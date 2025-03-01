"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ProductCard from "@/components/ClientSideComponent/HomePageComponents/ProductDisplaySection/productCard";

export default function WishlistInfoTab() {
  // Assume your wishlist slice stores items in state.wishlist.items
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="p-3 md:p-4">
      <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-400">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
