import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => window.open(buildWhatsAppLink("Merhaba, yardım almak istiyorum."), "_blank")}
      className="whatsapp-fab"
      aria-label="WhatsApp'tan Ulaşın"
    >
      <span className="whatsapp-fab-pulse" />
      <MessageCircle className="w-7 h-7 relative z-10" strokeWidth={1.8} />
    </motion.button>
  );
}
