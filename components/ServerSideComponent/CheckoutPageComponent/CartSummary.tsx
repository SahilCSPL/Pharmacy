"use client"

import type React from "react"
import Lottie from "lottie-react"
import emptyCart from "@/public/animation/Animation - 1740402945831.json"
import CartProductsSummary from "@/components/ClientSideComponent/CartComponent/CartSummery"

interface CartSummaryProps {
  cartData: any
  localCart: any
  token?: string
  customer?: number
  handleShop: () => void
}

const CartSummary: React.FC<CartSummaryProps> = ({ cartData, localCart, token, customer, handleShop }) => {
  return (
    <div className="border rounded">
      <h2 className="text-2xl font-bold text-white p-4 bg-[--mainColor]">Your Cart</h2>
      <div className="cart p-4 max-h-[400px] overflow-y-auto">
        {token && cartData ? (
          <CartProductsSummary cartItems={localCart.cartItems} token={token} customerId={customer} />
        ) : (
          <CartProductsSummary cartItems={localCart.cartItems} />
        )}
        <div className="empty-cart">
          {localCart.cartItems.length < 1 ? (
            <div className="flex items-center justify-center h-full flex-col">
              <div className="animation-container mx-auto">
                <Lottie animationData={emptyCart} loop={true} autoplay={true} style={{ height: 200, width: 300 }} />
              </div>
              <p className="py-3">Oops, your cart is empty.</p>
            </div>
          ) : (
            <></>
          )}
        </div>
        <button
          onClick={handleShop}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Go Back Shopping
        </button>
      </div>
    </div>
  )
}

export default CartSummary

