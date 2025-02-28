import { Suspense } from "react"
import { getAllProducts, getAllCategories } from "@/api/ShopPageApi"
import ShopPageSkeleton from "@/components/ClientSideComponent/ShopPageComponent.tsx/ShopPAgeSkeleton"
import ShopPageClient from "@/components/ClientSideComponent/ShopPageComponent.tsx/ShopPageClient"

export default async function ShopPage() {
  // Fetch data on the server
  const initialProductsData = await getAllProducts()
  const categoriesData = await getAllCategories()

  return (
    <section className="bg-[#f3f3f3]">
      <div
        className="h-[400px] bg-cover bg-center py-5 lg:py-10 flex justify-center items-center flex-col"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background/testimonial-bg.webp)",
        }}
      >
        <h1 className="text-white text-4xl font-bold">Our Products</h1>
      </div>

      <Suspense fallback={<ShopPageSkeleton />}>
        <ShopPageClient
          initialProducts={initialProductsData.products}
          initialCategories={categoriesData.product_categories}
        />
      </Suspense>
    </section>
  )
}

