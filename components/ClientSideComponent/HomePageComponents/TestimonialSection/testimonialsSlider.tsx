"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/pagination"
import TestimonialCard from "@/components/ServerSideComponent/HomePageComponents/TestimonialSection/testimonialCard"

export interface Testimonial {
  id: number
  image: string
  comment: string
  name: string
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
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
      }}
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.id}>
          <TestimonialCard testimonial={testimonial} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

