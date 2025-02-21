// app/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductInfoByid, ProductInfo } from "@/api/ShopPageApi";
import ProductDetailClient from "@/components/ClientSideComponent/SingleProductPageComponent/ProductDetailClient";

// Define the expected type for the `params` prop
interface ProductPageProps {
  params: { slug: string };
}

// Helper: Extract product ID from slug (expects slug like "product-name-5")
const extractProductId = (slug: string): number | null => {
  const parts = slug.split("-");
  const idString = parts[parts.length - 1];
  const id = parseInt(idString, 10);
  return isNaN(id) ? null : id;
};

// ✅ Generate Metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
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

// ✅ Main Product Page Component
export default async function ProductPage({ params }: ProductPageProps) {
  const productId = extractProductId(params.slug);
  if (!productId) return notFound();

  const product: ProductInfo | null = await getProductInfoByid(productId);
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
