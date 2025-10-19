import { retrieveCustomer } from "@lib/data/customer"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns",
  description: "View your returns",
}

export default async function ReturnsPage() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <h1 className="heading-md uppercase mb-8">Returns</h1>
      <div className="text-center py-12">
        <p className="text-lg text-secondary">
          No returns yet.
        </p>
      </div>
    </div>
  )
}