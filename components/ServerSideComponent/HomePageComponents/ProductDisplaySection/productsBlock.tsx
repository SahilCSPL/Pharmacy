import { getCategoryWiseProducts } from "@/api/ShopPageApi"
import { ProductsBlock } from "@/components/ClientSideComponent/HomePageComponents/ProductDisplaySection/productsBlock"

interface ProductSectionProps {
  category_id: string
  title: string
  bgImage: string
  contentPosition: string
}

export default async function ProductSection({ category_id, title, bgImage, contentPosition }: ProductSectionProps) {
  // Server-side data fetching
  const productList = await getCategoryWiseProducts(category_id).catch((error) => {
    console.error("Error fetching products:", error)
    return { products: [] }
  })

  return (
    <ProductsBlock
      products={productList?.products || []}
      title={title}
      bgImage={bgImage}
      contentPosition={contentPosition}
    />
  )
}

