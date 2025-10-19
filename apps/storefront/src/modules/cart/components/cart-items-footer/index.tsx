import { convertToLocale } from "@lib/util/money"

interface CartItemsFooterProps {
  currency_code: string
  price?: number | null
}

export default function CartItemsFooter({ currency_code, price }: CartItemsFooterProps) {
  const shippingPrice = convertToLocale({
    amount: price || 0,
    currency_code,
  })

  return (
    <div className="border rounded-sm p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Shipping:</span>
        <span className="text-sm font-medium">
          {price === 0 ? "Free" : shippingPrice}
        </span>
      </div>
    </div>
  )
}