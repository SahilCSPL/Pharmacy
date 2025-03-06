"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import { Category, Product, ShopFilters } from "./type";
import MobileFilterOverlay from "./MobileFilterOverlay";
import ProductCard from "../HomePageComponents/ProductDisplaySection/productCard";

interface ShopPageClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ShopPageClient({
  initialProducts,
  initialCategories,
}: ShopPageClientProps) {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.getAll("category");

  // Store the complete product list (never change this)
  const [allProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<ShopFilters>({
    category: "",
    subCategories: [],
    sort: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const productsPerPage = 12;

  const initialLoadRef = useRef(true);

  // On initial load, parse URL parameters.
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      if (categoryParams.length > 0) {
        const parsedCategories = categoryParams
          .map((cat) => Number(cat))
          .filter((cat) => !isNaN(cat));
        if (parsedCategories.length > 0) {
          setFilters((prev) => ({ ...prev, subCategories: parsedCategories }));
        } else {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete("category");
          window.history.replaceState(null, "", currentUrl.toString());
        }
      }
    }
  }, [categoryParams]);

  // Whenever filters change, update filteredProducts.
  useEffect(() => {
    let filtered = allProducts;

    // Filter by subCategories if any are selected.
    if (filters.subCategories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.subCategories.includes(product.category_id)
      );
    }

    // Sort products.
    if (filters.sort === "price-low-high") {
      filtered = [...filtered].sort((a, b) => a.base_price - b.base_price);
    } else if (filters.sort === "price-high-low") {
      filtered = [...filtered].sort((a, b) => b.base_price - a.base_price);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, allProducts]);

  // Update subCategories and synchronize the URL immediately.
  const updateSubCategories = (categoryId: number, checked: boolean) => {
    let updatedSubCategories: number[];
    if (checked) {
      updatedSubCategories = [...filters.subCategories, categoryId];
    } else {
      updatedSubCategories = filters.subCategories.filter(
        (id) => id !== categoryId
      );
    }
    setFilters((prev) => ({ ...prev, subCategories: updatedSubCategories }));

    const params = new URLSearchParams(window.location.search);
    params.delete("category");
    updatedSubCategories.forEach((cat) =>
      params.append("category", cat.toString())
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  // For sort changes.
  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  // Reset filters function.
  const resetFilters = () => {
    setFilters({
      category: "",
      subCategories: [],
      sort: "",
    });
    setFilteredProducts(allProducts);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    params.delete("category");
    params.delete("sort");
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Helper function to get subcategory name by id.
  const getSubCategoryName = (id: number): string => {
    for (const category of initialCategories) {
      const found = category.child_categories.find(
        (subCat) => subCat.id === id
      );
      if (found) return found.name;
    }
    return "";
  };

  return (
    <div className="flex flex-col md:flex-row md:mx-5 md:mt-5 max-w-8xl p-2 md:p-0 lg:p-4">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block md:w-1/3 lg:w-1/4 xl:w-1/5 pr-3 xl:pr-4 ">
        <div className="flex items-center text-lg font-medium mb-3 p-4 bg-[--mainColor] text-white rounded-lg">
          <svg
            width="20"
            height="20"
            stroke="2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M4.833 6.5a1.667 1.667 0 1 1 3.334 0 1.667 1.667 0 0 1-3.334 0M4.05 7H2.5a.5.5 0 0 1 0-1h1.55a2.5 2.5 0 0 1 4.9 0h8.55a.5.5 0 0 1 0 1H8.95a2.5 2.5 0 0 1-4.9 0m11.117 6.5a1.667 1.667 0 1 0-3.334 0 1.667 1.667 0 0 0 3.334 0M13.5 11a2.5 2.5 0 0 1 2.45 2h1.55a.5.5 0 0 1 0 1h-1.55a2.5 2.5 0 0 1-4.9 0H2.5a.5.5 0 0 1 0-1h8.55a2.5 2.5 0 0 1 2.45-2"
            ></path>
          </svg>
          <h2 className="ml-1">Filter</h2>
        </div>
        <FilterSidebar
          categories={initialCategories}
          filters={filters}
          updateSubCategories={updateSubCategories}
          resetFilters={resetFilters}
        />
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 pl:3 xl:pl-4">
        {/* Mobile filter button */}
        <div className="flex justify-between items-center md:hidden md:mb-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="border rounded-full border-[--textColor] rounded py-2 px-4 flex p-2 gap-2 items-center bg-white"
          >
            <svg
              width="20"
              height="20"
              stroke="2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4.833 6.5a1.667 1.667 0 1 1 3.334 0 1.667 1.667 0 0 1-3.334 0M4.05 7H2.5a.5.5 0 0 1 0-1h1.55a2.5 2.5 0 0 1 4.9 0h8.55a.5.5 0 0 1 0 1H8.95a2.5 2.5 0 0 1-4.9 0m11.117 6.5a1.667 1.667 0 1 0-3.334 0 1.667 1.667 0 0 0 3.334 0M13.5 11a2.5 2.5 0 0 1 2.45 2h1.55a.5.5 0 0 1 0 1h-1.55a2.5 2.5 0 0 1-4.9 0H2.5a.5.5 0 0 1 0-1h8.55a2.5 2.5 0 0 1 2.45-2"
              ></path>
            </svg>
            Filter
          </button>
          <div className="">
            {/* <label className="font-semibold mx-2 text-sm md:text-base">
              Sort by:
            </label> */}
            <select
              className="border rounded-full border-[--textColor] rounded p-2 w-[150px] md:w-[180px]"
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
        {/* Sort and Selected Filters Container */}
        <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-end pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-0">
            {filters.subCategories.length > 0 && (
              <>
                <button
                  onClick={resetFilters}
                  className="flex items-center border border-[--mainColor] text-[--mainColor] rounded-full px-3 py-1 text-sm"
                >
                  Clear All
                </button>
                {filters.subCategories.map((id) => (
                  <div
                    key={id}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1"
                  >
                    <span className="mr-2 text-sm">
                      {getSubCategoryName(id)}
                    </span>
                    <button
                      onClick={() => updateSubCategories(id, false)}
                      aria-label="Remove filter"
                      className="text-sm text-gray-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="flex items-center p-2 hidden md:block">
            {/* <label className="font-semibold mx-2 text-sm md:text-base">
              Sort by:
            </label> */}
            <select
              className="border rounded p-2 w-[180px] mt-1"
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 md:p-4 h-[700px] overflow-y-auto bg-white rounded-lg">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div key={product.id} className="md:mb-3">
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
          <div className="flex justify-center items-center my-4">
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
          updateSubCategories={updateSubCategories}
          resetFilters={resetFilters}
          onClose={() => setMobileFilterOpen(false)}
        />
      )}
    </div>
  );
}
