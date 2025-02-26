import Image from "next/image"
import type { Category } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type"
import Breadcrumb from "./Breadcrumb"

interface CategoryBannerProps {
  category: Category
}

export default function CategoryBanner({ category }: CategoryBannerProps) {
  return (
    <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${category.banner}`}
        alt={category.name}
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold">{category.name}</h1>
        {/* <Breadcrumb category={category} /> */}
      </div>
    </div>
  )
}

