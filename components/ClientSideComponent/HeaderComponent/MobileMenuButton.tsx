import { FaBars } from "react-icons/fa";

export default function MobileMenuButton({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <button
      aria-label="Open mobile menu"
      className="xl:hidden cursor-pointer text-[var(--mainColor)] py-2 rounded-md"
      onClick={() => setIsOpen(true)}
    >
      <FaBars size={25} />
    </button>
  );
}
