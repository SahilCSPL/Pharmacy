"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    title: "Your Trusted Online Pharmacy",
    subtitle: "Order medicines easily with doorstep delivery",
    image: "/new-banner-2.webp",
    styling: "text-center md:w-1/2", // Ensure this exists in your public folder
    styling2: "",
    styling3: "justify-center",
    styling4: "",
  },
  {
    id: 2,
    title: "Exclusive Discounts on Medicines",
    subtitle: "Get up to 30% off on selected products",
    image: "/new-banner-1.webp", // Use a valid image
    styling: "md:w-1/2 text-center md:text-left",
    styling2: "md:w-1/2",
    styling3: "",
    styling4: "md:block",
  },
  {
    id: 3,
    title: "Safe & Secure Medicine Delivery",
    subtitle: "We ensure 100% authenticity in all products",
    image: "/new-banner-33.webp",
    styling: "md:w-1/2 text-center md:text-left",
    styling2: "md:w-1/2",
    styling3: "",
    styling4: "md:block",
  },
];

export default function HomeBanner() {
  const router = useRouter();

  const handleShop = () => {
    router.push("/shop");
  };
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] banner-section">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        effect="fade"
        fadeEffect={{ crossFade: true }} // Ensures smooth fade transition
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative w-full h-[400px] lg:h-[500px] bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>

              {/* Content */}
              <div
                className={`flex w-full container max-w-7xl mx-auto pl-4 ${slide.styling3}`}
              >
                <div className={`relative z-10  w-full ${slide.styling}`}>
                  <p className="text-base lg:text-lg mt-4 text-white">
                    💊 {slide.subtitle}
                  </p>
                  <h1 className="font-bold text-3xl md:text-4xl xl:text-7xl mt-4 leading-[1.2] sm:leading-[1.3] xl:leading-[1.1] text-white">
                    {slide.title}
                  </h1>
                  <div className={`flex justify-center ${slide.styling4}`}>
                    <button
                      onClick={handleShop}
                      className="mt-6 custom-pill-btn"
                    >
                      Shop Now{" "}
                    </button>
                  </div>
                </div>
                <div className={`dummy ${slide.styling2}`}></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
