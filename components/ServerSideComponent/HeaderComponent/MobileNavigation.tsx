"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCategories } from "@/api/ShopPageApi";
import { Category } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/shop" },
  { name: "Health Blog", path: "/blogs" },
  { name: "Contact", path: "/contact" },
];

export type MobileNavigationProps = {
  onLinkClick: () => void;
};

export default function MobileNavigation({
  onLinkClick,
}: MobileNavigationProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        // Assuming the categories are in data.product_categories
        setCategories(data.product_categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleSubCategory = (categoryId: number) => {
    setOpenSubCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <nav className="mt-5 flex flex-col space-y-4">
      <div>
        <button
          onClick={() => setIsCategoriesOpen((prev) => !prev)}
          className="flex justify-between items-center w-full text-[var(--textColor)] hover:text-white hover:bg-[var(--mainColor)] p-2 rounded-md"
        >
          <span>Categories</span>
          {isCategoriesOpen ? (
            // Caret Up SVG
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M31.5 320h257c28.4 0 42.7-34.5 22.6-54.6l-128.5-128c-12.5-12.5-32.8-12.5-45.3 0L9 265.4C-10.1 285.5 4.2 320 31.5 320z" />
            </svg>
          ) : (
            // Caret Down SVG
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M288 192H31.5c-28.4 0-42.7 34.5-22.6 54.6l128.5 128c12.5 12.5 32.8 12.5 45.3 0l128.5-128c20.1-20.1 5.8-54.6-22.6-54.6z" />
            </svg>
          )}
        </button>

        {isCategoriesOpen && (
          <ul className="ml-4 mt-2 flex flex-col space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <div>
                  <button
                    onClick={() => toggleSubCategory(Number(category.id))}
                    className="flex justify-between items-center w-full text-[var(--textColor)] hover:text-white hover:bg-[var(--mainColor)] p-2 rounded-md"
                  >
                    <span>{category.name}</span>
                    {category.child_categories &&
                      category.child_categories.length > 0 &&
                      (openSubCategory === Number(category.id) ? (
                        // Caret Up SVG
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                          fill="currentColor"
                          className="w-4 h-4"
                          aria-hidden="true"
                        >
                          <path d="M31.5 320h257c28.4 0 42.7-34.5 22.6-54.6l-128.5-128c-12.5-12.5-32.8-12.5-45.3 0L9 265.4C-10.1 285.5 4.2 320 31.5 320z" />
                        </svg>
                      ) : (
                        // Caret Down SVG
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                          fill="currentColor"
                          className="w-4 h-4"
                          aria-hidden="true"
                        >
                          <path d="M288 192H31.5c-28.4 0-42.7 34.5-22.6 54.6l128.5 128c12.5 12.5 32.8 12.5 45.3 0l128.5-128c20.1-20.1 5.8-54.6-22.6-54.6z" />
                        </svg>
                      ))}
                  </button>

                  {openSubCategory === Number(category.id) &&
                    category.child_categories &&
                    category.child_categories.length > 0 && (
                      <ul className="ml-4 mt-2 flex flex-col space-y-1">
                        {category.child_categories.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/shop/?category=${child.id}`}
                              onClick={onLinkClick}
                              className="block text-[var(--textColor)] hover:text-white hover:bg-[var(--mainColor)] p-2 rounded-md"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.path}
          onClick={onLinkClick}
          className="text-[var(--textColor)] hover:text-white hover:bg-[var(--mainColor)] p-2 rounded-md"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
