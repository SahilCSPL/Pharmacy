import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import useDebounce from "./useDebounce";
import { searchProducts } from "@/api/ShopPageApi";
import { Product } from "../ShopPageComponent.tsx/type";
import Link from "next/link";

export default function SearchButton() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const debouncedQuery = useDebounce(query, 500);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      searchProducts(debouncedQuery)
        .then((data) => {
          setResults(data.products || []);
        })
        .catch((error) => {
          console.error("Search error:", error);
          setResults([]);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        console.log("Selected:", results[activeIndex]);
        // Navigate or perform additional logic here.
        setQuery("");
        setResults([]);
      }
    } else if (e.key === "Escape") {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    }
  };

  const handleResultClick = (index: number) => {
    console.log("Clicked:", results[index]);
    // Navigate or perform additional logic here.
    setQuery("");
    setResults([]);
  };

  // Clear the search field
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  return (
    <div className="relative w-full md:w-auto">
      <div className="flex bg-gray-100 px-4 py-2 rounded-lg items-center relative">
        <FaSearch className="text-[var(--mainColor)]" />
        <input
          type="text"
          placeholder="Search medicines..."
          className="bg-transparent outline-none px-2 w-full text-[var(--textColor)]"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        )}
      </div>
      {results.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-[300px] overflow-y-auto"
        >
          {results.map((result, index) => (
            <Link href={`/product/${result.id}`} key={result.id}>
              <li
                className={`px-4 py-2 cursor-pointer ${
                  index === activeIndex ? "bg-gray-200" : ""
                }`}
                onClick={() => handleResultClick(index)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {result.name}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
