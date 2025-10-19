import { Button } from "@medusajs/ui"
import Image from "next/image"
import Link from "next/link"

export default function BannerSection() {
  return (
    <section className="bg-ui-bg-subtle container text-ui-fg-base">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="py-6 px-6 flex flex-col h-full justify-between border border-ui-border-base rounded-md">
          <div className="mb-8 lg:mb-48">
            <span className="text-sm inline-block px-4 py-1 border border-ui-border-base rounded-md bg-ui-bg-base">
              #COLLECTION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              BOHO VIBES: WHERE COMFORT MEETS CREATIVITY
            </h2>
            <p className="text-lg text-ui-fg-subtle max-w-lg">
              Discover boho styles that inspire adventure and embrace the beauty
              of the unconventional.
            </p>
          </div>
          <Link href="/collections/boho">
            <Button size="large" variant="secondary" className="w-fit">
              EXPLORE
            </Button>
          </Link>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full flex justify-end rounded-md">
          <Image
            loading="lazy"
            fetchPriority="high"
            src="/images/banner-section/Image.jpg"
            alt="Boho fashion collection - Model wearing a floral dress with yellow boots"
            width={700}
            height={600}
            className="object-cover object-top rounded-md"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}