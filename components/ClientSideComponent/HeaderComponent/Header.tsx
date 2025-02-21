"use client";
import { useEffect, useState } from "react";
import SearchButton from "./SearchButton";
import CartButton from "./CartButton";
import WishlistButton from "./WishlistButton";
import MobileMenuButton from "./MobileMenuButton";
import HeaderLogo from "@/components/ServerSideComponent/HeaderComponent/HeaderLogo";
import HeaderDesktopNavigation from "@/components/ServerSideComponent/HeaderComponent/HeaderDesktopNavigation";
import MobileOffcanvas from "@/components/ServerSideComponent/HeaderComponent/MobileOffcanvas";
import UserButton from "./UserButton";
import CartOverlay from "../CartComponent/CartOverly";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 500);
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 w-full transition-all duration-300 z-50 bg-white border-b ${
        isScrolled ? "shadow-md" : "py-2"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-8">
        {/* Logo */}
        <HeaderLogo />

        {/* Desktop Navigation */}
        <HeaderDesktopNavigation />

        <div className="flex items-center space-x-2 lg:space-x-6 ms-2">
          {/* Search Bar */}
          <SearchButton />

          {/* Desktop Icons */}
          <div className="hidden lg:flex space-x-4">
            <UserButton />
            <WishlistButton />
            <CartOverlay />
          </div>

          {/* Mobile toggle button */}
          <MobileMenuButton setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <MobileOffcanvas isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
};

export default Header;
