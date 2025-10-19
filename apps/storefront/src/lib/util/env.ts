export const getBaseURL = () => {
  // Use production URL if available, otherwise use localhost for development
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "https://localhost:8000"
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
}
