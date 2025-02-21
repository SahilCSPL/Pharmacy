import { APICore } from "./APICore";


export interface ApiResponse {
  message?: string;
}

// Customer login Api
export const loginCustomer = async (username: string, password: string) => {
  const data = await APICore<{}>("/user/customer-login/", "POST", {
    username,
    password,
  });
  return data;
};


// Function to send OTP to the customer's email
export const sendOtp = async (email: string): Promise<ApiResponse> => {
  const data = await APICore<ApiResponse>(
    "/user/reset-password/customer/send-otp/",
    "POST",
    { email }
  );
  return data;
};

// Function to verify the OTP sent to the customer's email
export const verifyOtp = async (email: string, otp: string): Promise<ApiResponse> => {
  const data = await APICore<ApiResponse>(
    "/user/reset-password/verify-otp/",
    "POST",
    { email, otp }
  );
  return data;
};

// Function to reset the password
export const resetPassword = async (
  email: string,
  otp: string,
  password: string,
  confirm_password: string
): Promise<ApiResponse> => {
  const data = await APICore<ApiResponse>(
    "/user/reset-password/",
    "POST",
    { email, otp, password, confirm_password }
  );
  return data;
};
