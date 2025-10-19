"use client"

import { convertToLocale } from "@lib/util/money"

interface CartSummaryBackupStyleProps {
  item_total: number
  shipping_total: number
  total: number
  currency_code: string
  tax: number
}

export default function CartSummaryBackupStyle({
  item_total,
  shipping_total,
  total,
  currency_code,
  tax,
}: CartSummaryBackupStyleProps) {
  return (
    <div>
      <div className="space-y-4 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Items:</span>
          <span className="text-gray-900">
            {convertToLocale({
              amount: item_total,
              currency_code,
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span className="text-gray-900">
            {convertToLocale({
              amount: shipping_total,
              currency_code,
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span className="text-gray-900">
            {convertToLocale({
              amount: tax,
              currency_code,
            })}
          </span>
        </div>
        <div className="flex justify-between border-t pt-4 items-center">
          <span>Total:</span>
          <span className="text-xl font-semibold text-gray-900">
            {convertToLocale({
              amount: total,
              currency_code,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}