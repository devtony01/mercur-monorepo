"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarBookingFlow } from "@modules/booking"
import CalendarBookingFlowDemo from "@modules/booking/components/calendar-booking-flow-demo"

export default function BookingDemoPage() {
  const router = useRouter()
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const demos = [
    {
      id: "standalone",
      title: "Standalone Booking Flow",
      description: "Complete calendar booking experience as a standalone component",
      path: "/test-booking"
    },
    {
      id: "checkout",
      title: "Checkout Integration", 
      description: "Booking step integrated into the checkout process",
      path: "/test-checkout-booking"
    },
    {
      id: "admin",
      title: "Booking Management",
      description: "Admin interface for managing customer bookings",
      path: "/admin/bookings"
    },
    {
      id: "inline",
      title: "Inline Demo",
      description: "See the booking flow directly on this page",
      path: null
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hapio Booking Integration Demo</h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete hotel-style calendar booking system for service appointments
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">✨ Key Features Implemented</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <ul className="space-y-1">
                <li>✅ Hotel-style step-by-step booking flow</li>
                <li>✅ Calendar with available date highlighting</li>
                <li>✅ Time slot selection with availability</li>
                <li>✅ Customer information collection</li>
              </ul>
              <ul className="space-y-1">
                <li>✅ Checkout integration before payment</li>
                <li>✅ Multiple service booking support</li>
                <li>✅ Demo mode with mock data</li>
                <li>✅ Responsive design for all devices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {demos.map((demo) => (
            <div key={demo.id} className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">{demo.title}</h3>
              <p className="text-gray-600 mb-4">{demo.description}</p>
              
              {demo.path ? (
                <button
                  onClick={() => router.push(demo.path)}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Demo
                </button>
              ) : (
                <button
                  onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {activeDemo === demo.id ? "Hide Demo" : "Show Demo"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Inline Demo */}
        {activeDemo === "inline" && (
          <div className="bg-white rounded-lg border shadow-lg p-6 mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Live Booking Demo</h2>
              <p className="text-gray-600">
                This is the actual booking component with demo data. Try the complete flow!
              </p>
            </div>
            
            <CalendarBookingFlowDemo
              productId="demo-spa-service"
              onBookingComplete={(bookingId) => {
                alert(`Demo booking completed! Booking ID: ${bookingId}`)
              }}
            />
          </div>
        )}

        {/* Implementation Guide */}
        <div className="bg-white rounded-lg border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Implementation Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">🚀 Quick Start</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Mark products as bookable</strong>
                    <p className="text-gray-600">Add <code>requires_booking: "true"</code> to product metadata</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Configure Hapio API</strong>
                    <p className="text-gray-600">Set up API credentials in environment variables</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Test the flow</strong>
                    <p className="text-gray-600">Add bookable products to cart and proceed to checkout</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">📋 Checkout Flow</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs mr-3">1</span>
                  Shipping & Billing Addresses
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs mr-3">2</span>
                  Shipping Methods
                </div>
                <div className="flex items-center p-2 bg-blue-100 rounded border border-blue-200">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">3</span>
                  <strong>📅 Service Booking (NEW!)</strong>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs mr-3">4</span>
                  Payment Methods
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs mr-3">5</span>
                  Order Review & Confirmation
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">📖 Documentation</h4>
            <p className="text-sm text-yellow-700">
              Complete implementation guide available in <code>HAPIO_BOOKING_INTEGRATION.md</code>
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔧 Technical Implementation</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Components</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• CalendarBookingFlow</li>
                <li>• ServiceBookingStep</li>
                <li>• ProductBookingFlow</li>
                <li>• BookingsList</li>
                <li>• BookingDetails</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">API Integration</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Hapio API wrapper</li>
                <li>• Booking data models</li>
                <li>• Medusa plugin</li>
                <li>• Workflow automation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Smart product detection</li>
                <li>• Multiple service booking</li>
                <li>• Progress tracking</li>
                <li>• Demo mode</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}