import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/api/blogPageApi";

interface BlogCardProps {
  blog: Blog;
}

export default function SingleBlogCard({ blog }: BlogCardProps) {
  // Format the date part from "Thursday, 27 February 2025, 10:20AM"
  const formattedDate =
    blog.created_at.split(",").length > 1
      ? blog.created_at.split(",")[1].trim()
      : blog.created_at;

  return (
    <div className="overflow-hidden">
      {/* Thumbnail wrapped in Link */}
      <Link href={`/blogs/${blog.slug}`}>
        <div className="relative h-48 overflow-hidden group">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 rounded-md"
          />
        </div>
      </Link>
      {/* Date and Author */}
      <div className="py-1 flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-1">
          <span className="text-[12px] text-gray-600">{blog.created_by}</span>
          <span className="text-[20px] text-gray-400">&bull;</span>
          <span className="text-[12px] text-gray-600">{formattedDate}</span>
        </div>
      </div>
      {/* Content */}
      <div>
        <div className="flex justify-between">
          {/* Title wrapped in Link */}
          <Link href={`/blogs/${blog.slug}`} className="flex-1">
            <h3 className="text-lg font-[500] mb-2 text-[--textColor] line-clamp-2">
              {blog.title}
            </h3>
          </Link>
          {/* Arrow icon as a secondary Link */}
          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex hover:text-[--mainColor] transition-colors duration-300"
            aria-label={blog.slug}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2"
            >
              <path
                d="M14 3L21 3L21 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14L21 3"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21H3V3"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3">{blog.content}</p>
      </div>
    </div>
  );
}
