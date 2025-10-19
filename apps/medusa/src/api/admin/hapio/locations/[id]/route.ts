import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        message: "Location ID is required"
      })
    }

    const hapioApiUrl = process.env.HAPIO_API_URL || "https://eu-central-1.hapio.net/v1"
    const hapioApiToken = process.env.HAPIO_API_TOKEN

    if (!hapioApiToken) {
      return res.status(500).json({
        message: "Hapio API token not configured"
      })
    }

    const response = await fetch(`${hapioApiUrl}/locations/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${hapioApiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          message: "Location not found"
        })
      }
      throw new Error(`Failed to fetch location: ${response.status}`)
    }

    const location = await response.json()
    res.json({ location })
  } catch (error) {
    console.error("Error fetching Hapio location:", error)
    res.status(500).json({
      message: "Failed to fetch location",
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params
    const updateData = req.body

    if (!id) {
      return res.status(400).json({
        message: "Location ID is required"
      })
    }

    const hapioApiUrl = process.env.HAPIO_API_URL || "https://eu-central-1.hapio.net/v1"
    const hapioApiToken = process.env.HAPIO_API_TOKEN

    if (!hapioApiToken) {
      return res.status(500).json({
        message: "Hapio API token not configured"
      })
    }

    const response = await fetch(`${hapioApiUrl}/locations/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${hapioApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          message: "Location not found"
        })
      }
      
      const errorText = await response.text()
      try {
        const errorData = JSON.parse(errorText)
        return res.status(response.status).json({
          message: errorData.message || "Failed to update location",
          errors: errorData.errors || {}
        })
      } catch {
        return res.status(response.status).json({
          message: `Failed to update location: ${response.status}`,
          error: errorText
        })
      }
    }

    const location = await response.json()
    res.json({
      location,
      message: "Location updated successfully"
    })
  } catch (error) {
    console.error("Error updating Hapio location:", error)
    res.status(500).json({
      message: "Failed to update location",
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        message: "Location ID is required"
      })
    }

    const hapioApiUrl = process.env.HAPIO_API_URL || "https://eu-central-1.hapio.net/v1"
    const hapioApiToken = process.env.HAPIO_API_TOKEN

    if (!hapioApiToken) {
      return res.status(500).json({
        message: "Hapio API token not configured"
      })
    }

    const response = await fetch(`${hapioApiUrl}/locations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${hapioApiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          message: "Location not found"
        })
      }
      throw new Error(`Failed to delete location: ${response.status}`)
    }

    res.status(204).send()
  } catch (error) {
    console.error("Error deleting Hapio location:", error)
    res.status(500).json({
      message: "Failed to delete location",
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}