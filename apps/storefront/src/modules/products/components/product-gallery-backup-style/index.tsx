import { HttpTypes } from "@medusajs/types"
import ProductCarousel from "./product-carousel"

interface ProductGalleryBackupStyleProps {
  images: HttpTypes.StoreProduct["images"]
}

export default function ProductGalleryBackupStyle({ images }: ProductGalleryBackupStyleProps) {
  return (
    <div className="border w-full p-1 rounded-sm">
      <ProductCarousel slides={images} />
    </div>
  )
}