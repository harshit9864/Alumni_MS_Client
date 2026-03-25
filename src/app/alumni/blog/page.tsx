import BlogCardGrid from "../../components/blog";
import { auth } from "@clerk/nextjs/server";



export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();
  let posts =[];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/alumni/blogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // optional: ensures fresh data
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch blogs");
    }

    // console.log(result,userId);
    posts = result?.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  return <BlogCardGrid posts={posts} role="alumni" />;
}
