import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ProductGalleryBackupStyle from "@modules/products/components/product-gallery-backup-style"
import ProductDetailsBackupStyle from "@modules/products/components/product-details-backup-style"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <main className="container">
      <div className="flex flex-col md:flex-row lg:gap-12" data-testid="product-container">
        <div className="md:w-1/2 md:px-2">
          <ProductGalleryBackupStyle images={product?.images || []} />
        </div>
        <div className="md:w-1/2 md:px-2">
          <ProductDetailsBackupStyle
            product={product}
            region={region}
            countryCode={countryCode}
          />
        </div>
      </div>
      <div className="my-8" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </main>
  )
}

export default ProductTemplate
