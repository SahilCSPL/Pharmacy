"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Banner } from "@/api/homePageApi"

// Import Swiper styles
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"
import "swiper/css/navigation"

const styling1 = ["text-center md:w-1/2", "md:w-1/2 text-center md:text-left", "md:w-1/2 text-center md:text-left"]

const styling2 = ["", "md:w-1/2", "md:w-1/2"]

const styling3 = ["justify-center", "", ""]

const styling4 = ["", "md:block", "md:block"]

interface BannerClientProps {
  banners: Banner[]
}

export function BannerSlider({ banners }: BannerClientProps) {
  const router = useRouter()

  const handleShop = () => {
    router.push("/shop")
  }

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] banner-section">
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
            <div className="relative w-full h-[400px] lg:h-[500px]">
              {/* Optimized image with priority for the first slide */}
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${slide.image}`}
                alt={slide.heading}
                fill
                priority={index === 0} // First slide is critical
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              {/* Added flex and items-center to vertically center content */}
              <div className={`flex items-center w-full h-[400px] lg:h-[500px] container max-w-7xl mx-auto pl-4 ${styling3[index % styling3.length]}`}>
                <div className={`relative z-10 w-full ${styling1[index % styling1.length]}`}>
                  <p className="text-base lg:text-lg mt-4 text-white">💊 {slide.description}</p>
                  <h1 className="font-bold text-3xl md:text-4xl xl:text-7xl mt-4 leading-[1.2] sm:leading-[1.3] xl:leading-[1.1] text-white">
                    {slide.heading}
                  </h1>
                  <div className={`flex justify-center ${styling4[index % styling4.length]}`}>
                    <button onClick={handleShop} className="mt-6 custom-pill-btn" aria-label="Shop Now">
                      Shop Now
                    </button>
                  </div>
                </div>
                <div className={`dummy ${styling2[index % styling2.length]}`}></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
