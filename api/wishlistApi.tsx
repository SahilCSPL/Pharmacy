import { APICore } from "./APICore";

export type wishlistPayload = {
  is_cart: boolean;
  customer_id: number | undefined;
  product_id: number;
};

export const addOrUpdateWishlist = async (
  payload: wishlistPayload,
  token: string
): Promise<any> => {
  const endpoint = "/user/cart-wishlist/update/";
  const data = await APICore<any>(endpoint, "POST", payload, token);
  return data;
};

export const removeFromWishlist = async (
  payload: wishlistPayload,
  token: string
): Promise<any> => {
  const endpoint = "/user/cart-wishlist/remove/";
  const data = await APICore<any>(endpoint, "DELETE", payload, token);
  return data;
};
