"use client"

import { Product } from "../../ShopPageComponent.tsx/type"
import ProductSlider from "./productsSlider"

interface ProductSectionClientProps {
  products: Product[]
  title: string
  bgImage: string
  contentPosition: string
}

export function ProductsBlock({ products, title, bgImage, contentPosition }: ProductSectionClientProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section
      className="w-full bg-cover bg-end md:bg-center py-4 lg:py-5"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bgImage})`,
      }}
    >
      <div
        className={`container mx-auto flex items-stretch h-full ${
          contentPosition === "start" ? "justify-start" : contentPosition === "end" ? "justify-end" : "justify-center"
        }`}
      >
        <div className="w-full lg:w-2/3">
          <ProductSlider products={products} title={title} />
        </div>
      </div>
    </section>
  )
}

