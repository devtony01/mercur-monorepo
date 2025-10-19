"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@components/atoms"
import { DatePicker } from "@components/molecules"

interface BookingSlot {
  id: string
  start_time: string
  end_time: string
  available: boolean
  service_id?: string
  location_id?: string
  duration?: number
}

interface BookingService {
  id: string
  name: string
  description?: string
  duration: number
  price?: number
  location_id?: string
  available?: boolean
}

interface BookingLocation {
  id: string
  name: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  available?: boolean
}

interface CalendarBookingFlowDemoProps {
  productId?: string
  onBookingComplete?: (bookingId: string) => void
  className?: string
}

// Mock data for demonstration
const mockLocations: BookingLocation[] = [
  {
    id: "loc-1",
    name: "Downtown Spa",
    address: "123 Main St",
    city: "New York",
    country: "US",
    available: true
  },
  {
    id: "loc-2", 
    name: "Uptown Wellness Center",
    address: "456 Park Ave",
    city: "New York",
    country: "US",
    available: true
  }
]

const mockServices: BookingService[] = [
  {
    id: "svc-1",
    name: "Deep Tissue Massage",
    description: "Therapeutic massage for muscle tension relief",
    duration: 60,
    price: 120,
    available: true
  },
  {
    id: "svc-2",
    name: "Swedish Massage", 
    description: "Relaxing full-body massage",
    duration: 90,
    price: 150,
    available: true
  },
  {
    id: "svc-3",
    name: "Hot Stone Therapy",
    description: "Massage with heated stones",
    duration: 75,
    price: 180,
    available: true
  }
]

// Generate mock time slots for the next 30 days
const generateMockSlots = (serviceId: string, locationId: string, date: Date): BookingSlot[] => {
  const slots: BookingSlot[] = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = new Date(date)
      startTime.setHours(hour, minute, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + 60) // 1 hour slots
      
      // Make some slots unavailable randomly
      const available = Math.random() > 0.3
      
      slots.push({
        id: `slot-${hour}-${minute}`,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        available,
        service_id: serviceId,
        location_id: locationId,
        duration: 60
      })
    }
  }
  
  return slots
}

