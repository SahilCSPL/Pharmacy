"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCategories } from "@/api/ShopPageApi";
import { Category } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";

const navItems = [
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
          <i
            className={`fa-solid ${
              isCategoriesOpen ? "fa-caret-up" : "fa-caret-down"
            }`}
          ></i>
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
                      category.child_categories.length > 0 && (
                        <i
                          className={`fa-solid ${
                            openSubCategory === Number(category.id)
                              ? "fa-caret-up"
                              : "fa-caret-down"
                          }`}
                        ></i>
                      )}
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
