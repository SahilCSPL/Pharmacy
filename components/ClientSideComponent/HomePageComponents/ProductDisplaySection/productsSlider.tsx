"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { useRef, useState } from "react"
import { Navigation } from "swiper/modules"
import type { NavigationOptions } from "swiper/types"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import { Product } from "../../ShopPageComponent.tsx/type"
import ProductCard from "./productCard"

interface ProductSliderProps {
  products: Product[]
  title: string
}

export default function ProductSlider({ products, title }: ProductSliderProps) {
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <div className="flex justify-between items-center mx-3">
        <h2 className="text-[20px] lg:text-[35px] text-white font-bold">{title}</h2>
        <div className="flex space-x-3 mb-2">
          <button
            ref={prevRef}
            disabled={isBeginning}
            className={`bg-white py-1 lg:py-2 px-2 lg:px-4 shadow-md hover:bg-gray-200 transition ${
              isBeginning ? "opacity-50 cursor-not-allowed bg-gray-200" : ""
            }`}
            aria-label="Previous Slide"
          >
            <i className="fa-solid fa-chevron-left text-gray-700"></i>
          </button>
          <button
            ref={nextRef}
            disabled={isEnd}
            className={`bg-white py-1 lg:py-2 px-2 lg:px-4 shadow-md hover:bg-gray-200 transition ${
              isEnd ? "opacity-50 cursor-not-allowed bg-gray-200" : ""
            }`}
            aria-label="Next Slide"
          >
            <i className="fa-solid fa-chevron-right text-gray-700"></i>
          </button>
        </div>
      </div>
      <Swiper
        slidesPerView={4}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
          1320: { slidesPerView: 4 },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // Ensure the refs are available before assigning
          if (
            prevRef.current &&
            nextRef.current &&
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            ;(swiper.params.navigation as NavigationOptions).prevEl = prevRef.current
            ;(swiper.params.navigation as NavigationOptions).nextEl = nextRef.current
          }
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning)
          setIsEnd(swiper.isEnd)
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