export default function CalendarBookingFlowDemo({
  productId,
  onBookingComplete,
  className = "",
}: CalendarBookingFlowDemoProps) {
  const router = useRouter()
  
  // State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [notes, setNotes] = useState<string>("")
  
  // Data
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([])
  const [services] = useState<BookingService[]>(mockServices)
  const [locations] = useState<BookingLocation[]>(mockLocations)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  
  // Loading states
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [isCreatingBooking, setIsCreatingBooking] = useState(false)
  const [error, setError] = useState<string>("")
  
  // Current step in the booking flow
  const [currentStep, setCurrentStep] = useState<'location' | 'service' | 'date' | 'time' | 'details' | 'confirm'>('location')

  // Load available dates when service and location are selected
  useEffect(() => {
    if (selectedService && selectedLocation) {
      loadAvailableDates()
    }
  }, [selectedService, selectedLocation])

  // Load available slots when date is selected
  useEffect(() => {
    if (selectedDate && selectedService && selectedLocation) {
      loadAvailableSlots()
    }
  }, [selectedDate, selectedService, selectedLocation])

  const loadAvailableDates = async () => {
    if (!selectedService || !selectedLocation) return
    
    setIsLoadingDates(true)
    setError("")
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Generate available dates for the next 30 days (excluding weekends for demo)
      const dates: Date[] = []
      const today = new Date()
      
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i)
        
        // Skip weekends for demo
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push(date)
        }
      }
      
      setAvailableDates(dates)
      
      if (dates.length > 0) {
        setCurrentStep('date')
      }
    } catch (err) {
      console.error("Failed to load available dates:", err)
      setError("Failed to load available dates")
      setAvailableDates([])
    } finally {
      setIsLoadingDates(false)
    }
  }

  const loadAvailableSlots = async () => {
    if (!selectedDate || !selectedService || !selectedLocation) return
    
    setIsLoadingSlots(true)
    setError("")
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const slots = generateMockSlots(selectedService, selectedLocation, selectedDate)
      setAvailableSlots(slots)
      
      if (slots.filter(s => s.available).length > 0) {
        setCurrentStep('time')
      }
    } catch (err) {
      console.error("Failed to load available slots:", err)
      setError("Failed to load available time slots")
      setAvailableSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId)
    setSelectedService("")
    setSelectedDate(null)
    setSelectedSlot(null)
    setCurrentStep('service')
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setSelectedDate(null)
    setSelectedSlot(null)
    setCurrentStep('date')
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slot: BookingSlot) => {
    setSelectedSlot(slot)
    setCurrentStep('details')
  }

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !selectedService || !selectedLocation || !customerInfo.name || !customerInfo.email) {
      setError("Please fill in all required fields")
      return
    }

    setIsCreatingBooking(true)
    setError("")

    try {
      // Simulate booking creation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockBookingId = `booking-${Date.now()}`

      if (onBookingComplete) {
        onBookingComplete(mockBookingId)
      } else {
        alert(`Demo booking created successfully! ID: ${mockBookingId}`)
        // In real implementation: router.push(`/account/bookings/${mockBookingId}`)
      }
    } catch (err: any) {
      console.error("Failed to create booking:", err)
      setError(err.message || "Failed to create booking")
    } finally {
      setIsCreatingBooking(false)
    }
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Date constraints for calendar
  const today = new Date()
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)

  // Determine disabled dates (dates without available slots)
  const disabledDates = availableDates.length > 0 ? 
    Array.from({ length: 90 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      return date
    }).filter(date => 
      !availableDates.some(availableDate => 
        availableDate.toDateString() === date.toDateString()
      )
    ) : []

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Book Your Service (Demo)</h2>
        <p className="text-gray-600">Follow the steps below to schedule your appointment</p>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mt-2 text-sm">
          <strong>Demo Mode:</strong> This is using mock data to demonstrate the booking flow
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { key: 'location', label: 'Location', completed: !!selectedLocation },
          { key: 'service', label: 'Service', completed: !!selectedService },
          { key: 'date', label: 'Date', completed: !!selectedDate },
          { key: 'time', label: 'Time', completed: !!selectedSlot },
          { key: 'details', label: 'Details', completed: false },
        ].map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step.completed ? 'bg-green-500 text-white' : 
                currentStep === step.key ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-600'}
            `}>
              {step.completed ? '✓' : index + 1}
            </div>
            <span className={`ml-2 text-sm ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
              {step.label}
            </span>
            {index < 4 && <div className="w-8 h-px bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Location Selection */}
          {currentStep === 'location' && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Select Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location.id)}
                    className={`p-4 border rounded-lg text-left transition-colors hover:border-blue-500 ${
                      selectedLocation === location.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <h4 className="font-medium">{location.name}</h4>
                    {location.city && <p className="text-sm text-gray-600">{location.city}</p>}
                    {location.address && <p className="text-xs text-gray-500 mt-1">{location.address}</p>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === 'service' && selectedLocation && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Select Service</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`w-full p-4 border rounded-lg text-left transition-colors hover:border-blue-500 ${
                      selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">Duration: {service.duration} minutes</p>
                      </div>
                      {service.price && (
                        <span className="text-lg font-semibold text-blue-600">
                          ${service.price}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date Selection */}
          {currentStep === 'date' && selectedService && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Select Date</h3>
              {isLoadingDates ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading available dates...</p>
                </div>
              ) : (
                <DatePicker
                  value={selectedDate || undefined}
                  onChange={handleDateSelect}
                  minValue={today}
                  maxValue={maxDate}
                  disabledDates={disabledDates}
                  className="max-w-md mx-auto"
                />
              )}
            </div>
          )}

          {/* Step 4: Time Selection */}
          {currentStep === 'time' && selectedDate && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">
                Select Time for {formatDate(selectedDate)}
              </h3>
              {isLoadingSlots ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading available times...</p>
                </div>
              ) : availableSlots.filter(s => s.available).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSlots.filter(s => s.available).map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-3 border rounded-lg text-center transition-colors hover:border-blue-500 ${
                        selectedSlot === slot ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {formatTime(slot.start_time)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {slot.duration ? `${slot.duration} min` : ''}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No available times for this date. Please select a different date.
                </div>
              )}
            </div>
          )}

          {/* Step 5: Customer Details */}
          {currentStep === 'details' && selectedSlot && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Your Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requests or notes..."
                  />
                </div>
                
                <Button
                  className="w-full"
                  onClick={() => setCurrentStep('confirm')}
                  disabled={!customerInfo.name || !customerInfo.email}
                  variant="filled"
                >
                  Review Booking
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {currentStep === 'confirm' && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Location:</strong> {locations.find(l => l.id === selectedLocation)?.name}</p>
                    <p><strong>Service:</strong> {services.find(s => s.id === selectedService)?.name}</p>
                    <p><strong>Date:</strong> {selectedDate && formatDate(selectedDate)}</p>
                    <p><strong>Time:</strong> {selectedSlot && formatTime(selectedSlot.start_time)}</p>
                    <p><strong>Duration:</strong> {selectedSlot?.duration || services.find(s => s.id === selectedService)?.duration} minutes</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {customerInfo.name}</p>
                    <p><strong>Email:</strong> {customerInfo.email}</p>
                    {customerInfo.phone && <p><strong>Phone:</strong> {customerInfo.phone}</p>}
                    {notes && <p><strong>Notes:</strong> {notes}</p>}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentStep('details')}
                    className="flex-1"
                  >
                    Back to Edit
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleBookingSubmit}
                    disabled={isCreatingBooking}
                    loading={isCreatingBooking}
                    variant="filled"
                  >
                    {isCreatingBooking ? "Creating Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
            <h3 className="font-semibold mb-4">Booking Summary</h3>
            <div className="space-y-3 text-sm">
              {selectedLocation && (
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="font-medium">{locations.find(l => l.id === selectedLocation)?.name}</p>
                </div>
              )}
              
              {selectedService && (
                <div>
                  <span className="text-gray-600">Service:</span>
                  <p className="font-medium">{services.find(s => s.id === selectedService)?.name}</p>
                  {services.find(s => s.id === selectedService)?.price && (
                    <p className="text-blue-600 font-semibold">
                      ${services.find(s => s.id === selectedService)?.price}
                    </p>
                  )}
                </div>
              )}
              
              {selectedDate && (
                <div>
                  <span className="text-gray-600">Date:</span>
                  <p className="font-medium">{formatDate(selectedDate)}</p>
                </div>
              )}
              
              {selectedSlot && (
                <div>
                  <span className="text-gray-600">Time:</span>
                  <p className="font-medium">{formatTime(selectedSlot.start_time)}</p>
                  <p className="text-gray-500">
                    Duration: {selectedSlot.duration || services.find(s => s.id === selectedService)?.duration} min
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}