import Brands2 from "@/components/ClientSideComponent/HomePageComponent/Brands2";
import CategorySlider from "@/components/ClientSideComponent/HomePageComponent/CategorySlider";
import OurCategory from "@/components/ClientSideComponent/HomePageComponent/OurCategory";
import ProductSection from "@/components/ClientSideComponent/HomePageComponent/ProductSection";
import HomeBanner from "@/components/ServerSideComponent/HomePageComponent/BannerComponent/HomeBanner";
import BlogSection from "@/components/ServerSideComponent/HomePageComponent/BlogSection";
import TestimonialSection from "@/components/ServerSideComponent/HomePageComponent/TestimonialSection";

export default function Home() {
  return (
    <main>
      {/* <Banner /> */}
      <HomeBanner />
      <CategorySlider />
      <ProductSection
        category_id={52}
        title="Glow with the Best Skincare!"
        bgImage="/background/skin-care-background-banner.jpg"
        contentPosition="end"
      />
      <OurCategory />
      <ProductSection
        category_id={52}
        title="Nature's Healing Touch!"
        bgImage="/background/ayurved.jpg"
        contentPosition="start"
      />
      <BlogSection />
      <TestimonialSection />

      {/* <Brands /> */}
      <Brands2 />
    </main>
  );
}
