"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

interface ProductCarouselIndicatorProps {
  slides: HttpTypes.StoreProduct["images"]
  currentSlide: number
  onSlideChange: (index: number) => void
}

export default function ProductCarouselIndicator({ 
  slides, 
  currentSlide, 
  onSlideChange 
}: ProductCarouselIndicatorProps) {
  if (!slides || slides.length <= 1) return null

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex space-x-2 bg-black/50 rounded-full px-3 py-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onSlideChange(index)}
            className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
              index === currentSlide 
                ? "border-white scale-110" 
                : "border-white/50 hover:border-white/80"
            }`}
            aria-label={`Go to image ${index + 1}`}
          >
            <Image
              src={decodeURIComponent(slide.url)}
              alt={`Product thumbnail ${index + 1}`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}