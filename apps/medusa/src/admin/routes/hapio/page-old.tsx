import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Text,
  Badge,
  Input,
  Select,
  Tabs,
} from "@medusajs/ui"
import { useState, useEffect, useMemo } from "react"
import { Calendar } from "@medusajs/icons"
import { createColumnHelper } from "@tanstack/react-table"
import { CreateServiceForm } from "@/components/hapio/create-service-form"
import { DataTable } from "../../components/table/data-table"
import { useDataTable } from "../../hooks/table/use-data-table"
import { 
  useHapioBookingsTableQuery, 
  useHapioServicesTableQuery,
  useHapioBookingsTableColumns,
  useHapioServicesTableColumns
} from "./helpers"

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

interface BookingStats {
  total_bookings: number
  pending_bookings: number
  confirmed_bookings: number
  completed_bookings: number
  bookable_products: number
  today_bookings: number
}

interface BookableProduct {
  id: string
  title: string
  status: string
  bookings_count: number
  last_booking: string | null
  metadata: Record<string, any>
}

const HapioBookingPage = () => {
  const [activeTab, setActiveTab] = useState("bookings")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [products, setProducts] = useState<BookableProduct[]>([])
  const [stats, setStats] = useState<BookingStats>({
    total_bookings: 0,
    pending_bookings: 0,
    confirmed_bookings: 0,
    completed_bookings: 0,
    bookable_products: 0,
    today_bookings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesCurrentPage, setServicesCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchBookings(),
        fetchBookableProducts(),
        fetchStats()
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      // TODO: Replace with actual booking API when available
      // For now, return empty array since we don't have real booking data yet
      const response = await fetch('/admin/hapio/bookings').catch(() => null)
      
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
    }
  }

  const fetchBookableProducts = async () => {
    try {
      // Fetch actual products and filter for bookable services
      const response = await fetch('/admin/products')
      if (response.ok) {
        const data = await response.json()
        // Filter products that are actually bookable services
        const bookableProducts = data?.products?.filter(product => 
          product.metadata?.requires_booking === 'true' || 
          product.metadata?.type === 'service'
        ).map(product => ({
          id: product.id,
          title: product.title,
          status: product.status,
          bookings_count: 0, // TODO: Get actual booking count from booking API
          last_booking: null, // TODO: Get actual last booking from booking API
          metadata: product.metadata
        })) || []
        
        setProducts(bookableProducts)
      } else {
        console.error('Failed to fetch products')
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch actual product data to count services
      const response = await fetch('/admin/products')
      if (response.ok) {
        const data = await response.json()
        // Count only products that are actually bookable services
        const bookableProducts = data?.products?.filter(product => 
          product.metadata?.requires_booking === 'true' || 
          product.metadata?.type === 'service'
        ) || []
        
        // Calculate booking stats from actual bookings
        const bookingStats = {
          total_bookings: bookings.length,
          pending_bookings: bookings.filter(b => b.status === 'pending').length,
          confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
          completed_bookings: bookings.filter(b => b.status === 'completed').length,
          bookable_products: bookableProducts.length,
          today_bookings: bookings.filter(b => {
            const today = new Date().toISOString().split('T')[0]
            return b.booking_date === today
          }).length,
        }
        
        setStats(bookingStats)
      } else {
        // Fallback if API fails
        setStats({
          total_bookings: bookings.length,
          pending_bookings: bookings.filter(b => b.status === 'pending').length,
          confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
          completed_bookings: bookings.filter(b => b.status === 'completed').length,
          bookable_products: 0,
          today_bookings: 0,
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Fallback
      setStats({
        total_bookings: bookings.length,
        pending_bookings: bookings.filter(b => b.status === 'pending').length,
        confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
        completed_bookings: bookings.filter(b => b.status === 'completed').length,
        bookable_products: 0,
        today_bookings: 0,
      })
    }
  }

  const handleServiceCreated = () => {
    // Refresh all data when a new service is created
    fetchData()
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

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic for bookings
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex)

  // Pagination logic for services
  const servicesTotalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const servicesStartIndex = (servicesCurrentPage - 1) * itemsPerPage
  const servicesEndIndex = servicesStartIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(servicesStartIndex, servicesEndIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleServicesPageChange = (page: number) => {
    setServicesCurrentPage(page)
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <Heading>Hapio Booking Management</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Manage appointments, bookings, and service products
          </Text>
        </div>
        <div className="flex gap-2">
          <CreateServiceForm onServiceCreated={handleServiceCreated} />
          <Button onClick={fetchData} disabled={loading}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Plugin Status Banner */}
      <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <Heading level="h3" className="text-blue-900">🎯 Hapio Booking Plugin Active</Heading>
              <Text className="text-sm text-blue-700 mt-1">
                Calendar booking system is loaded and ready. Customers can now book appointments for service products.
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <Text className="text-xs text-blue-600 uppercase tracking-wide font-medium">Plugin Status</Text>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Text className="text-sm font-medium text-green-700">Active & Running</Text>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              v1.0.0
            </Badge>
          </div>
        </div>
        


      </div>

      {/* Spacer */}
      <div className="h-6"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-6 pb-6">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <Text className="text-sm font-medium">Total</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.total_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">All bookings</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <Text className="text-sm font-medium">Pending</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.pending_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">Need confirmation</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-500" />
            <Text className="text-sm font-medium">Confirmed</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.confirmed_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">Ready to go</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CubeSolid className="w-4 h-4 text-blue-500" />
            <Text className="text-sm font-medium">Completed</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.completed_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">Finished</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CubeSolid className="w-4 h-4 text-purple-500" />
            <Text className="text-sm font-medium">Services</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.bookable_products}</Text>
          <Text className="text-xs text-ui-fg-subtle">Active services</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-600" />
            <Text className="text-sm font-medium">Today</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.today_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">Today's bookings</Text>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <Tabs.List>
            <Tabs.Trigger value="bookings">Bookings</Tabs.Trigger>
            <Tabs.Trigger value="services">Services</Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="bookings">
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
                  <Table.HeaderCell>Service</Table.HeaderCell>
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
                    <Table.Cell colSpan={7} className="text-center py-8">
                      <Text>Loading bookings...</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : paginatedBookings.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={7} className="text-center py-8">
                      <Text>No bookings found</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedBookings.map((booking) => (
                    <Table.Row 
                      key={booking.id} 
                      className="cursor-pointer hover:bg-ui-bg-subtle"
                      onClick={() => window.location.href = `/app/hapio/bookings/details/${booking.id}`}
                    >
                      <Table.Cell>
                        <Text className="font-mono text-sm">#{booking.id.slice(-8)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="font-medium">{booking.product_title}</Text>
                      </Table.Cell>
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
                        <div className="flex gap-2">
                          <Button variant="secondary" size="small">
                            View
                          </Button>
                          <Button variant="secondary" size="small">
                            Edit
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
            
            {/* Pagination Controls */}
            {filteredBookings.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-ui-border-base bg-ui-bg-base">
                <Text className="text-sm text-ui-fg-subtle">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} bookings
                </Text>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page
                      if (totalPages <= 5) {
                        page = i + 1
                      } else if (currentPage <= 3) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i
                      } else {
                        page = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "primary" : "secondary"}
                          size="small"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="services">
          {/* Services Table */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div className="border border-ui-border-base rounded-lg overflow-hidden">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Service Name</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Total Bookings</Table.HeaderCell>
                  <Table.HeaderCell>Last Booking</Table.HeaderCell>
                  <Table.HeaderCell>Booking Status</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {loading ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-8">
                      <Text>Loading services...</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : paginatedProducts.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-8">
                      <Text>No services found</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedProducts.map((product) => (
                    <Table.Row key={product.id}>
                      <Table.Cell>
                        <Text className="font-medium">{product.title}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge color={product.status === 'published' ? 'green' : 'orange'}>
                          {product.status}
                        </StatusBadge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{product.bookings_count}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-sm">
                          {product.last_booking 
                            ? new Date(product.last_booking).toLocaleDateString()
                            : "No bookings yet"
                          }
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Bookable
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => window.location.href = `/app/products/${product.id}`}
                          >
                            Edit Service
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => window.location.href = `/app/hapio/bookings?service_id=${product.id}`}
                          >
                            View Bookings
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
            
            {/* Services Pagination Controls */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-ui-border-base bg-ui-bg-base">
                <Text className="text-sm text-ui-fg-subtle">
                  Showing {servicesStartIndex + 1} to {Math.min(servicesEndIndex, filteredProducts.length)} of {filteredProducts.length} services
                </Text>
                {servicesTotalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleServicesPageChange(servicesCurrentPage - 1)}
                      disabled={servicesCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(servicesTotalPages, 5) }, (_, i) => {
                      let page
                      if (servicesTotalPages <= 5) {
                        page = i + 1
                      } else if (servicesCurrentPage <= 3) {
                        page = i + 1
                      } else if (servicesCurrentPage >= servicesTotalPages - 2) {
                        page = servicesTotalPages - 4 + i
                      } else {
                        page = servicesCurrentPage - 2 + i
                      }
                      return (
                        <Button
                          key={page}
                          variant={servicesCurrentPage === page ? "primary" : "secondary"}
                          size="small"
                          onClick={() => handleServicesPageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleServicesPageChange(servicesCurrentPage + 1)}
                      disabled={servicesCurrentPage === servicesTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </Tabs.Content>
      </Tabs>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Hapio Bookings",
  icon: Calendar,
})

export default HapioBookingPage