import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Product, Category } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getCategories } from "@/lib/data";

let categoriesCache: Category[] | null = null;
const subscribers = new Set<(cats: Category[]) => void>();

function useCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>(categoriesCache ?? []);
  useEffect(() => {
    if (categoriesCache) return;
    let cancelled = false;
    subscribers.add(setCats);
    getCategories().then((data) => {
      if (cancelled) return;
      categoriesCache = data;
      subscribers.forEach((cb) => cb(data));
    });
    return () => {
      cancelled = true;
      subscribers.delete(setCats);
    };
  }, []);
  return cats;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const mainImage = product.images[0];
  const categories = useCategories();
  const category = categories.find((c) => c.id === product.category_id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/urun/${product.slug}`} className="block group product-card">
        {/* Image */}
        <div className="relative overflow-hidden bg-muted/40 rounded-t-2xl">
          {category && (
            <span className="badge-category absolute top-3 left-3 z-10">
              {category.name}
            </span>
          )}
          <AspectRatio ratio={4 / 3}>
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </AspectRatio>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <h3 className="font-serif font-semibold text-[1.05rem] leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-3.5 border-t border-border/50">
            <span className="price-label">
              {product.price_label}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-secondary uppercase tracking-wider opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              İncele <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
