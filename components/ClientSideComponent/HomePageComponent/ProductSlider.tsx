"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import ProductCard from "../../ServerSideComponent/HomePageComponent/ProductCard";
import { Product } from "../ShopPageComponent.tsx/type";

// type Product = {
//   id: number;
//   name: string;
//   images: string[];
//   category_name: string;
//   base_price: number;
//   selling_price: number;
//   base_and_selling_price_difference_in_percent: number;
//   stock: number;
//   tags: string[];
// };

type ProductSliderProps = {
  products: Product[];
  title: string;
};

export default function ProductSlider({ products, title }: ProductSliderProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mx-3">
        <h2 className="text-[20px] lg:text-[35px] text-white font-bold">
          {title}
        </h2>
        <div className="flex space-x-3 mb-2">
          <button
            disabled={isBeginning}
            className={`swiper-button-prev-custom bg-white py-1 lg:py-2 px-2 lg:px-4 shadow-md hover:bg-gray-200 transition ${
              isBeginning ? "opacity-50 cursor-not-allowed bg-gray-200" : ""
            }`}
            aria-label="Previous Slide"
          >
            <i className="fa-solid fa-chevron-left text-gray-700"></i>
          </button>
          <button
            disabled={isEnd}
            className={`swiper-button-next-custom bg-white py-1 lg:py-2 px-2 lg:px-4 shadow-md hover:bg-gray-200 transition ${
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
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
          1320: { slidesPerView: 4 },
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
