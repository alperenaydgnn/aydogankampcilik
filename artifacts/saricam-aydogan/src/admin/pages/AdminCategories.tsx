import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/admin/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";
import { getCategories } from "@/lib/data";
import { Category } from "@/lib/mockData";

function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .toLowerCase()
    .replace(/[çğışöüÇĞIŞÖÜ]/g, (c) => map[c] || c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

const emptyForm: CategoryForm = { name: "", slug: "", description: "", image_url: "" };

export default function AdminCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setSlugManual(false);
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: cat.image_url,
    });
    setSlugManual(true);
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManual ? f.slug : slugify(name),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ variant: "destructive", title: "Kategori adı gerekli" }); return; }
    if (!form.slug.trim()) { toast({ variant: "destructive", title: "Slug gerekli" }); return; }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
    };

    const supabase = getSupabase();
    if (supabase) {
      let error;
      if (editTarget) {
        ({ error } = await supabase.from("categories").update(payload).eq("id", editTarget.id));
      } else {
        ({ error } = await supabase.from("categories").insert(payload));
      }
      if (error) {
        toast({ variant: "destructive", title: "Kaydedilemedi", description: error.message });
        setSaving(false);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
    }

    toast({ title: editTarget ? "Kategori güncellendi" : "Kategori oluşturuldu" });
    setSaving(false);
    setDialogOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const supabase = getSupabase();
    setDeleting(true);
    if (supabase) {
      const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);
      if (error) {
        toast({ variant: "destructive", title: "Silinemedi", description: error.message });
        setDeleting(false);
        return;
      }
    }
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
    toast({ title: "Kategori silindi" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Kategoriler</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{categories.length} kategori kayıtlı</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={load} aria-label="Yenile">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni Kategori
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-background rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Görsel yok
                  </div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{cat.slug}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)} aria-label="Düzenle">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget(cat)}
                      aria-label="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {cat.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                )}
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              Henüz kategori yok. İlk kategorinizi ekleyin.
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Kategoriyi Düzenle" : "Yeni Kategori"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Ad *</Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Çadırlar"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                }}
                placeholder="cadirlar"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Kısa kategori açıklaması..."
              />
            </div>
            <div className="space-y-2">
              <Label>Görsel URL</Label>
              <Input
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://..."
              />
              {form.image_url && (
                <div className="w-24 h-16 rounded-lg overflow-hidden border border-border mt-1">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`"${deleteTarget?.name}" kategorisi silinsin mi?`}
        description="Bu kategori ve içindeki ürünler etkilenebilir. Bu işlem geri alınamaz."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
