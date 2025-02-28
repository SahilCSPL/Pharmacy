export interface Product {
  id: number;
  name: string;
  base_price: number; 
  category_id: number;
  category_name: string; 
  selling_price: number;  
  base_and_selling_price_difference_in_percent: number; 
  stock: number;
  is_new_arrival: boolean;
  images: string[];  // Array of image URLs
  tags: string[];  // Array of tags
}


export interface ChildCategory {
  id: number;
  name: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  banner: string;
  child_categories: ChildCategory[];
}

export interface ProductVariant {
  id: number
  specification: Record<string, string>
  description: string
  selling_price: string
  base_and_selling_price_difference_in_percent: string
  stock: number
  is_new_arrival: boolean
  images: string[]
}

export interface ProductInfo {
  id: number
  name: string
  description: string
  category_id: number
  category_name: string
  base_price: string
  selling_price: string
  base_and_selling_price_difference_in_percent: string
  stock: number
  is_new_arrival: boolean
  images: string[]
  tags: string[]
  variant_list: ProductVariant[]
}

export interface ShopFilters {
  category: string
  subCategories: number[]
  sort: string
}