import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { getCustomerBookings } from "@lib/data/bookings"
import BookingsList from "@modules/booking/templates/bookings-list"

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your service bookings.",
}

export default async function BookingsPage() {
  const customer = await retrieveCustomer()
  
  if (!customer) {
    return (
      <div className="text-center py-8">
        <p>Please log in to view your bookings.</p>
      </div>
    )
  }

  let bookings = []
  try {
    bookings = await getCustomerBookings(customer.id)
  } catch (error) {
    console.error("Failed to fetch customer bookings:", error)
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">My Bookings</h1>
        <p className="text-base-regular text-ui-fg-subtle">
          View and manage your service bookings
        </p>
      </div>
      
      <BookingsList bookings={bookings} />
    </div>
  )
}