"use client"

import type React from "react"
import { useState } from "react"
import { Category, ShopFilters } from "./type"

interface FilterSidebarProps {
  categories: Category[]
  filters: ShopFilters
  setFilters: React.Dispatch<React.SetStateAction<ShopFilters>>
  resetFilters: () => void
}

export default function FilterSidebar({ categories, filters, setFilters, resetFilters }: FilterSidebarProps) {
  const [openCategory, setOpenCategory] = useState<string>("")

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? "" : categoryId)
  }

  const handleSubCategoryChange = (id: number) => {
    setFilters((prevFilters) => {
      const isSelected = prevFilters.subCategories.includes(id)
      return {
        ...prevFilters,
        subCategories: isSelected
          ? prevFilters.subCategories.filter((catId) => catId !== id)
          : [...prevFilters.subCategories, id],
      }
    })
  }

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
                <i className="fa-solid fa-caret-up"></i>
              ) : (
                <i className="fa-solid fa-caret-down"></i>
              )}
            </span>
          </button>

          {/* Subcategories (Toggle based on state) */}
          {openCategory === category.id && (
            <ul className="pl-4 mt-2">
              {category.child_categories.map((subCategory) => (
                <li key={subCategory.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`subCat-${subCategory.id}`}
                    checked={filters.subCategories.includes(subCategory.id)}
                    onChange={() => handleSubCategoryChange(subCategory.id)}
                    className="accent-[--mainColor]"
                  />
                  <label htmlFor={`subCat-${subCategory.id}`}>{subCategory.name}</label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div className="mt-4">
        <button onClick={resetFilters} className="w-full bg-[--mainColor] text-white py-2 rounded-md">
          Reset Filters
        </button>
      </div>
    </div>
  )
}

