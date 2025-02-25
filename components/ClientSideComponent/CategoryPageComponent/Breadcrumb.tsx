import Link from "next/link"
import type { Category } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type"

interface BreadcrumbProps {
  category: Category
}

export default function Breadcrumb({ category }: BreadcrumbProps) {
  return (
    <nav className="text-sm mb-4">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Home
          </Link>
          <span className="mx-2">/</span>
        </li>
        <li className="flex items-center">
          <span className="text-gray-500">{category.name}</span>
        </li>
      </ol>
    </nav>
  )
}

