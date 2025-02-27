"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Product } from "../ShopPageComponent.tsx/type";
import ProductCard from "@/components/ServerSideComponent/HomePageComponent/ProductCard";

type RelatedProductsProps = {
  relatedProducts: Product[];
  currentProductId: number;
  categoryName?: string;
};

export default function RelatedProducts({
  relatedProducts,
  currentProductId,
  categoryName,
}: RelatedProductsProps) {
  // Optionally filter out the current product
  const filteredProducts = relatedProducts.filter(
    (product) => product.id !== currentProductId
  );

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 container mx-auto mb-5">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 mx-3">
        More products from {categoryName ? categoryName : "this category"}
      </h2>
      <Swiper
        spaceBetween={10}
        slidesPerView={5}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {filteredProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
