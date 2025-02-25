import Link from "next/link"
import type { Category } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type"

interface CategorySidebarProps {
  categories: Category[]
  currentCategoryId: string
}

export default function CategorySidebar({ categories, currentCategoryId }: CategorySidebarProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <Link
              href={`/category?category_id=${category.id}`}
              className={`block p-2 rounded ${
                category.id === currentCategoryId ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

