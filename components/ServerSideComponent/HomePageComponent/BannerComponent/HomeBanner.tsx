"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import { Banner, getBanners } from "@/api/homePageApi";
import { useEffect, useState } from "react";

const styling1 = [
  "text-center md:w-1/2",
  "md:w-1/2 text-center md:text-left",
  "md:w-1/2 text-center md:text-left",
];

const styling2 = ["", "md:w-1/2", "md:w-1/2"];

const styling3 = ["justify-center", "", ""];

const styling4 = ["", "md:block", "md:block"];

export default function HomeBanner() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        // Assuming the API returns { results: Banner[] }
        setBanners(data.results);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const handleShop = () => {
    router.push("/shop");
  };

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] banner-section">
      {banners.length > 0 && (
        <Swiper
          observer={true}
          observeParents={true}
          observeSlideChildren={true}
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ clickable: true }}
          navigation={true}
          className="w-full h-full"
        >
          {banners.map((slide, index) => (
            <SwiperSlide key={slide.sequence_number}>
              <div
                className="relative w-full h-[400px] lg:h-[500px] bg-cover bg-center flex items-center"
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${slide.image})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>

                {/* Content */}
                <div
                  className={`flex w-full container max-w-7xl mx-auto pl-4 ${
                    styling3[index % styling3.length]
                  }`}
                >
                  <div
                    className={`relative z-10 w-full ${
                      styling1[index % styling1.length]
                    }`}
                  >
                    <p className="text-base lg:text-lg mt-4 text-white">
                      💊 {slide.description}
                    </p>
                    <h1 className="font-bold text-3xl md:text-4xl xl:text-7xl mt-4 leading-[1.2] sm:leading-[1.3] xl:leading-[1.1] text-white">
                      {slide.heading}
                    </h1>
                    <div
                      className={`flex justify-center ${
                        styling4[index % styling4.length]
                      }`}
                    >
                      <button
                        onClick={handleShop}
                        className="mt-6 custom-pill-btn"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                  <div
                    className={`dummy ${styling2[index % styling2.length]}`}
                  ></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
