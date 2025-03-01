import HomeBanner from "@/components/ServerSideComponent/HomePageComponents/BannerSection/banner"
import BlogSection from "@/components/ServerSideComponent/HomePageComponents/BlogSection/blogs"
import Brands from "@/components/ServerSideComponent/HomePageComponents/BrandsSection/brands"
import Category from "@/components/ServerSideComponent/HomePageComponents/CategorySection/category"
import ProductSection from "@/components/ServerSideComponent/HomePageComponents/ProductDisplaySection/productsBlock"
import SubCategories from "@/components/ServerSideComponent/HomePageComponents/SubcategorySection/subcategory"
import TestimonialSection from "@/components/ServerSideComponent/HomePageComponents/TestimonialSection/testimonials"
import { PharmacySpinner } from "@/components/ServerSideComponent/UI/pharmacySpinner"
import { Suspense } from "react"


export default function Home() {
  return (
    <main>
      <Suspense fallback={<BannerSkeleton />}>
        <HomeBanner />
      </Suspense>

      <Suspense fallback={<PharmacySpinner />}>
        <Category />
      </Suspense>

      <Suspense fallback={<PharmacySpinner />}>
        <ProductSection
          category_id="84"
          title="Glow with the Best Skincare!"
          bgImage="/background/skin-care-background-banner.jpg"
          contentPosition="end"
        />
      </Suspense>

      <Suspense fallback={<PharmacySpinner />}>
        <SubCategories />
      </Suspense>

      <Suspense fallback={<PharmacySpinner />}>
        <ProductSection
          category_id="52"
          title="Nature's Healing Touch!"
          bgImage="/background/ayurved.jpg"
          contentPosition="start"
        />
      </Suspense>

      <Suspense fallback={<PharmacySpinner />}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={<PharmacySpinner />}>
        <TestimonialSection />
      </Suspense>

      <Suspense fallback={<PharmacySpinner />}>
        <Brands />
      </Suspense>
    </main>
  )
}

// Banner skeleton component for better loading UX
function BannerSkeleton() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
      <div className="relative z-10 container max-w-7xl mx-auto flex items-center h-full px-4">
        <div className="w-full md:w-1/2">
          <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-8 bg-gray-300 rounded animate-pulse mb-2 ${
                i === 0 ? "w-full sm:w-3/4" : i === 1 ? "w-5/6 sm:w-2/3" : "w-4/6 sm:w-1/2"
              }`}
            ></div>
          ))}
          <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse mt-4"></div>
        </div>
      </div>
    </div>
  )
}

