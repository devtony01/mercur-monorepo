"use client"

import CalendarBookingFlow from "./calendar-booking-flow"

interface ServiceBookingProps {
  productId?: string
  onBookingComplete?: (bookingId: string) => void
  className?: string
}

export default function ServiceBooking({
  productId,
  onBookingComplete,
  className = "",
}: ServiceBookingProps) {
  return (
    <CalendarBookingFlow
      productId={productId}
      onBookingComplete={onBookingComplete}
      className={className}
    />
  )
}