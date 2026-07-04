import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";

const SESSION_KEY = "sa_admin_auth_dev";

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
      setIsAuthenticated(localStorage.getItem(SESSION_KEY) === "1");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (cancelled) return;
      if (session?.user) {
        const ok = await verifyAdmin(session.user.id);
        if (cancelled) return;
        setIsAuthenticated(ok);
        setEmail(ok ? session.user.email ?? null : null);
        if (!ok) await supabase.auth.signOut();
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!session?.user) {
        setIsAuthenticated(false);
        setEmail(null);
        return;
      }
      const ok = await verifyAdmin(session.user.id);
      setIsAuthenticated(ok);
      setEmail(ok ? session.user.email ?? null : null);
    });

    return () => {
      cancelled = true;
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
