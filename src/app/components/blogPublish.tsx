"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPost {
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export default function BlogPublishForm() {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    excerpt: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPost, setSubmittedPost] = useState<BlogPost | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate publishing
    setTimeout(() => {
      console.log("Blog submitted:", formData);
      setSubmittedPost(formData);
      setIsSubmitting(false);
      setFormData({
        title: "",
        author: "",
        date: new Date().toISOString().split("T")[0],
        image: "",
        excerpt: "",
        content: "",
      });
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Publish a New Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Blog Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              name="author"
              placeholder="Author Name"
              value={formData.author}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <Input
              type="file"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
            <Textarea
              name="excerpt"
              placeholder="Short summary (1-2 sentences)"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              required
            />
            <Textarea
              name="content"
              placeholder="Write your full blog content here..."
              value={formData.content}
              onChange={handleChange}
              rows={6}
              required
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Publishing..." : "Publish Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
