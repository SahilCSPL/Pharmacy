// components/testimonial/TestimonialsSlider.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
// import "swiper/css/navigation";
import { Testimonial } from "../../ServerSideComponent/HomePageComponent/TestimonialSection";
import TestimonialCard from "../../ServerSideComponent/HomePageComponent/TestimonialCard";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({
  testimonials,
}) => {
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={3}
      loop={true}
      autoplay={{ delay: 5000 }}
      modules={[Autoplay, Pagination]}
      pagination={{
        clickable: true,
      }}
      breakpoints={{
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        // 1320: { slidesPerView: 4 },
      }}
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.id}>
          <TestimonialCard testimonial={testimonial} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonialsSlider;
