import Link from "next/link";

const navItems = [
  { name: "Medicines", path: "/medicines" },
  { name: "Categories", path: "/categories" },
  { name: "Health Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export default function MobileNavigation() {

  return (
    <nav className="mt-5 flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="text-[var(--textColor)] hover:text-white hover:bg-[var(--mainColor)] p-2 rounded-md"
          >
            {item.name}
          </Link>
        ))}
      </nav>
  );
}
