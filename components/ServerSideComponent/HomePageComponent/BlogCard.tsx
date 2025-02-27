import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/api/blogPageApi";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  // Assuming the API date is in the format:
  // "Thursday, 27 February 2025, 10:20AM"
  // We extract the date part ("27 February 2025") by splitting the string.
  const formattedDate =
    blog.created_at.split(",").length > 1
      ? blog.created_at.split(",")[1].trim()
      : blog.created_at;

  return (
    <div className="overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden group">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      {/* Date and Author */}
      <div className="px-4 py-2 border-b flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-1">
          <i className="fa-solid fa-user text-[--mainColor]"></i>
          <span className="text-sm text-[--mainColor]">{blog.created_by}</span>
        </div>
        <div className="flex items-center space-x-1">
          <i className="fa fa-calendar-alt text-[--mainColor]"></i>
          <span className="text-sm text-[--mainColor]">{formattedDate}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-[--textColor]">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{blog.content}</p>
        <Link
          href={`/blogs/${blog.slug}`}
          className="text-[--mainColor] hover:underline transition-colors duration-300"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
