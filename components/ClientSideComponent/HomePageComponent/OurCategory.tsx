"use client"; // Required for interactivity in Next.js 15

import { useEffect, useState } from "react";
import { getAllCategories } from "@/api/ShopPageApi";
import { Category, ChildCategory } from "../ShopPageComponent.tsx/type";
import Link from "next/link";

export default function OurCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.product_categories || []);
      if (data.product_categories.length > 0)
        setActiveTabId(data.product_categories[0].id); // Set the first category ID as active
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Find the active category based on the activeTabId
  const activeCategory = categories.find(
    (category) => category.id === activeTabId
  );

  return (
    <section className="container mx-auto py-4 lg:py-5 " id="our-category">
      <div className="container mx-auto">
        <div>
          <h2 className="text-[20px] lg:text-[35px] text-[--mainColor] text-center font-bold">
            Explore Our Categories
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-nowrap border-b lg:justify-center overflow-x-auto hiddenScrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`p-4 text-sm lg:text-base xl:text-xl font-semibold focus:outline-none transition duration-300 ease-in-out 
                ${
                  activeTabId === category.id
                    ? "text-[--mainColor] border-b-[3px] border-[--mainColor]"
                    : "text-[--textColor] hover:text-[--mainColor]"
                }
              `}
              onClick={() => setActiveTabId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 flex flex-wrap lg:flex-no-wrap">
          {/* Right Column: Subcategories Display */}
          <div className="w-full">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap">
                {activeCategory &&
                activeCategory.child_categories &&
                activeCategory.child_categories.length > 0 ? (
                  activeCategory.child_categories.map(
                    (subCat: ChildCategory) => (
                      <div
                        key={subCat.id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
                      >
                        <Link href={`/shop/?category=${subCat.id}`}>
                          <div className="border p-4 rounded-lg text-center">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${subCat.image}`}
                              alt={subCat.name}
                              className="object-cover rounded-md h-40 w-full mb-2"
                            />
                            <p className="font-semibold">{subCat.name}</p>
                          </div>
                        </Link>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-gray-500">
                    No subcategories available for this category.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
