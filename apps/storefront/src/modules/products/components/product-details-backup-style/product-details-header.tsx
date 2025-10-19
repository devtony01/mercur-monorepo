"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/atoms"
import { ProductVariants } from "@components/molecules"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { ProductBookingFlow } from "@modules/booking"

interface ProductDetailsHeaderProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce(
    (
      acc: Record<string, string>,
      varopt: HttpTypes.StoreProductOptionValue
    ) => {
      acc[varopt.option?.title.toLowerCase() || ""] = varopt.value

      return acc
    },
    {}
  )
}

export default function ProductDetailsHeader({
  product,
  region,
  countryCode,
}: ProductDetailsHeaderProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({})

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Set default variant
  const defaultVariant = {
    ...selectedVariant,
  }

  // Get selected variant id
  const variantId =
    product.variants?.find(({ options }: { options: any }) =>
      options?.every((option: any) =>
        defaultVariant[option.option?.title.toLowerCase() || ""]?.includes(
          option.value
        )
      )
    )?.id || ""

  // Get variant price
  const { variantPrice } = getProductPrice({
    product,
    variantId,
  })

  // Add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variantId) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: variantId,
        quantity: 1,
        countryCode: countryCode,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const variantStock =
    product.variants?.find(({ id }) => id === variantId)?.inventory_quantity ||
    0

  const variantHasPrice = product.variants?.find(({ id }) => id === variantId)
    ?.calculated_price
    ? true
    : false

  // Check if product requires booking (service product)
  const requiresBooking = product.metadata?.requires_booking === "true" || 
                         product.metadata?.type === "service" ||
                         product.tags?.some(tag => tag.value === "service" || tag.value === "booking")

  const handleBookingComplete = (bookingId: string) => {
    console.log("Booking completed:", bookingId)
  }

  return (
    <div className="border rounded-sm p-5">
      <div className="flex justify-between">
        <div>
          <h2 className="text-sm text-gray-600">
            {/* Brand placeholder */}
          </h2>
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <div className="mt-2 flex gap-2 items-center">
            <span className="text-xl font-semibold text-gray-900">
              {variantPrice?.calculated_price}
            </span>
            {variantPrice?.calculated_price !== variantPrice?.original_price && (
              <span className="text-sm text-gray-500 line-through">
                {variantPrice?.original_price}
              </span>
            )}
          </div>
        </div>
        <div>
          {/* Wishlist button placeholder */}
        </div>
      </div>
      
      {/* Product Variants */}
      <ProductVariants 
        product={product} 
        selectedVariant={defaultVariant}
        setSelectedVariant={setSelectedVariant}
      />
      
      {/* Booking Flow for Service Products or Regular Add to Cart */}
      {requiresBooking ? (
        <ProductBookingFlow 
          product={product}
          onBookingComplete={handleBookingComplete}
          onAddToCart={handleAddToCart}
          className="mb-4"
        />
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || !variantStock || !variantHasPrice}
          loading={isAdding}
          className="w-full uppercase mb-4 py-3 flex justify-center"
          size="large"
        >
          {variantStock && variantHasPrice ? "ADD TO CART" : "OUT OF STOCK"}
        </Button>
      )}
    </div>
  )
}