const DEFAULT_NUMBER = '905551112233';

export function getWhatsAppNumber(): string {
  return import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER;
}

export function buildWhatsAppLink(message: string): string {
  const number = getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
