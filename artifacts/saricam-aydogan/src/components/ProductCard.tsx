import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/urun/${product.slug}`} className="block group">
        <div className="bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
          {category && (
            <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-secondary/95 text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 shadow-md">
              {category.name}
            </span>
          )}
          <div className="overflow-hidden bg-muted">
            <AspectRatio ratio={4/3}>
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </AspectRatio>
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </div>

            <div className="flex items-end justify-between mt-2 pt-4 border-t border-border/50">
              <span className="font-medium text-lg text-primary">
                {product.price_label}
              </span>
              <span className="text-sm font-medium text-secondary uppercase tracking-wider">
                İncele
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
