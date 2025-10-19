"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import CalendarBookingFlowDemo from "@modules/booking/components/calendar-booking-flow-demo"
import { CalendarBookingFlow } from "@modules/booking"

interface ServiceBookingStepProps {
  cart: HttpTypes.StoreCart
}

export default function ServiceBookingStep({ cart }: ServiceBookingStepProps) {
  const [bookableItems, setBookableItems] = useState<HttpTypes.StoreCartLineItem[]>([])
  const [completedBookings, setCompletedBookings] = useState<Set<string>>(new Set())
  const [currentBookingItem, setCurrentBookingItem] = useState<HttpTypes.StoreCartLineItem | null>(null)
  const [useDemo, setUseDemo] = useState(true) // Default to demo for now
  const [showDemoMode, setShowDemoMode] = useState(false) // For testing when no bookable items

  useEffect(() => {
    // Find items that require booking
    const itemsNeedingBooking = cart.items?.filter((item) => {
      const product = item.product
      return (
        product?.metadata?.requires_booking === "true" ||
        product?.metadata?.type === "service" ||
        product?.tags?.some(tag => tag.value === "service" || tag.value === "booking")
      )
    }) || []

    setBookableItems(itemsNeedingBooking)
    
    // Set the first item as current if none is selected
    if (itemsNeedingBooking.length > 0 && !currentBookingItem) {
      setCurrentBookingItem(itemsNeedingBooking[0])
    }
  }, [cart.items, currentBookingItem])

  const handleBookingComplete = (itemId: string, bookingId: string) => {
    console.log(`Booking completed for item ${itemId}: ${bookingId}`)
    
    // Mark this item as having completed booking
    setCompletedBookings(prev => new Set([...prev, itemId]))
    
    // Move to next item that needs booking
    const nextItem = bookableItems.find(item => 
      item.id !== itemId && !completedBookings.has(item.id)
    )
    
    if (nextItem) {
      setCurrentBookingItem(nextItem)
    } else {
      setCurrentBookingItem(null)
    }
  }

  // If no items need booking, show demo option for testing
  if (bookableItems.length === 0) {
    if (!showDemoMode) {
      return (
        <div className="bg-white border rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Service Booking Step</h2>
            <p className="text-gray-600 mb-4">
              No bookable services in cart. This step only appears when you have services that require appointment scheduling.
            </p>
            <button
              onClick={() => setShowDemoMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Show Demo Booking Flow
            </button>
          </div>
        </div>
      )
    }
    
    // Create mock bookable item for demo
    const mockItem = {
      id: "demo-item-1",
      quantity: 1,
      product: {
        id: "demo-product-1",
        title: "Deep Tissue Massage",
        description: "60-minute therapeutic massage session",
        metadata: { requires_booking: "true" }
      }
    } as HttpTypes.StoreCartLineItem
    
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This shows how the booking step would appear with a bookable service in your cart.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Schedule Your Services</h2>
          
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg">{mockItem.product?.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Quantity: {mockItem.quantity}</p>
            <p className="text-sm text-gray-600 mt-2">{mockItem.product?.description}</p>
          </div>

          <CalendarBookingFlowDemo
            productId={mockItem.product?.id}
            onBookingComplete={(bookingId) => {
              alert(`Demo booking completed! In real checkout, this would proceed to payment. Booking ID: ${bookingId}`)
            }}
          />
        </div>
        
        <div className="text-center">
          <button
            onClick={() => setShowDemoMode(false)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Hide Demo
          </button>
        </div>
      </div>
    )
  }

  // If all bookings are completed, show summary
  if (bookableItems.every(item => completedBookings.has(item.id))) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Service Bookings</h2>
          <div className="flex items-center text-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            All bookings completed
          </div>
        </div>
        
        <div className="space-y-3">
          {bookableItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium">{item.product?.title}</h4>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-green-600 font-medium">
                ✓ Booking scheduled
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your service appointments have been scheduled. 
            You'll receive confirmation emails with the details after completing your order.
          </p>
        </div>
      </div>
    )
  }

  // Show booking flow for current item
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Schedule Your Services</h2>
          <div className="text-sm text-gray-600">
            {completedBookings.size} of {bookableItems.length} completed
          </div>
        </div>
        
        {bookableItems.length > 1 && (
          <div className="mb-4">
            <div className="flex space-x-2 overflow-x-auto">
              {bookableItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentBookingItem(item)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentBookingItem?.id === item.id
                      ? 'bg-blue-500 text-white'
                      : completedBookings.has(item.id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {completedBookings.has(item.id) && '✓ '}
                  {item.product?.title}
                  {item.quantity > 1 && ` (${item.quantity})`}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Service Booking Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please schedule your appointment time before completing your order. 
                This ensures your preferred date and time are reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Demo/API Toggle */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setUseDemo(true)}
            className={`px-4 py-2 rounded-md text-sm ${
              useDemo 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Demo Mode
          </button>
          <button
            onClick={() => setUseDemo(false)}
            className={`px-4 py-2 rounded-md text-sm ${
              !useDemo 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Live API
          </button>
        </div>
      </div>

      {currentBookingItem && (
        <div>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg">{currentBookingItem.product?.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Quantity: {currentBookingItem.quantity} 
              {currentBookingItem.quantity > 1 && " (you'll schedule each appointment separately)"}
            </p>
            {currentBookingItem.product?.description && (
              <p className="text-sm text-gray-600 mt-2">{currentBookingItem.product.description}</p>
            )}
          </div>

          {useDemo ? (
            <CalendarBookingFlowDemo
              productId={currentBookingItem.product?.id}
              onBookingComplete={(bookingId) => handleBookingComplete(currentBookingItem.id, bookingId)}
            />
          ) : (
            <CalendarBookingFlow
              productId={currentBookingItem.product?.id}
              onBookingComplete={(bookingId) => handleBookingComplete(currentBookingItem.id, bookingId)}
            />
          )}
        </div>
      )}
    </div>
  )
}