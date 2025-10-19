import { HttpTypes } from "@medusajs/types"

/**
 * Check if a product requires booking
 */
export function isBookableProduct(product: HttpTypes.StoreProduct): boolean {
  // Check metadata
  if (product.metadata?.requires_booking === "true" || product.metadata?.type === "service") {
    return true
  }
  
  // Check tags
  if (product.tags?.some(tag => 
    tag.value === "service" || 
    tag.value === "booking" || 
    tag.value === "appointment"
  )) {
    return true
  }
  
  return false
}

/**
 * Check if a cart line item requires booking
 */
export function isBookableCartItem(item: HttpTypes.StoreCartLineItem): boolean {
  return item.product ? isBookableProduct(item.product) : false
}

/**
 * Get all bookable items from a cart
 */
export function getBookableCartItems(cart: HttpTypes.StoreCart): HttpTypes.StoreCartLineItem[] {
  return cart.items?.filter(isBookableCartItem) || []
}

/**
 * Check if cart has any bookable items
 */
export function cartHasBookableItems(cart: HttpTypes.StoreCart): boolean {
  return getBookableCartItems(cart).length > 0
}

/**
 * Get booking requirements summary for a cart
 */
export function getBookingRequirements(cart: HttpTypes.StoreCart) {
  const bookableItems = getBookableCartItems(cart)
  
  return {
    hasBookableItems: bookableItems.length > 0,
    bookableItemCount: bookableItems.length,
    totalBookingsNeeded: bookableItems.reduce((total, item) => total + item.quantity, 0),
    bookableItems: bookableItems.map(item => ({
      id: item.id,
      productId: item.product?.id,
      title: item.product?.title,
      quantity: item.quantity,
      requiresIndividualBooking: item.quantity > 1
    }))
  }
}

/**
 * Format booking time for display
 */
export function formatBookingTime(dateTime: string): string {
  return new Date(dateTime).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

/**
 * Format booking date for display
 */
export function formatBookingDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString([], { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Calculate duration between two times in minutes
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${mins}m`
  }
}

/**
 * Generate available dates for the next N days (excluding weekends for demo)
 */
export function generateAvailableDates(days: number = 30, excludeWeekends: boolean = true): Date[] {
  const dates: Date[] = []
  const today = new Date()
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    if (excludeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
      continue
    }
    
    dates.push(date)
  }
  
  return dates
}

/**
 * Generate mock time slots for a given date
 */
export function generateMockTimeSlots(date: Date, startHour: number = 9, endHour: number = 17, intervalMinutes: number = 30) {
  const slots = []
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const startTime = new Date(date)
      startTime.setHours(hour, minute, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + 60) // 1 hour slots
      
      // Make some slots unavailable randomly for demo
      const available = Math.random() > 0.3
      
      slots.push({
        id: `slot-${hour}-${minute}`,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        available,
        duration: 60
      })
    }
  }
  
  return slots
}

/**
 * Validate booking data before submission
 */
export function validateBookingData(data: {
  service_id?: string
  location_id?: string
  start_time?: string
  end_time?: string
  customer_name?: string
  customer_email?: string
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.service_id) errors.push("Service is required")
  if (!data.location_id) errors.push("Location is required")
  if (!data.start_time) errors.push("Start time is required")
  if (!data.end_time) errors.push("End time is required")
  if (!data.customer_name) errors.push("Customer name is required")
  if (!data.customer_email) errors.push("Customer email is required")
  
  if (data.customer_email && !isValidEmail(data.customer_email)) {
    errors.push("Valid email address is required")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get booking status color for UI
 */
export function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'text-green-600 bg-green-100'
    case 'pending':
      return 'text-yellow-600 bg-yellow-100'
    case 'cancelled':
      return 'text-red-600 bg-red-100'
    case 'completed':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

/**
 * Check if booking can be cancelled (e.g., not within 24 hours)
 */
export function canCancelBooking(startTime: string, hoursBeforeLimit: number = 24): boolean {
  const bookingTime = new Date(startTime)
  const now = new Date()
  const hoursUntilBooking = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  return hoursUntilBooking > hoursBeforeLimit
}