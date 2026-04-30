import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  const handleClick = () => {
    window.open(buildWhatsAppLink("Merhaba, yardım almak istiyorum."), "_blank");
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-xl shadow-[#25D366]/30 flex items-center justify-center group"
      aria-label="WhatsApp'tan Ulaşın"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-60 group-hover:opacity-90 transition-opacity"></span>
      <MessageCircle className="w-8 h-8 relative z-10" />
    </motion.button>
  );
}
