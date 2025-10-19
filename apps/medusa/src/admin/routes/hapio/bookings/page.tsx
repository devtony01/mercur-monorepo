import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Table,
  Text,
  Badge,
  Input,
  Select,
} from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Calendar, ArrowLeft } from "@medusajs/icons"
import { useParams } from "react-router-dom"

interface Booking {
  id: string
  product_id: string
  product_title: string
  customer_email: string
  customer_name: string
  booking_date: string
  booking_time: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  created_at: string
  notes?: string
}

const BookingListPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [productTitle, setProductTitle] = useState("")
  const [serviceId, setServiceId] = useState<string | null>(null)

  useEffect(() => {
    // Get service_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const serviceIdParam = urlParams.get('service_id')
    setServiceId(serviceIdParam)
    
    fetchBookings()
    if (serviceIdParam) {
      fetchProductTitle(serviceIdParam)
    }
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual booking API when available
      const response = await fetch(`/admin/hapio/bookings${serviceId ? `?service_id=${serviceId}` : ''}`).catch(() => null)
      
      if (response && response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      } else {
        // No bookings API available yet, use empty array
        setBookings([])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProductTitle = async (productId: string) => {
    try {
      const response = await fetch(`/admin/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProductTitle(data.product?.title || "Unknown Product")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
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

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === "all" || booking.status === filter
    const matchesSearch = 
      booking.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleBookingClick = (bookingId: string) => {
    window.location.href = `/app/hapio/bookings/details/${bookingId}`
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="small"
            onClick={() => window.location.href = '/app/hapio'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hapio
          </Button>
          <div>
            <Heading>
              {serviceId ? `Bookings for ${productTitle}` : 'All Bookings'}
            </Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {serviceId ? `View all bookings for this service` : 'Manage all service bookings'}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-ui-tag-blue-bg text-ui-tag-blue-text border-ui-tag-blue-border">
            {filteredBookings.length} Booking{filteredBookings.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filter} onValueChange={setFilter}>
          <Select.Trigger className="w-40">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Status</Select.Item>
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="confirmed">Confirmed</Select.Item>
            <Select.Item value="completed">Completed</Select.Item>
            <Select.Item value="cancelled">Cancelled</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Bookings Table */}
      <div className="p-6">
        <div className="border border-ui-border-base rounded-lg overflow-hidden">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Booking ID</Table.HeaderCell>
                {!serviceId && <Table.HeaderCell>Service</Table.HeaderCell>}
                <Table.HeaderCell>Customer</Table.HeaderCell>
                <Table.HeaderCell>Date & Time</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Notes</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={serviceId ? 6 : 7} className="text-center py-8">
                    <Text>Loading bookings...</Text>
                  </Table.Cell>
                </Table.Row>
              ) : filteredBookings.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={serviceId ? 6 : 7} className="text-center py-8">
                    <Text>No bookings found</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredBookings.map((booking) => (
                  <Table.Row 
                    key={booking.id} 
                    className="cursor-pointer hover:bg-ui-bg-subtle"
                    onClick={() => handleBookingClick(booking.id)}
                  >
                    <Table.Cell>
                      <Text className="font-mono text-sm">#{booking.id.slice(-8)}</Text>
                    </Table.Cell>
                    {!serviceId && (
                      <Table.Cell>
                        <Text className="font-medium">{booking.product_title}</Text>
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <div>
                        <Text className="font-medium">{booking.customer_name}</Text>
                        <Text className="text-sm text-ui-fg-subtle">{booking.customer_email}</Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <Text className="font-medium">{booking.booking_date}</Text>
                        <Text className="text-sm text-ui-fg-subtle">{booking.booking_time}</Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {getStatusBadge(booking.status)}
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-sm max-w-xs truncate">
                        {booking.notes || "No notes"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookingClick(booking.id)
                        }}
                      >
                        View Details
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Service Bookings",
  icon: Calendar,
})

export default BookingListPage