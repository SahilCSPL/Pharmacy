"use client";

import { useEffect, useState } from "react";
import { Blog, getAllBlogs } from "@/api/blogPageApi";
import SingleBlogCard from "@/components/ServerSideComponent/HomePageComponents/BlogSection/singleBlogCard";

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(8); // default for md and below

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

  // Update blogsPerPage based on window width:
  // - 12 for lg and xl screens (>= 1024px)
  // - 8 for md and below (< 1024px)
  useEffect(() => {
    const updateBlogsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setBlogsPerPage(12);
      } else {
        setBlogsPerPage(8);
      }
    };

    updateBlogsPerPage();
    window.addEventListener("resize", updateBlogsPerPage);
    return () => window.removeEventListener("resize", updateBlogsPerPage);
  }, []);

  // Compute totalPages ensuring it's at least 1
  const totalPages = Math.max(Math.ceil(blogs.length / blogsPerPage), 1);

  // Adjust currentPage if it exceeds totalPages (but now totalPages is at least 1)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [blogs, blogsPerPage, currentPage, totalPages]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      {/* Banner Section */}
      <div
        className="h-[400px] bg-cover bg-center py-5 lg:py-10 flex justify-center items-center flex-col"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background/testimonial-bg.webp)",
        }}
      >
        <h1 className="text-white text-4xl font-bold">Health Blogs</h1>
        {/* <nav className="text-sm text-white mb-4">
          <a href="/" className="text-grey-100 hover:text-[--mainColor]">
            Home
          </a>{" "}
          &gt;
          <span className="ml-2">Shop</span>
        </nav> */}
      </div>
      <div className="container mx-auto pt-10">
      <h3 className="text-3xl font-bold text-black px-3">Look What's Trending!</h3>
      </div>
      
      {/* Blog Grid Section */}
      <div className="container mx-auto pt-5 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg mx-[10px] bg-[#edf8fa] mb-[10px] shadow"
          >
            <SingleBlogCard blog={blog} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4 mb-5">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[--mainColor] text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[--mainColor] text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
