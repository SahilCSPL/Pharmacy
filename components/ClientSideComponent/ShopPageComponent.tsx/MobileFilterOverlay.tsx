"use client"

import type React from "react"

import FilterSidebar from "./FilterSidebar"
import { Category, ShopFilters } from "./type"

interface MobileFilterOverlayProps {
  categories: Category[]
  filters: ShopFilters
  setFilters: React.Dispatch<React.SetStateAction<ShopFilters>>
  resetFilters: () => void
  onClose: () => void
}

export default function MobileFilterOverlay({
  categories,
  filters,
  setFilters,
  resetFilters,
  onClose,
}: MobileFilterOverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Filter products"
    >
      <div className="bg-white w-3/4 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-600 text-2xl" aria-label="Close filters">
            &times;
          </button>
        </div>
        <FilterSidebar categories={categories} filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
      </div>
      {/* Clicking outside the sidebar closes the filter */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  )
}

