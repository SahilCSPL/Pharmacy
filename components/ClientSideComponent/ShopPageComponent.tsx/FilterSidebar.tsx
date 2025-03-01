"use client";

import type React from "react";
import { useState } from "react";
import { Category, ShopFilters } from "./type";

interface FilterSidebarProps {
  categories: Category[];
  filters: ShopFilters;
  updateSubCategories: (categoryId: number, checked: boolean) => void;
  resetFilters: () => void;
}

export default function FilterSidebar({
  categories,
  filters,
  updateSubCategories,
  resetFilters,
}: FilterSidebarProps) {
  const [openCategory, setOpenCategory] = useState<string>("");

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? "" : categoryId);
  };

  const handleSubCategoryChange = (id: number) => {
    const isSelected = filters.subCategories.includes(id);
    updateSubCategories(id, !isSelected);
  };

  return (
    <div className="filters bg-white h-[700px] overflow-y-auto rounded-lg p-4">
      {categories.map((category) => (
        <div key={category.id} className="mb-3">
          {/* Category Header (Accordion Toggle) */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="bg-white w-full text-left flex justify-between items-center p-2 hover:shadow-md rounded-md"
          >
            {category.name}
            <span>
              {openCategory === category.id ? (
                // Caret Up (fa-caret-up)
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
                // Caret Down (fa-caret-down)
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
            </span>
          </button>

          {/* Subcategories (Toggle based on state) */}
          {openCategory === category.id && (
            <ul className="pl-4 mt-2">
              {category.child_categories.map((subCategory) => (
                <li
                  key={subCategory.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={`subCat-${subCategory.id}`}
                    checked={filters.subCategories.includes(subCategory.id)}
                    onChange={() => handleSubCategoryChange(subCategory.id)}
                    className="accent-[--mainColor]"
                  />
                  <label htmlFor={`subCat-${subCategory.id}`}>
                    {subCategory.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div className="mt-4">
        <button
          onClick={resetFilters}
          className="w-full bg-[--mainColor] text-white py-2 rounded-md"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
