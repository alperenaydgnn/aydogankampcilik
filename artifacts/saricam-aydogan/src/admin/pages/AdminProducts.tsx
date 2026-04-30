import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  Plus, Search, Pencil, Trash2, Star, StarOff, ChevronUp, ChevronDown, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/admin/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabase";
import { getCategories, getProducts } from "@/lib/data";
import { Category, Product } from "@/lib/mockData";

type SortKey = "name" | "created_at" | "price_label";
type SortDir = "asc" | "desc";

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchCat = filterCat === "all" || p.category_id === filterCat;
      return matchQ && matchCat;
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const supabase = getSupabase();
    setDeleting(true);
    if (supabase) {
      const { error } = await supabase.from("products").delete().eq("id", deleteTarget.id);
      if (error) {
        toast({ variant: "destructive", title: "Silinemedi", description: error.message });
        setDeleting(false);
        return;
      }
    }
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
    toast({ title: "Ürün silindi" });
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
      </div>

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {search || filterCat !== "all" ? "Sonuç bulunamadı." : "Henüz ürün yok. İlk ürünü ekleyin."}
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
                  <th className="text-center p-4 font-medium text-muted-foreground">Öne Çıkan</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
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
                      <div className="font-medium line-clamp-1">{product.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{product.slug}</div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <Badge variant="secondary">{getCatName(product.category_id)}</Badge>
                    </td>
                    <td className="p-4 font-medium hidden md:table-cell">{product.price_label}</td>
                    <td className="p-4">
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
                          aria-label="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`"${deleteTarget?.name}" silinsin mi?`}
        description="Bu ürün kalıcı olarak silinecek. Bu işlem geri alınamaz."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
