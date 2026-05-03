export type Lang = "tr" | "en";

export const translations = {
  tr: {
    // Skip link / a11y
    "a11y.skipToContent": "İçeriğe atla",

    // Nav
    "nav.home": "Anasayfa",
    "nav.products": "Ürünler",
    "nav.blog": "Blog",
    "nav.map": "Harita",
    "nav.academy": "Akademi",
    "nav.about": "Hakkımızda",
    "nav.contact": "İletişim",

    // Header buttons
    "header.cta": "Bize Ulaşın",
    "header.search": "Akıllı arama",
    "header.wishlist": "Favoriler",
    "header.cart": "Sepet",
    "header.menu": "Menü",
    "header.instagram": "Instagram'da takip edin",
    "header.langToggle": "Dil seçimi",

    // Mobile menu
    "mobile.whatsapp": "WhatsApp'tan Ulaşın",
    "mobile.instagram": "Instagram",

    // Footer
    "footer.brandLine": "Torosların eteklerinden doğaya.",
    "footer.brandLineEm": "Hazır mıyız.",
    "footer.cta": "WhatsApp'tan Yazın",
    "footer.col.discover": "Keşfet",
    "footer.col.categories": "Kategoriler",
    "footer.col.corporate": "Kurumsal",
    "footer.col.contact": "İletişim",
    "footer.faq": "Sık Sorulan Sorular",
    "footer.shipping": "Teslimat & Sipariş",
    "footer.policy": "Mağaza Politikası",
    "footer.privacy": "KVKK & Gizlilik",
    "footer.copyright": "Adana Sarıçam — Doğanın Kapısı",

    // Categories (footer)
    "cat.tents": "Çadırlar",
    "cat.fishing": "Olta & Makine",
    "cat.camp": "Kamp Aksesuarları",
    "cat.lighting": "Aydınlatma",

    // CTAs
    "cta.callMe": "Beni Ara",
    "cta.contactWa": "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.",

    // Loading
    "loading.page": "Yükleniyor",
  },
  en: {
    "a11y.skipToContent": "Skip to content",

    "nav.home": "Home",
    "nav.products": "Products",
    "nav.blog": "Blog",
    "nav.map": "Map",
    "nav.academy": "Academy",
    "nav.about": "About",
    "nav.contact": "Contact",

    "header.cta": "Contact Us",
    "header.search": "Smart search",
    "header.wishlist": "Wishlist",
    "header.cart": "Cart",
    "header.menu": "Menu",
    "header.instagram": "Follow on Instagram",
    "header.langToggle": "Language",

    "mobile.whatsapp": "Message on WhatsApp",
    "mobile.instagram": "Instagram",

    "footer.brandLine": "From Sarıçam to the wild.",
    "footer.brandLineEm": "Ready when you are.",
    "footer.cta": "Message on WhatsApp",
    "footer.col.discover": "Discover",
    "footer.col.categories": "Categories",
    "footer.col.corporate": "Corporate",
    "footer.col.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.shipping": "Shipping & Orders",
    "footer.policy": "Store Policy",
    "footer.privacy": "Privacy & GDPR",
    "footer.copyright": "Adana Sarıçam — Gateway to Nature",

    "cat.tents": "Tents",
    "cat.fishing": "Rods & Reels",
    "cat.camp": "Camp Accessories",
    "cat.lighting": "Lighting",

    "cta.callMe": "Call Me",
    "cta.contactWa": "Hi, I'd like more information about your products.",

    "loading.page": "Loading",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["tr"];
