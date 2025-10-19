import { format } from "date-fns"
import { HttpTypes } from "@medusajs/types"

interface ProductDetailsFooterProps {
  tags?: HttpTypes.StoreProductTag[]
  posted?: string | Date
}

export default function ProductDetailsFooter({ tags, posted }: ProductDetailsFooterProps) {
  return (
    <div className="border rounded-sm p-4 mt-4">
      <div className="space-y-4">
        {tags && tags.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag.value}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {posted && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Posted</h4>
            <p className="text-sm text-gray-600">
              {format(new Date(posted), "MMMM dd, yyyy")}
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 pt-2 border-t">
          <p>Product ID: {Math.random().toString(36).substr(2, 9)}</p>
        </div>
      </div>
    </div>
  )
}