// OrderApi.ts
import { APICore } from "@/api/APICore";

// For placing an order
export interface OrderResponse {
  message: string;
  order_id: number;
}

export interface OrderData {
  sub_total: number;
  discount: number;
  tax: number;
  delivery_charge: number;
  final_total: number;
  is_payment_done: boolean;
  payment_transaction_id: string;
  payment_type: string; // e.g., "COD" or "Online"
  payment_datetime: string;
  billing_address: string;
  delivery_address: string;
  products: {
    product_id: number;
    unit_price: number;
    quantity: number;
  }[];
}

export const placeOrderAPI = async (
  orderData: OrderData,
  token: string
): Promise<OrderResponse> => {
  const endpoint = "/order/place-order/";
  const data = await APICore<OrderResponse>(endpoint, "POST", orderData, token);
  return data;
};

// New types for guest order payload
export interface Address {
  type: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export interface GuestOrderData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  sub_total: number;
  tax: number;
  discount: number;
  delivery_charge: number;
  final_total: number;
  is_payment_done: boolean;
  payment_transaction_id: string;
  payment_type: string; // e.g., "Cash on Delivery"
  payment_datetime: string;
  billing_address: Address;
  delivery_address: Address;
  products: {
    product_id: number;
    unit_price: number;
    quantity: number;
  }[];
}

// New API function for guest order placement, no token required
export const placeGuestOrderAPI = async (
  guestOrderData: GuestOrderData
): Promise<OrderResponse> => {
  const endpoint = "/order/guest-place-order/";
  const data = await APICore<OrderResponse>(endpoint, "POST", guestOrderData);
  return data;
};

// For fetching order details
export interface OrderItem {
  id: number;
  name: string;
  SKU: string;
  image: string;
  unit_price: string;
  quantity: number;
  category: string;
  specification: string | null;
}

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  country_code_for_phone_number: string | null;
  phone_number: number;
  email: string;
  billing_address: string;
  delivery_address: string;
}

export interface OrderInfo {
  sub_total: number;
  tax: number;
  discount: number;
  discount_coupon_type: string;
  discount_coupon_code: string;
  discount_coupon_value: number;
  delivery_charge: number;
  final_total: number;
  order_status: string;
  created_at_formatted: string;
  created_at: string;
}

export interface PaymentInfo {
  is_payment_done: boolean;
  payment_transaction_id: string;
  payment_type: string;
}

export interface OrderDetail {
  id: string;
  purchased_item_count: number;
  customer_info: CustomerInfo;
  order_info: OrderInfo;
  payment_info: PaymentInfo;
  items: OrderItem[];
}

export interface OrderDetailsResponse {
  message: string;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: OrderDetail[];
}

export const getAllOrderDetails = async (
  page: number,
  page_size: number,
  customer_id: number,
  token: string
): Promise<OrderDetailsResponse> => {
  const endpoint = `/order/get-customer-orders/?page=${page}&page_size=${page_size}&customer_id=${customer_id}`;
  const data = await APICore<OrderDetailsResponse>(endpoint, "GET", {}, token);
  return data;
};

export const getOrderDetails =  async (
  page: number,
  page_size: number,
  customer_id: number,
  token: string,
  order_id: string
) : Promise<OrderDetailsResponse> => {
  const endpoint = `/order/get-customer-orders/?page=${page}&page_size=${page_size}&customer_id=${customer_id}&order_id=${order_id}`;
  const data = await APICore<OrderDetailsResponse>(endpoint, "GET", {}, token);
  return data;
}

export const getGuestOrderDetails = async (
  page: number,
  page_size: number,
  order_id: string
) : Promise<OrderDetailsResponse> => {
  const endpoint = `/order/get-single-orders/?page=${page}&page_size=${page_size}&search=${order_id}`;
  const data = await APICore<OrderDetailsResponse>(endpoint, "GET", {});
  return data;
}
