import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <PaymentWrapper cart={cart}>
      <main className="container py-8">
        <div className="grid lg:grid-cols-11 gap-8">
          <div className="flex flex-col gap-4 lg:col-span-6">
            <CheckoutForm cart={cart} customer={customer} />
          </div>
          <div className="lg:col-span-5">
            <CheckoutSummary cart={cart} />
          </div>
        </div>
      </main>
    </PaymentWrapper>
  )
}
