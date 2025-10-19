"use client"

import { updateLineItem } from "@lib/data/cart"
import { Button } from "@medusajs/ui"
import { useState } from "react"

export const UpdateCartItemButton = ({
  quantity,
  lineItemId,
}: {
  quantity: number
  lineItemId: string
}) => {
  const [isChanging, setIsChanging] = useState(false)

  const handleChange = async ({
    lineId,
    quantity,
  }: {
    lineId: string
    quantity: number
  }) => {
    setIsChanging(true)

    try {
      await updateLineItem({ lineId, quantity })
    } catch (error: any) {
      console.error("Error updating cart:", error.message)
    } finally {
      setIsChanging(false)
    }
  }
  
  return (
    <div className="flex items-center gap-4 mt-2">
      <Button
        variant="secondary"
        size="small"
        className="w-8 h-8 flex items-center justify-center"
        disabled={quantity === 1 || isChanging}
        onClick={() =>
          handleChange({ lineId: lineItemId, quantity: quantity - 1 })
        }
      >
        -
      </Button>
      <span className="text-ui-fg-base font-medium">{quantity}</span>
      <Button
        variant="secondary"
        size="small"
        className="w-8 h-8 flex items-center justify-center"
        disabled={isChanging}
        onClick={() =>
          handleChange({ lineId: lineItemId, quantity: quantity + 1 })
        }
      >
        +
      </Button>
    </div>
  )
}