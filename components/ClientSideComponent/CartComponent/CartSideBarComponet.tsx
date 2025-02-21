"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/cartSlice";
import CartProductsSummary from "./CartSummery";

interface OffCanvasCartProps {
  isOpen: boolean;
  toggleCart: () => void;
}

export default function OffCanvasCart({ isOpen, toggleCart }: OffCanvasCartProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.user.token);
  const customerId = useSelector((state: RootState) => state.user.id);

  const handleClearCart = async () => {
    dispatch(clearCart());
    toast.info("Cart cleared!");
    // Optionally update backend if needed.
  };

  const handleCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full z-50 bg-white shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } w-80 md:w-96`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <button onClick={toggleCart} className="text-red-500 font-bold">
          Close
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-12rem)]">
        <CartProductsSummary cartItems={cartItems} token={token} customerId={customerId} />
      </div>
      <div className="p-4 border-t flex flex-col gap-2">
        {cartItems.length > 0 && (
          <>
            <button
              onClick={handleClearCart}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Remove All Items
            </button>
            <button
              onClick={handleCheckout}
              className="w-full bg-[var(--mainColor)] text-white py-2 rounded-md hover:bg-[var(--mainHoverColor)] transition"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
