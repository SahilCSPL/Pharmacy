"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { getAllCategories } from "@/api/ShopPageApi";
import { Category } from "../ShopPageComponent.tsx/type";
import Link from "next/link";

const headingBackgroundColors = [
  "#FCE4EC",
  "#E3F2FD",
  "#E8F5E9",
  "#FFF3E0",
  "#F3E5F5",
  "#FFEBEE",
  "#F0F4C3",
  "#D1C4E9",
];
const headingColors = [
  "#C2185B",
  "#1565C0",
  "#2E7D32",
  "#E65100",
  "#6A1B9A",
  "#C62828",
  "#827717",
  "#4527A0",
];

export default function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data.product_categories);
        setLoading(false);
      } catch (error) {
        setError("Error fetching categories. Please try again later.");
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="category-slider container mx-auto py-5 lg:py-10">
      <div>
        <h2 className="text-[20px] lg:text-[35px] text-[--mainColor] text-center font-bold mb-3 lg:mb-4">
          Shop by Category
        </h2>
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
        <div className="">
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
                    backgroundColor:
                      headingBackgroundColors[
                        index % headingBackgroundColors.length
                      ],
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
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
                    alt={category.name}
                    className="w-full h-[100%] object-contain rounded-md hover:scale-105 transition-transform duration-300 transform"
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
        </div>
      </Swiper>
    </div>
  );
}
