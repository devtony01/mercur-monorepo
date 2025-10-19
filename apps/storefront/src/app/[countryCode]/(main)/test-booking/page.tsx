"use client"

import { useState } from "react"
import { CalendarBookingFlow } from "@modules/booking"
import CalendarBookingFlowDemo from "@modules/booking/components/calendar-booking-flow-demo"

export default function TestBookingPage() {
  const [useDemo, setUseDemo] = useState(true)
  
  const handleBookingComplete = (bookingId: string) => {
    alert(`Booking created successfully! ID: ${bookingId}`)
    // You could also redirect to a success page or order confirmation
    // window.location.href = `/account/bookings/${bookingId}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Test Calendar Booking Flow</h1>
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setUseDemo(true)}
              className={`px-4 py-2 rounded-md ${
                useDemo 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Demo Version (Working)
            </button>
            <button
              onClick={() => setUseDemo(false)}
              className={`px-4 py-2 rounded-md ${
                !useDemo 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              API Version (Needs Setup)
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {useDemo ? (
            <CalendarBookingFlowDemo 
              productId="test-product-id"
              onBookingComplete={handleBookingComplete}
            />
          ) : (
            <CalendarBookingFlow 
              productId="test-product-id"
              onBookingComplete={handleBookingComplete}
            />
          )}
        </div>
      </div>
    </div>
  )
}