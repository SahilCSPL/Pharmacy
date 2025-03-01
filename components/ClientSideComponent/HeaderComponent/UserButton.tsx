"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { clearUser } from "@/redux/userSlice";
import { clearCart } from "@/redux/cartSlice";

interface DropdownMenuProps {
  onLogoutClick: () => void;
}

function DropdownMenu({ onLogoutClick }: DropdownMenuProps) {
  return (
    <div
      role="menu"
      className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
    >
      <Link
        href="/profile"
        role="menuitem"
        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
      >
        Profile
      </Link>
      <button
        role="menuitem"
        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
        onClick={onLogoutClick}
      >
        Logout
      </button>
    </div>
  );
}

export default function UserButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown on click (for mobile and desktop)
  const handleToggleDropdown = () => {
    if (user.token) {
      setDropdownOpen((prev) => !prev);
    } else {
      router.push("/user-login");
    }
  };

  // Logout handler: clear user data and optionally redirect.
  const handleLogoutClick = () => {
    dispatch(clearUser());
    dispatch(clearCart());
    setDropdownOpen(false);
    router.push("/user-login");
  };

  // Close dropdown if clicking outside the component.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Use a button to toggle dropdown for logged in users */}
      <button
        onClick={handleToggleDropdown}
        className="group cursor-pointer hover:bg-[var(--mainColor)] hover:text-white p-2 rounded-md flex items-center"
      >
        {user.token && user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Profile picture"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex items-center justify-center w-7 h-7 bg-[var(--mainColor)] rounded-full group-hover:bg-white transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-white group-hover:text-[var(--mainColor)] transition-colors duration-300"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a6 6 0 0 1 6-6 6 6 0 0 1 6 6v2" />
            </svg>
          </span>
        )}
        {user.token ? (
          <p className="hover:text-white ml-2">{user.first_name}</p>
        ) : (
          <p className="hover:text-white ml-2">Log in</p>
        )}
      </button>

      {/* Render dropdown only if user is logged in and dropdown is open */}
      {user.token && isDropdownOpen && (
        <DropdownMenu onLogoutClick={handleLogoutClick} />
      )}
    </div>
  );
}
