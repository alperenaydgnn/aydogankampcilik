import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecsEditor } from "@/admin/components/SpecsEditor";
import { ImageUrlList } from "@/admin/components/ImageUrlList";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";
import { getAllCategoriesForAdmin, getTags } from "@/lib/data";
import { Category, Tag, mockProducts } from "@/lib/mockData";
import type { DBProductImage, DBProductWithRelations } from "@/lib/database.types";

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

interface FormState {
  name: string;
  slug: string;
  category_id: string;
  description: string;
  short_description: string;
  price: string;        // string for input control
  old_price: string;
  price_label: string;
  stock: string;
  specs: Record<string, string>;
  whatsapp_message: string;
  meta_title: string;
  meta_description: string;
  images: string[];
  tag_ids: string[];
  featured: boolean;
  is_new: boolean;
  active: boolean;
}

const defaultForm: FormState = {
  name: "",
  slug: "",
  category_id: "",
  description: "",
  short_description: "",
  price: "",
  old_price: "",
  price_label: "",
  stock: "0",
  specs: {},
  whatsapp_message: "",
  meta_title: "",
  meta_description: "",
  images: [],
  tag_ids: [],
  featured: false,
  is_new: false,
  active: true,
};

const ADMIN_PRODUCT_SELECT = "*, product_images(*), product_tags(tag:tags(*))";

