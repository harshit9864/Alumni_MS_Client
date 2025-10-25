import BlogCardGrid from "../../components/blog";

const samplePosts = [
  {
    id: "1",
    title: "The Future of Web Development",
    author: "Jane Doe",
    date: "Oct 6, 2025",
    excerpt:
      "Explore how AI and modern frameworks are shaping the future of web apps.",
    image: "https://source.unsplash.com/800x600/?web,technology",
  },
  {
    id: "2",
    title: "Mastering TypeScript in 2025",
    author: "John Smith",
    date: "Sep 20, 2025",
    excerpt:
      "A complete guide to TypeScript’s new features and best practices.",
    image: "https://source.unsplash.com/800x600/?typescript,code",
  },
  // more posts...
];

export default function Page() {
  return <BlogCardGrid posts={samplePosts} />;
}
