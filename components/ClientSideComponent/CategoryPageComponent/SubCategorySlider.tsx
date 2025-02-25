import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import type { ChildCategory } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import Image from "next/image";

interface SubCategorySliderProps {
  subCategories: ChildCategory[];
  onSubCategoryClick: (subCategoryId: string) => void;
}

export default function SubCategorySlider({
  subCategories,
  onSubCategoryClick,
}: SubCategorySliderProps) {
  return (
    <div className="mb-5">
      {/* <h2 className="text-2xl font-bold mb-4 p-2 bg-[--mainColor] text-white">Sub Categories</h2> */}
      <Swiper
        slidesPerView={4}
        spaceBetween={5}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {subCategories.map((subCategory) => (
          <SwiperSlide key={subCategory.id}>
            <div
              className="cursor-pointer p-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => onSubCategoryClick(subCategory.id.toString())}
            >
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${subCategory.image}`}
                  alt={subCategory.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <p className="mt-2 text-center font-semibold">
                {subCategory.name}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
