"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/atoms"

interface CartPromotionCodeProps {
  cart: HttpTypes.StoreCart
}

export default function CartPromotionCode({ cart }: CartPromotionCodeProps) {
  const [promoCode, setPromoCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return

    setIsApplying(true)
    try {
      // TODO: Implement promo code application logic
      console.log("Applying promo code:", promoCode)
      // await applyPromoCode(cart.id, promoCode)
    } catch (error) {
      console.error("Failed to apply promo code:", error)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Promotion Code</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promotion code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Button
          onClick={handleApplyPromoCode}
          disabled={!promoCode.trim() || isApplying}
          loading={isApplying}
          variant="outlined"
          className="px-4 py-2"
        >
          Apply
        </Button>
      </div>
      
      {/* Show applied promotions */}
      {cart.promotions && cart.promotions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Applied Promotions:</h4>
          {cart.promotions.map((promotion) => (
            <div key={promotion.id} className="flex justify-between items-center py-1">
              <span className="text-sm text-green-600">{promotion.code}</span>
              <button className="text-xs text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}