import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title:        string;
  italicAccent?:string;
  subtitle?:    string;
  eyebrow?:     string;
  breadcrumbs?: BreadcrumbItem[];
  icon?:        LucideIcon;
  image?:       string;
}

export function PageHero({
  title,
  italicAccent,
  subtitle,
  eyebrow,
  breadcrumbs,
  icon: Icon,
  image,
}: PageHeroProps) {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const heroImage = image ?? `${baseUrl}/mock/hero.jpg`;

  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-primary">
      {/* Cinematic background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-primary/95" />
      </div>

      <div className="container relative z-10 px-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex justify-center"
          >
            <ol className="flex flex-wrap items-center gap-1 text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground/55">
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-primary-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-primary-foreground/85">{crumb.label}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-3 h-3 mx-1.5 text-primary-foreground/30" />
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2.5 mb-8 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-secondary">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span className="w-6 h-px bg-secondary" />
              {eyebrow}
            </span>
          )}
          <h1 className="font-serif font-light tracking-tight leading-[1.05] text-primary-foreground text-5xl md:text-6xl lg:text-7xl">
            {title}
            {italicAccent && (
              <>
                <br />
                <em className="italic font-light text-primary-foreground/85">{italicAccent}</em>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="mt-8 text-base md:text-lg text-primary-foreground/70 font-light max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-primary-foreground/10" />
    </section>
  );
}
