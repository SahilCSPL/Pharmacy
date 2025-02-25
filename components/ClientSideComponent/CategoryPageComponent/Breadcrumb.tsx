import Link from "next/link";
import type { Category } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";

interface BreadcrumbProps {
  category: Category;
}

export default function Breadcrumb({ category }: BreadcrumbProps) {
  return (
    <nav className="text-sm mb-4">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center text-white">
          <Link href="/" className=" hover:text-[--mainColor] mr-2">
            Home
          </Link>
          &gt;
        </li>
        <li className="flex items-center ml-2">
          <span className="text-white">{category.name}</span>
        </li>
      </ol>
    </nav>
  );
}
