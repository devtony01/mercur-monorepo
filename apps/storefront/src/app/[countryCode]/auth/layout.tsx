import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import Image from "next/image"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ui-bg-subtle flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <LocalizedClientLink href="/">
            <Image
              src="/Logo.svg"
              width={126}
              height={40}
              alt="Logo"
              priority
            />
          </LocalizedClientLink>
        </div>
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {props.children}
        </div>
      </div>
    </div>
  )
}