import { useState } from "react";
import { useLocation } from "wouter";
import { Trees, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/admin/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isConfigured = !!import.meta.env.VITE_ADMIN_PASSWORD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const ok = login(password);
    setLoading(false);
    if (ok) {
      setLocation("/admin/urunler");
    } else {
      setError("Yanlış şifre. Lütfen tekrar deneyin.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="p-3 bg-primary rounded-2xl">
            <Trees className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">Sarıçam Aydoğan</h1>
            <p className="text-muted-foreground text-sm mt-1">Admin Paneli</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>Devam etmek için admin şifresini girin.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isConfigured ? (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive space-y-1">
                <p className="font-semibold">Admin şifresi yapılandırılmamış</p>
                <p className="text-destructive/80">
                  Giriş yapabilmek için{" "}
                  <code className="font-mono bg-destructive/10 px-1 rounded">VITE_ADMIN_PASSWORD</code>{" "}
                  ortam değişkenini ayarlayın, ardından sunucuyu yeniden başlatın.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Admin şifrenizi girin"
                      autoComplete="current-password"
                      autoFocus
                      className="pr-10"
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

                <Button type="submit" className="w-full" disabled={loading || !password}>
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Şifrenizi <code className="font-mono bg-muted px-1 rounded">VITE_ADMIN_PASSWORD</code> ortam değişkeniyle ayarlayın.
        </p>
      </div>
    </div>
  );
}
