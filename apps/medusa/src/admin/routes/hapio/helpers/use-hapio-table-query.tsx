import { useQueryParams } from "../../../hooks/use-query-params"

export const useHapioBookingsTableQuery = ({ 
  prefix, 
  pageSize = 20 
}: {
  prefix?: string
  pageSize?: number
}) => {
  const queryObject = useQueryParams(
    [
      'offset', 
      'q', 
      'created_at', 
      'updated_at',
      'status', 
      'id', 
      'order',
      'service_id',
      'customer_email',
      'booking_date'
    ],
    prefix
  )

  const { 
    offset, 
    created_at, 
    updated_at,
    status, 
    q, 
    order,
    service_id,
    customer_email,
    booking_date
  } = queryObject

  const searchParams: any = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    status: status?.split(','),
    q,
    fields: 'id,product_id,product_title,customer_email,customer_name,booking_date,booking_time,status,created_at,notes',
    order: order ? order : undefined,
    service_id: service_id ? service_id.split(',') : undefined,
    customer_email: customer_email ? customer_email.split(',') : undefined,
    booking_date: booking_date ? booking_date.split(',') : undefined,
  }

  return {
    searchParams,
    raw: queryObject
  }
}

export const useHapioServicesTableQuery = ({ 
  prefix, 
  pageSize = 20 
}: {
  prefix?: string
  pageSize?: number
}) => {
  const queryObject = useQueryParams(
    [
      'offset', 
      'q', 
      'created_at', 
      'updated_at',
      'status', 
      'id', 
      'order',
      'requires_booking',
      'type'
    ],
    prefix
  )

  const { 
    offset, 
    created_at, 
    updated_at,
    status, 
    q, 
    order,
    requires_booking,
    type
  } = queryObject

  const searchParams: any = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    status: status?.split(','),
    q,
    fields: 'id,title,status,metadata,created_at,updated_at',
    order: order ? order : undefined,
    'metadata.requires_booking': requires_booking === 'true' ? 'true' : undefined,
    'metadata.type': type === 'service' ? 'service' : undefined,
  }

  return {
    searchParams,
    raw: queryObject
  }
}