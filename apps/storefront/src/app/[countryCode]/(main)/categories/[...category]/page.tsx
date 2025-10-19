import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import EnhancedCategoryTemplate from "@modules/categories/templates/enhanced-category-template"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  // Limit static generation to prevent build timeouts
  // Only generate for main country codes and top categories
  const mainCountryCodes = ['us', 'dk', 'fr'] // Limit to main markets
  
  try {
    const categoriesData = await listCategories({ query: { limit: 10 } }) // Limit categories

    if (!categoriesData || !categoriesData.categories) {
      return []
    }

    // Only generate for top-level categories to prevent timeout
    const topCategoryHandles = categoriesData.categories
      .slice(0, 5) // Limit to top 5 categories
      .map((category: any) => category.handle)
      .filter(Boolean)

    const staticParams = mainCountryCodes
      .map((countryCode: string) =>
        topCategoryHandles.map((handle: string) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat()

    return staticParams
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    return [] // Return empty array to prevent build failure
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mercur Marketplace"

    const title = `${productCategory.name} - Shop ${productCategory.name} Products`
    const description = productCategory.description ?? 
      `Discover ${productCategory.name} products on ${siteName}. Browse our curated collection of ${productCategory.name} items from top brands.`
    
    const canonical = `${baseUrl}/${params.countryCode}/categories/${params.category.join("/")}`

    return {
      title: `${title} | ${siteName}`,
      description,
      keywords: `${productCategory.name}, fashion, marketplace, buy, sell, pre-loved`,
      alternates: {
        canonical,
      },
      openGraph: {
        title: `${title} | ${siteName}`,
        description,
        url: canonical,
        siteName,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${siteName}`,
        description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-video-preview": -1,
          "max-snippet": -1,
        },
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <EnhancedCategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
