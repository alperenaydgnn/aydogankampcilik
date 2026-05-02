import { useEffect, useState } from "react";
import { Save, Loader2, RefreshCw, Image as ImageIcon, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSiteSettings, saveSiteSetting } from "@/lib/data";
import { mockSiteSettings } from "@/lib/mockData";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { getSupabase } from "@/lib/supabase";

const MAX_IMAGES = 6;

export default function AdminSiteSettings() {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabaseAvailable = !!getSupabase();

  const load = async () => {
    setLoading(true);
    const settings = await getSiteSettings();
    const fromDb = (settings.hero_images as string[] | undefined) ?? mockSiteSettings.hero_images ?? [];
    setImages([...fromDb]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateAt = (i: number, url: string) => {
    setImages((prev) => prev.map((u, idx) => (idx === i ? url : u)));
  };

  const removeAt = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addEmpty = () => {
    if (images.length >= MAX_IMAGES) {
      toast({ variant: "destructive", title: `En fazla ${MAX_IMAGES} görsel eklenebilir.` });
      return;
    }
    setImages((prev) => [...prev, ""]);
  };

  const addUploaded = (url: string) => {
    if (images.length >= MAX_IMAGES) {
      toast({ variant: "destructive", title: `En fazla ${MAX_IMAGES} görsel eklenebilir.` });
      return;
    }
    setImages((prev) => [...prev, url]);
  };

  const move = (i: number, dir: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSave = async () => {
    const cleaned = images.map((u) => u.trim()).filter(Boolean);
    if (cleaned.length === 0) {
      toast({ variant: "destructive", title: "En az 1 görsel gerekli" });
      return;
    }
    setSaving(true);
    const ok = await saveSiteSetting("hero_images", cleaned);
    setSaving(false);
    if (ok) {
      toast({
        title: "Kaydedildi",
        description: supabaseAvailable
          ? "Anasayfa slider görselleri güncellendi."
          : "Mock modunda — değişiklik kalıcı değil. Supabase bağlantısı eklendiğinde aktif olur.",
      });
    } else {
      toast({ variant: "destructive", title: "Kaydedilemedi", description: "Lütfen tekrar deneyin." });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" />
            Anasayfa Görselleri
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Anasayfa hero slider için 1–{MAX_IMAGES} görsel. 4 saniyede bir otomatik geçer.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={load} disabled={loading} aria-label="Yenile">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      {!supabaseAvailable && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Mock mod:</strong> Supabase bağlantısı yok. Değişiklikler kalıcı olmayacak.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Live preview strip */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sıralama Önizleme</Label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((url, i) => (
                <div key={i} className="shrink-0 w-32 aspect-video rounded-lg overflow-hidden border border-border bg-muted relative">
                  {url ? (
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.opacity = "0.2")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Boş</div>
                  )}
                  <span className="absolute top-1 left-1 text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">
                    {i + 1}
                  </span>
                </div>
              ))}
              {images.length === 0 && (
                <div className="text-sm text-muted-foreground py-6">Henüz görsel yok.</div>
              )}
            </div>
          </div>

          {/* List editor */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Görsel Listesi</Label>
            {images.map((url, i) => (
              <div key={i} className="flex gap-2 items-center bg-background border border-border rounded-xl p-2">
                <div className="flex flex-col shrink-0">
                  <button
                    type="button"
                    title="Yukarı taşı"
                    disabled={i === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed p-1"
                    onClick={() => move(i, -1)}
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Aşağı taşı"
                    disabled={i === images.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed p-1"
                    onClick={() => move(i, 1)}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="w-14 h-14 rounded-md overflow-hidden border border-border shrink-0 bg-muted">
                  {url ? (
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.opacity = "0.2")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">Boş</div>
                  )}
                </div>
                <Input
                  placeholder="Görsel URL (https://...)"
                  value={url}
                  onChange={(e) => updateAt(i, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAt(i)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmpty}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                URL Ekle ({images.length}/{MAX_IMAGES})
              </Button>
            )}
          </div>

          {/* Upload area */}
          {supabaseAvailable && images.length < MAX_IMAGES && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Görsel Yükle</Label>
              <ImageUpload bucket="product-images" onUpload={addUploaded} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
