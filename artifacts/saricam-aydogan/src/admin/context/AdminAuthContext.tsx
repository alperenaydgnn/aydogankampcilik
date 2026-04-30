import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const SESSION_KEY = "sa_admin_auth";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  });

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem(SESSION_KEY, "1");
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [isAuthenticated]);

  const login = (password: string): boolean => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!adminPassword) return false;
    if (password === adminPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
