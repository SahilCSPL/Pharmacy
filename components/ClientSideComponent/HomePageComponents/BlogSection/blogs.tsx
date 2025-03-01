"use client"
import Link from "next/link"
import type { Blog } from "@/api/blogPageApi"
import SingleBlogCard from "@/components/ServerSideComponent/HomePageComponents/BlogSection/singleBlogCard"

interface BlogSectionClientProps {
  blogs: Blog[]
}

export function BlogSectionClient({ blogs }: BlogSectionClientProps) {
  if (!blogs || blogs.length === 0) {
    return (
      <section className="container mx-auto py-4 lg:py-5">
        <div className="flex justify-between items-center px-[10px]">
          <div></div>
          <h2 className="text-[20px] lg:text-[40px] text-[--textColor] font-bold">Latest Blogs</h2>
          <Link href="/blogs">View All</Link>
        </div>
        <p className="text-center text-gray-500 mt-4 py-8">No blogs available at the moment.</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto py-4 lg:py-5">
      {/* Header Section */}
      <div className="flex justify-between items-center px-[10px]">
        <div></div>
        <h2 className="text-[20px] lg:text-[40px] text-[--textColor] font-bold">Latest Blogs</h2>
        <Link href="/blogs">View All</Link>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {blogs.map((blog, index) => (
          <div
            key={blog.id}
            className={`bg-white rounded-lg mx-[10px] bg-[#edf8fa] shadow ${index > 1 ? "hidden lg:block" : "block"}`}
          >
            <SingleBlogCard blog={blog} />
          </div>
        ))}
      </div>
    </section>
  )
}

