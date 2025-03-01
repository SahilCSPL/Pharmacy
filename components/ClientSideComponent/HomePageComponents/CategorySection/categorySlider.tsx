"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import Link from "next/link"
import Image from "next/image"

// Import Swiper styles
import "swiper/css"
import "swiper/css/autoplay"
import { Category } from "../../ShopPageComponent.tsx/type"

const headingBackgroundColors = ["#FCE4EC", "#E3F2FD", "#E8F5E9", "#FFF3E0", "#F3E5F5", "#FFEBEE", "#F0F4C3", "#D1C4E9"]

const headingColors = ["#C2185B", "#1565C0", "#2E7D32", "#E65100", "#6A1B9A", "#C62828", "#827717", "#4527A0"]

interface CategorySliderClientProps {
  categories: Category[]
}

export function CategorySlider({ categories }: CategorySliderClientProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="category-slider container mx-auto py-5 lg:py-10">
        <h2 className="text-[20px] lg:text-[35px] text-[--textColor] text-center font-bold">Shop by Category</h2>
        <p className="text-center text-gray-500 mt-4">No categories available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="category-slider container mx-auto py-5 lg:py-10">
      <div>
        <h2 className="text-[20px] lg:text-[35px] text-[--textColor] text-center font-bold">Shop by Category</h2>
      </div>
      <Swiper
        slidesPerView={4}
        spaceBetween={5}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
        breakpoints={{
          320: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1320: { slidesPerView: 6 },
        }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={category.id} className="my-3">
            <Link href={`/category?category_id=${category.id}`}>
              <div
                className="border-[1px] rounded-[5px] mx-1 lg:mx-2 hover:shadow-md transition-transform duration-300 transform"
                style={{
                  borderColor: headingColors[index % headingColors.length],
                }}
              >
                <div
                  className="h-[80px] lg:h-[100px] rounded-tl-[5px] rounded-tr-[5px] rounded-br-[35%] rounded-bl-[35%]"
                  style={{
                    backgroundColor: headingBackgroundColors[index % headingBackgroundColors.length],
                  }}
                >
                  <h3
                    className="text-center font-bold text-sm lg:text-base xl:text-xl pt-[20px] lg:pt-[30px]"
                    style={{
                      color: headingColors[index % headingColors.length],
                    }}
                  >
                    {category.name}
                  </h3>
                </div>
                <div className="category-image h-[130px] lg:h-[180px] mx-1 pb-1">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="w-full h-[100%] object-contain rounded-md hover:scale-105 transition-transform duration-300 transform"
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

