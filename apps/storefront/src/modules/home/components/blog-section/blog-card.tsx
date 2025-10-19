import Image from "next/image"
import Link from "next/link"

type BlogPost = {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  href: string
}

type BlogCardProps = {
  post: BlogPost
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  return (
    <Link
      href={post.href}
      className="group block transition-transform hover:scale-[1.02]"
    >
      <article className="h-full">
        <div className="relative overflow-hidden rounded-sm mb-4">
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={300}
            className="w-full h-64 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary px-3 py-1 label-sm rounded-full">
              {post.category}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="heading-sm text-tertiary group-hover:text-action transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-secondary text-md line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </article>
    </Link>
  )
}