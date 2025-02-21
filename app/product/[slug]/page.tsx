import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductInfoByid, ProductInfo } from "@/api/ShopPageApi";
import ProductDetailClient from "@/components/ClientSideComponent/SingleProductPageComponent/ProductDetailClient";
type Props = {
  params: Promise<{ slug: string }>;
};
// Helper: Extract product id from slug (expects slug like "product-name-5")
const extractProductId = async (
  slugPromise: Promise<string>
): Promise<number | null> => {
  const slug = await slugPromise;
  const parts = slug.split("-");
  const idString = parts[parts.length - 1];
  const id = Number.parseInt(idString, 10);
  return isNaN(id) ? null : id;
};
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const productId = await extractProductId(Promise.resolve(slug));
  const product: ProductInfo = await getProductInfoByid(Number(productId));
  if (!product) {
    notFound();
  }
  return <ProductDetailClient product={product} />;
}
