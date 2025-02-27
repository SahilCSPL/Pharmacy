"use client";

import CartButton from "@/components/ClientSideComponent/HeaderComponent/CartButton";
import WishlistButton from "@/components/ClientSideComponent/HeaderComponent/WishlistButton";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import MobileNavigation from "./MobileNavigation";
import UserButton from "@/components/ClientSideComponent/HeaderComponent/UserButton";
import CartOverlay from "@/components/ClientSideComponent/CartComponent/CartOverly";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type MobileOffcanvasProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function MobileOffcanvas({ isOpen, setIsOpen }: MobileOffcanvasProps) {
  const pathname = usePathname();

  // Close offcanvas on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 w-[75%] md:w-[50%] h-full bg-white shadow-lg z-50 p-5 flex flex-col"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[var(--textColor)]">Menu</h2>
            <FaTimes
              className="cursor-pointer text-[var(--mainColor)]"
              size={35}
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="flex space-x-1 py-4 border-b items-center">
            <UserButton />
            <div className="lg:hidden" onClick={() => setIsOpen(false)}>
              <WishlistButton/>
            </div>
            <div className="lg:hidden">
              <CartOverlay />
            </div>
          </div>
          <MobileNavigation onLinkClick={() => setIsOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
