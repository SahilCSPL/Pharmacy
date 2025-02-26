"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { clearUser } from "@/redux/userSlice";
import { clearCart } from "@/redux/cartSlice";

interface DropdownMenuProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLogoutClick: () => void;
}

function DropdownMenu({
  onMouseEnter,
  onMouseLeave,
  onLogoutClick,
}: DropdownMenuProps) {
  return (
    <div
      role="menu"
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
  const hoverTimeout = useRef<number | null>(null);

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

  // Mouse event handlers to control the dropdown display.
  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = window.setTimeout(() => {
      setDropdownOpen(false);
    }, 200); // Adjust delay as needed
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main link: navigates to Profile if logged in; else to Login */}
      <Link
        href={user.token ? "/profile" : "/user-login"}
        className="group cursor-pointer hover:bg-[var(--mainColor)] hover:text-white p-2 rounded-md flex items-center"
      >
        {user.token && user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Profile picture"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <i className="fa-regular fa-user text-[var(--mainColor)] group-hover:text-white"></i>
        )}
        {user.token ? (
          <p className="hover:text-white ml-2">{user.first_name}</p>
        ) : (
          <p className="hover:text-white ml-2">Log in</p>
        )}
      </Link>

      {/* Show dropdown only if user is logged in */}
      {user.token && isDropdownOpen && (
        <DropdownMenu
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onLogoutClick={handleLogoutClick}
        />
      )}
    </div>
  );
}
