import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  Text,
  Badge,
  Tabs,
} from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Calendar } from "@medusajs/icons"
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
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

const PAGE_SIZE = 20

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
  
  // Query hooks for proper pagination
  const { searchParams: bookingsSearchParams, raw: bookingsRaw } = useHapioBookingsTableQuery({
    pageSize: PAGE_SIZE,
  })
  
  const { searchParams: servicesSearchParams, raw: servicesRaw } = useHapioServicesTableQuery({
    pageSize: PAGE_SIZE,
  })
  
  // Table columns
  const bookingsColumns = useHapioBookingsTableColumns()
  const servicesColumns = useHapioServicesTableColumns()
  
  // Data tables
  const { table: bookingsTable } = useDataTable({
    data: bookings,
    columns: bookingsColumns,
    count: bookings.length,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
  })
  
  const { table: servicesTable } = useDataTable({
    data: products,
    columns: servicesColumns,
    count: products.length,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
  })

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
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      // TODO: Replace with actual booking API when available
      const response = await fetch('/admin/hapio/bookings').catch(() => null)
      
      if (response && response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      } else {
        // Mock data for demonstration
        setBookings([
          {
            id: "booking_01HQZX1234567890",
            product_id: "prod_01HQZX1234567890",
            product_title: "Hair Styling Service",
            customer_email: "sarah.johnson@example.com",
            customer_name: "Sarah Johnson",
            booking_date: "2024-01-15",
            booking_time: "10:00",
            status: "confirmed",
            created_at: "2024-01-10T10:00:00Z",
            notes: "First time customer, prefers natural look"
          }
        ])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setBookings([])
    }
  }

  const fetchBookableProducts = async () => {
    try {
      const response = await fetch('/admin/products')
      if (response.ok) {
        const data = await response.json()
        const bookableProducts = data?.products?.filter(product => 
          product.metadata?.requires_booking === 'true' || 
          product.metadata?.type === 'service'
        ) || []
        
        setProducts(bookableProducts)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/admin/products')
      if (response.ok) {
        const data = await response.json()
        const bookableProducts = data?.products?.filter(product => 
          product.metadata?.requires_booking === 'true' || 
          product.metadata?.type === 'service'
        ) || []
        
        setStats({
          total_bookings: bookings.length,
          pending_bookings: bookings.filter(b => b.status === 'pending').length,
          confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
          completed_bookings: bookings.filter(b => b.status === 'completed').length,
          bookable_products: bookableProducts.length,
          today_bookings: bookings.filter(b => {
            const today = new Date().toISOString().split('T')[0]
            return b.booking_date === today
          }).length,
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleServiceCreated = () => {
    fetchData()
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
          <Button 
            variant="secondary"
            onClick={() => window.location.href = '/app/hapio/locations'}
          >
            Manage Locations
          </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-6 py-6">
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
            <Calendar className="w-4 h-4 text-orange-500" />
            <Text className="text-sm font-medium">Pending</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.pending_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">Need confirmation</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <Text className="text-sm font-medium">Confirmed</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.confirmed_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">Ready to go</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <Text className="text-sm font-medium">Completed</Text>
          </div>
          <Text className="text-2xl font-bold">{stats.completed_bookings}</Text>
          <Text className="text-xs text-ui-fg-subtle">Finished</Text>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-500" />
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

      {/* Tabs with DataTable */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <Tabs.List>
            <Tabs.Trigger value="bookings">Bookings</Tabs.Trigger>
            <Tabs.Trigger value="services">Services</Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="bookings">
          <div className="flex size-full flex-col overflow-hidden">
            <DataTable
              table={bookingsTable}
              columns={bookingsColumns}
              count={bookings.length}
              pageSize={PAGE_SIZE}
              isLoading={loading}
              queryObject={bookingsRaw}
              search
              pagination
              navigateTo={(row) => `/app/hapio/bookings/details/${row.id}`}
              orderBy={[
                { key: "booking_date", label: "Date" },
                { key: "customer_name", label: "Customer" },
                { key: "status", label: "Status" },
                { key: "created_at", label: "Created" },
              ]}
              noRecords={{
                message: "No bookings found",
              }}
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="services">
          <div className="flex size-full flex-col overflow-hidden">
            <DataTable
              table={servicesTable}
              columns={servicesColumns}
              count={products.length}
              pageSize={PAGE_SIZE}
              isLoading={loading}
              queryObject={servicesRaw}
              search
              pagination
              navigateTo={(row) => `/app/products/${row.id}`}
              orderBy={[
                { key: "title", label: "Name" },
                { key: "status", label: "Status" },
                { key: "created_at", label: "Created" },
                { key: "updated_at", label: "Updated" },
              ]}
              noRecords={{
                message: "No services found",
              }}
            />
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