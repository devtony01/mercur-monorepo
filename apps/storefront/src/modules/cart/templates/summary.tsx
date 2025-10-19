"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions?: HttpTypes.StorePromotion[]
  }
}

const Summary = ({ cart }: SummaryProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
      <div className="space-y-4 text-sm mb-4">
        <div className="flex justify-between">
          <span>Items:</span>
          <span>
            {convertToLocale({
              amount: cart.subtotal || 0,
              currency_code: cart.currency_code || "USD",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>
            {convertToLocale({
              amount: cart.shipping_total || 0,
              currency_code: cart.currency_code || "USD",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>
            {convertToLocale({
              amount: cart.tax_total || 0,
              currency_code: cart.currency_code || "USD",
            })}
          </span>
        </div>
        <div className="flex justify-between border-t pt-4 items-center font-medium">
          <span>Total:</span>
          <span className="text-lg">
            {convertToLocale({
              amount: cart.total || 0,
              currency_code: cart.currency_code || "USD",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Summary
