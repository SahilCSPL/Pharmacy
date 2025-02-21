// app/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductInfoByid, ProductInfo } from "@/api/ShopPageApi";
import ProductDetailClient from "@/components/ClientSideComponent/SingleProductPageComponent/ProductDetailClient";

// Helper: Extract product id from slug (expects slug like "product-name-5")
const extractProductId = (slug: string): number | null => {
  const parts = slug.split("-");
  const idString = parts[parts.length - 1];
  const id = parseInt(idString, 10);
  return isNaN(id) ? null : id;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const productId = extractProductId(params.slug);
  if (!productId) return { title: "Product Not Found" };

  const product = await getProductInfoByid(productId);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    icons: {
      icon: "/favicon.png",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const productId = extractProductId(params.slug);
  if (!productId) {
    notFound();
  }
  const product: ProductInfo = await getProductInfoByid(productId);
  if (!product) {
    notFound();
  }
  return <ProductDetailClient product={product} />;
}
