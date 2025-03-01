"use client";
import type { Product } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import Lottie from "lottie-react";
import emptyCategory from "@/public/animation/Animation - 1740491203202.json";
import ProductCard from "../HomePageComponents/ProductDisplaySection/productCard";
interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center border rounded">
        <div className="animation-container mx-auto">
          <Lottie
            animationData={emptyCategory}
            loop={true}
            autoplay={true}
            style={{ height: 500 }} // Customize the size as needed
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 border rounded p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
