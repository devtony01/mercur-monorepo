import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { CreateServiceForm } from "@/components/hapio/create-service-form"

// Widget for product list page to filter bookable services
const ProductListBookingFilter = () => {
  const [filterActive, setFilterActive] = useState(false)
  const [bookableCount, setBookableCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Count bookable products
    fetchBookableProductsCount()
  }, [])

  const fetchBookableProductsCount = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/admin/products')
      if (response.ok) {
        const data = await response.json()
        // Count only products that are actually bookable services (strict filtering)
        const bookableProducts = data?.products?.filter(product => 
          product.metadata?.requires_booking === 'true' && 
          product.metadata?.type === 'service'
        ) || []
        setBookableCount(bookableProducts.length)
      }
    } catch (error) {
      console.log("Could not fetch bookable products count:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterToggle = () => {
    const newFilterState = !filterActive
    setFilterActive(newFilterState)
    
    // Update URL to filter products using the correct parameter format
    const url = new URL(window.location.href)
    if (newFilterState) {
      // Filter for bookable services using tag_id parameter
      url.searchParams.set('tag_id', 'service')
    } else {
      // Remove filters to show all products
      url.searchParams.delete('tag_id')
    }
    
    // Navigate to the filtered URL
    window.location.href = url.toString()
  }

  const handleServiceCreated = () => {
    // Refresh the bookable products count when a new service is created
    fetchBookableProductsCount()
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heading level="h3">Booking Services</Heading>
            <Badge variant="outline" size="small" className="bg-ui-tag-blue-bg text-ui-tag-blue-text border-ui-tag-blue-border text-xs">
              {bookableCount} Service{bookableCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={filterActive ? "primary" : "secondary"}
              size="small"
              onClick={handleFilterToggle}
            >
              {filterActive ? "Show All Products" : "Show Services Only"}
            </Button>
            
            <CreateServiceForm onServiceCreated={handleServiceCreated} />
          </div>
        </div>
        
        {filterActive && (
          <div className="mt-3 p-3 bg-ui-bg-subtle border border-ui-border-base rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ui-tag-blue-icon" />
              <Text className="text-sm text-ui-fg-base">
                Showing only bookable services and appointments
              </Text>
            </div>
          </div>
        )}
        
        {!isLoading && bookableCount === 0 && (
          <div className="mt-3 p-4 bg-ui-bg-subtle border border-ui-border-base rounded-md text-center">
            <Heading level="h4" className="text-ui-fg-base mb-2">
              No Booking Services Yet
            </Heading>
            <Text className="text-sm text-ui-fg-subtle mb-3">
              Create your first bookable service to start accepting appointments
            </Text>
            <CreateServiceForm onServiceCreated={handleServiceCreated} />
          </div>
        )}
        
        {isLoading && (
          <div className="mt-3 p-4 bg-ui-bg-subtle border border-ui-border-base rounded-md text-center">
            <Text className="text-sm text-ui-fg-subtle">
              Loading services...
            </Text>
          </div>
        )}
      </div>
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default ProductListBookingFilter