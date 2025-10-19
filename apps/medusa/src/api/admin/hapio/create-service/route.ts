import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

// Type definition for create service request body
interface CreateServiceRequestBody {
  title: string
  description?: string
  price?: number
  duration?: string
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { title, description, price, duration } = req.body as CreateServiceRequestBody

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        message: "Service title is required"
      })
    }

    // Create product data with bookable service configuration
    const productData = {
      title: title || 'New Bookable Service',
      subtitle: 'Service that requires appointment booking',
      description: description || 'A new service product that customers can book appointments for. Configure the details, pricing, and availability.',
      status: 'draft',
      metadata: {
        requires_booking: 'true',
        type: 'service',
        booking_duration: duration || '60',
        advance_booking_days: '30'
      },
      options: [
        {
          title: 'Duration',
          values: ['30 min', '60 min', '90 min']
        }
      ],
      variants: [
        {
          title: `${title || 'Standard Service'} (${duration || '60'} min)`,
          options: {
            'Duration': `${duration || '60'} min`
          },
          prices: [
            {
              currency_code: 'usd',
              amount: price || 10000 // Default $100.00 in cents
            }
          ],
          manage_inventory: false
        }
      ]
    }

    // Use internal HTTP call to admin products API (following Medusa patterns)
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const response = await fetch(`${baseUrl}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
        'Cookie': req.headers.cookie || '',
        'x-medusa-access-token': Array.isArray(req.headers['x-medusa-access-token']) 
          ? req.headers['x-medusa-access-token'][0] 
          : req.headers['x-medusa-access-token'] || '',
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Product creation failed: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Failed to create product: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    const product = result.product

    res.status(201).json({
      product,
      message: "Bookable service created successfully"
    })
  } catch (error) {
    console.error("Error creating bookable service:", error)
    res.status(500).json({
      message: "Failed to create bookable service",
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}