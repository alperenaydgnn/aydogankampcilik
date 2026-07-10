import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

const SESSION_KEY = "sa_admin_auth_dev";

// Safe wrapper around localStorage to prevent SecurityError crashes in browsers with restricted settings
const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

// Helper function to wrap a promise in a timeout, preventing infinite hangs
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

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
    authMode === "env" ? safeLocalStorage.getItem(SESSION_KEY) === "1" : false
  );
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(authMode === "supabase");

  /** Verify the current Supabase user is registered in admin_users. */
  const verifyAdmin = useCallback(async (userId: string): Promise<boolean | null> => {
    if (!supabase) return false;
    try {
      const queryPromise = supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      const { data, error } = await withTimeout(
        queryPromise,
        5000,
        "Yetki kontrolü zaman aşımına uğradı (Veritabanı yanıt vermiyor)."
      );

      if (error) {
        console.warn("admin verify failed:", error.message);
        return null; // network or db error
      }
      return !!data;
    } catch (err) {
      console.warn("admin verify error/timeout:", err);
      return null; // timeout
    }
  }, [supabase]);

  // ─── Bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    // ── ENV-PASSWORD MODE ──────────────────────────────────────────
    if (authMode === "env") {
      setIsAuthenticated(safeLocalStorage.getItem(SESSION_KEY) === "1");
      setLoading(false);
      return;
    }

    // ── NO AUTH CONFIGURED ────────────────────────────────────────
    if (authMode === "none") {
      setLoading(false);
      return;
    }

    // ── SUPABASE MODE ─────────────────────────────────────────────
    if (!supabase) return; // TypeScript guard

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
        const isAdmin = await verifyAdmin(session.user.id);
        if (cancelled) return;
        
        if (isAdmin === true) {
          setIsAuthenticated(true);
          setEmail(session.user.email ?? null);
        } else if (isAdmin === false) {
          setIsAuthenticated(false);
          setEmail(null);
          supabase.auth.signOut().catch(() => {});
        } else {
          // isAdmin === null (Network error or timeout)
          // Keep existing state if it's a background refresh.
          setIsAuthenticated((prev) => prev);
        }
      } catch {
        if (cancelled) return;
        setIsAuthenticated((prev) => prev);
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
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          3000,
          "Oturum kontrolü zaman aşımı."
        );
        if (!cancelled) await handleSession(data.session);
      } catch (err) {
        console.warn("Failed to get initial session:", err);
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
    try {
      // ── ENV-PASSWORD MODE ──────────────────────────────────────────
      if (authMode === "env") {
        if (emailOrPassword === ENV_PASSWORD) {
          setIsAuthenticated(true);
          safeLocalStorage.setItem(SESSION_KEY, "1");
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

      const authPromise = supabase.auth.signInWithPassword({
        email: emailOrPassword,
        password,
      });

      const { data, error } = await withTimeout(
        authPromise,
        6000,
        "Giriş işlemi zaman aşımına uğradı. Sunucuya erişilemiyor veya Supabase projeniz duraklatılmış olabilir."
      );

      if (error) return error.message;
      if (!data.user) return "Giriş başarısız oldu.";

      const ok = await verifyAdmin(data.user.id);
      if (!ok) {
        await supabase.auth.signOut().catch(() => {});
        return "Bu kullanıcı admin yetkisine sahip değil.";
      }
      setIsAuthenticated(true);
      setEmail(data.user.email ?? null);
      return null;
    } catch (err: any) {
      console.error("Login call failed:", err);
      return err?.message || "Giriş işlemi sırasında beklenmeyen bir hata oluştu.";
    }
  };

  // ─── Logout ────────────────────────────────────────────────────
  const logout = async () => {
    if (supabase) {
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
    }
    safeLocalStorage.removeItem(SESSION_KEY);
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
