"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import ProductCarouselIndicator from "./product-carousel-indicator"

interface ProductCarouselProps {
  slides: HttpTypes.StoreProduct["images"]
}

export default function ProductCarousel({ slides = [] }: ProductCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [screenSize, setScreenSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("lg")

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize("xs")
      else if (width < 768) setScreenSize("sm")
      else if (width < 1024) setScreenSize("md")
      else if (width < 1280) setScreenSize("lg")
      else setScreenSize("xl")
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isHorizontal = screenSize === "xs" || screenSize === "sm" || screenSize === "md"

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="h-[350px] lg:h-[698px] flex items-center justify-center bg-gray-100 rounded-xs">
        <Image
          src="/images/placeholder.svg"
          alt="No image available"
          width={200}
          height={200}
          className="opacity-50"
        />
      </div>
    )
  }

  return (
    <div className="embla relative">
      <div className="embla__viewport overflow-hidden rounded-xs">
        <div className={`h-[350px] lg:h-fit max-h-[698px] ${isHorizontal ? "flex" : "block"}`}>
          {isHorizontal ? (
            // Horizontal carousel for mobile/tablet
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="embla__slide min-w-full h-[350px] flex-shrink-0"
                >
                  <Image
                    priority={idx === 0}
                    src={decodeURIComponent(slide.url)}
                    alt="Product image"
                    width={700}
                    height={700}
                    quality={idx === 0 ? 85 : 70}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="max-h-[700px] w-full h-full aspect-square object-cover object-center"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Vertical carousel for desktop
            <div 
              className="transition-transform duration-300 ease-in-out"
              style={{ transform: `translateY(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="embla__slide h-fit"
                >
                  <Image
                    priority={idx === 0}
                    src={decodeURIComponent(slide.url)}
                    alt="Product image"
                    width={700}
                    height={700}
                    quality={idx === 0 ? 85 : 70}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="max-h-[700px] w-full h-auto aspect-square object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all z-10"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all z-10"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Indicators */}
        {slides.length > 1 && (
          <ProductCarouselIndicator 
            slides={slides} 
            currentSlide={currentSlide}
            onSlideChange={goToSlide}
          />
        )}
      </div>
    </div>
  )
}