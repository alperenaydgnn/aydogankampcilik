import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";
import {
  ArrowLeft, Save, Loader2, Package, Image as ImageIcon,
  Settings2, Search, MessageCircle, AlertCircle, CheckCircle2,
  Star, Eye, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpecsEditor } from "@/admin/components/SpecsEditor";
import { ProductImageManager, ProductImageState, ImagesChangeFn } from "@/admin/components/ProductImageManager";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";
import { getAllCategoriesForAdmin, getTags } from "@/lib/data";
import { Category, Tag as TagType, mockProducts } from "@/lib/mockData";
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
  price: string;
  old_price: string;
  price_label: string;
  stock: string;
  specs: Record<string, string>;
  whatsapp_message: string;
  meta_title: string;
  meta_description: string;
  images: ProductImageState[];
  tag_ids: string[];
  featured: boolean;
  is_new: boolean;
  active: boolean;
}

interface FieldErrors {
  name?: string;
  slug?: string;
  category_id?: string;
  price?: string;
  stock?: string;
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

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] text-destructive mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" /> {msg}
    </p>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const pct = len / max;
  return (
    <span className={`text-[11px] tabular-nums ${pct > 1 ? "text-destructive" : pct > 0.85 ? "text-amber-600" : "text-muted-foreground"}`}>
      {len} / {max}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

export default function AdminProductForm() {
  const params = useParams<{ id?: string }>();
  const productId = params.id;
  const isEdit = !!productId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const footerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [activeTab, setActiveTab] = useState("genel");
  const [saved, setSaved] = useState(false);

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
          const imgs: ProductImageState[] = (row.product_images ?? [])
            .slice()
            .sort((a, b) => (a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1))
            .map((img) => ({
              key: img.id,
              id: img.id,
              url: img.url,
              alt_text: img.alt_text ?? "",
              is_primary: img.is_primary,
              uploading: false,
              progress: 100,
            }));
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
        if (error) {
          toast({ variant: "destructive", title: "Ürün yüklenemedi", description: error.message });
        }
      }
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
          images: (p.images ?? []).map((url, i) => ({
            key: `mock_${i}_${url.slice(-8)}`,
            url,
            alt_text: "",
            is_primary: i === 0,
            uploading: false,
            progress: 100,
          })),
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
  }, [isEdit, productId, toast]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugManual ? f.slug : slugify(name) }));
    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManual(true);
    set("slug", slugify(slug));
  };

  const handleImagesChange = (v: ImagesChangeFn) => {
    setForm(f => ({ ...f, images: typeof v === "function" ? v(f.images) : v }));
  };

  const toggleTag = (tagId: string) => {
    setForm((f) => ({
      ...f,
      tag_ids: f.tag_ids.includes(tagId)
        ? f.tag_ids.filter((t) => t !== tagId)
        : [...f.tag_ids, tagId],
    }));
  };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!form.name.trim()) errs.name = "Ürün adı boş bırakılamaz.";
    if (!form.slug.trim()) errs.slug = "URL slug zorunludur.";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = "Slug yalnızca küçük harf, rakam ve tire içerebilir.";
    if (!form.category_id) errs.category_id = "Lütfen bir kategori seçin.";
    if (form.price.trim()) {
      const n = Number(form.price);
      if (!Number.isFinite(n) || n < 0) errs.price = "Geçerli bir fiyat girin (örn: 2499).";
    }
    if (form.stock.trim()) {
      const n = Number.parseInt(form.stock, 10);
      if (!Number.isFinite(n) || n < 0) errs.stock = "Stok adedi negatif olamaz.";
    }
    return errs;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.name || errs.slug || errs.category_id || errs.stock || errs.price) {
        setActiveTab("genel");
      }
      toast({ variant: "destructive", title: "Lütfen hataları düzeltin", description: "Kırmızıyla işaretlenen alanları kontrol et." });
      return;
    }

    const hasUploading = form.images.some(img => img.uploading);
    if (hasUploading) {
      toast({ variant: "destructive", title: "Görseller hâlâ yükleniyor", description: "Lütfen tüm yüklemeler tamamlanana kadar bekleyin." });
      setSaving(false);
      return;
    }

    const priceNum = form.price.trim() ? Number(form.price) : null;
    const oldPriceNum = form.old_price.trim() ? Number(form.old_price) : null;
    const stockNum = Number.parseInt(form.stock, 10) || 0;

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
          .from("products").insert(payload).select("id").single();
        if (error || !data) {
          toast({ variant: "destructive", title: "Oluşturulamadı", description: error?.message });
          setSaving(false);
          return;
        }
        savedId = data.id;
      }

      const cleanImages = form.images.filter(img => !img.uploading && !img.error && img.url.trim());
      const hasPrimaryImg = cleanImages.some(img => img.is_primary);
      const { error: delImgErr } = await supabase.from("product_images").delete().eq("product_id", savedId!);
      if (delImgErr) {
        toast({ variant: "destructive", title: "Görseller temizlenemedi", description: delImgErr.message });
        setSaving(false);
        return;
      }
      if (cleanImages.length > 0) {
        const rows: Omit<DBProductImage, "id" | "created_at">[] = cleanImages.map((img, i) => ({
          product_id: savedId!,
          url: img.url.trim(),
          sort_order: i,
          is_primary: img.is_primary || (!hasPrimaryImg && i === 0),
          alt_text: img.alt_text || form.name,
        }));
        const { error: insImgErr } = await supabase.from("product_images").insert(rows as DBProductImage[]);
        if (insImgErr) {
          toast({ variant: "destructive", title: "Görseller kaydedilemedi", description: insImgErr.message });
          setSaving(false);
          return;
        }
      }

      const { error: delTagErr } = await supabase.from("product_tags").delete().eq("product_id", savedId!);
      if (delTagErr) {
        toast({ variant: "destructive", title: "Etiketler temizlenemedi", description: delTagErr.message });
        setSaving(false);
        return;
      }
      if (form.tag_ids.length > 0) {
        const tagRows = form.tag_ids.map((tag_id) => ({ product_id: savedId!, tag_id }));
        const { error: insTagErr } = await supabase.from("product_tags").insert(tagRows);
        if (insTagErr) {
          toast({ variant: "destructive", title: "Etiketler kaydedilemedi", description: insTagErr.message });
          setSaving(false);
          return;
        }
      }
    } else {
      await new Promise((r) => setTimeout(r, 500));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    toast({ title: isEdit ? "✓ Ürün güncellendi" : "✓ Ürün oluşturuldu" });
    setSaving(false);
    setLocation("/admin/urunler");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
        <p className="text-sm text-muted-foreground">Ürün yükleniyor...</p>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/urunler">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-primary shrink-0" />
            {isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}
          </h1>
          <p className="text-muted-foreground text-sm truncate">
            {isEdit ? form.name || "—" : "Yeni bir ürün ekleyin"}
          </p>
        </div>
        {isEdit && form.slug && (
          <a
            href={`/urun/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto"
          >
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <Eye className="w-3.5 h-3.5" /> Önizle
            </Button>
          </a>
        )}
      </div>

      <form onSubmit={handleSave} noValidate>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab list */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur pb-4 pt-1">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="genel" className="gap-1.5 text-xs sm:text-sm py-2">
                <Package className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Genel</span>
                {(errors.name || errors.slug || errors.category_id || errors.stock || errors.price) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                )}
              </TabsTrigger>
              <TabsTrigger value="gorseller" className="gap-1.5 text-xs sm:text-sm py-2">
                <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Görseller</span>
                {form.images.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-0.5">{form.images.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="teknik" className="gap-1.5 text-xs sm:text-sm py-2">
                <Settings2 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Teknik</span>
                {Object.keys(form.specs).length > 0 && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-0.5">{Object.keys(form.specs).length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-1.5 text-xs sm:text-sm py-2">
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">SEO</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Tab 1: Genel Bilgiler ─────────────────────────────────────── */}
          <TabsContent value="genel" className="space-y-6 mt-0">

            {/* Identity */}
            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader icon={Package} title="Kimlik" description="Ürün adı, URL ve kategori bilgileri" />

              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Ürün Adı <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Örn: Alpinist Pro 4 Mevsim Kamp Çadırı"
                  className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                  autoFocus={!isEdit}
                />
                <FieldError msg={errors.name} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">
                    URL Slug <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    /urun/<strong>{form.slug || "slug"}</strong>
                  </span>
                </div>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="urun-adi"
                  className={`font-mono text-sm ${errors.slug ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <FieldError msg={errors.slug} />
                {!errors.slug && (
                  <p className="text-[11px] text-muted-foreground">
                    Addan otomatik oluşturulur. Düzenleme yayın sonrası SEO'yu etkiler.
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>
                    Kategori <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
                    <SelectTrigger className={errors.category_id ? "border-destructive focus:ring-destructive" : ""}>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                          {c.active === false && <span className="ml-1 text-muted-foreground text-[10px]">(gizli)</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError msg={errors.category_id} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stok Adedi</Label>
                  <Input
                    id="stock"
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => set("stock", e.target.value)}
                    className={errors.stock ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  <FieldError msg={errors.stock} />
                  {!errors.stock && (
                    <p className="text-[11px] text-muted-foreground">
                      0 = Tükendi · 1-5 = Son stoklar · 6+ = Stokta
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader icon={Tag} title="Fiyatlandırma" description="Satış fiyatı ve indirim bilgisi" />

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Fiyat (₺)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₺</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min={0}
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      placeholder="2499"
                      className={`pl-7 ${errors.price ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  <FieldError msg={errors.price} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="old_price">Eski Fiyat (₺)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₺</span>
                    <Input
                      id="old_price"
                      type="number"
                      step="0.01"
                      min={0}
                      value={form.old_price}
                      onChange={(e) => set("old_price", e.target.value)}
                      placeholder="Opsiyonel"
                      className="pl-7"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">İndirim göstergesi için</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="price_label">Fiyat Etiketi</Label>
                  <Input
                    id="price_label"
                    value={form.price_label}
                    onChange={(e) => set("price_label", e.target.value)}
                    placeholder="Boş = otomatik"
                  />
                  <p className="text-[11px] text-muted-foreground">"Fiyat sorunuz" gibi özel metin</p>
                </div>
              </div>

              {form.price && form.old_price && Number(form.old_price) > Number(form.price) && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  %{Math.round((1 - Number(form.price) / Number(form.old_price)) * 100)} indirim gösterimi aktif
                </div>
              )}
            </div>

            {/* Descriptions */}
            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader icon={MessageCircle} title="Açıklamalar" description="Listeleme ve ürün detay sayfası metinleri" />

              <div className="space-y-1.5">
                <Label htmlFor="short_description">Kısa Açıklama</Label>
                <Input
                  id="short_description"
                  value={form.short_description}
                  onChange={(e) => set("short_description", e.target.value)}
                  placeholder="Ürün kartlarında ve arama sonuçlarında görünür."
                  maxLength={200}
                />
                <div className="flex justify-between items-center">
                  <p className="text-[11px] text-muted-foreground">Listeleme kartlarında gösterilir.</p>
                  <CharCount value={form.short_description} max={200} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Detaylı Açıklama</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={6}
                  placeholder="Ürün detay sayfasında gösterilir. Malzeme, kullanım, garanti vb."
                />
                <div className="flex justify-end">
                  <CharCount value={form.description} max={2000} />
                </div>
              </div>
            </div>

            {/* Status & flags */}
            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader icon={Eye} title="Durum ve Rozet" description="Yayın durumu ve öne çıkarma ayarları" />

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div>
                    <p className="font-medium text-sm">Yayında</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Kapalıysa site ziyaretçileri bu ürünü göremez.</p>
                  </div>
                  <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div>
                    <p className="font-medium text-sm flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      Öne Çıkan
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Anasayfada öne çıkan ürünler bölümünde gösterilir.</p>
                  </div>
                  <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">Yeni Ürün Rozeti</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ürün kartında "Yeni" etiketi gösterilir.</p>
                  </div>
                  <Switch checked={form.is_new} onCheckedChange={(v) => set("is_new", v)} />
                </div>
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
                <SectionHeader icon={Tag} title="Etiketler" description="Arama ve filtreleme için etiket ekleyin" />
                <div className="flex flex-wrap gap-2">
                  {allTags.map((t) => {
                    const active = form.tag_ids.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTag(t.id)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          active
                            ? "shadow-sm scale-105"
                            : "border-border bg-background hover:bg-muted text-foreground"
                        }`}
                        style={
                          active
                            ? { backgroundColor: t.color || "hsl(var(--primary))", borderColor: t.color || "hsl(var(--primary))", color: "#fff" }
                            : undefined
                        }
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
                {form.tag_ids.length > 0 && (
                  <p className="text-xs text-muted-foreground">{form.tag_ids.length} etiket seçili</p>
                )}
              </div>
            )}
          </TabsContent>

          {/* ── Tab 2: Görseller ─────────────────────────────────────────── */}
          <TabsContent value="gorseller" className="space-y-5 mt-0">
            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader
                icon={ImageIcon}
                title="Ürün Görselleri"
                description="Görselleri yükle, sırala ve ana görseli seç. Sürükle-bırak ile yeniden sıralayabilirsin."
              />
              <ProductImageManager value={form.images} onChange={handleImagesChange} />
            </div>
          </TabsContent>

          {/* ── Tab 3: Teknik Özellikler ─────────────────────────────────── */}
          <TabsContent value="teknik" className="space-y-5 mt-0">
            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader
                icon={Settings2}
                title="Teknik Özellikler"
                description="Ürün detay sayfasında tablo olarak gösterilir."
              />
              <SpecsEditor value={form.specs} onChange={(v) => set("specs", v)} />
              {Object.keys(form.specs).length === 0 && (
                <p className="text-xs text-muted-foreground/60 text-center py-2">
                  Teknik özellik eklenmemiş. Yukarıdaki butonla ekleyin.
                </p>
              )}
            </div>
          </TabsContent>

          {/* ── Tab 4: SEO & Diğer ───────────────────────────────────────── */}
          <TabsContent value="seo" className="space-y-5 mt-0">
            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader
                icon={Search}
                title="SEO Ayarları"
                description="Arama motoru sonuçlarında görünecek başlık ve açıklama"
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">Meta Başlık</Label>
                  <CharCount value={form.meta_title} max={60} />
                </div>
                <Input
                  id="meta_title"
                  value={form.meta_title}
                  onChange={(e) => set("meta_title", e.target.value)}
                  placeholder="Boş bırakılırsa ürün adı kullanılır."
                  maxLength={80}
                />
                <p className="text-[11px] text-muted-foreground">Önerilen maksimum: 60 karakter</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Açıklama</Label>
                  <CharCount value={form.meta_description} max={160} />
                </div>
                <Textarea
                  id="meta_description"
                  value={form.meta_description}
                  onChange={(e) => set("meta_description", e.target.value)}
                  rows={3}
                  placeholder="Boş bırakılırsa açıklamadan otomatik üretilir."
                  maxLength={200}
                />
                <p className="text-[11px] text-muted-foreground">Önerilen maksimum: 160 karakter</p>
              </div>

              {/* SERP preview */}
              {(form.meta_title || form.name || form.meta_description || form.short_description) && (
                <div className="border border-border rounded-xl p-4 bg-muted/20">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Google önizlemesi</p>
                  <p className="text-[15px] text-blue-700 font-medium leading-snug line-clamp-1">
                    {form.meta_title || form.name || "Ürün Başlığı"}
                  </p>
                  <p className="text-[12px] text-green-700 mt-0.5">sarıçamaydoğan.com/urun/{form.slug || "urun-adi"}</p>
                  <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2 leading-snug">
                    {form.meta_description || form.short_description || form.description || "Açıklama buraya gelecek..."}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
              <SectionHeader
                icon={MessageCircle}
                title="WhatsApp Özelleştirme"
                description="Ürün sayfasındaki WhatsApp butonunun mesajını özelleştir"
              />
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp_message">Özel WhatsApp Mesajı</Label>
                <Textarea
                  id="whatsapp_message"
                  value={form.whatsapp_message}
                  onChange={(e) => set("whatsapp_message", e.target.value)}
                  rows={3}
                  placeholder="Boş bırakılırsa otomatik oluşturulur."
                />
                <p className="text-[11px] text-muted-foreground">
                  Ürün adı ve kategori bilgisi her durumda başa eklenir.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Sticky footer */}
        <div ref={footerRef} className="sticky bottom-0 z-10 mt-6 -mx-1">
          <div className="bg-background/95 backdrop-blur border-t border-border px-1 py-3">
            <div className="flex items-center gap-3">
              {errorCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorCount} alan hatalı
                </div>
              )}
              {saved && (
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kaydedildi
                </div>
              )}
              <div className="ml-auto flex gap-2">
                <Link href="/admin/urunler">
                  <Button type="button" variant="outline" disabled={saving}>İptal</Button>
                </Link>
                <Button type="submit" disabled={saving} className="gap-2 min-w-[110px]">
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Kaydet</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
