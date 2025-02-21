"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

// Manually list the brands and their image filenames
const brandList = [
  { id: 1, name: "Mama earth", image: "/brands/mama-earth-1.avif" },
  { id: 2, name: "Dabar", image: "/brands/dabur-india-ltd-31.png" },
  { id: 3, name: "Lama", image: "/brands/lama-pharmaceuticals.png" },
  { id: 4, name: "Herbolab", image: "/brands/herbolab.avif" },
  { id: 5, name: "Schwabe", image: "/brands/schwabe.webp" },
  { id: 6, name: "Lord", image: "/brands/lord's-homeopathic.png" },
  { id: 7, name: "pankajakasthuri herbals", image: "/brands/pankajakasthuri-herbals.png"},
  { id: 8, name: "vlcc", image: "/brands/vlcc.svg"}
];

const Brands2 = () => {
  return (
    <div className="brand-slider bg-white">
      <div className="container mx-auto py-[50px]">
        <Swiper
          slidesPerView={5}
          spaceBetween={15}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[Autoplay]}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1320: { slidesPerView: 5},
          }}
        >
          {brandList.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div className="brand-item text-center h-[100px] flex items-center border p-3 mx-1">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="brand-image mx-auto object-contain h-[100%]"
                  onError={(e) => (e.currentTarget.src = "/brands/default.png")} // Fallback image
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Brands2;
