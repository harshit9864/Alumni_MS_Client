"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";

interface BlogPost {
  title: string;
  authorName: string;
  date: string;
  image: string;
  summary: string;
  content: string;
}

export default function BlogPublishForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    authorName: "",
    date: "",
    image: "",
    summary: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = await getToken();

    try {
      const response = await fetch("http://localhost:8080/alumni/post-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "something went wrong");
      }
      console.log(result);
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false);
      setFormData({
        title: "",
        authorName: "",
        date: new Date().toISOString().split("T")[0],
        image: "",
        summary: "",
        content: "",
      });
    }
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
              name="authorName"
              placeholder="Author Name"
              value={formData.authorName}
              onChange={handleChange}
              required
            />
            <Input
              type="file"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
            <Textarea
              name="summary"
              placeholder="Short summary (1-2 sentences)"
              value={formData.summary}
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
