'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { Blog, getAllBlogs } from "@/api/blogPageApi";

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.results);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="container mx-auto py-4 lg:py-5">
      {/* Header Section */}
      <div className="flex justify-between items-center px-[10px]">
        <div></div>
        <h2 className="text-[20px] lg:text-[40px] text-[--textColor] font-bold ">
          Latest Blogs
        </h2>
        <Link href="/blogs">View All</Link>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {blogs.map((blog, index) => (
          <div
            key={blog.id}
            className={`bg-white rounded-lg mx-[10px] bg-[#edf8fa] shadow ${index > 1 ? "hidden lg:block" : "block"}`}
          >
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;