import ProductPageAccordion from "./product-page-accordion"

interface ProductPageDetailsProps {
  details: string
}

export default function ProductPageDetails({ details }: ProductPageDetailsProps) {
  if (!details) return null

  return (
    <ProductPageAccordion heading="Product details" defaultOpen={false}>
      <div
        className="product-details prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: details }}
      />
    </ProductPageAccordion>
  )
}