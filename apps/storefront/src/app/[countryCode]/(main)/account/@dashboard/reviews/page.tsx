import { retrieveCustomer } from "@lib/data/customer"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reviews",
  description: "View your reviews",
}

export default async function ReviewsPage() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <h1 className="heading-md uppercase mb-8">Reviews</h1>
      <div className="text-center py-12">
        <p className="text-lg text-secondary">
          No reviews to write yet.
        </p>
      </div>
    </div>
  )
}