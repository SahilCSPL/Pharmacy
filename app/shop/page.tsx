"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { APICore } from "@/api/APICore";
import {
  Category,
  Product,
} from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import { getAllProducts, getCategoryWiseProducts } from "@/api/ShopPageApi";
import ProductCard from "@/components/ServerSideComponent/HomePageComponent/ProductCard";

const ShopPage = () => {
  const searchParams = useSearchParams();
  // Get the "category" query parameter (if provided)
  const categoryId = searchParams.get("category");

  const [filters, setFilters] = useState({
    category: "",
    subCategories: [] as number[], // Store selected subcategory IDs
    sort: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openCategory, setOpenCategory] = useState<string>("");
  const productsPerPage = 12;
  // State to control mobile filter sidebar visibility
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // When a category parameter is present, preselect it in the filters
  useEffect(() => {
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        subCategories: [Number(categoryId)],
      }));
    }
  }, [categoryId]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await APICore<{ product_categories: Category[] }>(
        "/frontend/categories/",
        "GET"
      );
      setCategories(data.product_categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? " " : categoryId);
  };

  // Combined product fetching: if categoryId exists, fetch category-wise, otherwise fetch all products.
  const fetchProducts = async () => {
    try {
      if (categoryId) {
        const data = await getCategoryWiseProducts(categoryId);
        setProducts(data.products);
      } else {
        const data = await getAllProducts();
        setProducts(data.products);
        setFilteredProducts(data.products); // Initially, show all products
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  // Filter products when filters change
  useEffect(() => {
    let filtered = products;

    // Filter by subcategories if any are selected
    if (filters.subCategories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.subCategories.includes(product.category_id)
      );
    }

    // Sort products
    if (filters.sort === "price-low-high") {
      filtered = [...filtered].sort(
        (a, b) => a.selling_price - b.selling_price
      );
    } else if (filters.sort === "price-high-low") {
      filtered = [...filtered].sort(
        (a, b) => b.selling_price - a.selling_price
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page
  }, [filters, products]);

  // Handle checkbox selection
  const handleSubCategoryChange = (id: number) => {
    setFilters((prevFilters) => {
      const isSelected = prevFilters.subCategories.includes(id);
      return {
        ...prevFilters,
        subCategories: isSelected
          ? prevFilters.subCategories.filter((catId) => catId !== id)
          : [...prevFilters.subCategories, id],
      };
    });
  };

  // Handle sorting change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prevFilters) => ({ ...prevFilters, sort: e.target.value }));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Filter content used in both desktop sidebar and mobile filter modal
  const filterContent = (
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
    </div>
  );

  return (
    <section className="bg-[#f3f3f3]">
      {/* Breadcrumb & Banner */}
      <div
        className="h-[400px] bg-cover bg-center py-5 lg:py-10 flex justify-center items-center flex-col"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background/testimonial-bg.jpg)",
        }}
      >
        <h1 className="text-white text-4xl font-bold">Our Products</h1>
        <nav className="text-sm text-white mb-4">
          <a href="/" className="text-grey-100 hover:text-[--mainColor]">
            Home
          </a>{" "}
          &gt;
          <span className="ml-2">Shop</span>
        </nav>
      </div>

      {/* Mobile Filter Button */}

      <div className="flex flex-wrap lg:mx-[20px] mt-5 max-w-8xl">
        {/* Desktop Sidebar: hidden on mobile */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4 xl:w-1/5 pr-4">
          <h2 className="text-lg font-bold mb-3 p-4 bg-[--mainColor] text-white rounded-lg">
            Filters
          </h2>
          {filterContent}
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 pl-4">
          {/* Sort Dropdown */}
          <div className="flex jsutify-between md:justify-end items-center pb-4">
            <div className="block md:hidden px-4 w-1/2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="w-full bg-[--mainColor] text-white py-2 rounded-md"
              >
                Filter
              </button>
            </div>
            <div className="md:mt-4 flex items-center justify-end md:mb-3 w-1/2">
              <label className="block font-semibold mx-4">Sort by:</label>
              <select
                className="border rounded p-2 w-[100px] mt-1"
                value={filters.sort}
                onChange={handleSortChange}
              >
                <option value="">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 h-[700px] overflow-y-auto bg-white rounded-lg">
            {displayedProducts.map((product) => (
              <div key={product.id} className="mb-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
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
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white w-3/4 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            {filterContent}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-4 w-full bg-[--mainColor] text-white py-2 rounded-md"
            >
              Apply Filters
            </button>
          </div>
          {/* Clicking outside the sidebar closes the filter */}
          <div
            className="flex-1"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
        </div>
      )}
    </section>
  );
};

export default ShopPage;
