import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Text,
  Badge,
  Input,
  Textarea,
  Select,
} from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Calendar, ArrowLeft, Pencil, Check, XMark } from "@medusajs/icons"
import { useParams } from "react-router-dom"

interface Booking {
  id: string
  product_id: string
  product_title: string
  customer_email: string
  customer_name: string
  customer_phone?: string
  booking_date: string
  booking_time: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  created_at: string
  updated_at?: string
  notes?: string
  duration?: string
  location?: string
  price?: number
}

const BookingDetailsPage = () => {
  const { id } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Booking>>({})

  useEffect(() => {
    if (id) {
      fetchBooking()
    }
  }, [id])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual booking API when available
      const response = await fetch(`/admin/hapio/bookings/${id}`).catch(() => null)
      
      if (response && response.ok) {
        const data = await response.json()
        setBooking(data.booking)
        setEditForm(data.booking)
      } else {
        // Mock data for now
        const mockBooking: Booking = {
          id: id || "booking_01HQZX1234567890",
          product_id: "prod_01HQZX1234567890",
          product_title: "Hair Styling Service",
          customer_email: "sarah.johnson@example.com",
          customer_name: "Sarah Johnson",
          customer_phone: "+1 (555) 123-4567",
          booking_date: "2024-01-15",
          booking_time: "10:00",
          status: "confirmed",
          created_at: "2024-01-10T10:00:00Z",
          updated_at: "2024-01-12T14:30:00Z",
          notes: "First time customer, prefers natural look",
          duration: "60 minutes",
          location: "Main Salon",
          price: 85.00
        }
        setBooking(mockBooking)
        setEditForm(mockBooking)
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: "green" as const, label: "Confirmed" },
      pending: { color: "orange" as const, label: "Pending" },
      cancelled: { color: "red" as const, label: "Cancelled" },
      completed: { color: "blue" as const, label: "Completed" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <StatusBadge color={config.color}>{config.label}</StatusBadge>
  }

  const handleSave = async () => {
    try {
      // TODO: Implement actual save API
      console.log("Saving booking:", editForm)
      setBooking({ ...booking, ...editForm } as Booking)
      setEditing(false)
    } catch (error) {
      console.error("Error saving booking:", error)
    }
  }

  const handleCancel = () => {
    setEditForm(booking || {})
    setEditing(false)
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <Text>Loading booking details...</Text>
        </div>
      </Container>
    )
  }

  if (!booking) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <Text>Booking not found</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="small"
            onClick={() => window.location.href = '/app/hapio/bookings'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
          <div>
            <Heading>Booking #{booking.id.slice(-8)}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {booking.product_title}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(booking.status)}
          {!editing ? (
            <Button
              variant="secondary"
              size="small"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="small"
                onClick={handleSave}
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={handleCancel}
              >
                <XMark className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="border border-ui-border-base rounded-lg p-6">
            <Heading level="h3" className="mb-4">Customer Information</Heading>
            <div className="space-y-4">
              <div>
                <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Name</Text>
                {editing ? (
                  <Input
                    value={editForm.customer_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
                  />
                ) : (
                  <Text className="font-medium">{booking.customer_name}</Text>
                )}
              </div>
              <div>
                <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Email</Text>
                {editing ? (
                  <Input
                    type="email"
                    value={editForm.customer_email || ''}
                    onChange={(e) => setEditForm({ ...editForm, customer_email: e.target.value })}
                  />
                ) : (
                  <Text>{booking.customer_email}</Text>
                )}
              </div>
              {booking.customer_phone && (
                <div>
                  <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Phone</Text>
                  {editing ? (
                    <Input
                      value={editForm.customer_phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, customer_phone: e.target.value })}
                    />
                  ) : (
                    <Text>{booking.customer_phone}</Text>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Booking Information */}
          <div className="border border-ui-border-base rounded-lg p-6">
            <Heading level="h3" className="mb-4">Booking Information</Heading>
            <div className="space-y-4">
              <div>
                <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Service</Text>
                <Text className="font-medium">{booking.product_title}</Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Date</Text>
                {editing ? (
                  <Input
                    type="date"
                    value={editForm.booking_date || ''}
                    onChange={(e) => setEditForm({ ...editForm, booking_date: e.target.value })}
                  />
                ) : (
                  <Text className="font-medium">{booking.booking_date}</Text>
                )}
              </div>
              <div>
                <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Time</Text>
                {editing ? (
                  <Input
                    type="time"
                    value={editForm.booking_time || ''}
                    onChange={(e) => setEditForm({ ...editForm, booking_time: e.target.value })}
                  />
                ) : (
                  <Text className="font-medium">{booking.booking_time}</Text>
                )}
              </div>
              <div>
                <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Status</Text>
                {editing ? (
                  <Select 
                    value={editForm.status || booking.status} 
                    onValueChange={(value) => setEditForm({ ...editForm, status: value as any })}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="pending">Pending</Select.Item>
                      <Select.Item value="confirmed">Confirmed</Select.Item>
                      <Select.Item value="completed">Completed</Select.Item>
                      <Select.Item value="cancelled">Cancelled</Select.Item>
                    </Select.Content>
                  </Select>
                ) : (
                  getStatusBadge(booking.status)
                )}
              </div>
              {booking.duration && (
                <div>
                  <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Duration</Text>
                  <Text>{booking.duration}</Text>
                </div>
              )}
              {booking.location && (
                <div>
                  <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Location</Text>
                  <Text>{booking.location}</Text>
                </div>
              )}
              {booking.price && (
                <div>
                  <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Price</Text>
                  <Text className="font-medium">${booking.price.toFixed(2)}</Text>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="lg:col-span-2 border border-ui-border-base rounded-lg p-6">
            <Heading level="h3" className="mb-4">Notes</Heading>
            {editing ? (
              <Textarea
                placeholder="Add notes about this booking..."
                value={editForm.notes || ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={4}
              />
            ) : (
              <Text className="text-ui-fg-subtle">
                {booking.notes || "No notes added"}
              </Text>
            )}
          </div>

          {/* Timestamps */}
          <div className="lg:col-span-2 border border-ui-border-base rounded-lg p-6">
            <Heading level="h3" className="mb-4">Timestamps</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Created</Text>
                <Text className="text-sm">{new Date(booking.created_at).toLocaleString()}</Text>
              </div>
              {booking.updated_at && (
                <div>
                  <Text className="text-sm font-medium text-ui-fg-subtle mb-1">Last Updated</Text>
                  <Text className="text-sm">{new Date(booking.updated_at).toLocaleString()}</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  // No label or icon for parameterized routes to avoid sidebar warnings
})

export default BookingDetailsPage