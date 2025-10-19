"use client"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import { LogoutButton } from "@components/atoms"
import { ProfileIcon, HeartIcon, MessageIcon, SearchIcon, CartIcon } from "@icons"
import { Divider } from "@medusajs/ui"
import { usePathname } from "next/navigation"

const accountNavLinks = [
  {
    name: "Profile",
    href: "/account/profile",
    icon: ProfileIcon,
  },
  {
    name: "Addresses",
    href: "/account/addresses",
    icon: SearchIcon,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: CartIcon,
  },
  {
    name: "Bookings",
    href: "/account/bookings",
    icon: MessageIcon,
  },
  {
    name: "Wishlist",
    href: "/account/wishlist",
    icon: HeartIcon,
  },
]

export const UserNavigation = () => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-y-4">
      {accountNavLinks.map((item) => {
        const isActive = pathname === item.href
        const IconComponent = item.icon
        return (
          <LocalizedClientLink
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 text-base-regular transition-colors duration-150 ${
              isActive
                ? "text-ui-fg-base font-semibold"
                : "text-ui-fg-subtle hover:text-ui-fg-base"
            }`}
          >
            <IconComponent size={20} />
            {item.name}
          </LocalizedClientLink>
        )
      })}
      <Divider className="my-4" />
      <div className="flex flex-col gap-y-4">
        <LogoutButton />
      </div>
    </div>
  )
}