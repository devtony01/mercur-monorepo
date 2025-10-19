import { defineLink } from '@medusajs/framework/utils'
import ProductModule from '@medusajs/medusa/product'

import Taxcode from '@mercurjs/taxcode'

// Using product instead of productCategory since productCategory linkable is not available
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true
  },
  Taxcode.linkable.taxCode
)
