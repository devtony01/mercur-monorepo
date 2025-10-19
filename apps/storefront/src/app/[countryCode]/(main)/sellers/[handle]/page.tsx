import { SellerTabs } from "@components/organisms"
import { SellerPageHeader } from "@components/sections"
import { retrieveCustomer } from "@lib/data/customer"
import { getRegion } from "@lib/data/regions"
import { getSellerByHandle } from "@lib/data/seller"
import { SellerProps } from "@types/seller"

export default async function SellerPage({
  params,
}: {
  params: Promise<{ handle: string; countryCode: string }>
}) {
  const { handle, countryCode } = await params

  const seller = (await getSellerByHandle(handle)) as SellerProps

  const user = await retrieveCustomer()

  const currency_code = (await getRegion(countryCode))?.currency_code || "usd"

  const tab = "products"

  if (!seller) {
    return null
  }

  return (
    <main className="container">
      <SellerPageHeader header seller={seller} user={user} />
      <SellerTabs
        tab={tab}
        seller_id={seller.id}
        seller_handle={seller.handle}
        locale={countryCode}
        currency_code={currency_code}
      />
    </main>
  )
}