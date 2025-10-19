import { HttpTypes } from "@medusajs/types"
import ProductDetailsHeader from "./product-details-header"
import ProductPageDetails from "./product-page-details"
import ProductDetailsShipping from "./product-details-shipping"
import ProductDetailsSeller from "./product-details-seller"
import ProductDetailsFooter from "./product-details-footer"

interface ProductDetailsBackupStyleProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default function ProductDetailsBackupStyle({
  product,
  region,
  countryCode,
}: ProductDetailsBackupStyleProps) {
  return (
    <div>
      <ProductDetailsHeader
        product={product}
        region={region}
        countryCode={countryCode}
      />
      <ProductPageDetails details={product?.description || ""} />
      <ProductDetailsShipping />
      <ProductDetailsSeller seller={product?.metadata?.seller} />
      <ProductDetailsFooter
        tags={product?.tags || []}
        posted={product?.created_at}
      />
    </div>
  )
}