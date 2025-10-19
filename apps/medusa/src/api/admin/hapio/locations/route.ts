import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { page = 1, per_page = 100, enabled = "exclude" } = req.query

    const hapioApiUrl = process.env.HAPIO_API_URL || "https://eu-central-1.hapio.net/v1"
    const hapioApiToken = process.env.HAPIO_API_TOKEN

    if (!hapioApiToken) {
      return res.status(500).json({
        message: "Hapio API token not configured",
        error: "HAPIO_API_TOKEN environment variable is required"
      })
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      enabled: enabled.toString()
    })

    console.log('Fetching locations from:', `${hapioApiUrl}/locations?${queryParams}`)
    
    const response = await fetch(`${hapioApiUrl}/locations?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${hapioApiToken}`,
        'Content-Type': 'application/json',
      },
      // Add timeout configuration
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Hapio API error: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    const transformedResponse = {
      locations: data.data || [],
      pagination: {
        page: data.meta?.current_page || 1,
        per_page: data.meta?.per_page || 100,
        total: data.meta?.total || 0,
        total_pages: data.meta?.last_page || 1
      }
    }

    res.json(transformedResponse)
  } catch (error) {
    console.error("Error fetching Hapio locations:", error)
    res.status(500).json({
      message: "Failed to fetch locations",
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const {
      name,
      time_zone,
      resource_selection_strategy = "randomize",
      resource_selection_priority = [],
      metadata = null,
      enabled = true
    } = req.body as {
      name: string
      time_zone: string
      resource_selection_strategy?: "randomize" | "prioritize" | "equalize"
      resource_selection_priority?: string[]
      metadata?: any
      enabled?: boolean
    }

    if (!name) {
      return res.status(400).json({
        message: "Location name is required"
      })
    }

    if (!time_zone) {
      return res.status(400).json({
        message: "Time zone is required"
      })
    }

    const hapioApiUrl = process.env.HAPIO_API_URL || "https://eu-central-1.hapio.net/v1"
    const hapioApiToken = process.env.HAPIO_API_TOKEN

    if (!hapioApiToken) {
      return res.status(500).json({
        message: "Hapio API token not configured",
        error: "HAPIO_API_TOKEN environment variable is required"
      })
    }

    // Prepare location data for Hapio API
    // Ensure metadata is null if empty object
    const cleanMetadata = metadata && Object.keys(metadata).length > 0 ? metadata : null
    
    const locationData = {
      name,
      time_zone,
      resource_selection_strategy,
      resource_selection_priority,
      metadata: cleanMetadata,
      enabled
    }

    console.log('Creating location with data:', JSON.stringify(locationData, null, 2))
    console.log('Using Hapio API URL:', hapioApiUrl)
    
    const response = await fetch(`${hapioApiUrl}/locations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hapioApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
      // Add timeout configuration
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Hapio API error: ${response.status} ${response.statusText}`, errorText)
      
      try {
        const errorData = JSON.parse(errorText)
        return res.status(response.status).json({
          message: errorData.message || "Failed to create location",
          errors: errorData.errors || {}
        })
      } catch {
        return res.status(response.status).json({
          message: `Failed to create location: ${response.status} ${response.statusText}`,
          error: errorText
        })
      }
    }

    const location = await response.json()

    res.status(201).json({
      location,
      message: "Location created successfully"
    })
  } catch (error) {
    console.error("Error creating Hapio location:", error)
    res.status(500).json({
      message: "Failed to create location",
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}