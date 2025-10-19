import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/atoms"

export const ProfilePassword = ({ user }: { user: HttpTypes.StoreCustomer }) => {
  return (
    <div className="space-y-4">
      <h2 className="heading-sm">Password</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
            ••••••••
          </div>
        </div>
        <Button variant="tonal" className="w-full md:w-auto">
          Change Password
        </Button>
      </div>
    </div>
  )
}