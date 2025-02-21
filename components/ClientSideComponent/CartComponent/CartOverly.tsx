// components/CartOverlay.tsx
"use client";
import React, { useState } from "react";
import CartButton from "../HeaderComponent/CartButton";
import OffCanvasCart from "./CartSideBarComponet";

export default function CartOverlay() {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <>
      <CartButton toggleCart={toggleCart} />
      <OffCanvasCart isOpen={isCartOpen} toggleCart={toggleCart} />
    </>
  );
}
