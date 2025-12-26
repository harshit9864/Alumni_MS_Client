"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/nextjs";

interface BlogPostState {
  title: string;
  authorName: string;
  date: string;
  image: File | null; // Changed from string to File object
  summary: string;
  content: string;
}

export default function BlogPublishForm() {
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<BlogPostState>({
    title: "",
    authorName: "",
    date: new Date().toISOString().split("T")[0],
    image: null,
    summary: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      // TypeScript requires a cast to HTMLInputElement to access .files
      const fileInput = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: fileInput.files ? fileInput.files[0] : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = await getToken();

    // 1. Create a FormData object
    const data = new FormData();
    data.append("title", formData.title);
    data.append("authorName", formData.authorName);
    data.append("date", formData.date);
    data.append("summary", formData.summary);
    data.append("content", formData.content);

    // Only append image if one exists
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:8080/alumni/post-blog", {
        method: "POST",
        headers: {
          // IMPORTANT: Do NOT set Content-Type here.
          // The browser sets it to multipart/form-data with the boundary automatically.
          Authorization: `Bearer ${token}`,
        },
        body: data, // Pass the FormData object directly
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "something went wrong");
      }

      console.log("Success:", result);
      alert("Blog published successfully!");

      // Reset form
      setFormData({
        title: "",
        authorName: "",
        date: new Date().toISOString().split("T")[0],
        image: null,
        summary: "",
        content: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to publish blog.");
    } finally {
      setIsSubmitting(false);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Blog Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter an engaging title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <Label htmlFor="authorName" className="text-sm font-medium">
                Author Name
              </Label>
              <Input
                id="authorName"
                name="authorName"
                placeholder="Who is writing this?"
                value={formData.authorName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Cover Image
              </Label>
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF
              </p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Publish Date
              </Label>
              <Input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary" className="text-sm font-medium">
                Summary
              </Label>
              <Textarea
                id="summary"
                name="summary"
                placeholder="Write a short summary (1-2 sentences) to appear on the card."
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Full Content
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your full blog post here..."
                value={formData.content}
                onChange={handleChange}
                rows={8}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Publishing..." : "Publish Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
