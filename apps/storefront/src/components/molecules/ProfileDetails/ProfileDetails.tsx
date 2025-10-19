import { HttpTypes } from "@medusajs/types"

export const ProfileDetails = ({ user }: { user: HttpTypes.StoreCustomer }) => {
  return (
    <div className="space-y-4 mb-8">
      <h2 className="heading-sm">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
            {user.first_name || "Not provided"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
            {user.last_name || "Not provided"}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
            {user.email}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
            {user.phone || "Not provided"}
          </div>
        </div>
      </div>
    </div>
  )
}