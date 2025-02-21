// AddressApi.ts
import { Address } from "@/redux/userSlice";
import { APICore } from "./APICore";

// Interface for the response when fetching addresses
export interface CustomerAddressesResponse {
  addresses: Address[];
}

// Function to fetch customer addresses
export const getCustomerAddresses = async (
  userId: number,
  token: string
): Promise<CustomerAddressesResponse> => {
  const data = await APICore<CustomerAddressesResponse>(
    `/user/customer-address/?customer=${userId}`,
    "GET",
    {},
    token
  );
  return data;
};

// Interface for the response when deleting an address
export interface DeleteAddressResponse {
  message: string;
  // Add additional fields from the API response if needed
}

// Function to delete an address
export const deleteAddress = async (
  addressId: number,
  customerId: number,
  token: string
): Promise<DeleteAddressResponse> => {
  const endpoint = `/user/customer-address/${addressId}/?customer=${customerId}`;
  const data = await APICore<DeleteAddressResponse>(
    endpoint,
    "DELETE",
    {},
    token
  );
  return data;
};

// Interface for the payload when adding or editing an address
export interface NewAddressData {
  customer: number;
  type: string; // "Billing address" or "Delivery address"
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  created_by: number;
  is_selected: boolean;
}

// Interface for the response when adding a new address
export interface AddNewAddressResponse {
  message: string;
  address: Address;
  // Add additional fields if returned by your API
}

// Function to add a new address
export const addNewAddress = async (
  payload: NewAddressData,
  token: string
): Promise<AddNewAddressResponse> => {
  const endpoint = "/user/customer-address/";
  const data = await APICore<AddNewAddressResponse>(
    endpoint,
    "POST",
    payload,
    token
  );
  return data;
};

// Interface for the response when editing an address
export interface EditAddressResponse {
  message: string;
  address: Address;
  // Add additional fields if returned by your API
}

// Function to edit an address using PATCH
export const editAddress = async (
  payload: NewAddressData,
  token: string
): Promise<EditAddressResponse> => {
  // The endpoint for editing an address (using PATCH)
  const endpoint = "/user/customer_address/update/";
  const data = await APICore<EditAddressResponse>(
    endpoint,
    "PATCH",
    payload,
    token
  );
  return data;
};
