import { useState } from "react";
import { useLocation } from "wouter";
import { Trees, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/admin/context/AdminAuthContext";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [, setLocation] = useLocation();
  const supabaseConfigured = !!getSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const envPasswordConfigured = !!import.meta.env.VITE_ADMIN_PASSWORD;
  const isConfigured = supabaseConfigured || envPasswordConfigured;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;
    setError("");
    setLoading(true);
    const err = supabaseConfigured
      ? await login(email, password)
      : await login(password);
    setLoading(false);
    if (err) {
      setError(err);
      setPassword("");
      return;
    }
    setLocation("/admin/urunler");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="p-3 bg-primary rounded-2xl">
            <Trees className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">Aydoğan Kampçılık</h1>
            <p className="text-muted-foreground text-sm mt-1">Admin Paneli</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              {supabaseConfigured
                ? "Yetkili admin kullanıcı bilgilerinizi girin."
                : "Devam etmek için admin şifresini girin."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConfigured ? (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive space-y-1">
                <p className="font-semibold">Admin paneli yapılandırılmamış</p>
                <p className="text-destructive/80">
                  Supabase için <code className="font-mono bg-destructive/10 px-1 rounded">VITE_SUPABASE_URL</code> ve{" "}
                  <code className="font-mono bg-destructive/10 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>, geliştirme modu için{" "}
                  <code className="font-mono bg-destructive/10 px-1 rounded">VITE_ADMIN_PASSWORD</code> ortam değişkenini ayarlayın.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {supabaseConfigured && (
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@aydogankampcilik.com"
                      autoComplete="email"
                      autoFocus
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={supabaseConfigured ? "••••••••" : "Admin şifrenizi girin"}
                      autoComplete="current-password"
                      autoFocus={!supabaseConfigured}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive font-medium">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !password || (supabaseConfigured && !email)}
                >
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          {supabaseConfigured
            ? "Admin yetkisi için kullanıcının admin_users tablosunda kaydı olmalıdır."
            : "Geliştirme modu — VITE_ADMIN_PASSWORD ile çalışıyor."}
        </p>
      </div>
    </div>
  );
}
