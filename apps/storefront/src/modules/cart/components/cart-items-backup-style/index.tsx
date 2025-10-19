import { HttpTypes } from "@medusajs/types"
import CartItemsHeader from "../cart-items-header"
import CartItemsProducts from "../cart-items-products"
import CartItemsFooter from "../cart-items-footer"
import EmptyCartMessage from "../empty-cart-message"

interface CartItemsBackupStyleProps {
  cart: HttpTypes.StoreCart | null
}

export default function CartItemsBackupStyle({ cart }: CartItemsBackupStyleProps) {
  if (!cart) return null

  const groupedItems: any = groupItemsBySeller(cart)

  if (!Object.keys(groupedItems).length) return <EmptyCartMessage />

  return (
    <div>
      {Object.keys(groupedItems).map((key) => (
        <div key={key} className="mb-4">
          <CartItemsHeader seller={groupedItems[key]?.seller} />
          <CartItemsProducts
            products={groupedItems[key].items || []}
            currency_code={cart.currency_code}
          />
          <CartItemsFooter
            currency_code={cart.currency_code}
            price={cart.shipping_total}
          />
        </div>
      ))}
    </div>
  )
}

function groupItemsBySeller(cart: HttpTypes.StoreCart) {
  const groupedBySeller: any = {}

  cart.items?.forEach((item: any) => {
    const seller = item.product?.seller
    if (seller) {
      if (!groupedBySeller[seller.id]) {
        groupedBySeller[seller.id] = {
          seller: seller,
          items: [],
        }
      }
      groupedBySeller[seller.id].items.push(item)
    } else {
      if (!groupedBySeller["default"]) {
        groupedBySeller["default"] = {
          seller: {
            name: "Store",
            id: "default",
            photo: "/logo.svg",
            created_at: new Date(),
          },
          items: [],
        }
      }
      groupedBySeller["default"].items.push(item)
    }
  })

  return groupedBySeller
}