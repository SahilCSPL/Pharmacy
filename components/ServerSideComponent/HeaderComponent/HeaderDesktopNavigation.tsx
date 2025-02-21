"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getAllCategories } from "@/api/ShopPageApi";
import { Category } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";

export default function HeaderDesktopNavigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        // Ensure we get an array of categories from data.product_categories.
        setCategories(data.product_categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hidden xl:flex items-center space-x-6 flex-grow justify-center">
      <nav className="hidden lg:flex space-x-6 relative">
        {[
          { name: "Categories", path: "/shop" },
          { name: "Shop", path: "/shop" },
          { name: "Health Blog", path: "/blog" },
          { name: "Contact", path: "/contact" },
        ].map((item) =>
          item.name === "Categories" ? (
            <div key={item.name} className="relative flex">
              <Link
                href={item.path}
                className="text-[var(--textColor)] hover:text-[var(--mainColor)] p-2 rounded-md"
              >
                {item.name}
              </Link>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-[var(--textColor)] hover:text-[var(--mainColor)] p-2 rounded-md"
              >
                <span className="ml-1">
                  {isDropdownOpen ? (
                    <i className="fa-solid fa-caret-up"></i>
                  ) : (
                    <i className="fa-solid fa-caret-down"></i>
                  )}
                </span>
              </button>
              {isDropdownOpen && categories.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 left-0 w-[1000px] bg-white border shadow-md rounded-md z-50 p-4"
                >
                  {/* Container for main categories laid out horizontally */}
                  <div className="flex flex-wrap justify-start">
                    {categories.map((category) => (
                      <div key={category.id} className="mb-4">
                        {category.child_categories &&
                        category.child_categories.length > 0 ? (
                          <div className="flex flex-col w-[240px]">
                            {/* Display main category name as a label */}
                            <span className="font-bold mb-2 text-[--mainColor]">
                              {category.name}
                            </span>
                            {/* Child categories displayed horizontally */}
                            <div className="flex flex-col space-y-1">
                              {category.child_categories.map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/shop/?category=${child.id}`}
                                  className="text-gray-600 hover:text-[--mainColor] text-sm"
                                >
                                  - {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // If no child categories, the main category itself is clickable.
                          <Link
                            href={`/shop/categoryid=${category.id}`}
                            className="text-gray-800 hover:text-blue-600 font-bold"
                          >
                            {category.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.path}
              className="text-[var(--textColor)] hover:text-[var(--mainColor)] p-2 rounded-md"
            >
              {item.name}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
