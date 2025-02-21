// components/BlogCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface Blog {
  id: number;
  thumbnail: string;
  date: string;
  category: string;
  title: string;
  description: string;
  slug: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48">
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>
      {/* Date and Category */}
      <div className="px-4 py-2 border-b flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <i className="fa fa-tag text-[--mainColor]"></i>
          <span className="text-sm text-[--mainColor]">{blog.category}</span>
        </div>
        <div className="flex items-center space-x-1">
          <i className="fa fa-calendar-alt text-[--mainColor]"></i>
          <span className="text-sm text-[--mainColor]">{blog.date}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-[--textColor]">{blog.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{blog.description}</p>
        <Link href={`/blog/${blog.slug}`}>Read more</Link>
      </div>
    </div>
  );
};

export default BlogCard;
