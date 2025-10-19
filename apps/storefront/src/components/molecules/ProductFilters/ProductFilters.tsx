"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@components/atoms"

export const ProductFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "created_at")

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams)
    
    if (minPrice) {
      params.set("min_price", minPrice)
    } else {
      params.delete("min_price")
    }
    
    if (maxPrice) {
      params.set("max_price", maxPrice)
    } else {
      params.delete("max_price")
    }
    
    if (sortBy !== "created_at") {
      params.set("sortBy", sortBy)
    } else {
      params.delete("sortBy")
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    setSortBy("created_at")
    router.push(pathname)
  }

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-medium mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border border-ui-border-base rounded-md text-sm"
        >
          <option value="created_at">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title">Name: A to Z</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 border border-ui-border-base rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 border border-ui-border-base rounded-md text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={updateFilters}
          className="w-full"
          variant="primary"
        >
          Apply Filters
        </Button>
        <Button
          onClick={clearFilters}
          className="w-full"
          variant="secondary"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}