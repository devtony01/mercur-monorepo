"use client"

import { useState, useEffect } from "react"
import { formatBookingDate, formatBookingTime, getBookingStatusColor } from "@lib/utils/booking-helpers"

// Mock booking data for demo
const mockBookings = [
  {
    id: "booking-1",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "+1-555-0123",
    service_name: "Deep Tissue Massage",
    location_name: "Downtown Spa",
    start_time: "2024-01-15T14:00:00Z",
    end_time: "2024-01-15T15:00:00Z",
    status: "confirmed",
    notes: "First time customer",
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "booking-2", 
    customer_name: "Jane Smith",
    customer_email: "jane@example.com",
    customer_phone: "+1-555-0456",
    service_name: "Swedish Massage",
    location_name: "Uptown Wellness Center",
    start_time: "2024-01-16T10:30:00Z",
    end_time: "2024-01-16T12:00:00Z",
    status: "pending",
    notes: "Prefers female therapist",
    created_at: "2024-01-11T15:30:00Z"
  },
  {
    id: "booking-3",
    customer_name: "Mike Johnson", 
    customer_email: "mike@example.com",
    customer_phone: "+1-555-0789",
    service_name: "Hot Stone Therapy",
    location_name: "Downtown Spa",
    start_time: "2024-01-17T16:00:00Z",
    end_time: "2024-01-17T17:15:00Z",
    status: "confirmed",
    notes: "",
    created_at: "2024-01-12T09:15:00Z"
  }
]

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(mockBookings)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === "all" || booking.status === filter
    const matchesSearch = searchTerm === "" || 
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Booking Management</h1>
          <p className="text-gray-600">Manage customer service appointments and bookings</p>
        </div>

        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This shows mock booking data. In production, this would connect to your Hapio API to display real bookings.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name, email, or service..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status Filter</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">
              Bookings ({filteredBookings.length})
            </h2>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings found matching your criteria.
            </div>
          ) : (
            <div className="divide-y">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{booking.customer_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Service:</strong> {booking.service_name}</p>
                          <p><strong>Location:</strong> {booking.location_name}</p>
                          <p><strong>Email:</strong> {booking.customer_email}</p>
                          {booking.customer_phone && (
                            <p><strong>Phone:</strong> {booking.customer_phone}</p>
                          )}
                        </div>
                        <div>
                          <p><strong>Date:</strong> {formatBookingDate(booking.start_time)}</p>
                          <p><strong>Time:</strong> {formatBookingTime(booking.start_time)} - {formatBookingTime(booking.end_time)}</p>
                          <p><strong>Booked:</strong> {formatBookingDate(booking.created_at)}</p>
                          {booking.notes && (
                            <p><strong>Notes:</strong> {booking.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "confirmed")}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "completed")}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {["pending", "confirmed", "completed", "cancelled"].map(status => {
            const count = bookings.filter(b => b.status === status).length
            return (
              <div key={status} className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{status}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}