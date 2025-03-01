import { getAllCategories } from "@/api/ShopPageApi"
import { CategorySlider } from "@/components/ClientSideComponent/HomePageComponents/CategorySection/categorySlider"

export default async function Category() {
  // Server-side data fetching
  const data = await getAllCategories().catch((error) => {
    console.error("Error fetching categories:", error)
    return { product_categories: [] }
  })

  return <CategorySlider categories={data.product_categories} />
}

