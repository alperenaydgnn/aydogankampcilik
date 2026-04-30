import { Link } from "wouter";
import { motion } from "framer-motion";
import { Category } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/urunler/${category.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl">
          <AspectRatio ratio={3/4}>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
            <img 
              src={category.image_url} 
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              <h3 className="text-2xl font-serif font-bold text-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
                {category.name}
              </h3>
              <p className="text-white/80 text-sm line-clamp-2 transform opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                {category.description}
              </p>
            </div>
          </AspectRatio>
        </div>
      </Link>
    </motion.div>
  );
}
