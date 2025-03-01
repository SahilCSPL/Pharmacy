"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import FilterSidebar from "./FilterSidebar"
import { Category, Product, ShopFilters } from "./type"
import MobileFilterOverlay from "./MobileFilterOverlay"
import ProductCard from "../HomePageComponents/ProductDisplaySection/productCard"

interface ShopPageClientProps {
  initialProducts: Product[]
  initialCategories: Category[]
}

export default function ShopPageClient({ initialProducts, initialCategories }: ShopPageClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get("category")

  // Store the complete product list separately (never change this)
  const [allProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [filters, setFilters] = useState<ShopFilters>({
    category: "",
    subCategories: [],
    sort: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const productsPerPage = 12

  // On initial load, if there's a categoryId in the URL,
  // set that as the default filter
  useEffect(() => {
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        subCategories: [Number(categoryId)],
      }))

      // Remove the query parameter after using it
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.delete("category")
      router.replace(currentUrl.toString())
    }
  }, [categoryId, router])

  // Filter products when filters change using the full list
  useEffect(() => {
    let filtered = allProducts

    // Filter by subcategories if any are selected
    if (filters.subCategories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.subCategories.includes(product.category_id)
      )
    }

    // Sort products
    if (filters.sort === "price-low-high") {
      filtered = [...filtered].sort((a, b) => a.base_price - b.base_price)
    } else if (filters.sort === "price-high-low") {
      filtered = [...filtered].sort((a, b) => b.base_price - a.base_price)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page
  }, [filters, allProducts])

  // Reset filters function
  const resetFilters = () => {
    setFilters({
      category: "",
      subCategories: [],
      sort: "",
    })
    setFilteredProducts(allProducts)
    setCurrentPage(1)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  return (
    <div className="flex flex-wrap lg:mx-[20px] mt-5 max-w-8xl p-4">
      {/* Desktop Sidebar: hidden on mobile */}
      <div className="hidden md:block md:w-1/3 lg:w-1/4 xl:w-1/5 pr-4">
        <h2 className="text-lg font-bold mb-3 p-4 bg-[--mainColor] text-white rounded-lg">
          Filters
        </h2>
        <FilterSidebar
          categories={initialCategories}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
        />
      </div>

      {/* Product Grid */}
      <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 md:pl-4">
        {/* Sort Dropdown */}
        <div className="flex justify-between md:justify-end items-end md:items-center pb-4 md:pb-0">
          <div className="block md:hidden w-1/2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="w-full bg-[--mainColor] text-white py-2 rounded-md"
            >
              Filter
            </button>
          </div>
          <div className="md:mt-4 flex flex-col md:flex-row items-center justify-end md:mb-3 w-1/2">
            <label className="block font-semibold mx-2 md:mx-4 text-sm md:text-base">
              Sort by:
            </label>
            <select
              className="border rounded p-2 w-[120px] md:w-[180px] mt-1"
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: e.target.value }))
              }
            >
              <option value="">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 h-[700px] overflow-y-auto bg-white rounded-lg">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div key={product.id} className="mb-3">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-500">
                No products found matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-[--mainColor] text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setCurrentPage(index + 1)}
                aria-label={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFilterOpen && (
        <MobileFilterOverlay
          categories={initialCategories}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          onClose={() => setMobileFilterOpen(false)}
        />
      )}
    </div>
  )
}
