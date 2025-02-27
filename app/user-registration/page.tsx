"use client";

import { APICore } from "@/api/APICore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL;

interface MyCountryData {
  dialCode?: string;
}

interface OtpResponse {
  message?: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  otp: string;
  phone_number: string;
  country_code_for_phone_number: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  password: string;
  confirm_password: string;
}

const Page = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  // Watch country field so that state dropdown can be updated accordingly.
  const selectedCountry = watch("country", "");

  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSendError, setOtpSendError] = useState("");
  const [otpVerifyError, setOtpVerifyError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Local state for holding the selected country dial code.
  // Default is set to "+91".
  const [selectedDialCode, setSelectedDialCode] = useState("+91");

  // File change handler for profile picture.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Send OTP (requires email to be entered first)
  const sendOtp = async () => {
    setOtpLoading(true);
    setOtpSendError("");
    const email = getValues("email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
      const message = "Please provide a valid email address before sending OTP";
      setOtpSendError(message);
      toast.error(message);
      setOtpLoading(false);
      return;
    }

    try {
      await APICore("/user/verify-email/customer/send-otp/", "POST", { email });
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to send OTP";
      setOtpSendError(errMsg);
      toast.error(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    setOtpLoading(true);
    setOtpVerifyError("");
    try {
      const email = getValues("email");
      const otp = getValues("otp");

      // Cast the response to the OtpResponse type
      const response = (await APICore(
        "/user/verify-email/verify-otp/",
        "POST",
        { email, otp }
      )) as OtpResponse;

      if (response?.message === "Invalid OTP") {
        throw new Error("Invalid OTP");
      }

      setIsOtpVerified(true);
      toast.success("OTP Verified!");
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "OTP Verification failed";
      setOtpVerifyError(errMsg);
      toast.error(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // On form submission.
  const onSubmit = async (data: FormData) => {
    if (!isOtpVerified) {
      setError("Email verification is required");
      return;
    }
    setRegisterLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // Append each field to the FormData object
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("otp", data.otp);
      formData.append("phone_number", data.phone_number);
      formData.append(
        "country_code_for_phone_number",
        data.country_code_for_phone_number
      );
      formData.append("address", data.address);
      formData.append("locality", data.locality);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("country", data.country);
      formData.append("zipcode", data.zipcode);
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirm_password);

      // Append the file if selected
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      const response = await fetch(
        `${PUBLIC_URL}/user/customer-registration/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast.success("Registration successful!");
      router.push("/user-login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <main className="bg-[--mainColor] py-10">
      <div className="flex container mx-auto px-3">
        <div className="mx-auto bg-white p-8 shadow-lg rounded-lg w-full lg:w-1/2 justify-center lg:justify-start">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Create an Account!
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 registration-form"
          >
            <p>Personal Information :</p>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div className="pb-3">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("first_name", {
                    required: "First Name is required",
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="pb-3">
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("last_name", {
                    required: "Last Name is required",
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Picture */}
            <div className="pb-3">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-md text-black"
              />
            </div>

            <p>Email Verification and Password :</p>
            {/* Email & OTP */}
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2 pb-3">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
              </div>
              {!isOtpVerified && (
                <div className="pb-3 h-full">
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200 h-full w-full"
                    disabled={otpLoading}
                  >
                    {otpLoading ? "Processing..." : "Send OTP"}
                  </button>
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mb-3">
                {errors.email.message}
              </p>
            )}
            {isOtpVerified && (
              <p className="text-green-500 text-sm mt-1 mb-3">
                Email Verified successfully
              </p>
            )}
            {otpSendError && (
              <p className="text-red-500 text-sm mt-1">{otpSendError}</p>
            )}
            {otpSent && !isOtpVerified && (
              <div className="pb-3">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", { required: "OTP is required" })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otp.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition duration-200 mt-2"
                  disabled={otpLoading}
                >
                  {otpLoading ? "Processing..." : "Verify OTP"}
                </button>
                {otpVerifyError && (
                  <p className="text-red-500 text-sm mt-1">{otpVerifyError}</p>
                )}
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="pb-3">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="pb-3">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirm_password", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
            </div>

            <p>Phone Number:</p>
            {/* Phone Number */}
            <div className="flex gap-2 items-start pb-3">
              <div className="w-4/12 md:w-2/12 country-code">
                <PhoneInput
                  country={"us"}
                  value={selectedDialCode}
                  onChange={(value, country) => {
                    const dial = (country as MyCountryData).dialCode || "";
                    const dialWithPlus = dial ? `+${dial}` : "";
                    setSelectedDialCode(dialWithPlus);
                    setValue("country_code_for_phone_number", dialWithPlus);
                  }}
                  inputProps={{ readOnly: true }}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{ width: "100%" }}
                  buttonStyle={{ border: "none" }}
                />
              </div>
              <div className="w-8/12 md:w-10/12 pb-3">
                <input
                  id="phone_number"
                  type="text"
                  placeholder="Phone Number"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message:
                        "Mobile number must be numeric and exactly 10 digits",
                    },
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>
            </div>

            <p>Address Information:</p>
            {/* Address Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Street"
                  {...register("address", {
                    required: "Street address is required",
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="pb-3">
                <input
                  type="text"
                  placeholder="Area"
                  {...register("locality", { required: "Area is required" })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.locality && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.locality.message}
                  </p>
                )}
              </div>
              <div className="pb-3">
                <input
                  type="text"
                  placeholder="City"
                  {...register("city", { required: "City is required" })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Country Dropdown */}
              <div className="pb-3 select-address">
                <Controller
                  control={control}
                  name="country"
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <CountryDropdown
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                      defaultOptionLabel="Select Country"
                    />
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div className="pb-3">
                <Controller
                  control={control}
                  name="state"
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <RegionDropdown
                      country={selectedCountry}
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                      defaultOptionLabel="Select State"
                    />
                  )}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Pincode"
                  {...register("zipcode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Zip code must contain only numbers",
                    },
                  })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.zipcode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[--mainColor] text-white py-2 rounded-md hover:bg-[--mainHoverColor] transition duration-200"
              disabled={registerLoading}
            >
              {registerLoading ? "Registering..." : "Register"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
};

export default Page;
