import { Metadata } from "next"
import { Suspense } from "react"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all product categories.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    min_price?: string
    max_price?: string
    [key: string]: string | undefined
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function CategoriesPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, ...otherParams } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchParams={otherParams}
    />
  )
}