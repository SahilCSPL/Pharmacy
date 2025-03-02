import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export default function WishlistButton() {
  return (
    <div className="wishlist-button flex justify-center items-center">
      <Link href="/profile/?tab=wishlistInfo" aria-label="Wishlist">
        <FaHeart
          className="cursor-pointer text-[var(--mainColor)] hover:text-white hover:bg-[var(--mainColor)] p-2 rounded-md"
          size={35}
        />
      </Link>
    </div>
  );
}
