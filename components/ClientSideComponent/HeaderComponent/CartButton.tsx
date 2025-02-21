// components/CartButton.tsx
"use client";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CartButtonProps {
  toggleCart: () => void;
}

export default function CartButton({ toggleCart }: CartButtonProps) {
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );

  const handleClick = () => {
    toggleCart();
  };

  return (
    <div onClick={handleClick} className="cart-button relative cursor-pointer flex items-center">
      <FaShoppingCart
        className="text-[var(--mainColor)] hover:text-white hover:bg-[var(--mainColor)] p-2 rounded-md"
        size={35}
      />
      {totalQuantity > 0 && (
        <span className="absolute top-0 lg:top-1 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </div>
  );
}
