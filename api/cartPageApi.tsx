import { APICore } from "@/api/APICore";

// Define the product type as returned in the cart
export type CartProduct = {
  id: number;
  name: string;
  price: string; 
  image: string;
  quantity: number;
  
};

// Define the structure of the cart response
export type CartResponse = {
  customer: number | undefined;
  products: CartProduct[];
};

// Create the getCart function. If your APICore automatically handles the token, you can just call it.
export const getCart = async (customerId: number, token: string): Promise<CartResponse> => {
  const endpoint = `/user/cart-wishlist/get/?customer=${customerId}&is_cart=true`;
  const data = await APICore<CartResponse>(endpoint, "GET", {}, token);
  return data;
};

export type CartUpdatePayload = {
  is_cart: boolean;
  customer_id: number | undefined;
  product_id: number;
  quantity: number;

};

export const addOrUpdateCart = async (
  payload: CartUpdatePayload,
  token: string
): Promise<any> => {
  const endpoint = "/user/cart-wishlist/update/";
  const data = await APICore<any>(endpoint, "POST", payload, token);
  return data;
};

export type CartDeletePayload = {
  is_cart: boolean;
  customer_id: number | undefined;
  product_id: number;
}

export const deleteCart = async (
  payload: CartDeletePayload,
  token: string) : Promise<any> => {
  const endpoint = "/user/cart-wishlist/remove/";
  const data = await APICore<CartResponse>(endpoint, "DELETE", payload, token);
  return data;
}
