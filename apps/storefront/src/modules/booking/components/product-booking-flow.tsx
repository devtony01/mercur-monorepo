"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@components/atoms"
import CalendarBookingFlow from "./calendar-booking-flow"
import { getAvailableSlots, getBookingServices, getBookingLocations, createBooking } from "@lib/data/bookings"
import type { BookingSlot, BookingService, BookingLocation, CreateBookingData } from "@lib/data/bookings"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"

interface ProductBookingFlowProps {
  product: HttpTypes.StoreProduct
  onBookingComplete?: (bookingId: string) => void
  onAddToCart?: () => void
  className?: string
}



export default function ProductBookingFlow({
  product,
  onBookingComplete,
  onAddToCart,
  className = "",
}: ProductBookingFlowProps) {
  const router = useRouter()
  
  // Check if product requires booking
  const requiresBooking = product.metadata?.requires_booking === "true" || 
                         product.metadata?.type === "service" ||
                         product.tags?.some(tag => tag.value === "service" || tag.value === "booking")
  
  // State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([])
  const [services, setServices] = useState<BookingService[]>([])
  const [locations, setLocations] = useState<BookingLocation[]>([])
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")  
  // Loading states
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)
  const [isCreatingBooking, setIsCreatingBooking] = useState(false)
  
  // Error state
  const [error, setError] = useState<string>("")
  
  // UI state
  const [showBookingFlow, setShowBookingFlow] = useState(false)

  // Load initial data
  useEffect(() => {
    if (requiresBooking) {
      loadInitialData()
    }
  }, [requiresBooking])

  // Load available slots when date, service, or location changes
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDate || !selectedService || !selectedLocation) return

      setIsLoadingSlots(true)
      setSelectedSlot(null)
      setError("")

      try {
        const dateString = selectedDate.toISOString().split('T')[0] // YYYY-MM-DD format
        const slots = await getAvailableSlots(selectedService, selectedLocation, dateString)
        setAvailableSlots(slots)
      } catch (err) {
        console.error("Failed to load available slots:", err)
        setError("Failed to load available time slots")
        setAvailableSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }

    if (selectedDate && selectedService && selectedLocation) {
      loadAvailableSlots()
    }
  }, [selectedDate, selectedService, selectedLocation])

  const loadInitialData = async () => {
    try {
      const [servicesData, locationsData] = await Promise.all([
        getBookingServices(),
        getBookingLocations(),
      ])
      
      setServices(servicesData)
      setLocations(locationsData)
      
      // Auto-select first location if only one available
      if (locationsData.length === 1) {
        setSelectedLocation(locationsData[0].id)
      }
    } catch (err) {
      console.error("Failed to load initial data:", err)
      setError("Failed to load booking options")
    } finally {
      setIsLoadingServices(false)
      setIsLoadingLocations(false)
    }
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slot: BookingSlot) => {
    setSelectedSlot(slot)
  }

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot || !selectedService || !selectedLocation) {
      setError("Please select a date and time slot")
      return
    }

    setIsCreatingBooking(true)
    setError("")

    try {
      // Get current customer
      const customer = await retrieveCustomer()
      if (!customer) {
        router.push("/account/login")
        return
      }

      // Create booking data
      const bookingData: CreateBookingData = {
        service_id: selectedService,
        location_id: selectedLocation,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        customer_email: customer.email,
        customer_phone: customer.phone || undefined,
        product_id: product.id,
      }

      // Create booking
      const booking = await createBooking(bookingData)
      
      if (onBookingComplete) {
        onBookingComplete(booking.id)
      } else {
        router.push(`/account/bookings/${booking.id}`)
      }
    } catch (err: any) {
      console.error("Failed to create booking:", err)
      setError(err.message || "Failed to create booking")
    } finally {
      setIsCreatingBooking(false)
    }
  }

  const handleAddToCart = () => {
    if (requiresBooking && !selectedDate) {
      setShowBookingFlow(true)
      setError("Please select a service date before adding to cart")
      return
    }
    
    if (onAddToCart) {
      onAddToCart()
    }
  }

  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3) // Allow booking up to 3 months ahead

  // If product doesn't require booking, show regular add to cart
  if (!requiresBooking) {
    return (
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-4">
          This product can be added directly to your cart.
        </p>
        {/* Add regular add to cart component here */}
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        {!showBookingFlow ? (
          <div className="text-center">
            <p className="text-blue-800 mb-4">
              This service requires booking. Please select your preferred date and time.
            </p>
            <Button
              onClick={() => setShowBookingFlow(true)}
              variant="filled"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Book Now
            </Button>
          </div>
        ) : (
          <CalendarBookingFlow
            productId={product.id}
            onBookingComplete={onBookingComplete}
            className="bg-white rounded-lg p-6"
          />
        )}
      </div>
    </div>
  )
}