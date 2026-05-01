/* ── WhatsApp click analytics ─────────────────────────────────────────
 *  Drop-in ready for GA4, Facebook Pixel, Mixpanel, or any custom sink.
 *  Swap the stubs below for your real tracking calls.
 * ───────────────────────────────────────────────────────────────────── */

export type WhatsAppEventType =
  | 'product_order'       // ordering a specific product
  | 'product_inquiry'     // asking about a specific product
  | 'catalog_inquiry'     // general category inquiry
  | 'search_inquiry'      // triggered from search hint
  | 'general_inquiry';    // catch-all (FAB, footer, etc.)

export type WhatsAppEventSource =
  | 'product_card'
  | 'product_detail_main'
  | 'product_detail_sticky'
  | 'product_detail_cta_strip'
  | 'catalog_empty'
  | 'catalog_search_hint'
  | 'catalog_sidebar'
  | 'catalog_strip'
  | 'home_hero'
  | 'home_strip'
  | 'fab';

export interface WhatsAppTrackingData {
  event: WhatsAppEventType;
  source: WhatsAppEventSource;
  product_id?: string;
  product_name?: string;
  product_slug?: string;
  category_id?: string;
  category_name?: string;
  price_numeric?: number;
  search_query?: string;
}

export function trackWhatsAppClick(data: WhatsAppTrackingData): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] 📱 WhatsApp Click:', data);
  }

  /* ── Google Analytics 4 ─────────────────────────────────────────── */
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: data.product_name ?? data.category_name ?? 'general',
      value: data.price_numeric ?? 0,
      custom_source: data.source,
      custom_event_type: data.event,
      product_id: data.product_id,
      product_slug: data.product_slug,
      category_name: data.category_name,
    });
  }

  /* ── Facebook Pixel ─────────────────────────────────────────────── */
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', 'WhatsAppClick', {
      content_name: data.product_name,
      content_category: data.category_name,
      content_ids: data.product_id ? [data.product_id] : [],
      value: data.price_numeric,
      currency: 'TRY',
      custom_source: data.source,
    });
  }

  /* ── Mixpanel (uncomment when integrated) ───────────────────────── */
  // if (typeof window !== 'undefined' && (window as any).mixpanel) {
  //   (window as any).mixpanel.track('WhatsApp Click', data);
  // }
}
