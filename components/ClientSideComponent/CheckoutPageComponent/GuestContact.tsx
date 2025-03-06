"use client";

import React, { forwardRef, useImperativeHandle } from "react";

interface GuestContactProps {
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  error?: string;
  setError: (error: string) => void;
}

const GuestContact = forwardRef<{ validate: () => boolean }, GuestContactProps>(
  ({ guestEmail, setGuestEmail, error, setError }, ref) => {
    // Simple email validation function
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setGuestEmail(value);

      // Validate on change and immediately clear error if valid
      if (value && validateEmail(value)) {
        setError("");
      } else if (value) {
        setError("Please enter a valid email address");
      }
    };

    const handleBlur = () => {
      if (!guestEmail) {
        setError("Email is required");
      } else if (!validateEmail(guestEmail)) {
        setError("Please enter a valid email address");
      } else {
        setError("");
      }
    };

    // Expose a validate method to the parent component
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!guestEmail) {
          setError("Email is required");
          return false;
        } else if (!validateEmail(guestEmail)) {
          setError("Please enter a valid email address");
          return false;
        }
        setError("");
        return true;
      },
    }));

    return (
      <div className="border rounded space-y-3 mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold bg-[--mainColor] text-white p-4">
          Contact
        </h2>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">
            Enter Email
          </h3>
          <input
            type="email"
            placeholder="Email"
            value={guestEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border p-2 rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }
);

GuestContact.displayName = "GuestContact";
export default GuestContact;
