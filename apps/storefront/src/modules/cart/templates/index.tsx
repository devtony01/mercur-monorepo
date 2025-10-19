import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/atoms"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import CartItemsBackupStyle from "../components/cart-items-backup-style"
import CartSummaryBackupStyle from "../components/cart-summary-backup-style"
import CartPromotionCode from "../components/cart-promotion-code"
import EmptyCartMessage from "../components/empty-cart-message"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  if (!cart?.items?.length) {
    return (
      <main className="container grid grid-cols-12">
        <div className="col-span-12">
          <EmptyCartMessage />
        </div>
      </main>
    )
  }

  return (
    <main className="container grid grid-cols-12">
      <div className="col-span-12 lg:col-span-6">
        <CartItemsBackupStyle cart={cart} />
      </div>
      <div className="lg:col-span-2"></div>
      <div className="col-span-12 lg:col-span-4">
        <div className="w-full mb-6 border rounded-sm p-4">
          <CartPromotionCode cart={cart} />
        </div>
        <div className="border rounded-sm p-4 h-fit">
          <CartSummaryBackupStyle
            item_total={cart?.subtotal || 0}
            shipping_total={cart?.shipping_total || 0}
            total={cart?.total || 0}
            currency_code={cart?.currency_code || ""}
            tax={cart?.tax_total || 0}
          />
          <LocalizedClientLink href="/checkout">
            <Button className="w-full py-3 flex justify-center items-center">
              Go to checkout
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </main>
  )
}

export default CartTemplate
