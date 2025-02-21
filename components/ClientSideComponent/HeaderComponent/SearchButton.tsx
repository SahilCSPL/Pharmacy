import { FaSearch } from "react-icons/fa";

export default function SearchButton() {
  return (
    <div className="flex bg-gray-100 px-4 py-2 rounded-lg items-center w-full md:w-auto">
      <FaSearch className="text-[var(--mainColor)]" />
      <input
        type="text"
        placeholder="Search medicines..."
        className="bg-transparent outline-none px-2 w-full text-[var(--textColor)]"
      />
    </div>
  );
}
