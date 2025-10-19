"use client"

import { useState } from "react"
import { Button } from "@components/atoms"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import { ArrowLeftIcon } from "@icons"
import type { Booking } from "@lib/data/bookings"

interface BookingDetailsProps {
  booking: Booking
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    setIsLoading(true)
    try {
      // Implement cancel booking logic
      console.log("Cancelling booking:", booking.id)
      // await cancelBooking(booking.id)
      // Refresh or redirect
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <LocalizedClientLink 
          href="/account/bookings"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Bookings
        </LocalizedClientLink>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking #{booking.id.slice(-8)}
            </h1>
            <p className="text-gray-600 mt-1">
              Created on {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <p className="text-gray-900">{booking.service_id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <p className="text-gray-900">{booking.location_id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <p className="text-gray-900">{formatDate(booking.date)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <p className="text-gray-900">{booking.time}</p>
              </div>
            </div>
            
            {booking.notes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* Booking History */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Booking History</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">Booking Created</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-green-600 text-sm">✓</span>
              </div>
              
              {booking.updated_at !== booking.created_at && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-blue-600 text-sm">ℹ</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              {booking.status === "confirmed" && (
                <>
                  <Button variant="tonal" className="w-full">
                    Reschedule Booking
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleCancelBooking}
                    loading={isLoading}
                  >
                    Cancel Booking
                  </Button>
                </>
              )}
              
              {booking.status === "pending" && (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleCancelBooking}
                  loading={isLoading}
                >
                  Cancel Booking
                </Button>
              )}
              
              <Button variant="text" className="w-full">
                Download Receipt
              </Button>
              
              <Button variant="text" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-medium text-gray-700">Booking ID</label>
                <p className="text-gray-900 font-mono">{booking.id}</p>
              </div>
              
              {booking.hapio_booking_id && (
                <div>
                  <label className="block font-medium text-gray-700">External ID</label>
                  <p className="text-gray-900 font-mono">{booking.hapio_booking_id}</p>
                </div>
              )}
              
              <div>
                <label className="block font-medium text-gray-700">Product ID</label>
                <p className="text-gray-900 font-mono">{booking.product_id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}