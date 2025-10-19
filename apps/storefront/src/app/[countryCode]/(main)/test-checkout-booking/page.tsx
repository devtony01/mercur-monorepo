"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@lib/data/cart"

export default function TestCheckoutBookingPage() {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const addBookableServiceToCart = async () => {
    setIsAdding(true)
    try {
      // Create a mock bookable service item
      await addToCart({
        variantId: "test-variant-id", // This would be a real variant ID in production
        quantity: 1,
        metadata: {
          requires_booking: "true",
          type: "service"
        }
      })
      
      // Redirect to checkout
      router.push("/checkout")
    } catch (error) {
      console.error("Failed to add to cart:", error)
      alert("Failed to add service to cart. This is a demo - in production this would work with real products.")
    } finally {
      setIsAdding(false)
    }
  }

  const goToCheckoutDemo = () => {
    // For demo purposes, just go to checkout
    router.push("/checkout")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Checkout with Service Booking</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Checkout Integration Demo</h2>
            <p className="text-gray-600 mb-6">
              This demonstrates how the calendar booking flow integrates into the checkout process, 
              appearing before the order confirmation page.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Option 1: Add Service to Cart</h3>
              <p className="text-gray-600 mb-4">
                Add a bookable service to your cart and proceed to checkout to see the booking step.
              </p>
              <button
                onClick={addBookableServiceToCart}
                disabled={isAdding}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add Spa Service & Go to Checkout"}
              </button>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Option 2: View Checkout Flow</h3>
              <p className="text-gray-600 mb-4">
                Go directly to checkout to see how the booking step integrates with the existing flow.
              </p>
              <button
                onClick={goToCheckoutDemo}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600"
              >
                Go to Checkout Demo
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How it Works:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. <strong>Customer adds service to cart</strong> (spa treatment, consultation, etc.)</li>
              <li>2. <strong>Proceeds to checkout</strong> with normal flow</li>
              <li>3. <strong>Fills shipping/billing addresses</strong></li>
              <li>4. <strong>Selects shipping method</strong></li>
              <li>5. <strong>📅 SCHEDULES SERVICE APPOINTMENT</strong> (new step!)</li>
              <li>6. <strong>Selects payment method</strong></li>
              <li>7. <strong>Reviews and confirms order</strong></li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Demo Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• The booking step only appears if cart contains bookable services</li>
              <li>• Multiple services can be scheduled in sequence</li>
              <li>• Booking must be completed before payment</li>
              <li>• Currently using demo data - connect to Hapio API for production</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}