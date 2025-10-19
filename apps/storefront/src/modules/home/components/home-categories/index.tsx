import { Carousel } from "@components/molecules"
import { CategoryCard } from "@components/organisms"
import { HttpTypes } from "@medusajs/types"

const defaultCategories = [
  {
    id: 1,
    name: "Sneakers",
    handle: "sneakers",
  },
  {
    id: 2,
    name: "Sandals",
    handle: "sandals",
  },
  {
    id: 3,
    name: "Boots",
    handle: "boots",
  },
  {
    id: 4,
    name: "Sport",
    handle: "sport",
  },
  {
    id: 5,
    name: "Accessories",
    handle: "accessories",
  },
]

type HomeCategoriesProps = {
  heading: string
  categories?: HttpTypes.StoreProductCategory[]
}

export default function HomeCategories({ 
  heading, 
  categories = defaultCategories as any 
}: HomeCategoriesProps) {
  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      />
    </section>
  )
}