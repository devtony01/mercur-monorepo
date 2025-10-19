import { Badge } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

export const ProductTags = ({
  tags,
}: {
  tags: HttpTypes.StoreProductTag[]
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map(({ id, value }) => (
        <Badge key={id} variant="secondary" size="small">
          {value}
        </Badge>
      ))}
    </div>
  )
}