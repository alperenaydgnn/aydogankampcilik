import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";

const SESSION_KEY = "sa_admin_auth_dev";

/**
 * Auth strategy decision:
 * - If VITE_ADMIN_PASSWORD is set → use simple env-password mode (localStorage).
 *   This works reliably regardless of Supabase configuration and survives
 *   tab/browser restarts until the user explicitly logs out.
 * - If VITE_ADMIN_PASSWORD is NOT set → use Supabase auth (requires
 *   VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY and an admin_users table).
 */
const ENV_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
const USE_ENV_AUTH = !!ENV_PASSWORD;

interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  email: string | null;
  /** Which auth mode is active */
  authMode: "env" | "supabase" | "none";
  /** Returns an error message on failure, or `null` on success. */
  login: (emailOrPassword: string, password?: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase();

  // Determine auth mode once
  const authMode: "env" | "supabase" | "none" = USE_ENV_AUTH
    ? "env"
    : supabase
      ? "supabase"
      : "none";

  // In env-auth mode, we can read localStorage synchronously — no loading needed.
  // In supabase mode, we need to wait for session verification.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authMode === "env" ? localStorage.getItem(SESSION_KEY) === "1" : false
  );
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(authMode === "supabase");

  /** Verify the current Supabase user is registered in admin_users. */
  const verifyAdmin = useCallback(async (userId: string): Promise<boolean> => {
    if (!supabase) return false;
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.warn("admin verify failed:", error.message);
      return false;
    }
    return !!data;
  }, [supabase]);

  // ─── Bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    // ── ENV-PASSWORD MODE ──────────────────────────────────────────
    // Fully synchronous — just read localStorage. No network calls,
    // no loading spinner, no timeouts needed.
    if (authMode === "env") {
      setIsAuthenticated(localStorage.getItem(SESSION_KEY) === "1");
      setLoading(false);
      return;
    }

    // ── NO AUTH CONFIGURED ────────────────────────────────────────
    if (authMode === "none") {
      setLoading(false);
      return;
    }

    // ── SUPABASE MODE ─────────────────────────────────────────────
    if (!supabase) return; // TypeScript guard — won't happen if authMode is "supabase"

    let cancelled = false;

    const handleSession = async (session: { user: { id: string; email?: string | null } } | null) => {
      if (cancelled) return;
      if (!session?.user) {
        setIsAuthenticated(false);
        setEmail(null);
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const ok = await verifyAdmin(session.user.id);
        if (cancelled) return;
        setIsAuthenticated(ok);
        setEmail(ok ? session.user.email ?? null : null);
        if (!ok) supabase.auth.signOut().catch(() => {});
      } catch {
        if (cancelled) return;
        setIsAuthenticated(false);
        setEmail(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Safety timeout — if Supabase is unreachable, stop waiting after 4s
    const timeout = setTimeout(() => {
      if (!cancelled) {
        console.warn("Supabase auth timed out — redirecting to login");
        setIsAuthenticated(false);
        setEmail(null);
        setLoading(false);
      }
    }, 4000);

    // Primary: get cached/refreshed session
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) await handleSession(data.session);
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
          setEmail(null);
          setLoading(false);
        }
      }
    })();

    // Ongoing listener for sign-in / sign-out / token refresh
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      await handleSession(session);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, [authMode, supabase, verifyAdmin]);

  // ─── Login ─────────────────────────────────────────────────────
  const login = async (emailOrPassword: string, password?: string): Promise<string | null> => {
    // ── ENV-PASSWORD MODE ──────────────────────────────────────────
    if (authMode === "env") {
      if (emailOrPassword === ENV_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_KEY, "1");
        return null;
      }
      return "Yanlış şifre.";
    }

    // ── NO AUTH ────────────────────────────────────────────────────
    if (authMode === "none" || !supabase) {
      return "Admin paneli yapılandırılmamış (VITE_ADMIN_PASSWORD veya Supabase eksik).";
    }

    // ── SUPABASE MODE ─────────────────────────────────────────────
    if (!password) return "E-posta ve şifre gerekli.";
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrPassword,
      password,
    });
    if (error) return error.message;
    if (!data.user) return "Giriş başarısız oldu.";

    const ok = await verifyAdmin(data.user.id);
    if (!ok) {
      await supabase.auth.signOut();
      return "Bu kullanıcı admin yetkisine sahip değil.";
    }
    setIsAuthenticated(true);
    setEmail(data.user.email ?? null);
    return null;
  };

  // ─── Logout ────────────────────────────────────────────────────
  const logout = async () => {
    if (supabase) {
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
    }
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, email, authMode, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
