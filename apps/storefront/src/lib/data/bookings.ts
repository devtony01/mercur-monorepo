"use server"

import { sdk } from "@lib/config"
import { getCacheOptions, getCacheTag } from "./cookies"
import medusaError from "@lib/util/medusa-error"

// Types for Hapio Integration
export interface BookingSlot {
  id: string
  start_time: string
  end_time: string
  available: boolean
  service_id?: string
  location_id?: string
  duration?: number
}

export interface Booking {
  id: string
  customer_id: string
  hapio_booking_id?: string
  product_id?: string
  service_id: string
  location_id: string
  start_time: string
  end_time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  created_at: string
  updated_at: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
}

export interface CreateBookingData {
  service_id: string
  location_id: string
  start_time: string
  end_time: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  notes?: string
  product_id?: string
}

export interface BookingService {
  id: string
  name: string
  description?: string
  duration: number // in minutes
  price?: number
  location_id?: string
  available?: boolean
}

export interface BookingLocation {
  id: string
  name: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  available?: boolean
}

// API Functions for Hapio Integration
export const getAvailableSlots = async (
  serviceId: string,
  locationId: string,
  fromDate: string,
  toDate?: string
): Promise<{ data: BookingSlot[] }> => {
  try {
    const params = new URLSearchParams()
    params.append("service", serviceId)
    params.append("location", locationId)
    params.append("from", fromDate)
    params.append("to", toDate || fromDate)

    const response = await sdk.client
      .fetch<{ data: BookingSlot[] }>(`/store/booking-slots?${params.toString()}`, {
        method: "GET",
        cache: "no-store", // Don't cache availability data
      })
      .catch((error) => {
        console.error("API Error fetching slots:", error)
        // Return empty data instead of throwing
        return { data: [] }
      })

    return { data: response?.data || [] }
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return { data: [] }
  }
}

export const getBookingServices = async (locationId?: string): Promise<{ data: BookingService[] }> => {
  try {
    const next = await getCacheOptions("booking-services")
    
    const params = locationId ? `?location=${locationId}` : ""
    
    const response = await sdk.client
      .fetch<{ data: BookingService[] }>(`/store/booking-services${params}`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .catch((error) => {
        console.error("API Error fetching services:", error)
        // Return empty data instead of throwing
        return { data: [] }
      })

    return { data: response?.data || [] }
  } catch (error) {
    console.error("Error fetching booking services:", error)
    return { data: [] }
  }
}

export const getBookingLocations = async (): Promise<{ data: BookingLocation[] }> => {
  try {
    const next = await getCacheOptions("booking-locations")
    
    const response = await sdk.client
      .fetch<{ data: BookingLocation[] }>(`/store/booking-locations`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .catch((error) => {
        console.error("API Error fetching locations:", error)
        // Return empty data instead of throwing
        return { data: [] }
      })

    return { data: response?.data || [] }
  } catch (error) {
    console.error("Error fetching booking locations:", error)
    return { data: [] }
  }
}

export const createBooking = async (data: CreateBookingData): Promise<Booking> => {
  try {
    const response = await sdk.client
      .fetch<{ booking: Booking }>(`/store/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .catch(medusaError)

    if (!response?.booking) {
      throw new Error("Failed to create booking")
    }

    // Revalidate cache
    try {
      const cacheTag = await getCacheTag("bookings")
    } catch (e) {
      // Cache tag error shouldn't fail the booking
      console.warn("Cache tag error:", e)
    }
    
    return response.booking
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export const getBooking = async (id: string): Promise<Booking> => {
  try {
    const next = await getCacheOptions("bookings")
    
    const response = await sdk.client
      .fetch<{ booking: Booking }>(`/store/bookings/${id}`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .catch(medusaError)

    if (!response?.booking) {
      throw new Error(`Booking not found: ${id}`)
    }

    return response.booking
  } catch (error) {
    console.error("Error fetching booking:", error)
    throw error
  }
}

export const updateBooking = async (
  id: string,
  data: Partial<CreateBookingData>
): Promise<Booking> => {
  try {
    const headers = {
      "Content-Type": "application/json",
    }

    const booking = await sdk.client
      .fetch<{ booking: Booking }>(`/store/bookings/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      })
      .then(({ booking }) => booking)
      .catch((error) => {
        throw new Error(`Failed to update booking: ${error.message}`)
      })

    // Revalidate cache
    const cacheTag = await getCacheTag("bookings")
    
    return booking
  } catch (error) {
    console.error("Error updating booking:", error)
    throw error
  }
}

export const cancelBooking = async (id: string): Promise<void> => {
  try {
    await sdk.client
      .fetch(`/store/bookings/${id}`, {
        method: "DELETE",
      })
      .catch((error) => {
        throw new Error(`Failed to cancel booking: ${error.message}`)
      })

    // Revalidate cache
    const cacheTag = await getCacheTag("bookings")
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw error
  }
}

export const getCustomerBookings = async (customerId: string): Promise<Booking[]> => {
  try {
    const next = await getCacheOptions("bookings")
    
    const response = await sdk.client
      .fetch<{ bookings: Booking[] }>(`/store/bookings?customer_id=${customerId}`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .catch(medusaError)

    return response?.bookings || []
  } catch (error) {
    console.error("Error fetching customer bookings:", error)
    return [] // Return empty array instead of throwing
  }
}