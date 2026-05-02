import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown, RefreshCw,
  Copy, ExternalLink, RotateCcw, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Package, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/admin/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";
import { getAllCategoriesForAdmin } from "@/lib/data";
import { Category, Product } from "@/lib/mockData";
import { mockProducts } from "@/lib/mockData";
import type { DBProductWithRelations } from "@/lib/database.types";

type SortKey = "name" | "created_at" | "price_label" | "stock";
type SortDir = "asc" | "desc";
type BulkAction = "activate" | "deactivate" | "delete";

const PAGE_SIZES = [10, 25, 50] as const;

const ADMIN_PRODUCT_SELECT = "*, product_images(*), product_tags(tag:tags(*))";

function stockBadge(stock: number | null | undefined) {
  const s = stock ?? 0;
  if (s === 0) return <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Tükendi</Badge>;
  if (s <= 5) return <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-orange-300 text-orange-700 bg-orange-50">{s}</Badge>;
  return <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-green-300 text-green-700 bg-green-50">{s}</Badge>;
}

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZES[number]>(25);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const loadProducts = useCallback(async (): Promise<Product[]> => {
    const supabase = getSupabase();
    if (!supabase) return mockProducts;
    const { data, error } = await supabase
      .from("products")
      .select(ADMIN_PRODUCT_SELECT)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Ürünler yüklenemedi", description: error.message });
      return [];
    }
    return (data as DBProductWithRelations[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      category_id: row.category_id,
      description: row.description,
      short_description: row.short_description,
      specs: (row.specs as Record<string, string>) ?? {},
      price_label: row.price_label ?? (row.price != null ? `₺${row.price}` : "Fiyat için sorunuz"),
      price_numeric: row.price ?? undefined,
      old_price: row.old_price,
      stock: row.stock,
      images: (row.product_images ?? [])
        .slice()
        .sort((a, b) => (a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1))
        .map((img) => img.url),
      featured: row.featured,
      is_new: row.is_new,
      active: row.active,
      whatsapp_message: row.whatsapp_message ?? undefined,
      created_at: row.created_at,
    }));
  }, [toast]);

  const load = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    const [cats, prods] = await Promise.all([getAllCategoriesForAdmin(), loadProducts()]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  }, [loadProducts]);

  useEffect(() => { load(); }, [load]);

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      const matchCat = filterCat === "all" || p.category_id === filterCat;
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && p.active !== false) ||
        (filterStatus === "inactive" && p.active === false);
      return matchQ && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return dir * a.name.localeCompare(b.name, "tr");
      if (sortKey === "created_at") return dir * (a.created_at > b.created_at ? 1 : -1);
      if (sortKey === "stock") return dir * ((a.stock ?? 0) - (b.stock ?? 0));
      return dir * a.price_label.localeCompare(b.price_label, "tr");
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = () => setPage(1);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    resetPage();
  };

  const allOnPageSelected = paginated.length > 0 && paginated.every((p) => selected.has(p.id));
  const someSelected = selected.size > 0;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const toggleActive = async (product: Product) => {
    const supabase = getSupabase();
    setToggling(product.id);
    const next = !(product.active !== false);
    if (supabase) {
      const { error } = await supabase.from("products").update({ active: next }).eq("id", product.id);
      if (error) {
        toast({ variant: "destructive", title: "Hata", description: error.message });
        setToggling(null);
        return;
      }
    }
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, active: next } : p));
    setToggling(null);
    toast({ title: next ? "Ürün yayına alındı" : "Ürün gizlendi" });
  };

  const toggleFeatured = async (product: Product) => {
    const supabase = getSupabase();
    setToggling(product.id);
    if (supabase) {
      const { error } = await supabase.from("products").update({ featured: !product.featured }).eq("id", product.id);
      if (error) {
        toast({ variant: "destructive", title: "Hata", description: error.message });
        setToggling(null);
        return;
      }
    }
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, featured: !p.featured } : p));
    setToggling(null);
    toast({ title: product.featured ? "Öne çıkandan kaldırıldı" : "Öne çıkanlara eklendi" });
  };

  const handleDuplicate = async (product: Product) => {
    const supabase = getSupabase();
    setDuplicating(product.id);
    if (supabase) {
      const slug = `${product.slug}-kopya-${Date.now().toString(36)}`;
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: `${product.name} (Kopya)`,
          slug,
          category_id: product.category_id,
          description: product.description,
          short_description: product.short_description,
          specs: product.specs ?? {},
          price: product.price_numeric ?? null,
          old_price: product.old_price ?? null,
          price_label: product.price_label,
          stock: product.stock ?? 0,
          featured: false,
          is_new: product.is_new,
          active: false,
          whatsapp_message: product.whatsapp_message ?? null,
        })
        .select("id")
        .single();
      if (error || !data) {
        toast({ variant: "destructive", title: "Çoğaltılamadı", description: error?.message });
        setDuplicating(null);
        return;
      }
      if (product.images.length > 0) {
        await supabase.from("product_images").insert(
          product.images.map((url, i) => ({ product_id: data.id, url, sort_order: i, is_primary: i === 0, alt_text: product.name }))
        );
      }
      toast({ title: "Ürün çoğaltıldı", description: "Gizli olarak oluşturuldu. Düzenleyip yayına alabilirsin." });
      await load();
      setLocation(`/admin/urunler/${data.id}/duzenle`);
    } else {
      toast({ title: "Mock modunda çoğaltma desteklenmiyor." });
    }
    setDuplicating(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const supabase = getSupabase();
    setDeleting(true);
    if (supabase) {
      const { error } = await supabase.from("products").update({ active: false }).eq("id", deleteTarget.id);
      if (error) {
        toast({ variant: "destructive", title: "Silinemedi", description: error.message });
        setDeleting(false);
        return;
      }
    }
    setProducts((prev) => prev.map((p) => p.id === deleteTarget.id ? { ...p, active: false } : p));
    setDeleting(false);
    setDeleteTarget(null);
    toast({ title: "Ürün gizlendi", description: "Aktif/Pasif sütunundan tekrar yayına alabilirsin." });
  };

  const handleBulkConfirm = async () => {
    if (!bulkAction || selected.size === 0) return;
    const supabase = getSupabase();
    const ids = Array.from(selected);
    setDeleting(true);

    if (supabase) {
      const updates =
        bulkAction === "activate" ? { active: true } :
        bulkAction === "deactivate" ? { active: false } :
        { active: false };
      const { error } = await supabase.from("products").update(updates).in("id", ids);
      if (error) {
        toast({ variant: "destructive", title: "Toplu işlem başarısız", description: error.message });
        setDeleting(false);
        setBulkAction(null);
        return;
      }
    }

    setProducts((prev) => prev.map((p) => {
      if (!ids.includes(p.id)) return p;
      return bulkAction === "activate" ? { ...p, active: true } : { ...p, active: false };
    }));
    setSelected(new Set());
    setDeleting(false);
    setBulkAction(null);
    toast({ title: `${ids.length} ürün güncellendi` });
  };

  const getCatName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc"
        ? <ChevronUp className="w-3 h-3 inline ml-0.5" />
        : <ChevronDown className="w-3 h-3 inline ml-0.5" />
    ) : null;

  const from = (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Ürünler
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {products.length} kayıt
            {filtered.length !== products.length && ` · ${filtered.length} filtreli`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={load} disabled={loading} aria-label="Yenile">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/admin/urunler/yeni">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Yeni Ürün
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Ad, açıklama veya slug ara..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="pl-9"
          />
        </div>
        <Select value={filterCat} onValueChange={(v) => { setFilterCat(v); resetPage(); }}>
          <SelectTrigger className="w-48">
            <Layers className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
                {c.active === false && <span className="ml-1 text-muted-foreground text-[10px]">(gizli)</span>}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v as typeof filterStatus); resetPage(); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Yayında</SelectItem>
            <SelectItem value="inactive">Gizli</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
          <span className="text-sm font-medium text-primary">{selected.size} seçili</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={() => setBulkAction("activate")}>Yayına Al</Button>
            <Button size="sm" variant="outline" onClick={() => setBulkAction("deactivate")}>Gizle</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="text-muted-foreground">
              Seçimi Temizle
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-primary/40" />
            Yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Ürün bulunamadı</p>
            <p className="text-sm mt-1">
              {search || filterCat !== "all" || filterStatus !== "all"
                ? "Filtre veya arama kriterlerini değiştirmeyi dene."
                : "Henüz ürün eklenmemiş. İlk ürünü oluştur."}
            </p>
            {!search && filterCat === "all" && filterStatus === "all" && (
              <Link href="/admin/urunler/yeni">
                <Button className="mt-4 gap-2" size="sm">
                  <Plus className="w-4 h-4" /> İlk Ürünü Ekle
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 w-10">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Tümünü seç"
                    />
                  </th>
                  <th className="text-left p-4 w-12"></th>
                  <th
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                    onClick={() => toggleSort("name")}
                  >
                    Ürün <SortIcon k="name" />
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Kategori</th>
                  <th
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden md:table-cell select-none"
                    onClick={() => toggleSort("price_label")}
                  >
                    Fiyat <SortIcon k="price_label" />
                  </th>
                  <th
                    className="text-center p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden lg:table-cell select-none"
                    onClick={() => toggleSort("stock")}
                  >
                    Stok <SortIcon k="stock" />
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Yayın</th>
                  <th className="text-center p-4 font-medium text-muted-foreground hidden xl:table-cell">Öne Çıkan</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => {
                  const isActive = product.active !== false;
                  const isSel = selected.has(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${!isActive ? "opacity-60" : ""} ${isSel ? "bg-primary/5" : ""}`}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={isSel}
                          onCheckedChange={() => toggleSelect(product.id)}
                          aria-label={`${product.name} seç`}
                        />
                      </td>
                      <td className="p-4">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                            <Package className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium line-clamp-1 flex items-center gap-1.5">
                          {product.name}
                          {!isActive && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-300 text-amber-700 shrink-0">
                              Gizli
                            </Badge>
                          )}
                          {product.is_new && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1 border-blue-300 text-blue-700 shrink-0">
                              Yeni
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground/60 font-mono mt-0.5 truncate max-w-[180px]">
                          /{product.slug}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <Badge variant="secondary" className="font-normal">
                          {getCatName(product.category_id)}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium hidden md:table-cell tabular-nums">
                        {product.price_numeric
                          ? <span>₺{product.price_numeric.toLocaleString("tr-TR")}</span>
                          : <span className="text-muted-foreground text-xs">{product.price_label}</span>
                        }
                        {product.old_price && (
                          <span className="block text-xs text-muted-foreground line-through">
                            ₺{(product.old_price as number).toLocaleString("tr-TR")}
                          </span>
                        )}
                      </td>
                      <td className="p-4 hidden lg:table-cell text-center">
                        {stockBadge(product.stock)}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <Switch
                            checked={isActive}
                            onCheckedChange={() => toggleActive(product)}
                            disabled={toggling === product.id}
                            aria-label="Yayın durumu"
                          />
                        </div>
                      </td>
                      <td className="p-4 hidden xl:table-cell">
                        <div className="flex justify-center">
                          <Switch
                            checked={product.featured}
                            onCheckedChange={() => toggleFeatured(product)}
                            disabled={toggling === product.id}
                            aria-label="Öne çıkan"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-0.5 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                            aria-label="Önizle"
                          >
                            <a href={`/urun/${product.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setLocation(`/admin/urunler/${product.id}/duzenle`)}
                            aria-label="Düzenle"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => handleDuplicate(product)}
                            disabled={duplicating === product.id}
                            aria-label="Çoğalt"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          {isActive ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteTarget(product)}
                              aria-label="Gizle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                              onClick={() => toggleActive(product)}
                              disabled={toggling === product.id}
                              aria-label="Yayına al"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sayfa başına</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v) as typeof pageSize); setPage(1); }}>
              <SelectTrigger className="h-8 w-16 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <span>·</span>
            <span>{from}–{to} / {filtered.length} ürün</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline" size="icon" className="h-8 w-8"
              onClick={() => setPage(1)} disabled={safePage === 1}
              aria-label="İlk sayfa"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline" size="icon" className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              aria-label="Önceki sayfa"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm font-medium">{safePage} / {totalPages}</span>
            <Button
              variant="outline" size="icon" className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              aria-label="Sonraki sayfa"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline" size="icon" className="h-8 w-8"
              onClick={() => setPage(totalPages)} disabled={safePage === totalPages}
              aria-label="Son sayfa"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`"${deleteTarget?.name}" gizlensin mi?`}
        description="Ürün siteden kaldırılır ancak silinmez. İstediğinde tekrar yayına alabilirsin."
        onConfirm={handleDelete}
        loading={deleting}
      />
      <ConfirmDialog
        open={!!bulkAction}
        onOpenChange={(open) => !open && setBulkAction(null)}
        title={
          bulkAction === "activate" ? `${selected.size} ürün yayına alınsın mı?` :
          bulkAction === "deactivate" ? `${selected.size} ürün gizlensin mi?` :
          `${selected.size} ürün silinsin mi?`
        }
        description={
          bulkAction === "activate" ? "Seçili ürünler sitede görünür hale gelir." :
          "Seçili ürünler siteden gizlenir, silinmez."
        }
        onConfirm={handleBulkConfirm}
        loading={deleting}
      />
    </div>
  );
}
