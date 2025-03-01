"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import Image from "next/image"

// Import Swiper styles
import "swiper/css"
import "swiper/css/autoplay"

interface Brand {
  id: number
  name: string
  image: string
}

interface BrandsClientProps {
  brandList: Brand[]
}

export function BrandsClient({ brandList }: BrandsClientProps) {
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
            1320: { slidesPerView: 5 },
          }}
        >
          {brandList.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div className="brand-item text-center h-[100px] flex items-center border p-3 mx-1">
                <Image
                  src={brand.image || "/placeholder.svg"}
                  alt={brand.name}
                  width={200}
                  height={100}
                  className="brand-image mx-auto object-contain h-[100%]"
                  onError={(e) => {
                    // TypeScript doesn't allow direct assignment to currentTarget.src
                    const target = e.target as HTMLImageElement
                    target.src = "/brands/default.png"
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

