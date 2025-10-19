import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { Carousel } from "@components/molecules"

type TrendingProductsProps = {
  heading: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

export default function TrendingProducts({ 
  heading, 
  products, 
  region 
}: TrendingProductsProps) {
  return (
    <section className="py-8 w-full">
      <h2 className="mb-6 heading-lg font-bold tracking-tight uppercase">
        {heading}
      </h2>
      <div className="flex justify-center w-full">
        <Carousel
          align="start"
          items={products.slice(0, 4).map((product) => (
            <div key={product.id} className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4">
              <ProductPreview
                product={product}
                region={region}
                isFeatured
              />
            </div>
          ))}
        />
      </div>
    </section>
  )
}