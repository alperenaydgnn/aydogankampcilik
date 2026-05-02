import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  italicAccent?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  italicAccent,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <motion.div
      className={cn("mb-16 md:mb-20", centered && "text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <span className={cn("eyebrow", centered && "justify-center")}>
          {eyebrow}
        </span>
      )}
      <h2 className="editorial-heading text-4xl md:text-5xl lg:text-6xl">
        {title}
        {italicAccent && (
          <>
            {" "}
            <em className="italic font-light text-secondary">{italicAccent}</em>
          </>
        )}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-6 text-foreground/60 text-base md:text-lg leading-relaxed max-w-2xl font-light",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
