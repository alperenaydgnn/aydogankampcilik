import { Link } from "wouter";
import { motion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlurImage } from "@/components/BlurImage";
import { useTilt } from "@/lib/useTilt";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const num = String(index + 1).padStart(2, "0");
  const { ref, rotateX, rotateY, shineX, shineY, isHovered, onMove, onEnter, onLeave, reduced } = useTilt(7);

  // Cursor-following radial highlight (intensity scales with hover spring)
  const spotlight = useTransform(
    [shineX, shineY, isHovered],
    ([x, y, h]) =>
      `radial-gradient(560px circle at ${x} ${y}, rgba(255,255,255,${0.22 * (h as number)}), transparent 55%)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/urunler/${category.slug}`} className="block group">
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
          className="relative overflow-hidden bg-foreground/5 transition-transform duration-500 ease-out group-hover:-translate-y-2 will-change-transform"
        >
          <AspectRatio ratio={3 / 4}>
            <BlurImage
              src={category.image_url}
              alt={category.name}
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09]"
              loading="lazy"
            />

            {/* Cursor-following spotlight */}
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: spotlight }}
              />
            )}

            {/* Diagonal sheen sweep on hover */}
            <div aria-hidden className="card-sheen pointer-events-none absolute inset-0 overflow-hidden" />

            {/* Bottom gradient — intensifies on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent transition-opacity duration-500 group-hover:from-black/65" />

            {/* Hairline accent that draws in */}
            <div className="absolute left-5 right-5 bottom-[5.5rem] md:bottom-[6.5rem] h-px bg-white/0 group-hover:bg-white/70 origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-700 ease-out" />

            {/* Top-left index — subtle scale on hover */}
            <div
              className="absolute top-5 left-5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/85
                         transition-all duration-500 ease-out group-hover:tracking-[0.32em] group-hover:text-white"
              style={{ transform: "translateZ(30px)" } as React.CSSProperties}
            >
              {num} <span className="text-white/55">/ Kategori</span>
            </div>

            {/* Top-right circular arrow chip */}
            <div
              aria-hidden
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/12 backdrop-blur-md border border-white/30
                         flex items-center justify-center
                         opacity-0 -translate-y-1 translate-x-1 scale-90
                         group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-100
                         transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: "translateZ(50px)" } as React.CSSProperties}
            >
              <ArrowUpRight className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-500 ease-out" />
            </div>

            {/* Bottom title block — slides up on hover */}
            <div
              className="absolute bottom-0 left-0 right-0 p-6 md:p-7 transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
              style={{ transform: "translateZ(20px)" } as React.CSSProperties}
            >
              <h3 className="font-serif font-light text-2xl md:text-3xl text-white leading-tight tracking-tight">
                <span className="bg-[linear-gradient(rgba(255,255,255,0.9),rgba(255,255,255,0.9))] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%]
                                 group-hover:bg-[length:100%_1px] transition-[background-size] duration-700 ease-out">
                  {category.name}
                </span>
              </h3>
              <div className="mt-3 flex items-center gap-2 text-white/85 text-[0.7rem] font-bold uppercase tracking-[0.22em]
                              group-hover:gap-3 group-hover:text-white transition-all duration-300">
                <span>Keşfet</span>
                <span className="inline-flex w-6 h-px bg-white/70 group-hover:w-10 transition-[width] duration-500 ease-out" />
              </div>
            </div>
          </AspectRatio>
        </motion.div>
      </Link>
    </motion.div>
  );
}
