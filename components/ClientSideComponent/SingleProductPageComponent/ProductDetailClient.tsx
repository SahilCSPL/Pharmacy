"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addOrUpdateCart } from "@/api/cartPageApi";
import { addToCart } from "@/redux/cartSlice";
import { ProductInfo, ProductVariant } from "../ShopPageComponent.tsx/type";
import Custom360View from "./Product360View";

interface ProductDetailClientProps {
  product: ProductInfo;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  // When a variant is selected, store it; otherwise use null for base product
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  // This will hold the images that are shown in the 360 view and slider.
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const customerId = useSelector((state: RootState) => state.user.id);

  // When the variant or base images change, update displayImages.
  useEffect(() => {
    if (selectedVariant && selectedVariant.images?.length > 0) {
      setDisplayImages(
        selectedVariant.images.map(
          (img) => `${process.env.NEXT_PUBLIC_API_URL}${img}`
        )
      );
    } else {
      setDisplayImages(
        product.images.map((img) => `${process.env.NEXT_PUBLIC_API_URL}${img}`)
      );
    }
    setCurrentFrame(0); // reset frame on variant change
  }, [selectedVariant, product.images]);

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) newQty = 1;
    setQuantity(newQty);
  };

  // Set the selected variant.
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  // Determine which image to use for the cart without prefixing the base URL.
  const imageForCart =
    selectedVariant && selectedVariant.images.length > 0
      ? selectedVariant.images[0]
      : product.images[0];

  const handleAddToCart = async () => {
    // You may want to include the variant id if one is selected.
    dispatch(
      addToCart({
        id: product.id.toString(),
        quantity,
        name: product.name,
        price: product.base_price,
        image: imageForCart || "/default-placeholder.jpg",
        variantId: selectedVariant ? selectedVariant.id : undefined,
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
            {displayImages.length > 0 && (
              <Custom360View
                images={displayImages}
                frame={currentFrame}
                onFrameChange={(newFrame) => setCurrentFrame(newFrame)}
                width={400}
                height={400}
              />
            )}
          </div>
          {/* Thumbnail slider */}
          <div className="mt-4 flex justify-center items-center">
            <Swiper
              spaceBetween={10}
              slidesPerView={4}
              className="h-[120px] w-full"
            >
              {displayImages.map((img, index) => (
                <SwiperSlide
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setCurrentFrame(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`object-contain rounded h-[100px] w-[100px] ${
                      currentFrame === index ? "border-2 border-blue-500" : ""
                    }`}
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
              <p className="text-green-600 font-semibold bg-green-100 inline-block rounded-md py-1 px-4">
                In Stock
              </p>
            ) : (
              <p className="text-red-600 font-semibold bg-red-100 inline-block rounded-md py-1 px-4">
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
              <span className="text-2xl text-green-500 font-medium">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(Number(product.selling_price))}
              </span>
            </div>
          ) : (
            <div className="mt-3">
              <span className="text-xl text-green-500 font-medium">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(Number(product.base_price))}
              </span>
              <span className="text-red-500 line-through ml-3">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(Number(product.selling_price))}
              </span>
              <span className="ml-4 text-white bg-[--mainColor] font-medium px-2 py-2 rounded-md text-sm">
                {product.base_and_selling_price_difference_in_percent}% OFF
              </span>
            </div>
          )}

          {/* Variant Selector */}
          {product.variant_list && product.variant_list.length > 0 && (
            <div className="mb-4">
              {/* Dynamically create heading based on the specification key */}
              <h4 className="font-bold mb-2">
                Choose{" "}
                {Object.keys(product.variant_list[0].specification)[0]
                  .charAt(0)
                  .toUpperCase() +
                  Object.keys(product.variant_list[0].specification)[0].slice(
                    1
                  )}
                :
              </h4>
              <div className="flex gap-2">
                {product.variant_list.map((variant) => {
                  // Assuming the specification key is consistent across variants
                  const specKey = Object.keys(variant.specification)[0];
                  const specValue = variant.specification[specKey];
                  // Use the first image as the thumbnail for the variant option
                  const thumbnail = variant.images[0];
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`p-1 border rounded-full overflow-hidden ${
                        selectedVariant?.id === variant.id
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${thumbnail}`}
                        alt={specValue}
                        className="w-10 h-10 object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Add-to-Cart */}
          <div className="flex space-x-5 mt-4">
            <div className="flex items-center">
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
            <div>
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
