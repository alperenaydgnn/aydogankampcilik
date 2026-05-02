import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlurImage } from "@/components/BlurImage";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/urunler/${category.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl shadow-card hover-lift card-glow">
          <AspectRatio ratio={3 / 4}>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500 z-10" />
            <BlurImage
              src={category.image_url}
              alt={category.name}
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
              loading="lazy"
            />
            <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent">
              <span className="inline-flex self-start mb-3 text-[0.65rem] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-secondary/90 text-white shadow-sm">
                Kategori
              </span>
              <h3 className="text-[1.4rem] font-serif font-bold text-white leading-tight mb-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                {category.name}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed line-clamp-2 transform opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {category.description}
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-secondary text-xs font-semibold uppercase tracking-wider opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                Ürünleri Gör <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </AspectRatio>
        </div>
      </Link>
    </motion.div>
  );
}
