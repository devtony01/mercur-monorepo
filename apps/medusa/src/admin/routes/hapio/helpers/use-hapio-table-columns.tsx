import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { Badge, StatusBadge, Text, Button } from "@medusajs/ui"
import { PencilSquare, Eye } from "@medusajs/icons"

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

interface BookableProduct {
  id: string
  title: string
  status: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<Booking>()
const serviceColumnHelper = createColumnHelper<BookableProduct>()

export const useHapioBookingsTableColumns = () => {
  return useMemo(() => [
    columnHelper.accessor("id", {
      header: "Booking ID",
      cell: ({ getValue }) => (
        <Text className="font-mono text-sm">#{getValue().slice(-8)}</Text>
      ),
    }),
    columnHelper.accessor("product_title", {
      header: "Service",
      cell: ({ getValue }) => (
        <Text className="font-medium">{getValue()}</Text>
      ),
    }),
    columnHelper.accessor("customer_name", {
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <Text className="font-medium">{row.original.customer_name}</Text>
          <Text className="text-sm text-ui-fg-subtle">{row.original.customer_email}</Text>
        </div>
      ),
    }),
    columnHelper.accessor("booking_date", {
      header: "Date & Time",
      cell: ({ row }) => (
        <div>
          <Text className="font-medium">{row.original.booking_date}</Text>
          <Text className="text-sm text-ui-fg-subtle">{row.original.booking_time}</Text>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue()
        const statusConfig = {
          confirmed: { color: "green" as const, label: "Confirmed" },
          pending: { color: "orange" as const, label: "Pending" },
          cancelled: { color: "red" as const, label: "Cancelled" },
          completed: { color: "blue" as const, label: "Completed" },
        }
        
        const config = statusConfig[status] || statusConfig.pending
        return <StatusBadge color={config.color}>{config.label}</StatusBadge>
      },
    }),
    columnHelper.accessor("notes", {
      header: "Notes",
      cell: ({ getValue }) => (
        <Text className="text-sm max-w-xs truncate">
          {getValue() || "No notes"}
        </Text>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => window.location.href = `/app/hapio/bookings/details/${row.original.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => window.location.href = `/app/hapio/bookings/details/${row.original.id}`}
          >
            <PencilSquare className="w-4 h-4" />
          </Button>
        </div>
      ),
    }),
  ], [])
}

export const useHapioServicesTableColumns = () => {
  return useMemo(() => [
    serviceColumnHelper.accessor("title", {
      header: "Service Name",
      cell: ({ getValue }) => (
        <Text className="font-medium">{getValue()}</Text>
      ),
    }),
    serviceColumnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <StatusBadge color={getValue() === 'published' ? 'green' : 'orange'}>
          {getValue()}
        </StatusBadge>
      ),
    }),
    serviceColumnHelper.display({
      id: "bookings_count",
      header: "Total Bookings",
      cell: () => (
        <Text>0</Text> // TODO: Get actual booking count
      ),
    }),
    serviceColumnHelper.display({
      id: "last_booking",
      header: "Last Booking",
      cell: () => (
        <Text className="text-sm">No bookings yet</Text> // TODO: Get actual last booking
      ),
    }),
    serviceColumnHelper.display({
      id: "booking_status",
      header: "Booking Status",
      cell: () => (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Bookable
        </Badge>
      ),
    }),
    serviceColumnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => window.location.href = `/app/products/${row.original.id}`}
          >
            <PencilSquare className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => window.location.href = `/app/hapio/bookings?service_id=${row.original.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    }),
  ], [])
}