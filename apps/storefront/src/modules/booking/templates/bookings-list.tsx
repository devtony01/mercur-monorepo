"use client"

import { useState } from "react"
import { Button } from "@components/atoms"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import type { Booking } from "@lib/data/bookings"

interface BookingsListProps {
  bookings: Booking[]
}

export default function BookingsList({ bookings }: BookingsListProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't made any service bookings yet. Browse our services to get started.
          </p>
          <LocalizedClientLink href="/store">
            <Button variant="filled">Browse Services</Button>
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "all", label: "All Bookings" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {bookings.filter((b) => b.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Booking #{booking.id.slice(-8)}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                  </div>
                  <div>
                    <p><strong>Service ID:</strong> {booking.service_id}</p>
                    <p><strong>Location ID:</strong> {booking.location_id}</p>
                  </div>
                </div>
                
                {booking.notes && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {booking.notes}
                    </p>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(booking.created_at).toLocaleString()}
                </div>
              </div>
              
              <div className="ml-6 flex flex-col gap-2">
                <LocalizedClientLink href={`/account/bookings/${booking.id}`}>
                  <Button variant="tonal" size="small">
                    View Details
                  </Button>
                </LocalizedClientLink>
                
                {booking.status === "confirmed" && (
                  <Button variant="text" size="small">
                    Reschedule
                  </Button>
                )}
                
                {(booking.status === "pending" || booking.status === "confirmed") && (
                  <Button variant="destructive" size="small">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && filter !== "all" && (
        <div className="text-center py-8">
          <p className="text-gray-500">No {filter} bookings found.</p>
        </div>
      )}
    </div>
  )
}