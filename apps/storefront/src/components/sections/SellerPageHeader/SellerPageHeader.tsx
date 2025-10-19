import { HttpTypes } from "@medusajs/types"

export const SellerPageHeader = ({
  header = false,
  seller,
  user,
}: {
  header?: boolean
  seller: any
  user: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="border rounded-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{seller.name || seller.handle}</h1>
        {user && (
          <div className="text-sm text-gray-600">
            Welcome, {user.first_name}
          </div>
        )}
      </div>
      {seller.description && (
        <p
          dangerouslySetInnerHTML={{
            __html: seller.description,
          }}
          className="text-sm my-5 text-gray-700"
        />
      )}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>Seller ID: {seller.id}</span>
        <span>Handle: {seller.handle}</span>
      </div>
    </div>
  )
}