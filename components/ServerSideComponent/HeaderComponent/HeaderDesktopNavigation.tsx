"use client";
import { useState, useEffect, useRef, useMemo } from "react";
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

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) => category.child_categories?.length > 0
    );
  }, [categories]);

  return (
    <div className="hidden xl:flex items-center space-x-6 flex-grow justify-center">
      <nav className="hidden lg:flex space-x-6 relative">
        {[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/shop" },
          { name: "Products", path: "/shop" },
          { name: "Health Blog", path: "/blogs" },
          { name: "Contact", path: "/contact" },
        ].map((item) =>
          item.name === "Categories" ? (
            <div key={item.name} className="relative flex">
              {/* <Link
                href={item.path}
                className="text-[var(--textColor)] hover:text-[var(--mainColor)] p-2 rounded-md"
              >
                {item.name}
              </Link> */}
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className="flex items-center text-[var(--textColor)] hover:text-[var(--mainColor)] p-2 rounded-md "
              >
                <p className="py-2 pl-2 pr-1">{item.name}</p>
                  {isDropdownOpen ? (
                    // Caret Up SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      fill="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path d="M31.5 320h257c28.4 0 42.7-34.5 22.6-54.6l-128.5-128c-12.5-12.5-32.8-12.5-45.3 0L9 265.4C-10.1 285.5 4.2 320 31.5 320z" />
                    </svg>
                  ) : (
                    // Caret Down SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      fill="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path d="M288 192H31.5c-28.4 0-42.7 34.5-22.6 54.6l128.5 128c12.5 12.5 32.8 12.5 45.3 0l128.5-128c20.1-20.1 5.8-54.6-22.6-54.6z" />
                    </svg>
                  )}
              </button>
              {isDropdownOpen && filteredCategories.length > 0 && (
                <div
                  ref={dropdownRef}
                  role="menu"
                  className="absolute top-full right-0 left-0 w-[1000px] bg-white border shadow-md rounded-md z-50 p-4"
                >
                  {/* Container for main categories laid out horizontally */}
                  <ul className="flex flex-wrap justify-start">
                    {filteredCategories.map((category) => (
                      <li key={category.id} role="menuitem" className="mb-4">
                        <div className="flex flex-col w-[240px]">
                          <span className="font-bold mb-2 text-[--mainColor]">
                            {category.name}
                          </span>
                          <ul className="flex flex-col space-y-1">
                            {category.child_categories.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/shop/?category=${child.id}`}
                                  className="text-gray-600 hover:text-[--mainColor] text-sm"
                                  onClick={() => setIsDropdownOpen(false)}
                                >
                                  - {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div
              key={item.name}
              className="relative flex items-center justify-center"
            >
              <Link
                key={item.name}
                href={item.path}
                className="text-[var(--textColor)] hover:text-[var(--mainColor)] p-2 rounded-md"
              >
                {item.name}
              </Link>
            </div>
          )
        )}
      </nav>
    </div>
  );
}
