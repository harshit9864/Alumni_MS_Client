"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/nextjs";
import { PenTool, Image as ImageIcon, Loader2, User, Type, FileText } from "lucide-react";

interface BlogPostState {
  title: string;
  authorName: string;
  date: string;
  image: File | null;
  summary: string;
  content: string;
}

export default function BlogPublishForm() {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BlogPostState>({
    title: "",
    authorName: "",
    date: new Date().toISOString().split("T")[0],
    image: null,
    summary: "",
    content: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
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

    const data = new FormData();
    data.append("title", formData.title);
    data.append("authorName", formData.authorName);
    data.append("date", formData.date);
    data.append("summary", formData.summary);
    data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:8080/alumni/post-blog", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      alert("Blog published successfully!");
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
    <Card className="border-zinc-200 shadow-lg">
      <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
        <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full border border-zinc-200 shadow-sm">
                <PenTool className="w-5 h-5 text-violet-600" />
            </div>
            <div>
                <CardTitle className="text-xl">Publish New Blog</CardTitle>
                <CardDescription>Share your knowledge and experiences with the community.</CardDescription>
            </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 text-zinc-700">
                <Type className="w-4 h-4 text-violet-500" /> Blog Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter an engaging title"
                value={formData.title}
                onChange={handleChange}
                required
                className="focus-visible:ring-violet-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authorName" className="flex items-center gap-2 text-zinc-700">
                 <User className="w-4 h-4 text-violet-500" /> Author Name
              </Label>
              <Input
                id="authorName"
                name="authorName"
                placeholder="e.g. ABC"
                value={formData.authorName}
                onChange={handleChange}
                required
                className="focus-visible:ring-violet-500"
              />
            </div>
          </div>

          {/* Row 2: Image & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center gap-2 text-zinc-700">
                 <ImageIcon className="w-4 h-4 text-violet-500" /> Cover Image
              </Label>
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="cursor-pointer file:text-violet-600 file:font-semibold hover:file:bg-violet-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-zinc-700">Publish Date</Label>
              <Input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="focus-visible:ring-violet-500 block"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-zinc-700">Short Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              placeholder="Write a teaser (1-2 sentences) to appear on the blog card."
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              required
              className="resize-none focus-visible:ring-violet-500"
            />
          </div>

          {/* Full Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="flex items-center gap-2 text-zinc-700">
                <FileText className="w-4 h-4 text-violet-500" /> Full Content
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your full story here..."
              value={formData.content}
              onChange={handleChange}
              rows={10}
              required
              className="focus-visible:ring-violet-500"
            />
          </div>

          <div className="pt-2">
            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6 shadow-md shadow-violet-200"
            >
              {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                </>
              ) : (
                "Publish Blog Post"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}