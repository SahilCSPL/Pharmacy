"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "@/redux/cartSlice";
// Redux actions
import {
  addToWishlist,
  removeFromWishlist as removeFromWishlistAction,
} from "@/redux/wishlistSlice";
// API functions for wishlist (aliased to avoid naming conflicts)
import {
  addOrUpdateWishlist as apiAddOrUpdateWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "@/api/wishlistApi";
import { addOrUpdateCart } from "@/api/cartPageApi";
import { Product } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import { RootState } from "@/redux/store";

const formatPrice = (price: number, currency: string = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price);
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const customerId = useSelector((state: RootState) => state.user.id);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // Check if the product is already in the wishlist.
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  // Create a URL that includes both a slug and product id.
  const productUrl = `/product/${slugify(product.name)}-${product.id}`;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    // Immediately update local Redux state with full product details.
    dispatch(
      addToCart({
        id: product.id.toString(),
        quantity: 1,
        name: product.name,
        price: product.base_price.toString(),
        image: product.images?.[0],
      })
    );

    // Then attempt to update the backend if logged in.
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
      // Remove from wishlist.
      try {
        await apiRemoveFromWishlist(
          {
            is_cart: false,
            customer_id: customerId,
            product_id: product.id,
          },
          token
        );
        // Update Redux state.
        dispatch(removeFromWishlistAction(product.id));
        toast.success("Removed from wishlist!");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove from wishlist on backend.");
      }
    } else {
      // Add to wishlist.
      try {
        await apiAddOrUpdateWishlist(
          {
            is_cart: false,
            customer_id: customerId,
            product_id: product.id,
          },
          token
        );
        // Update Redux state.
        dispatch(addToWishlist(product));
        toast.success("Added to wishlist!");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add to wishlist on backend.");
      }
    }
  };

  return (
    <div className="items-center pb-3 px-3 bg-white rounded-[10px] mx-2 shadow-md">
      <div className="flex pt-3 justify-between">
        <p className="bg-blue-100 text-[--mainColor] px-2 py-1 text-[10px]">
          {product.base_and_selling_price_difference_in_percent}% off
        </p>
        <button onClick={handleWishlistToggle}>
          {isWishlisted ? (
            <i className="fa-solid fa-heart text-[20px] text-[--mainColor]"></i>
          ) : (
            <i className="fa-regular fa-heart text-[20px] text-[--mainColor]"></i>
          )}
        </button>
      </div>

      {/* Both image and heading use the same Link */}
      <Link href={productUrl}>
        <div className="mb-[10px] cursor-pointer">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${
              product.images?.[0] || "/default-placeholder.jpg"
            }`}
            alt={product.name}
            width={300}
            height={300}
            className="object-contain w-full h-[100px] lg:h-[150px] py-1 lg:py-3"
          />
        </div>
      </Link>

      <div className="product-details w-full">
        <Link href={productUrl}>
          <h3 className="text-[--textColor] text-sm lg:text-base font-bold truncate cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-[--textColor] text-[10px] ">{product.category_name}</p>
        <div className="flex items-baseline text-sm">
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
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
