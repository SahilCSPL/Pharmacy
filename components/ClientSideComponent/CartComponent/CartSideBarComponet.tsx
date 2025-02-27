"use client";
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import CartProductsSummary from "./CartSummery";
import Lottie from "lottie-react";
import emptyCart from "@/public/animation/Animation - 1740402945831.json";


interface OffCanvasCartProps {
  isOpen: boolean;
  toggleCart: () => void;
}

export default function OffCanvasCart({
  isOpen,
  toggleCart,
}: OffCanvasCartProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.user.token);
  const customerId = useSelector((state: RootState) => state.user.id);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  const handleShop = async () => {
    toggleCart();
    router.push("/shop");
  };

  const handleCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
          aria-hidden="true"
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-80 md:w-96`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">My Cart</h2>
          <button onClick={toggleCart} className="text-red-500 font-bold">
            Close
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-12rem)]">
          {cartItems.length > 0 ? (
            <CartProductsSummary
              cartItems={cartItems}
              token={token}
              customerId={customerId}
            />
          ) : (
            <div className="flex items-center justify-center h-full flex-col">
              <div className="animation-container mx-auto">
                <Lottie
                  animationData={emptyCart}
                  loop={true}
                  autoplay={true}
                  style={{ height: 200, width: 300 }} // Customize the size as needed
                />
              </div>
              <p>Oops, your cart is empty.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex flex-col gap-2">
          <button
            onClick={handleShop}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Continue Shopping
          </button>
          {cartItems.length > 0 && (
            <button
              onClick={handleCheckout}
              className="w-full bg-[var(--mainColor)] text-white py-2 rounded-md hover:bg-[var(--mainHoverColor)] transition"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
