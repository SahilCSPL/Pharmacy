"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CountryDropdown } from "react-country-region-selector";

export interface GuestAddressFormData {
  // Delivery Address Fields
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  countryCode: string;
  // Billing Address Fields
  billingFullName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipcode: string;
  billingCountry: string;
}

interface GuestAddressFormProps {
  billingSame: boolean;
  setBillingSame: (same: boolean) => void;
  onSubmit: (data: GuestAddressFormData) => void;
}

export default function GuestAddressForm({
  billingSame,
  setBillingSame,
  onSubmit,
}: GuestAddressFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<GuestAddressFormData>({
    defaultValues: {
      country: "India",
      state: "Maharashtra",
      billingCountry: "India",
      billingState: "Maharashtra",
      countryCode: "+91",
    },
  });

  // Watch the country fields so that the state dropdown can be updated accordingly.
  const selectedCountry = watch("country", "India");
  const selectedBillingCountry = watch("billingCountry", "India");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      {/* Delivery Address Section */}
      <div className="border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">
          Enter Delivery Address
        </h3>
        <div className="space-y-2 guest-delivery-address">
          <input
            type="text"
            placeholder="Full Name"
            {...register("fullName", { required: "Full Name is required" })}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
          <input
            type="text"
            placeholder="Address"
            {...register("address", { required: "Address is required" })}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="City"
              {...register("city", { required: "City is required" })}
              className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
            <input
              type="text"
              placeholder="State"
              {...register("state", { required: "State is required" })}
              className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Zipcode"
              {...register("zipcode", {
                required: "Zipcode is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Zipcode must contain only numbers",
                },
              })}
              className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
            />
            {errors.zipcode && (
              <p className="text-red-500 text-sm">{errors.zipcode.message}</p>
            )}
            <Controller
              control={control}
              name="country"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <CountryDropdown
                  value={field.value}
                  onChange={field.onChange}
                  className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                  defaultOptionLabel="Select Country"
                />
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-4/12 md:w-2/12">
              <Controller
                control={control}
                name="countryCode"
                render={({ field }) => (
                  <PhoneInput
                    country={"us"}
                    value={field.value}
                    onChange={(value, country) => {
                      const dial =
                        (country as { dialCode?: string }).dialCode || "";
                      const dialWithPlus = dial ? `+${dial}` : "";
                      field.onChange(dialWithPlus);
                    }}
                    inputProps={{ readOnly: true }}
                    containerStyle={{ width: "100%" }}
                    inputStyle={{ width: "100%" }}
                    buttonStyle={{ border: "none" }}
                  />
                )}
              />
            </div>
            <div className="w-8/12 md:w-10/12">
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message:
                      "Mobile number must be numeric and exactly 10 digits",
                  },
                })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address Section */}
      <div className="border p-4 rounded">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={billingSame}
            onChange={(e) => setBillingSame(e.target.checked)}
            className="mr-2"
          />
          <span>Billing address same as delivery</span>
        </label>

        {!billingSame && (
          <div className="space-y-2 mt-4 guest-billing-address">
            <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">
              Enter Billing Address
            </h3>
            <input
              type="text"
              placeholder="Full Name"
              {...register("billingFullName", {
                required: "Billing Full Name is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
            />
            {errors.billingFullName && (
              <p className="text-red-500 text-sm">
                {errors.billingFullName.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Address"
              {...register("billingAddress", {
                required: "Billing Address is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
            />
            {errors.billingAddress && (
              <p className="text-red-500 text-sm">
                {errors.billingAddress.message}
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City"
                {...register("billingCity", {
                  required: "Billing City is required",
                })}
                className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
              />
              {errors.billingCity && (
                <p className="text-red-500 text-sm">
                  {errors.billingCity.message}
                </p>
              )}
              <input
                type="text"
                placeholder="State"
                {...register("billingState", {
                  required: "Billing State is required",
                })}
                className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
              />
              {errors.billingState && (
                <p className="text-red-500 text-sm">
                  {errors.billingState.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Zipcode"
                {...register("billingZipcode", {
                  required: "Billing Zipcode is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Zipcode must contain only numbers",
                  },
                })}
                className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
              />
              {errors.billingZipcode && (
                <p className="text-red-500 text-sm">
                  {errors.billingZipcode.message}
                </p>
              )}
              <Controller
                control={control}
                name="billingCountry"
                rules={{ required: "Billing Country is required" }}
                render={({ field }) => (
                  <CountryDropdown
                    value={field.value}
                    onChange={field.onChange}
                    className="w-1/2 p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                    defaultOptionLabel="Select Country"
                  />
                )}
              />
              {errors.billingCountry && (
                <p className="text-red-500 text-sm">
                  {errors.billingCountry.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[--mainColor] text-white py-2 rounded-md hover:bg-[--mainHoverColor] transition duration-200"
      >
        Continue
      </button>
    </form>
  );
}
