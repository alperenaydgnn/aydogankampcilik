/* ─────────────────────────────────────────────────────────────────
   JSON-LD Schema builders — reusable structured data for all pages
   ───────────────────────────────────────────────────────────────── */

export const SITE_URL  = "https://saricamaydogan.com";
export const SITE_NAME = "Sarıçam Aydoğan Kamp & Balık Malzemeleri";
export const SITE_PHONE       = "+905551234567";
export const SITE_PHONE_HUMAN = "+90 555 123 45 67";
export const SITE_EMAIL       = "info@saricamaydogan.com";
export const SITE_ADDRESS = {
  street:  "Cumhuriyet Mah. Sahil Cd. No:42",
  city:    "Trabzon",
  region:  "Trabzon",
  country: "TR",
  postal:  "61000",
};
export const SITE_GEO          = { lat: 41.0015, lng: 39.7178 };
export const SITE_HOURS_HUMAN  = "Pzt–Cmt 09:00–19:00";
export const SITE_PRICE_RANGE  = "₺₺";
export const SITE_HERO_IMAGE   = `${SITE_URL}/mock/hero.jpg`;

/* ── LocalBusiness (+ Store) ─────────────────────────────────── */
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    description:
      "Trabzon'da kamp malzemeleri, balık malzemeleri ve outdoor ekipmanları mağazası. " +
      "Kamp çadırı, olta takımı, kamp feneri ve balıkçı malzemelerinde 15 yıllık tecrübe.",
    url: SITE_URL,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress:    SITE_ADDRESS.street,
      addressLocality:  SITE_ADDRESS.city,
      addressRegion:    SITE_ADDRESS.region,
      postalCode:       SITE_ADDRESS.postal,
      addressCountry:   SITE_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude:  SITE_GEO.lat,
      longitude: SITE_GEO.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday",
          "Thursday", "Friday", "Saturday",
        ],
        opens:  "09:00",
        closes: "19:00",
      },
    ],
    currenciesAccepted: "TRY",
    paymentAccepted:    "Nakit, Kredi Kartı, WhatsApp Sipariş",
    priceRange:  SITE_PRICE_RANGE,
    areaServed:  { "@type": "Country", name: "Turkey" },
    image:  SITE_HERO_IMAGE,
    logo: {
      "@type": "ImageObject",
      url:    `${SITE_URL}/favicon.svg`,
      width:  512,
      height: 512,
    },
    hasMap: "https://maps.app.goo.gl/saricam-aydogan",
    keywords:
      "kamp malzemeleri, balık malzemeleri, olta ekipmanları, kamp çadırı, " +
      "balıkçı malzemeleri, outdoor ekipmanları, Trabzon",
    sameAs: [],
  };
}

/* ── Organization ────────────────────────────────────────────── */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name:    SITE_NAME,
    url:     SITE_URL,
    logo: {
      "@type": "ImageObject",
      url:    SITE_HERO_IMAGE,
      width:  1200,
      height: 630,
    },
    contactPoint: {
      "@type":            "ContactPoint",
      telephone:          SITE_PHONE,
      contactType:        "customer service",
      availableLanguage:  "Turkish",
      areaServed:         "TR",
    },
  };
}

/* ── WebSite (enables Sitelinks Searchbox) ───────────────────── */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id":   `${SITE_URL}/#website`,
    name:    SITE_NAME,
    url:     SITE_URL,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type":       "EntryPoint",
        urlTemplate:   `${SITE_URL}/urunler?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ── BreadcrumbList ──────────────────────────────────────────── */
export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       item.name,
      item:       `${SITE_URL}${item.url}`,
    })),
  };
}

/* ── ItemList (catalog pages) ────────────────────────────────── */
export function buildItemListSchema(
  products: {
    name:    string;
    url:     string;
    image?:  string;
  }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 20).map((p, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       p.name,
      url:        `${SITE_URL}${p.url}`,
      ...(p.image ? { image: p.image } : {}),
    })),
  };
}
