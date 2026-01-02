import BlogCardGrid from "@/app/components/blog";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let blogs = null; // ✅ defined in outer scope

  try {
    const response = await fetch("http://localhost:8080/student/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json(); // ✅ read once

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch blogs");
    }

    blogs = result.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  // ✅ Fallback UI when posts are null or empty
  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        <p>No blogs available right now.</p>
      </div>
    );
  }

  return <BlogCardGrid posts={blogs} role="student"/>;
}
