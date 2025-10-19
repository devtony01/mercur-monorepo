import { Suspense } from "react"
import Link from "next/link"

export const SellerTabs = ({
  tab,
  seller_handle,
  seller_id,
  locale,
  currency_code,
}: {
  tab: string
  seller_handle: string
  seller_id: string
  locale: string
  currency_code?: string
}) => {
  const tabsList = [
    { label: "products", link: `/${locale}/sellers/${seller_handle}/` },
    {
      label: "reviews",
      link: `/${locale}/sellers/${seller_handle}/reviews`,
    },
  ]

  return (
    <div className="mt-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabsList.map((tabItem) => (
            <Link
              key={tabItem.label}
              href={tabItem.link}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                tab === tabItem.label
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tabItem.label.charAt(0).toUpperCase() + tabItem.label.slice(1)}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tab === "products" && (
          <div>
            <h3 className="text-lg font-medium mb-4">Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for products - you can integrate with your product listing component */}
              <div className="border rounded-lg p-4 text-center text-gray-500">
                Products will be displayed here
              </div>
            </div>
          </div>
        )}
        
        {tab === "reviews" && (
          <div>
            <h3 className="text-lg font-medium mb-4">Reviews</h3>
            <div className="text-gray-500">
              Reviews will be displayed here
            </div>
          </div>
        )}
      </div>
    </div>
  )
}