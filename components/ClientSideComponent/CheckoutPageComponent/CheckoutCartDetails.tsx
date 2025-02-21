"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addOrUpdateCart, deleteCart } from "@/api/cartPageApi";
import { toast } from "react-toastify";
import { updateCartItem, removeFromCart, clearCart } from "@/redux/cartSlice";

const CheckoutCartDetails = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.user.token);
  const customerId = useSelector((state: RootState) => state.user.id);

  // Calculate subtotal: Sum over all items: quantity * unit price
  const subtotal = cartItems.reduce((sum, item) => {
    const unitPrice = parseFloat(item.price);
    return sum + item.quantity * unitPrice;
  }, 0);

  // Handler to update quantity (same as your OffCanvasCart logic)
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    // Update Redux store immediately
    dispatch(updateCartItem({ id: itemId, quantity: newQuantity }));

    // Update backend if logged in
    if (token && customerId) {
      try {
        await addOrUpdateCart(
          {
            is_cart: true,
            customer_id: customerId,
            product_id: parseInt(itemId), // assuming product id is numeric
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

  // Handler to remove a single item
  const handleRemoveItem = async (itemId: string) => {
    // Remove from Redux store
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
    <div className="border p-4 rounded">
      {cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((item) => {
              const unitPrice = parseFloat(item.price);
              const itemTotal = (item.quantity * unitPrice).toFixed(2);
              return (
                <li key={item.id} className="flex items-center mb-4 border-b pb-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-contain mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{item.name}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                        className="text-red-500 text-sm font-bold"
                      >
                        X
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
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          –
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(item.id, item.quantity + 1);
                          }}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Total: {itemTotal}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {unitPrice.toFixed(2)} / Unit
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t pt-4">
            <p className="text-lg font-bold">Subtotal: {subtotal.toFixed(2)}</p>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CheckoutCartDetails;
