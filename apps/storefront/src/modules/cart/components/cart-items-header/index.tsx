import { Divider } from "@medusajs/ui"
import { format } from "date-fns"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

interface Seller {
  id: string
  name: string
  photo?: string
  created_at?: Date | string
  handle?: string
}

interface CartItemsHeaderProps {
  seller: Seller
}

export default function CartItemsHeader({ seller }: CartItemsHeaderProps) {
  return (
    <LocalizedClientLink href={`/sellers/${seller.handle || seller.id}`}>
      <div className="border rounded-sm p-4 flex gap-4 items-center">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {seller.photo ? (
            <Image
              src={seller.photo}
              alt={seller.name}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {seller.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="lg:flex gap-2">
          <p className="uppercase text-sm font-semibold">{seller.name}</p>
          {seller.id !== "default" && seller.created_at && (
            <div className="flex items-center gap-2">
              <Divider orientation="vertical" className="h-4" />
              <p className="text-sm text-gray-600">
                Joined: {format(new Date(seller.created_at), "yyyy-MM-dd")}
              </p>
            </div>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}