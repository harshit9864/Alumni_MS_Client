import BlogCardGrid from "../../components/blog";
import { auth } from "@clerk/nextjs/server";

const fallbackPosts = [
  {
    title: "The Future of Web Development",
    authorName: "Jane Doe",
    date: "Oct 6, 2025",
    summary:
      "Explore how AI and modern frameworks are shaping the future of web apps.",
    image: null,
  },
  {
    title: "Mastering TypeScript in 2025",
    authorName: "John Smith",
    date: "Sep 20, 2025",
    summary:
      "A complete guide to TypeScript’s new features and best practices.",
    image:
      "https://imgs.search.brave.com/oDBJCXaCX2xOPY5wqKm-TLN8tFsbFunuPwqIe5dEqlo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9raW5z/dGEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDIzLzA0L3doYXQtaXMtdHlwZXNjcmlwdC0xMDI0eDUxMi5qcGVn",
  },
];

export default async function Page() {
  const { getToken,userId } = await auth();
  const token = await getToken();
  let posts = fallbackPosts;

  try {
    const response = await fetch(`http://localhost:8080/alumni/blogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // optional: ensures fresh data
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to fetch blogs");
    }

    const result = await response.json();
    console.log(result,userId);
    posts = result.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  return <BlogCardGrid posts={posts} />;
}
