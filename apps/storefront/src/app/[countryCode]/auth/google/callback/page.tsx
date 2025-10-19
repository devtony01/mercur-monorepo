"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { transferCart } from "@lib/data/customer"
import { Button } from "@components/atoms"
import Cookies from "js-cookie"

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { countryCode } = useParams()

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const error = searchParams.get("error")

      if (error) {
        setStatus("error")
        setError("Google authentication was cancelled or failed")
        return
      }

      if (!code) {
        setStatus("error")
        setError("Missing authorization code")
        return
      }

      try {
        // Call Medusa's callback endpoint to exchange code for token
        const response = await fetch(`${process.env.MEDUSA_BACKEND_URL}/auth/customer/google/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state }),
        })

        if (!response.ok) {
          throw new Error("Failed to authenticate with Google")
        }

        const data = await response.json()
        
        if (data.token) {
          // Store the auth token using js-cookie
          Cookies.set('_medusa_jwt', data.token, {
            expires: 7, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          })
          
          // Transfer cart if exists
          await transferCart()
          
          setStatus("success")
          // Redirect to user dashboard after a short delay
          setTimeout(() => {
            router.push(`/${countryCode}/account`)
          }, 1500)
        } else {
          setStatus("error")
          setError("No authentication token received")
        }
      } catch (err: any) {
        setStatus("error")
        setError(err.message || "An unexpected error occurred")
      }
    }

    processCallback()
  }, [searchParams, router])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ui-border-interactive"></div>
        <h1 className="text-xl font-semibold text-ui-fg-base">Completing Google Sign In...</h1>
        <p className="text-ui-fg-subtle text-center">Please wait while we set up your account.</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-ui-bg-switch-off rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-ui-fg-on-color"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-ui-fg-base">Sign In Successful!</h1>
        <p className="text-ui-fg-subtle text-center">Redirecting you to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 bg-ui-bg-component rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-ui-fg-error"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-ui-fg-error">Sign In Failed</h1>
      <p className="text-ui-fg-subtle text-center max-w-md">{error}</p>
      <Button
        onClick={() => router.push(`/${countryCode}/account`)}
        variant="primary"
        className="mt-4"
      >
        Try Again
      </Button>
    </div>
  )
}