import { Category, Product } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import { APICore } from "./APICore";


export const getAllCategories = async () => {
  const data = await APICore<{ product_categories: Category[] }>(
    "/frontend/categories/",
    "GET"
  );
  return data;
};



export const getAllProducts = async () => {
  const data = await APICore<{ products: Product[] }>("/frontend/products/", "GET");
  return data;
}

export const getCategoryWiseProducts = async (categoryId: string) => {
  const data = await APICore<{ products: Product[] }>(
    `/frontend/products/?category=${categoryId}`,
    "GET"
  );
  return data;
};

export const searchProducts = async (search: string) => {
  const endpoint = `/frontend/products/?search=${encodeURIComponent(search)}`;
  const data = await APICore<{ products: Product[] }>(endpoint, "GET");
  return data;
}

export interface ProductVariant {
  id: number;
  specification: Record<string, string>;
  description: string;
  selling_price: string;
  base_and_selling_price_difference_in_percent: string;
  stock: number;
  is_new_arrival: boolean;
  images: string[];
}

export interface ProductInfo {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name: string;
  base_price: string;
  selling_price: string;
  base_and_selling_price_difference_in_percent: string;
  stock: number;
  is_new_arrival: boolean;
  images: string[];
  tags: string[];
  variant_list: ProductVariant[];
}

export const getProductInfoByid = async (id: number): Promise<ProductInfo> => {
  const endpoint = `/frontend/product_info/?product=${id}`;
  const data = await APICore<ProductInfo>(endpoint, "GET");
  return data;
};


