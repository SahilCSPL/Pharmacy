import CartButton from "@/components/ClientSideComponent/HeaderComponent/CartButton";
import WishlistButton from "@/components/ClientSideComponent/HeaderComponent/WishlistButton";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import MobileNavigation from "./MobileNavigation";
import UserButton from "@/components/ClientSideComponent/HeaderComponent/UserButton";
import CartOverlay from "@/components/ClientSideComponent/CartComponent/CartOverly";

const MobileOffcanvas = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) =>
  isOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed top-0 right-0 w-75 h-full bg-white shadow-lg z-50 p-5 flex flex-col"
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
        <div className="lg:hidden">
          <WishlistButton />
        </div>
        <div className="lg:hidden">
          <CartOverlay />
        </div>
      </div>
      <MobileNavigation />
    </motion.div>
  );

export default MobileOffcanvas;
