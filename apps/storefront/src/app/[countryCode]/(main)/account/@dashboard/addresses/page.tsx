import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <h1 className="heading-md uppercase mb-8">Addresses</h1>
      <div className="text-center py-12">
        <p className="text-lg text-secondary">
          Address management coming soon.
        </p>
      </div>
    </div>
  )
}
