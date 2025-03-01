import { getAllCategories } from "@/api/ShopPageApi"
import { SubCategoryTab } from "@/components/ClientSideComponent/HomePageComponents/SubCategorySection/subCategoryTab"

export default async function SubCategories() {
  // Server-side data fetching
  const data = await getAllCategories().catch((error) => {
    console.error("Error fetching categories:", error)
    return { product_categories: [] }
  })

  return <SubCategoryTab categories={data.product_categories} />
}

