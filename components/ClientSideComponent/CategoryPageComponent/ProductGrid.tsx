"use client";
import type { Product } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import ProductCard from "@/components/ServerSideComponent/HomePageComponent/ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
