import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft, Check, ShieldCheck, Truck } from "lucide-react";
import { getProductBySlug } from "@/lib/data";
import { Product, Category } from "@/lib/mockData";
import { SEO } from "@/lib/seo";
import { ImageGallery } from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import NotFound from "./not-found";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{ product: Product; category: Category } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return <NotFound />;

  const { product, category } = data;

  const handleOrder = () => {
    const productLine = `Ürün: ${product.name} • Kategori: ${category.name}`;
    const customNote = product.whatsapp_message?.trim();
    const message = customNote
      ? `${productLine}\n\n${customNote}`
      : `Merhaba! '${product.name}' (${category.name}) ürünü hakkında bilgi almak istiyorum.`;
    window.open(buildWhatsAppLink(message), "_blank");
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background">
      <SEO 
        title={product.name} 
        description={product.description} 
        image={product.images[0]} 
      />

      <div className="container px-4 max-w-6xl">
        <Link href="/urunler" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" />
          Tüm Ürünlere Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery images={product.images} alt={product.name} />
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-2">
              <Link href={`/urunler/${category.slug}`} className="text-secondary font-medium text-sm uppercase tracking-wider hover:underline">
                {category.name}
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="text-3xl font-medium text-primary mb-6">
              {product.price_label}
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* WhatsApp CTA */}
            <div className="bg-card border border-border p-6 rounded-2xl mb-10 shadow-sm">
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleOrder}
                  className="w-full text-lg py-7 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>WhatsApp'tan Sipariş Ver</span>
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Online ödeme almıyoruz. Siparişlerinizi WhatsApp üzerinden, stok teyidi ile güvenle oluşturabilirsiniz.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                Orijinal Ürün Garantisi
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                Aynı Gün Kargo
              </div>
            </div>

            {/* Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="text-xl font-serif font-semibold mb-4">Teknik Özellikler</h3>
                <div className="border border-border rounded-xl overflow-hidden bg-card">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? "bg-muted/30" : "bg-card"}>
                          <th className="px-4 py-3 font-medium text-foreground w-1/3 border-r border-border/50">
                            {key}
                          </th>
                          <td className="px-4 py-3 text-muted-foreground">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