export default function AdminProductForm() {
  const params = useParams<{ id?: string }>();
  const productId = params.id;
  const isEdit = !!productId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    getAllCategoriesForAdmin().then(setCategories);
    getTags().then(setAllTags);
  }, []);

  useEffect(() => {
    if (!isEdit || !productId) return;
    setLoading(true);
    const loadProduct = async () => {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("products")
          .select(ADMIN_PRODUCT_SELECT)
          .eq("id", productId)
          .maybeSingle();
        if (!error && data) {
          const row = data as DBProductWithRelations;
          const imgs = (row.product_images ?? [])
            .slice()
            .sort((a, b) => (a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1))
            .map((img) => img.url);
          setForm({
            name: row.name,
            slug: row.slug,
            category_id: row.category_id,
            description: row.description ?? "",
            short_description: row.short_description ?? "",
            price: row.price != null ? String(row.price) : "",
            old_price: row.old_price != null ? String(row.old_price) : "",
            price_label: row.price_label ?? "",
            stock: String(row.stock ?? 0),
            specs: (row.specs as Record<string, string>) ?? {},
            whatsapp_message: row.whatsapp_message ?? "",
            meta_title: row.meta_title ?? "",
            meta_description: row.meta_description ?? "",
            images: imgs,
            tag_ids: (row.product_tags ?? []).map((pt) => pt.tag.id),
            featured: row.featured,
            is_new: row.is_new,
            active: row.active,
          });
          setSlugManual(true);
          setLoading(false);
          return;
        }
      }
      // Mock fallback: find by id
      const p = mockProducts.find((x) => x.id === productId);
      if (p) {
        setForm({
          ...defaultForm,
          name: p.name,
          slug: p.slug,
          category_id: p.category_id,
          description: p.description,
          short_description: p.short_description ?? "",
          price: p.price_numeric ? String(p.price_numeric) : "",
          old_price: p.old_price ? String(p.old_price) : "",
          price_label: p.price_label,
          stock: String(p.stock ?? 0),
          specs: p.specs ?? {},
          whatsapp_message: p.whatsapp_message ?? "",
          images: p.images ?? [],
          tag_ids: (p.tags ?? []).map((t) => t.id),
          featured: p.featured,
          is_new: !!p.is_new,
          active: p.active !== false,
        });
        setSlugManual(true);
      }
      setLoading(false);
    };
    loadProduct();
  }, [isEdit, productId]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManual ? f.slug : slugify(name),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManual(true);
    set("slug", slugify(slug));
  };

  const toggleTag = (tagId: string) => {
    setForm((f) => ({
      ...f,
      tag_ids: f.tag_ids.includes(tagId)
        ? f.tag_ids.filter((t) => t !== tagId)
        : [...f.tag_ids, tagId],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast({ variant: "destructive", title: "Ürün adı gerekli" }); return; }
    if (!form.slug.trim()) { toast({ variant: "destructive", title: "Slug gerekli" }); return; }
    if (!form.category_id) { toast({ variant: "destructive", title: "Kategori seçin" }); return; }

    const priceNum = form.price.trim() ? Number(form.price) : null;
    const oldPriceNum = form.old_price.trim() ? Number(form.old_price) : null;
    const stockNum = Number.parseInt(form.stock, 10) || 0;
    if (priceNum != null && !Number.isFinite(priceNum)) {
      toast({ variant: "destructive", title: "Geçerli bir fiyat girin" });
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id,
      description: form.description.trim(),
      short_description: form.short_description.trim(),
      specs: form.specs,
      price: priceNum,
      old_price: oldPriceNum,
      price_label: form.price_label.trim() || null,
      stock: stockNum,
      whatsapp_message: form.whatsapp_message.trim() || null,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      featured: form.featured,
      is_new: form.is_new,
      active: form.active,
    };

    const supabase = getSupabase();
    if (supabase) {
      let savedId = productId;
      if (isEdit) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) {
          toast({ variant: "destructive", title: "Kaydedilemedi", description: error.message });
          setSaving(false);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (error || !data) {
          toast({ variant: "destructive", title: "Oluşturulamadı", description: error?.message });
          setSaving(false);
          return;
        }
        savedId = data.id;
      }

      // Re-sync product_images: delete all + re-insert
      const cleanImages = form.images.map((u) => u.trim()).filter(Boolean);
      const { error: delErr } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", savedId!);
      if (delErr) {
        toast({ variant: "destructive", title: "Görseller temizlenemedi", description: delErr.message });
        setSaving(false);
        return;
      }
      if (cleanImages.length > 0) {
        const rows = cleanImages.map((url, i) => ({
          product_id: savedId!,
          url,
          sort_order: i,
          is_primary: i === 0,
          alt_text: form.name,
        }));
        const { error: insErr } = await supabase.from("product_images").insert(rows);
        if (insErr) {
          toast({ variant: "destructive", title: "Görseller kaydedilemedi", description: insErr.message });
          setSaving(false);
          return;
        }
      }

      // Re-sync product_tags: delete all + re-insert
      const { error: tdErr } = await supabase
        .from("product_tags")
        .delete()
        .eq("product_id", savedId!);
      if (tdErr) {
        toast({ variant: "destructive", title: "Etiketler temizlenemedi", description: tdErr.message });
        setSaving(false);
        return;
      }
      if (form.tag_ids.length > 0) {
        const tagRows = form.tag_ids.map((tag_id) => ({ product_id: savedId!, tag_id }));
        const { error: tiErr } = await supabase.from("product_tags").insert(tagRows);
        if (tiErr) {
          toast({ variant: "destructive", title: "Etiketler kaydedilemedi", description: tiErr.message });
          setSaving(false);
          return;
        }
      }
    } else {
      // Mock mode — just simulate success
      await new Promise((r) => setTimeout(r, 400));
    }

    toast({ title: isEdit ? "Ürün güncellendi" : "Ürün oluşturuldu" });
    setSaving(false);
    setLocation("/admin/urunler");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/urunler">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold">{isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}</h1>
          <p className="text-muted-foreground text-sm">{isEdit ? form.name : "Yeni bir ürün ekleyin"}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Temel Bilgiler</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Alpinist Pro 4 Mevsim Çadır"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="urun-adi"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Ürün sayfası: /urun/<strong>{form.slug || "slug"}</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok Adedi</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  0 = Tükendi · 1-10 = Son stoklar · 10+ = Stokta
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="2499"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="old_price">Eski Fiyat (₺)</Label>
                <Input
                  id="old_price"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.old_price}
                  onChange={(e) => set("old_price", e.target.value)}
                  placeholder="opsiyonel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_label">Fiyat Etiketi (özel)</Label>
                <Input
                  id="price_label"
                  value={form.price_label}
                  onChange={(e) => set("price_label", e.target.value)}
                  placeholder="Boş bırakılırsa otomatik"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Kısa Açıklama</Label>
              <Input
                id="short_description"
                value={form.short_description}
                onChange={(e) => set("short_description", e.target.value)}
                placeholder="Listeleme kartlarında görünür."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="Ürün açıklaması..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="active"
                  checked={form.active}
                  onCheckedChange={(v) => set("active", !!v)}
                />
                <Label htmlFor="active" className="cursor-pointer">Yayında</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(v) => set("featured", !!v)}
                />
                <Label htmlFor="featured" className="cursor-pointer">Anasayfada öne çıkar</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="is_new"
                  checked={form.is_new}
                  onCheckedChange={(v) => set("is_new", !!v)}
                />
                <Label htmlFor="is_new" className="cursor-pointer">Yeni ürün rozeti</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Teknik Özellikler</CardTitle></CardHeader>
          <CardContent>
            <SpecsEditor value={form.specs} onChange={(v) => set("specs", v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Görseller</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload onUpload={(url) => set("images", [...form.images, url])} />
            <Separator />
            <div className="space-y-1">
              <Label>Görsel URL Listesi</Label>
              <p className="text-xs text-muted-foreground mb-2">
                İlk görsel ana görsel olarak işaretlenir (is_primary). Sıralamak için yukarı okunu kullanın.
              </p>
              <ImageUrlList value={form.images} onChange={(v) => set("images", v)} />
            </div>
          </CardContent>
        </Card>

        {allTags.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Etiketler</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => {
                  const active = form.tag_ids.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted text-foreground"
                      }`}
                      style={active && t.color ? { backgroundColor: t.color, borderColor: t.color } : undefined}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Başlık</Label>
              <Input
                id="meta_title"
                value={form.meta_title}
                onChange={(e) => set("meta_title", e.target.value)}
                placeholder="Boş bırakılırsa ürün adı kullanılır."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Açıklama</Label>
              <Textarea
                id="meta_description"
                value={form.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
                rows={2}
                placeholder="Boş bırakılırsa açıklamadan otomatik üretilir."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">WhatsApp Özelleştirme</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="whatsapp_message">Özel WhatsApp Mesajı</Label>
            <Textarea
              id="whatsapp_message"
              value={form.whatsapp_message}
              onChange={(e) => set("whatsapp_message", e.target.value)}
              rows={3}
              placeholder="Boş bırakılırsa otomatik oluşturulur."
            />
            <p className="text-xs text-muted-foreground">
              Ürün adı ve kategori bilgisi her durumda mesajın başına eklenir.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/urunler">
            <Button type="button" variant="outline">İptal</Button>
          </Link>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
