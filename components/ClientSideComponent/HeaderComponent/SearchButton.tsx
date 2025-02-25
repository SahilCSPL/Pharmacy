import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
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

  // Call searchProducts when the debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      searchProducts(debouncedQuery)
        .then((data) => {
          // Assuming your API returns an object with a "products" array.
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

  // Update the query state as the user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
  };

  // Handle arrow-key navigation and Enter key selection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        console.log("Selected:", results[activeIndex]);
        // Add any further logic for selection (e.g., routing)
        setQuery("");
        setResults([]);
      }
    }
  };

  // Handle clicking a search result
  const handleResultClick = (index: number) => {
    console.log("Clicked:", results[index]);
    // Add any further logic for selection (e.g., routing)
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full md:w-auto">
      <div className="flex bg-gray-100 px-4 py-2 rounded-lg items-center">
        <FaSearch className="text-[var(--mainColor)]" />
        <input
          type="text"
          placeholder="Search medicines..."
          className="bg-transparent outline-none px-2 w-full text-[var(--textColor)]"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
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
