import HomeBanner from "@/components/ServerSideComponent/HomePageComponents/BannerSection/banner"
import BannerSkeleton from "@/components/ServerSideComponent/HomePageComponents/BannerSection/BannerSkeleton"
import BlogSection from "@/components/ServerSideComponent/HomePageComponents/BlogSection/blogs"
import Brands from "@/components/ServerSideComponent/HomePageComponents/BrandsSection/brands"
import Category from "@/components/ServerSideComponent/HomePageComponents/CategorySection/category"
import ProductSection from "@/components/ServerSideComponent/HomePageComponents/ProductDisplaySection/productsBlock"
import SubCategories from "@/components/ServerSideComponent/HomePageComponents/SubcategorySection/subcategory"
import TestimonialSection from "@/components/ServerSideComponent/HomePageComponents/TestimonialSection/testimonials"
import { LoadingSpinner } from "@/components/ServerSideComponent/UI/loadingSpinner"
import { Suspense } from "react"


export default function Home() {
  return (
    <main>
      <Suspense fallback={<BannerSkeleton />}>
        <HomeBanner />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Category />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ProductSection
          category_id="84"
          title="Glow with the Best Skincare!"
          bgImage="/background/skin-care.webp"
          contentPosition="end"
        />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <SubCategories />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ProductSection
          category_id="52"
          title="Nature's Healing Touch!"
          bgImage="/background/ayurved.webp"
          contentPosition="start"
        />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <TestimonialSection />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Brands />
      </Suspense>
    </main>
  )
}



