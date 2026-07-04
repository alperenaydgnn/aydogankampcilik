import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

const SESSION_KEY = "sa_admin_auth_dev";
/** Max time (ms) to wait for Supabase auth initialization before giving up. */
const AUTH_TIMEOUT_MS = 4000;

interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  email: string | null;
  /** Returns an error message on failure, or `null` on success. */
  login: (emailOrPassword: string, password?: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!!supabase);
  /** Prevents setLoading(false) from being called multiple times. */
  const resolved = useRef(false);

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

  // Bootstrap auth state
  useEffect(() => {
    if (!supabase) {
      // No Supabase — use env-password mode with localStorage
      setIsAuthenticated(localStorage.getItem(SESSION_KEY) === "1");
      setLoading(false);
      return;
    }

    let cancelled = false;
    resolved.current = false;

    /** Safely transition out of the loading state (idempotent). */
    const finishLoading = () => {
      if (!cancelled && !resolved.current) {
        resolved.current = true;
        setLoading(false);
      }
    };

    /** Process a Supabase session (from getSession or onAuthStateChange). */
    const handleSession = async (session: { user: { id: string; email?: string | null } } | null) => {
      if (cancelled) return;

      if (!session?.user) {
        setIsAuthenticated(false);
        setEmail(null);
        finishLoading();
        return;
      }

      try {
        const ok = await verifyAdmin(session.user.id);
        if (cancelled) return;
        setIsAuthenticated(ok);
        setEmail(ok ? session.user.email ?? null : null);
        if (!ok) {
          supabase.auth.signOut().catch(() => {});
        }
      } catch (err) {
        console.error("Admin role verification error:", err);
        if (cancelled) return;
        setIsAuthenticated(false);
        setEmail(null);
      } finally {
        finishLoading();
      }
    };

    // ── 1) Safety timeout ──────────────────────────────────────────
    // If Supabase auth hasn't resolved within AUTH_TIMEOUT_MS (e.g.
    // because a paused project is unreachable, or the token-refresh
    // network request hangs), force loading to stop and send the user
    // to the login page rather than showing an infinite spinner.
    const timeout = setTimeout(() => {
      if (!resolved.current && !cancelled) {
        console.warn("Admin auth initialisation timed out – falling back to login");
        setIsAuthenticated(false);
        setEmail(null);
        finishLoading();
        // Clear potentially stale Supabase session so the next visit
        // doesn't hang again.
        supabase.auth.signOut().catch(() => {});
      }
    }, AUTH_TIMEOUT_MS);

    // ── 2) Direct getSession() call ────────────────────────────────
    // This resolves immediately if there's no stored session, and
    // triggers a token refresh if the access-token is expired.
    // We use this as the primary fast path.
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!cancelled && !resolved.current) {
          await handleSession(data.session);
        }
      } catch (err) {
        console.error("getSession() failed:", err);
        if (!cancelled) {
          setIsAuthenticated(false);
          setEmail(null);
          finishLoading();
        }
      }
    })();

    // ── 3) Ongoing auth-state listener ─────────────────────────────
    // Handles sign-in, sign-out, and token-refresh events AFTER the
    // initial bootstrap above.
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      // After the first resolution, every subsequent event should
      // also be processed (e.g. user signs out in another tab).
      await handleSession(session);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, [supabase, verifyAdmin]);

  const login = async (emailOrPassword: string, password?: string): Promise<string | null> => {
    if (!supabase) {
      // Env-password fallback (no Supabase configured)
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      if (!adminPassword) return "Admin paneli yapılandırılmamış (VITE_ADMIN_PASSWORD veya Supabase eksik).";
      if (emailOrPassword === adminPassword) {
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_KEY, "1");
        return null;
      }
      return "Yanlış şifre.";
    }

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

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, email, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
