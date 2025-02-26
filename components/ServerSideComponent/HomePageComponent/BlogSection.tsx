// components/BlogSection.tsx
import React from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";

export interface Blog {
  id: number;
  thumbnail: string;
  date: string;
  category: string;
  title: string;
  description: string;
  slug: string;
}
const blogs: Blog[] = [
  {
    id: 1,
    thumbnail: "/blog/online-pharmacy-blog.jpg",
    date: "2025-02-10",
    category: "Pharmacy",
    title: "The Rise of Online Pharmacies",
    description:
      "Explore how online pharmacies are revolutionizing healthcare, offering convenience, accessibility, and a wide range of products right at your fingertips.",
    slug: "rise-of-online-pharmacies",
  },
  {
    id: 2,
    thumbnail: "/blog/How-to-Safely-Order-Medications-Online.jpg",
    date: "2025-01-28",
    category: "Health Tips",
    title: "How to Safely Order Medications Online",
    description:
      "Learn essential tips for verifying the authenticity of online pharmacies and ensuring the safe purchase of medications without compromising your health.",
    slug: "safely-order-medications-online",
  },
  {
    id: 3,
    thumbnail: "/blog/Staying-Healthy-with-a-Digital-Prescription.jpg",
    date: "2025-01-15",
    category: "Wellness",
    title: "Staying Healthy with a Digital Prescription",
    description:
      "Discover the benefits of digital prescriptions and how they streamline the process of getting your medications, making it easier to manage your health.",
    slug: "staying-healthy-digital-prescription",
  },
  {
    id: 4,
    thumbnail: "/blog/Trends-Shaping-the-Future-of-Pharmacy-eCommerce.jpg",
    date: "2025-01-05",
    category: "eCommerce Trends",
    title: "Trends Shaping the Future of Pharmacy eCommerce",
    description:
      "Delve into the emerging trends in pharmacy eCommerce, including personalized medicine, telehealth integration, and innovative delivery services.",
    slug: "future-of-pharmacy-ecommerce",
  },
];

const BlogSection: React.FC = () => {
  return (
    <section className="container mx-auto py-4 lg:py-5">
      {/* Header Section */}
      <div className="flex justify-between items-center px-[10px]">
        <div></div>
        <h2 className="text-[20px] lg:text-[40px] text-[--textColor] font-bold ">
          Latest Blogs
        </h2>
        <Link href="/blog">View All</Link>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {blogs.map((blog, index) => (
          <div
            key={blog.id}
            // Hide the last two cards on mobile view (below md)
            className={`bg-white rounded-lg mx-[10px] bg-[#edf8fa] shadow ${
              index > 1 ? "hidden lg:block" : "block"
            }`}
          >
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
