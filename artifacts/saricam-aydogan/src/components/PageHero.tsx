import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title:        string;
  subtitle?:    string;
  eyebrow?:     string;
  breadcrumbs?: BreadcrumbItem[];
  icon?:        LucideIcon;
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
  icon: Icon,
}: PageHeroProps) {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-primary overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.12] mix-blend-overlay">
        <img
          src={`${baseUrl}/mock/hero.jpg`}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-primary" />

      <div className="container relative z-10 px-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex justify-center"
          >
            <ol className="flex flex-wrap items-center gap-1 text-sm text-primary-foreground/60">
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
                    <ChevronRight className="w-3.5 h-3.5 mx-1 text-primary-foreground/30" />
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold uppercase tracking-wider mb-5">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground tracking-tight leading-[1.1] mb-5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-primary-foreground/75 font-light max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
