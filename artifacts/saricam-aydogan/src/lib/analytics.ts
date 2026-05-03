/* ── WhatsApp click analytics ─────────────────────────────────────────
 *  Drop-in ready for GA4, Facebook Pixel, Mixpanel, or any custom sink.
 *  Swap the stubs below for your real tracking calls.
 * ───────────────────────────────────────────────────────────────────── */

export type WhatsAppEventType =
  | 'product_order'       // ordering a specific product
  | 'product_inquiry'     // asking about a specific product
  | 'catalog_inquiry'     // general category inquiry
  | 'search_inquiry'      // triggered from search hint
  | 'wishlist_share'      // share wishlist via WhatsApp
  | 'compare_share'       // share compare table via WhatsApp
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
  | 'favorites_page'
  | 'compare_page'
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
  item_count?: number;
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

/* ── Generic funnel events ─────────────────────────────────────────────
 *  Used by: cart, checkout wizard, callback FAB, exit-intent modal.
 *  Drop-in ready for GA4 / Pixel — same sinks as `trackWhatsAppClick`.
 * ──────────────────────────────────────────────────────────────────── */
export type FunnelEventType =
  | 'cart_add'
  | 'cart_remove'
  | 'cart_open'
  | 'checkout_start'
  | 'checkout_step'
  | 'checkout_submit'
  | 'callback_open'
  | 'callback_request'
  | 'exit_intent_shown'
  | 'exit_intent_cta'
  | 'combo_view'
  | 'combo_add'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'wishlist_open'
  | 'wishlist_share'
  | 'compare_add'
  | 'compare_remove'
  | 'compare_limit'
  | 'compare_share'
  | 'search_open'
  | 'search_query'
  | 'search_inquiry'
  | 'whatsapp_click'
  | 'push_optin'
  | 'push_optout'
  | 'pwa_install_shown'
  | 'pwa_install_accepted'
  | 'pwa_install_dismissed';

export interface FunnelEventData {
  event: FunnelEventType;
  source: string;
  product_id?: string;
  product_name?: string;
  product_slug?: string;
  category_id?: string;
  category_name?: string;
  combo_id?: string;
  step?: string;
  item_count?: number;
  subtotal?: number;
  total?: number;
  delivery?: string;
  payment?: string;
  has_combo?: boolean;
  time_window?: string;
  price_numeric?: number;
  search_query?: string;
}

export function trackEvent(data: FunnelEventData): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] 📊', data.event, data);
  }
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', data.event, {
      event_category: 'sales_funnel',
      custom_source: data.source,
      ...data,
    });
  }
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', data.event, data);
  }
}
