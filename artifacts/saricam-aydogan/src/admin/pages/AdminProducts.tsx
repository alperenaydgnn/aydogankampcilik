import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown, RefreshCw, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/admin/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";
import { getCategories } from "@/lib/data";
import { Category, Product } from "@/lib/mockData";
import { mockProducts } from "@/lib/mockData";
import type { DBProductWithRelations } from "@/lib/database.types";

type SortKey = "name" | "created_at" | "price_label";
type SortDir = "asc" | "desc";

const ADMIN_PRODUCT_SELECT =
  "*, product_images(*), product_tags(tag:tags(*))";

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
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  /** Admin uses an unfiltered fetch (RLS allows admin to read inactive rows). */
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
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [cats, prods] = await Promise.all([getCategories(), loadProducts()]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  }, [loadProducts]);

  useEffect(() => { load(); }, [load]);

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
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
      return dir * a.price_label.localeCompare(b.price_label, "tr");
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
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
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p))
    );
    setToggling(null);
    toast({ title: product.featured ? "Öne çıkandan kaldırıldı" : "Öne çıkanlara eklendi" });
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
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: next } : p))
    );
    setToggling(null);
    toast({ title: next ? "Ürün yayına alındı" : "Ürün gizlendi" });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const supabase = getSupabase();
    setDeleting(true);
    // Soft delete = set active = false. RLS cascades via the active filter for public.
    if (supabase) {
      const { error } = await supabase
        .from("products")
        .update({ active: false })
        .eq("id", deleteTarget.id);
      if (error) {
        toast({ variant: "destructive", title: "Silinemedi", description: error.message });
        setDeleting(false);
        return;
      }
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === deleteTarget.id ? { ...p, active: false } : p))
    );
    setDeleting(false);
    setDeleteTarget(null);
    toast({ title: "Ürün gizlendi", description: "Yayından kaldırıldı (soft delete). İstersen filtreden tekrar açabilirsin." });
  };

  const getCatName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Ürünler</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{products.length} ürün kayıtlı</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={load} aria-label="Yenile">
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
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-48 bg-background">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="w-40 bg-background">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Yayında</SelectItem>
            <SelectItem value="inactive">Gizli</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {search || filterCat !== "all" || filterStatus !== "all" ? "Sonuç bulunamadı." : "Henüz ürün yok. İlk ürünü ekleyin."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground w-12"></th>
                  <th
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                    onClick={() => toggleSort("name")}
                  >
                    Ad <SortIcon k="name" />
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Kategori</th>
                  <th
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden md:table-cell select-none"
                    onClick={() => toggleSort("price_label")}
                  >
                    Fiyat <SortIcon k="price_label" />
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Yayın</th>
                  <th className="text-center p-4 font-medium text-muted-foreground hidden lg:table-cell">Öne Çıkan</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const isActive = product.active !== false;
                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${!isActive ? "opacity-60" : ""}`}
                    >
                      <td className="p-4">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                            <span className="text-muted-foreground text-xs">?</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium line-clamp-1 flex items-center gap-2">
                          {product.name}
                          {!isActive && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-amber-300 text-amber-700">
                              Gizli
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{product.slug}</div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <Badge variant="secondary">{getCatName(product.category_id)}</Badge>
                      </td>
                      <td className="p-4 font-medium hidden md:table-cell">{product.price_label}</td>
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
                      <td className="p-4 hidden lg:table-cell">
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
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation(`/admin/urunler/${product.id}/duzenle`)}
                            aria-label="Düzenle"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteTarget(product)}
                            aria-label="Gizle"
                            disabled={!isActive}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`"${deleteTarget?.name}" gizlensin mi?`}
        description="Ürün siteden gizlenir (active=false) — kalıcı olarak silinmez. Daha sonra tekrar yayına alabilirsin."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
