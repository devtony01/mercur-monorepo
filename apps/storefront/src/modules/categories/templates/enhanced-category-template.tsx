import { notFound } from "next/navigation"
import { Suspense } from "react"
import Script from "next/script"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import { ProductFilters } from "@components/molecules"
import { HttpTypes } from "@medusajs/types"

// Enhanced breadcrumbs component
function CategoryBreadcrumbs({ 
  category, 
  parents 
}: { 
  category: HttpTypes.StoreProductCategory
  parents: HttpTypes.StoreProductCategory[]
}) {
  return (
    <nav className="hidden md:block mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-ui-fg-subtle">
        <li>
          <LocalizedClientLink 
            href="/categories" 
            className="hover:text-ui-fg-base transition-colors"
          >
            All Products
          </LocalizedClientLink>
        </li>
        {parents.reverse().map((parent) => (
          <li key={parent.id} className="flex items-center space-x-2">
            <span>/</span>
            <LocalizedClientLink
              href={`/categories/${parent.handle}`}
              className="hover:text-ui-fg-base transition-colors"
            >
              {parent.name}
            </LocalizedClientLink>
          </li>
        ))}
        <li className="flex items-center space-x-2">
          <span>/</span>
          <span className="text-ui-fg-base font-medium">{category.name}</span>
        </li>
      </ol>
    </nav>
  )
}

export default function EnhancedCategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  // Generate structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "All Products",
        item: `${baseUrl}/${countryCode}/categories`,
      },
      ...parents.reverse().map((parent, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: parent.name,
        item: `${baseUrl}/${countryCode}/categories/${parent.handle}`,
      })),
      {
        "@type": "ListItem",
        position: parents.length + 2,
        name: category.name,
        item: `${baseUrl}/${countryCode}/categories/${category.handle}`,
      },
    ],
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="category-breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <main className="container py-6">
        <CategoryBreadcrumbs category={category} parents={[...parents]} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-ui-bg-subtle p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-4">Filters</h3>
              <ProductFilters />
            </div>
          </div>
          
          <div className="md:col-span-3">
            {/* Category Header */}
            <div className="mb-8">
              <h1 
                className="text-3xl font-bold text-ui-fg-base uppercase tracking-tight mb-4"
                data-testid="category-page-title"
              >
                {category.name}
              </h1>
              
              {category.description && (
                <div className="text-ui-fg-subtle text-base mb-6">
                  <p>{category.description}</p>
                </div>
              )}
              
              {/* Subcategories */}
              {category.category_children && category.category_children.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-ui-fg-base mb-4">
                    Shop by Subcategory
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.category_children.map((c) => (
                      <InteractiveLink
                        key={c.id}
                        href={`/categories/${c.handle}`}
                        className="p-3 border border-ui-border-base rounded-lg hover:border-ui-border-interactive transition-colors text-center"
                      >
                        <span className="text-sm font-medium text-ui-fg-base">
                          {c.name}
                        </span>
                      </InteractiveLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 12}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  )
}