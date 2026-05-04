/* ─────────────────────────────────────────────────────────────────
   JSON-LD Schema builders — reusable structured data for all pages
   ───────────────────────────────────────────────────────────────── */

export const SITE_URL  = "https://aydogankampcilik.com";
export const SITE_NAME = "Aydoğan Kampçılık — Kamp & Balık Malzemeleri";
export const SITE_PHONE       = "+905076442350";
export const SITE_PHONE_HUMAN = "+90 507 644 23 50";
export const SITE_EMAIL       = "info@aydogankampcilik.com";
export const SITE_ADDRESS = {
  street:  "Sarıçam Mah. Atatürk Cd. No:18",
  city:    "Adana",
  region:  "Adana",
  country: "TR",
  postal:  "01320",
};
export const SITE_GEO          = { lat: 37.033411, lng: 35.422298 };
export const SITE_HOURS_HUMAN  = "Her Gün: 09:00 – 20:00";
export const SITE_ADDRESS_FULL =
  "Sarıçam Mah. Atatürk Cd. No:18, Sarıçam / Adana";
export const SITE_PRICE_RANGE  = "₺₺";
export const SITE_HERO_IMAGE   = `${SITE_URL}/mock/hero.jpg`;

const SITE_SOCIAL = [
  "https://instagram.com/aydogankampcilik",
  "https://facebook.com/aydogankampcilik",
];

const SITE_KEYWORDS =
  "kamp malzemeleri, balık malzemeleri, olta ekipmanları, kamp çadırı, " +
  "balıkçı malzemeleri, outdoor ekipmanları, kamp ekipmanları, uyku tulumu, " +
  "kamp feneri, kafa lambası, termos, soğutucu, Adana, Sarıçam, Toros, " +
  "Seyhan barajı balıkçılık, Toros kamp";

/* ── LocalBusiness (+ Store) ─────────────────────────────────── */
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store", "SportingGoodsStore"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Aydoğan Kampçılık",
    description:
      "Adana Sarıçam'da kamp malzemeleri, balık malzemeleri ve outdoor ekipmanları mağazası. " +
      "Kamp çadırı, olta takımı, kamp feneri ve balıkçı malzemelerinde 15 yıllık tecrübe. " +
      "Toros ve Seyhan havzası için uzman ekipman tavsiyesi. WhatsApp ile hızlı sipariş.",
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
          "Thursday", "Friday", "Saturday", "Sunday",
        ],
        opens:  "09:00",
        closes: "20:00",
      },
    ],
    currenciesAccepted: "TRY",
    paymentAccepted:    "Nakit, Kredi Kartı, EFT/Havale, WhatsApp Sipariş",
    priceRange:  SITE_PRICE_RANGE,
    areaServed:  [
      { "@type": "City", name: "Adana" },
      { "@type": "State", name: "Adana" },
      { "@type": "Country", name: "Turkey" },
    ],
    image:  SITE_HERO_IMAGE,
    logo: {
      "@type": "ImageObject",
      url:    `${SITE_URL}/favicon.svg`,
      width:  512,
      height: 512,
    },
    hasMap: "https://maps.app.goo.gl/aydogankampcilik",
    keywords: SITE_KEYWORDS,
    sameAs: SITE_SOCIAL,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Kamp & Balık Malzemeleri Kataloğu",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Kamp Çadırları",       url: `${SITE_URL}/urunler/cadirlar` },
        { "@type": "OfferCatalog", name: "Olta & Balık Makinesi",url: `${SITE_URL}/urunler/olta-ve-makine` },
        { "@type": "OfferCatalog", name: "Kamp Ekipmanları",     url: `${SITE_URL}/urunler/kamp-aksesuarlari` },
        { "@type": "OfferCatalog", name: "Aydınlatma",           url: `${SITE_URL}/urunler/aydinlatma` },
        { "@type": "OfferCatalog", name: "Termos & Soğutucu",    url: `${SITE_URL}/urunler/termos-ve-sogutucu` },
        { "@type": "OfferCatalog", name: "Olta Aksesuarları",    url: `${SITE_URL}/urunler/olta-aksesuarlari` },
        { "@type": "OfferCatalog", name: "Outdoor & Trekking",   url: `${SITE_URL}/urunler/outdoor-aksesuarlari` },
        { "@type": "OfferCatalog", name: "Çakmak & Ateş",       url: `${SITE_URL}/urunler/cakmak-ve-ates` },
      ],
    },
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
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens:  "09:00",
        closes: "20:00",
      },
    },
    sameAs: SITE_SOCIAL,
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

/* ── FAQPage ─────────────────────────────────────────────────── */
export function buildFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
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

/* ── Product (product detail pages) ─────────────────────────── */
export function buildProductSchema(product: {
  name:         string;
  slug:         string;
  description:  string;
  image?:       string;
  price?:       number | null;
  oldPrice?:    number | null;
  priceLabel?:  string | null;
  inStock?:     boolean;
  category?:    string;
  sku?:         string;
}) {
  const url = `${SITE_URL}/urun/${product.slug}`;
  const availability = product.inStock === false
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/InStock";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name:        product.name,
    description: product.description,
    url,
    image:       product.image ?? SITE_HERO_IMAGE,
    brand: {
      "@type": "Brand",
      name: "Aydoğan Kampçılık",
    },
    seller: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     SITE_URL,
    },
  };

  if (product.sku) schema.sku = product.sku;
  if (product.category) schema.category = product.category;

  if (product.price) {
    schema.offers = {
      "@type":         "Offer",
      url,
      priceCurrency:   "TRY",
      price:           product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      availability,
      seller: {
        "@type": "Organization",
        name:    SITE_NAME,
        url:     SITE_URL,
      },
      ...(product.oldPrice
        ? { priceSpecification: {
              "@type":         "PriceSpecification",
              price:            product.oldPrice.toFixed(2),
              priceCurrency:    "TRY",
            },
          }
        : {}),
    };
  } else {
    schema.offers = {
      "@type":       "Offer",
      url,
      availability,
      priceCurrency: "TRY",
      description:   product.priceLabel ?? "Fiyat için iletişime geçin",
      seller: {
        "@type": "Organization",
        name:    SITE_NAME,
        url:     SITE_URL,
      },
    };
  }

  return schema;
}
