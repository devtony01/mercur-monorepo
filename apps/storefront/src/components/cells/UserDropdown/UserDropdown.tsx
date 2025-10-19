"use client"

import {
  Badge,
  LogoutButton,
  NavigationItem,
} from "@components/atoms"
import { Divider } from "@medusajs/ui"
import { Dropdown } from "@components/molecules"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import { ProfileIcon } from "@icons"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

export const UserDropdown = ({
  user,
}: {
  user: HttpTypes.StoreCustomer | null
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <LocalizedClientLink
        href="/account"
        className="relative"
        aria-label="Go to user profile"
      >
        <ProfileIcon size={20} />
      </LocalizedClientLink>
      <Dropdown show={open}>
        {user ? (
          <div className="p-1">
            <div className="lg:w-[200px]">
              <h3 className="uppercase heading-xs border-b p-4">
                Your account
              </h3>
            </div>
            <NavigationItem href="/account/orders">Orders</NavigationItem>
            <NavigationItem href="/account/messages" className="relative">
              Messages
            </NavigationItem>
            <NavigationItem href="/account/returns">Returns</NavigationItem>
            <NavigationItem href="/account/addresses">Addresses</NavigationItem>
            <NavigationItem href="/account/reviews">Reviews</NavigationItem>
            <NavigationItem href="/account/wishlist">Wishlist</NavigationItem>
            <Divider />
            <NavigationItem href="/account/profile">Settings</NavigationItem>
            <LogoutButton />
          </div>
        ) : (
          <div className="p-1">
            <NavigationItem href="/account">Login</NavigationItem>
            <NavigationItem href="/account?view=register">Register</NavigationItem>
          </div>
        )}
      </Dropdown>
    </div>
  )
}