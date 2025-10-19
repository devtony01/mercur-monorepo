import { Metadata } from "next"
import { ProfileDetails } from "@components/molecules"
import { ProfilePassword } from "@components/molecules/ProfileDetails/ProfilePassword"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <h1 className="heading-md uppercase mb-8">Settings</h1>
      <ProfileDetails user={customer} />
      <ProfilePassword user={customer} />
    </div>
  )
}
