import { getBanners } from "@/api/homePageApi"
import { BannerSlider } from "@/components/ClientSideComponent/HomePageComponents/BannerSection/bannerSlider"

export default async function HomeBanner() {
  // Server-side data fetching
  const data = await getBanners().catch((error) => {
    console.error("Error fetching banners:", error)
    return { results: [] }
  })

  return <BannerSlider banners={data.results} />
}

