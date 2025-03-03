"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "@/redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist as removeFromWishlistAction,
} from "@/redux/wishlistSlice";
import {
  addOrUpdateWishlist as apiAddOrUpdateWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "@/api/wishlistApi";
import { addOrUpdateCart } from "@/api/cartPageApi";
import type { RootState } from "@/redux/store";
import { Product } from "../../ShopPageComponent.tsx/type";

const formatPrice = (price: number, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price);
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const customerId = useSelector((state: RootState) => state.user.id);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // Check if the product is already in the wishlist
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  // Create a URL that includes both a slug and product id
  const productUrl = `/product/${product.id}`;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    // Immediately update local Redux state with full product details
    dispatch(
      addToCart({
        id: product.id.toString(),
        quantity: 1,
        name: product.name,
        price: product.base_price.toString(),
        image: product.images?.[0],
      })
    );

    // Then attempt to update the backend if logged in
    if (token && customerId) {
      try {
        await addOrUpdateCart(
          {
            is_cart: true,
            customer_id: customerId,
            product_id: product.id,
            quantity: 1,
          },
          token
        );
        toast.success("Product added successfully!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
        toast.error("Failed to update cart on backend.");
      }
    } else {
      toast.success("Product added to cart locally!");
    }
  };

  const handleWishlistToggle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (!token || !customerId) {
      toast.error("Please log in to update your wishlist.");
      return;
    }

    if (isWishlisted) {
      // Remove from wishlist
      try {
        await apiRemoveFromWishlist(
          {
            is_cart: false,
            customer_id: customerId,
            product_id: product.id,
          },
          token
        );
        // Update Redux state
        dispatch(removeFromWishlistAction(product.id));
        toast.success("Removed from wishlist!");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove from wishlist on backend.");
      }
    } else {
      // Add to wishlist
      try {
        await apiAddOrUpdateWishlist(
          {
            is_cart: false,
            customer_id: customerId,
            product_id: product.id,
          },
          token
        );
        // Update Redux state
        dispatch(addToWishlist(product));
        toast.success("Added to wishlist!");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add to wishlist on backend.");
      }
    }
  };

  return (
    <div className="items-center pb-3 px-3 bg-white rounded-[5px] border hover:shadow-md transition-transform duration-300 transform">
      <div className="flex pt-3 justify-between">
        <p className="bg-blue-100 text-[--mainColor] px-2 py-1 text-[10px]">
          {product.base_and_selling_price_difference_in_percent}% off
        </p>
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            // Filled heart icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="text-[--mainColor]"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          ) : (
            // Outline heart icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-[--mainColor]"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Product image with link */}
      <Link href={productUrl}>
        <div className="mb-[10px] cursor-pointer">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${product.images?.[0]}`}
            alt={product.name}
            width={300}
            height={300}
            className="object-contain w-full h-[100px] lg:h-[150px] py-1 lg:py-3 hover:scale-105 transition-transform duration-300 transform"
          />
        </div>
      </Link>

      <div className="product-details w-full">
        <Link href={productUrl}>
          <h3 className="text-[--textColor] text-sm lg:text-base font-bold truncate cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-[--textColor] text-[14px] truncate">
          {product.category_name}
        </p>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-red-500 font-bold pe-1">
            {formatPrice(product.base_price)}
          </span>
          <span className="text-gray-500 line-through">
            {formatPrice(product.selling_price)}
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-3">
        <button
          onClick={handleAddToCart}
          className="text-sm lg:text-base w-full border-[1px] border-[--mainColor] text-[--mainColor] py-1 lg:py-2 rounded-md hover:bg-[--mainColor] hover:text-white hover:border-white transition duration-300 ease-in-out"
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
