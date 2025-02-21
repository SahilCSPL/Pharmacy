"use client";

import { useEffect, useState } from "react";
import ProductSlider from "./ProductSlider";
import { getCategoryWiseProducts } from "@/api/ShopPageApi";
import { Product } from "../ShopPageComponent.tsx/type";

// type Product = {
//   id: number;
//   name: string;
//   images: string[];
//   category_name: string;
//   base_price: number;
//   selling_price: number;
//   base_and_selling_price_difference_in_percent: number;
//   stock: number;
//   tags: string[];
// };

type ProductSectionProps = {
  category_id: string;
  title: string;
  bgImage: string;
  contentPosition: string;
};

export default function ProductSection({
  category_id,
  title,
  bgImage,
  contentPosition,
}: ProductSectionProps) {
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productList = await getCategoryWiseProducts(category_id);
        setProductData(productList?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category_id]);

  if (loading) return <p>Loading...</p>;

  return (
    <section
      className="w-full bg-cover bg-end md:bg-center py-4 lg:py-5"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bgImage})`,
      }}
    >
      <div
        className={`container mx-auto flex items-stretch h-full ${
          contentPosition === "start"
            ? "justify-start"
            : contentPosition === "end"
            ? "justify-end"
            : "justify-center"
        }`}
      >
        <div className="w-full md:w-2/3">
          <ProductSlider products={productData} title={title} />
        </div>
      </div>
    </section>
  );
}
