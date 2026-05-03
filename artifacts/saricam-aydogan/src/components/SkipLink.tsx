import { useT } from "@/lib/i18n";

/**
 * Accessibility skip-link: invisible until keyboard-focused.
 * Lets screen reader / keyboard users jump straight to <main id="main-content">.
 */
export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-white focus:font-bold focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
