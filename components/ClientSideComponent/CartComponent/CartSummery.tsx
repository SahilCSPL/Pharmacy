"use client";
import React from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCartItem, removeFromCart } from "@/redux/cartSlice";
import { addOrUpdateCart, deleteCart } from "@/api/cartPageApi";

interface CartProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartProductsSummaryProps {
  cartItems: CartProduct[];
  token?: string;
  customerId?: number;
}

const CartProductsSummary: React.FC<CartProductsSummaryProps> = ({
  cartItems,
  token,
  customerId,
}) => {
  const dispatch = useDispatch();

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const unitPrice = parseFloat(item.price);
    return sum + item.quantity * unitPrice;
  }, 0);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    // Update Redux state immediately
    dispatch(updateCartItem({ id: itemId, quantity: newQuantity }));
    // Update backend if logged in
    if (token && customerId) {
      try {
        await addOrUpdateCart(
          {
            is_cart: true,
            customer_id: customerId,
            product_id: parseInt(itemId),
            quantity: newQuantity,
          },
          token
        );
        toast.success("Cart updated!");
      } catch (error) {
        console.error("Error updating cart item:", error);
        toast.error("Failed to update cart on backend.");
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    // Remove item from Redux store
    dispatch(removeFromCart(itemId));
    toast.info("Item removed from cart.");
    // Optionally update backend if logged in
    if (token && customerId) {
      try {
        await deleteCart(
          {
            is_cart: true,
            customer_id: customerId,
            product_id: parseInt(itemId),
          },
          token
        );
      } catch (error) {
        console.error("Error removing item on backend:", error);
      }
    }
  };

  return (
    <div>
      <ul>
        {cartItems.map((item) => {
          const unitPrice = parseFloat(item.price);
          const itemTotal = (unitPrice * item.quantity).toFixed(2);
          return (
            <li key={item.id} className="flex items-center mb-4 border-b pb-2">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                alt={item.name}
                className="w-16 h-16 object-contain mr-4"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base">{item.name}</h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    className="bg-red-500 text-sm font-bold px-2 py-1 rounded hover:bg-red-700 transition"
                  >
                    <i className="fa-solid fa-xmark text-white"></i>
                  </button>
                </div>
                <div className="flex justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdateQuantity(item.id, item.quantity - 1);
                      }}
                      className="px-3 py-1 bg-[--mainColor] text-white rounded"
                    >
                      -
                    </button>
                    <span className="font-semibold px-1">{item.quantity}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdateQuantity(item.id, item.quantity + 1);
                      }}
                      className="px-3 py-1 bg-[--mainColor] text-white rounded"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Total: ₹ {itemTotal}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                ₹ {unitPrice.toFixed(2)} / Unit
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {cartItems.length > 0 && (
        <div className="mt-4 pt-4 text-end">
          <p className="text-lg font-bold">Subtotal: ₹ {subtotal.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default CartProductsSummary;
