import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-muted border border-border relative">
        <AspectRatio ratio={4/3}>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </AspectRatio>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                currentIndex === idx ? "border-primary shadow-md" : "border-transparent hover:border-primary/50"
              }`}
            >
              <AspectRatio ratio={1}>
                <img 
                  src={img} 
                  alt={`${alt} thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              {currentIndex !== idx && (
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
