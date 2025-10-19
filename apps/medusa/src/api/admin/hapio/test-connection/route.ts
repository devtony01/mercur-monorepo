import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const hapioApiUrl = process.env.HAPIO_API_URL || "https://eu-central-1.hapio.net/v1"
    const hapioApiToken = process.env.HAPIO_API_TOKEN

    // Check if environment variables are set
    const config = {
      apiUrl: hapioApiUrl,
      hasToken: !!hapioApiToken,
      tokenLength: hapioApiToken ? hapioApiToken.length : 0,
      tokenPreview: hapioApiToken ? `${hapioApiToken.substring(0, 8)}...` : 'Not set'
    }

    if (!hapioApiToken) {
      return res.status(400).json({
        message: "Hapio API token not configured",
        config,
        error: "HAPIO_API_TOKEN environment variable is required"
      })
    }

    // Test a simple API call to check connectivity
    console.log('Testing Hapio API connection to:', hapioApiUrl)
    
    try {
      const response = await fetch(`${hapioApiUrl}/locations?per_page=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${hapioApiToken}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout for test
      })

      const responseText = await response.text()
      
      return res.json({
        message: "Hapio API connection test",
        config,
        test: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
          responsePreview: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '')
        }
      })
    } catch (fetchError) {
      return res.status(500).json({
        message: "Failed to connect to Hapio API",
        config,
        error: {
          name: fetchError instanceof Error ? fetchError.name : 'Unknown',
          message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          cause: fetchError instanceof Error && 'cause' in fetchError ? fetchError.cause : null
        }
      })
    }
  } catch (error) {
    console.error("Error testing Hapio connection:", error)
    res.status(500).json({
      message: "Failed to test Hapio connection",
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}