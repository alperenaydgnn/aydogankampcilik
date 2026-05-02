import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlurImage } from "@/components/BlurImage";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/urunler/${category.slug}`} className="block group">
        {/* Editorial bare image */}
        <div className="relative overflow-hidden bg-foreground/5">
          <AspectRatio ratio={3 / 4}>
            <BlurImage
              src={category.image_url}
              alt={category.name}
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            {/* Subtle gradient bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            {/* Top-left index */}
            <div className="absolute top-5 left-5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/85">
              {num} / Kategori
            </div>

            {/* Bottom title block */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
              <h3 className="font-serif font-light text-2xl md:text-3xl text-white leading-tight tracking-tight">
                {category.name}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-white/85 text-[0.7rem] font-bold uppercase tracking-[0.22em] opacity-90 group-hover:gap-3 transition-all duration-300">
                <span>Keşfet</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
              </div>
            </div>
          </AspectRatio>
        </div>
      </Link>
    </motion.div>
  );
}
