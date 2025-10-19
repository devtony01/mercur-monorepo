import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Switch, Text, Badge, Button } from "@medusajs/ui"
import { 
  DetailWidgetProps, 
  AdminProduct,
} from "@medusajs/framework/types"
import { useState, useEffect } from "react"

// Enhanced booking service toggle widget
const BookingServiceToggle = ({ 
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const [isBookable, setIsBookable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasBookings, setHasBookings] = useState(false)

  // Check current booking status
  useEffect(() => {
    const checkBookingStatus = () => {
      const bookableFromMetadata = data?.metadata?.requires_booking === "true" || 
                                  data?.metadata?.type === "service"
      const bookableFromTags = data?.tags?.some(tag => 
        tag.value === "service" || 
        tag.value === "booking" || 
        tag.value === "bookable"
      )
      
      setIsBookable(bookableFromMetadata || bookableFromTags)
    }

    checkBookingStatus()
    
    // Check if product has existing bookings
    if (data?.id) {
      checkExistingBookings(data.id)
    }
  }, [data])

  const checkExistingBookings = async (productId: string) => {
    try {
      const response = await fetch(`/admin/bookings?product_id=${productId}`)
      if (response.ok) {
        const bookings = await response.json()
        setHasBookings(bookings?.bookings?.length > 0)
      }
    } catch (error) {
      console.log("Could not check existing bookings:", error)
    }
  }

  const handleToggleBookable = async () => {
    if (hasBookings && isBookable) {
      // Warn user about existing bookings
      const confirmed = window.confirm(
        "This product has existing bookings. Disabling booking functionality may affect customer experience. Continue?"
      )
      if (!confirmed) return
    }

    setIsLoading(true)
    try {
      const newBookableState = !isBookable
      
      // Prepare updated metadata
      const updatedMetadata = {
        ...data.metadata,
        requires_booking: newBookableState.toString(),
        type: newBookableState ? "service" : "product",
      }

      // Update product - only use metadata, no tags to avoid errors
      const response = await fetch(`/admin/products/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: updatedMetadata
        }),
      })

      if (response.ok) {
        setIsBookable(newBookableState)
        
        // Show success message
        const message = newBookableState 
          ? "Product marked as bookable service" 
          : "Product marked as regular product"
        
        // Show a toast notification instead of console.log
        if (typeof window !== 'undefined' && (window as any).medusaToast) {
          (window as any).medusaToast.success(message)
        } else {
          console.log(message)
        }
        
        // No page reload needed - state is already updated
      } else {
        throw new Error("Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product booking status:", error)
      alert("Failed to update product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Heading level="h3">Booking Service</Heading>
          {isBookable && (
            <Badge variant="outline" className="bg-ui-tag-green-bg text-ui-tag-green-text border-ui-tag-green-border">
              Service
            </Badge>
          )}
          {hasBookings && (
            <Badge variant="outline" className="bg-ui-tag-blue-bg text-ui-tag-blue-text border-ui-tag-blue-border">
              Has Bookings
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Text className="text-sm font-medium">
            {isBookable ? "Bookable" : "Regular"}
          </Text>
          <Switch
            checked={isBookable}
            onCheckedChange={handleToggleBookable}
            disabled={isLoading}
          />
        </div>
      </div>
      
      {isBookable && (
        <div className="px-6 py-4 bg-ui-bg-subtle border-t border-ui-border-base">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ui-tag-green-icon rounded-full" />
              <Text className="text-sm text-ui-fg-base">
                Customers can book appointments for this service
              </Text>
            </div>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => window.location.href = '/app/hapio'}
            >
              Manage in Hapio
            </Button>
          </div>
        </div>
      )}
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default BookingServiceToggle