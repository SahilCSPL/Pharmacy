import { APICore } from "@/api/APICore"
import { Category, Product, ProductInfo } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type"

// Server-side data fetching functions
export async function getAllProducts() {
  try {
    const data = await APICore<{ products: Product[] }>("/frontend/products/", "GET")
    return data
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return { products: [] }
  }
}

export async function getCategoryWiseProducts(categoryId: string) {
  try {
    const data = await APICore<{ products: Product[] }>(`/frontend/products/?category=${categoryId}`, "GET")
    return data
  } catch (error) {
    console.error("Failed to fetch category products:", error)
    return { products: [] }
  }
}

export async function getAllCategories() {
  try {
    const data = await APICore<{ product_categories: Category[] }>("/frontend/categories/", "GET")
    return data
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { product_categories: [] }
  }
}



export const searchProducts = async (search: string) => {
  const endpoint = `/frontend/products/?search=${encodeURIComponent(search)}`;
  const data = await APICore<{ products: Product[] }>(endpoint, "GET");
  return data;
}


export const getProductInfoByid = async (id: number): Promise<ProductInfo> => {
  const endpoint = `/frontend/product_info/?product=${id}`;
  const data = await APICore<ProductInfo>(endpoint, "GET");
  return data;
};


