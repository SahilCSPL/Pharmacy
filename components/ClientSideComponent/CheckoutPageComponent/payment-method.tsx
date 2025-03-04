"use client";

import { useEffect } from "react";

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  finalTotal?: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentMethodSection({
  paymentMethod,
  setPaymentMethod,
  finalTotal,
}: PaymentMethodSectionProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="border rounded shadow-sm">
      <h2 className="text-2xl font-bold text-white p-4 bg-[--mainColor]">
        Payment Method
      </h2>
      <div className="flex gap-4 p-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="Cash on Delivery"
            checked={paymentMethod === "Cash on Delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <span>Cash on Delivery</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="Online"
            checked={paymentMethod === "Online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <span>Online</span>
        </label>
      </div>
    </div>
  );
}
