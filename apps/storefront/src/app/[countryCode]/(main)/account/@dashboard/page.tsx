import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <h1 className="heading-xl uppercase">Welcome {customer.first_name}</h1>
      <p className="label-md">Your account is ready to go!</p>
    </div>
  )
}
