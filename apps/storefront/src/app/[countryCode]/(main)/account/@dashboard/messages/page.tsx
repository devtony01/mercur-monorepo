import { retrieveCustomer } from "@lib/data/customer"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Messages",
  description: "View your messages",
}

export default async function MessagesPage() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <h1 className="heading-md uppercase mb-8">Messages</h1>
      <div className="text-center py-12">
        <p className="text-lg text-secondary">
          No messages yet.
        </p>
      </div>
    </div>
  )
}