import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllBlogs, Blog } from "@/api/blogPageApi";
import SingleBlogCard from "@/components/ServerSideComponent/HomePageComponents/BlogSection/singleBlogCard";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const response = await getAllBlogs();
  return response.results.map((blog: Blog) => ({
    slug: blog.slug,
  }));
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params; // Extract slug as in your ProductPage example

  // Fetch all blogs (since there's no dedicated single blog API)
  const response = await getAllBlogs();
  const blog = response.results.find((b: Blog) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  // Filter out the current blog from the list of other blogs
  const otherBlogs = response.results.filter((b: Blog) => b.slug !== slug);

  // Format the date (assuming "Thursday, 27 February 2025, 10:20AM")
  const formattedDate =
    blog.created_at.split(",").length > 1
      ? blog.created_at.split(",")[1].trim()
      : blog.created_at;

  return (
    <div className="">
      {/* Full-width Banner */}
      <div className="relative w-full h-80 md:h-96 overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Main Content & Aside */}
      <div className="mt-8 flex flex-col lg:flex-row gap-8 container mx-auto p-6">
        {/* Blog Details */}
        <div className="flex-1">
          {/* Title, Author & Date */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{blog.title}</h1>
          <div className="text-gray-600 mb-4">
            <span className="mr-4">By {blog.created_by}</span>
            <span>{formattedDate}</span>
          </div>
          {/* Blog Description */}
          <p className="text-gray-800 leading-relaxed">{blog.content}</p>
        </div>

        {/* Aside: Other Blogs using BlogCard */}
        <aside className="w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Other Blogs</h2>
          <div className="space-y-4">
            {otherBlogs.map((otherBlog: Blog) => (
              <SingleBlogCard blog={otherBlog} key={otherBlog.id} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

