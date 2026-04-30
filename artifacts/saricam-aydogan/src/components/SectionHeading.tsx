import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left", className }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <motion.div
      className={cn("mb-12", centered && "text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <span className={cn("eyebrow", centered && "justify-center")}>
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground tracking-tight leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-4 text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl",
          centered && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
      <div className={cn("section-accent-line", centered && "mx-auto")} />
    </motion.div>
  );
}
