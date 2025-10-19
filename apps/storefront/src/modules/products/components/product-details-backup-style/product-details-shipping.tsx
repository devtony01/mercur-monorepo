import ProductPageAccordion from "./product-page-accordion"

export default function ProductDetailsShipping() {
  return (
    <ProductPageAccordion
      heading="Shipping & Returns"
      defaultOpen={false}
    >
      <div className="product-details space-y-4 text-sm text-gray-600">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
          <ul className="space-y-1">
            <li>• Free shipping on orders over $50</li>
            <li>• Standard delivery: 3-5 business days</li>
            <li>• Express delivery: 1-2 business days</li>
            <li>• International shipping available</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Returns Policy</h4>
          <ul className="space-y-1">
            <li>• 30-day return policy</li>
            <li>• Items must be in original condition</li>
            <li>• Free returns for defective items</li>
            <li>• Return shipping costs may apply</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
          <ul className="space-y-1">
            <li>• Follow care label instructions</li>
            <li>• Machine wash cold</li>
            <li>• Do not bleach</li>
            <li>• Tumble dry low</li>
          </ul>
        </div>
      </div>
    </ProductPageAccordion>
  )
}