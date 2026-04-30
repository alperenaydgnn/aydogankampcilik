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
import { getCategories, getProductBySlug, getProducts } from "@/lib/data";
import { Category, Product, mockProducts } from "@/lib/mockData";

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
  price_label: string;
  specs: Record<string, string>;
  whatsapp_message: string;
  images: string[];
  featured: boolean;
}

const defaultForm: FormState = {
  name: "",
  slug: "",
  category_id: "",
  description: "",
  price_label: "",
  specs: {},
  whatsapp_message: "",
  images: [],
  featured: false,
};

export default function AdminProductForm() {
  const params = useParams<{ id?: string }>();
  const productId = params.id;
  const isEdit = !!productId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit || !productId) return;
    setLoading(true);
    // Try to find by id in mock data or load via Supabase
    const loadProduct = async () => {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();
        if (!error && data) {
          const p = data as Product;
          setForm({
            name: p.name,
            slug: p.slug,
            category_id: p.category_id,
            description: p.description,
            price_label: p.price_label,
            specs: p.specs ?? {},
            whatsapp_message: p.whatsapp_message ?? "",
            images: p.images ?? [],
            featured: p.featured,
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
          name: p.name,
          slug: p.slug,
          category_id: p.category_id,
          description: p.description,
          price_label: p.price_label,
          specs: p.specs ?? {},
          whatsapp_message: p.whatsapp_message ?? "",
          images: p.images ?? [],
          featured: p.featured,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast({ variant: "destructive", title: "Ürün adı gerekli" }); return; }
    if (!form.slug.trim()) { toast({ variant: "destructive", title: "Slug gerekli" }); return; }
    if (!form.category_id) { toast({ variant: "destructive", title: "Kategori seçin" }); return; }
    if (!form.price_label.trim()) { toast({ variant: "destructive", title: "Fiyat etiketi gerekli" }); return; }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id,
      description: form.description.trim(),
      price_label: form.price_label.trim(),
      specs: form.specs,
      whatsapp_message: form.whatsapp_message.trim() || null,
      images: form.images.filter((u) => u.trim()),
      featured: form.featured,
    };

    const supabase = getSupabase();
    if (supabase) {
      let error;
      if (isEdit) {
        ({ error } = await supabase.from("products").update(payload).eq("id", productId));
      } else {
        ({ error } = await supabase.from("products").insert(payload));
      }
      if (error) {
        toast({ variant: "destructive", title: "Kaydedilemedi", description: error.message });
        setSaving(false);
        return;
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
                <Label htmlFor="price_label">Fiyat Etiketi *</Label>
                <Input
                  id="price_label"
                  value={form.price_label}
                  onChange={(e) => set("price_label", e.target.value)}
                  placeholder="Örn: ₺2.499"
                />
              </div>
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

            <div className="flex items-center gap-3">
              <Checkbox
                id="featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", !!v)}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Anasayfada öne çıkar
              </Label>
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
                İlk görsel ana görsel olarak kullanılır. Sıralamak için yukarı okunu kullanın.
              </p>
              <ImageUrlList value={form.images} onChange={(v) => set("images", v)} />
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
