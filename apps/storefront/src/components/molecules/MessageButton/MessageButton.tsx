"use client"

import { Badge } from "@components/atoms"
import { MessageIcon } from "@icons"
import LocalizedClientLink from "../LocalizedLink/LocalizedLink"

export const MessageButton = () => {
  // For now, we'll use a simple state or could integrate with TalkJS later
  const unreads = [] // This could be replaced with actual unread message logic

  return (
    <LocalizedClientLink href="/account/messages" className="relative">
      <MessageIcon size={20} />
      {Boolean(unreads?.length) && (
        <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0">
          {unreads?.length}
        </Badge>
      )}
    </LocalizedClientLink>
  )
}