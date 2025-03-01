import { getAllBlogs } from "@/api/blogPageApi"
import { BlogSectionClient } from "@/components/ClientSideComponent/HomePageComponents/BlogSection/blogs"

export default async function BlogSection() {
  // Server-side data fetching
  const data = await getAllBlogs().catch((error) => {
    console.error("Error fetching blogs:", error)
    return { results: [] }
  })

  return <BlogSectionClient blogs={data.results} />
}

