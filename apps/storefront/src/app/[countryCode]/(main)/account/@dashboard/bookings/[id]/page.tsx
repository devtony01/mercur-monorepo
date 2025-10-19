import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBooking } from "@lib/data/bookings"
import BookingDetails from "@modules/booking/templates/booking-details"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  return {
    title: `Booking ${params.id}`,
    description: "View your booking details.",
  }
}

export default async function BookingDetailsPage(props: Props) {
  const params = await props.params
  
  let booking
  try {
    booking = await getBooking(params.id)
  } catch (error) {
    console.error("Failed to fetch booking:", error)
    notFound()
  }

  if (!booking) {
    notFound()
  }

  return (
    <div className="w-full">
      <BookingDetails booking={booking} />
    </div>
  )
}