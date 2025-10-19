import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { ProductFilters } from "@components/molecules"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <main className="container">
      <div className="py-4">
        <h1 className="text-3xl font-bold uppercase mb-6" data-testid="store-page-title">All products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-4">
          <div className="md:col-span-1">
            <div className="bg-ui-bg-subtle p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-4">Filters</h3>
              <ProductFilters />
            </div>
          </div>
          <section className="md:col-span-3">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                searchParams={searchParams}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}

export default StoreTemplate
