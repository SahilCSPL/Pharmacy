"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addOrUpdateCart } from "@/api/cartPageApi";
import { addToCart } from "@/redux/cartSlice";
import { ProductInfo } from "../ShopPageComponent.tsx/type";
// Import the react-360-view component
import React360View from "react-360-view";
import Custom360View from "./Product360View";

interface ProductDetailClientProps {
  product: ProductInfo;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const customerId = useSelector((state: RootState) => state.user.id);

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) newQty = 1;
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    dispatch(
      addToCart({
        id: product.id.toString(),
        quantity,
        name: product.name,
        price: product.base_price,
        image: product.images[0] || "/default-placeholder.jpg",
      })
    );

    if (token && customerId) {
      try {
        await addOrUpdateCart(
          {
            is_cart: true,
            customer_id: customerId,
            product_id: product.id,
            quantity,
          },
          token
        );
        toast.success("Product added to cart!");
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Failed to update backend cart.");
      }
    } else {
      toast.success("Product added to cart locally!");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 w-full md:max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: 360 View */}
        <div className="md:w-1/2">
          <div className="border rounded p-2 flex justify-center items-center">
          <Custom360View
              images={product.images.map(
                (img) => `${process.env.NEXT_PUBLIC_API_URL}${img}`
              )}
              width={400}
              height={400}
            />
          </div>
          {/* Thumbnail slider (optional) */}
          <div className="mt-4 flex justify-center items-center">
            <Swiper
              spaceBetween={10}
              slidesPerView={4}
              className="h-[120px] w-full"
            >
              {product.images.map((img, index) => (
                <SwiperSlide key={index} className="cursor-pointer">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${img}`}
                    alt={`${product.name} ${index + 1}`}
                    className="object-contain rounded h-[100px] w-[100px]"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-1/2">
          <div className="my-1">
            {product.stock > 0 ? (
              <p className="text-green-600 font-bold bg-green-100 inline-block rounded-md py-1 px-4">
                In Stock
              </p>
            ) : (
              <p className="text-red-600 font-bold bg-red-100 inline-block rounded-md py-1 px-4">
                Out of Stock
              </p>
            )}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.category_name}</p>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mt-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {product.base_and_selling_price_difference_in_percent === "0" ? (
            <div className="mt-3">
              <span className="text-2xl text-green-500 font-bold">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(Number(product.selling_price))}
              </span>
            </div>
          ) : (
            <div className="mt-3">
              <span className="text-xl text-green-500 font-bold">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(Number(product.base_price))}
              </span>
              <span className="text-red-500 line-through ml-4">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(Number(product.selling_price))}
              </span>
              <span className="ml-4 text-white bg-[--mainColor] font-bold px-3 py-1 rounded-md">
                {product.base_and_selling_price_difference_in_percent}% OFF
              </span>
            </div>
          )}

          <div className="flex space-x-5">
            <div className="mt-4 flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={handleAddToCart}
                className="bg-[--mainColor] text-white px-6 py-2 rounded transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Product Description */}
      <div className="mt-6">
        <h3 className="font-bold text-lg">Description</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
}
