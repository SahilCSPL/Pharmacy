"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function CartPage() {
  const { cartItems, totalItems, totalQuantity } = useSelector(
    (state: RootState) => state.cart
  );

  return (
    <div>
      <h1>Your Cart</h1>
      <p>Total unique items: {totalItems}</p>
      <p>Total quantity: {totalQuantity}</p>
      {/* Render list of cart items */}
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            Product ID: {item.id} | Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
