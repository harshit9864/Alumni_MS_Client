"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar, User, ImageOff, ArrowRight, X, Pencil, Save, Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image"; // Added Image import

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------
interface BlogPost {
  _id: string; 
  title: string;
  authorName: string;
  date: string;
  summary: string;
  image: string | null;
}

interface BlogCardGridProps {
  posts: BlogPost[];
  role?: string; 
}

export default function BlogCardGrid({ posts, role }: BlogCardGridProps) { // Added fetchBlogs to props
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [localPosts, setLocalPosts] = useState<BlogPost[]>(posts);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", summary: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { getToken } = useAuth();

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (!selectedPost) {
      setIsEditing(false);
      setEditForm({ title: "", summary: "" });
    }
  }, [selectedPost]);

  // ------------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------------
  const startEditing = () => {
    if (!selectedPost) return;
    setEditForm({
      title: selectedPost.title,
      summary: selectedPost.summary
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedPost) return;
    setIsSaving(true);
    const token = await getToken();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/alumni/edit-blog/${selectedPost._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json(); // Added this line
      if (!res.ok) throw new Error(data.error || "Failed to update blog"); // Modified error handling

      const updatedPost = { ...selectedPost, ...editForm };
      
      setLocalPosts((prev) => 
        prev.map((p) => (p._id === selectedPost._id ? updatedPost : p))
      );
      
      setSelectedPost(updatedPost);
      setIsEditing(false); // Replaced setEditingBlog(null) with setIsEditing(false)
      toast.success("Blog updated successfully!"); // Replaced alert

    } catch (error: any) { // Added type for error
      console.error(error);
      toast.error(error.message || "Error updating blog"); // Replaced alert and used error message
    } finally {
      setIsSaving(false);
    }
  };

  // 🆕 DELETE HANDLER
  const handleDelete = async () => {
    if (!selectedPost) return;
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;

    setIsDeleting(true);
    const token = await getToken();

    try {
      // Assuming DELETE endpoint: /alumni/blog/:id
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/alumni/delete-blog/${selectedPost._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json(); // Added this line
      if (!res.ok) { // Modified error handling
        throw new Error(data.error || "Failed to delete blog");
      }

      // Update Local State: Remove the deleted post
      setLocalPosts((prev) => prev.filter((p) => p._id !== selectedPost._id));
      
      // Close Modal
      setSelectedPost(null);
      toast.success("Blog post deleted."); // Replaced alert

    } catch (error: any) { // Added type for error
      console.error(error);
      toast.error(error.message || "Error deleting blog"); // Replaced alert and used error message
    } finally {
      setIsDeleting(false);
    }
  };

  // ------------------------------------------------------------------
  // EMPTY STATE
  // ------------------------------------------------------------------
  if (localPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
          <ImageOff className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900">No Blogs Published</h3>
        <p className="text-zinc-500">Check back later for updates.</p>
      </div>
    );
  }

  return (
    <>
      {/* GRID VIEW */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {localPosts.map((post, index) => (
          <Card
            key={post._id || index}
            className="group flex flex-col h-full overflow-hidden border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white"
          >
            <div className="relative h-56 overflow-hidden bg-zinc-100">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                  <ImageOff className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs font-medium uppercase tracking-wider">No Cover Image</span>
                </div>
              )}
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium mb-3">
                <span className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                   <User className="w-3.5 h-3.5 text-violet-600" /> 
                   {post.authorName}
                </span>
                <span className="flex items-center gap-1.5" suppressHydrationWarning>
                   <Calendar className="w-3.5 h-3.5" /> 
                   {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-xl font-bold text-zinc-900 line-clamp-2 leading-tight group-hover:text-violet-700 transition-colors">
                {post.title}
              </CardTitle>
            </CardHeader>

            <CardFooter className="mt-auto pt-4 border-t border-zinc-100 bg-zinc-50/30">
              <Button 
                variant="ghost" 
                className="w-full justify-between text-zinc-600 hover:text-violet-700 hover:bg-violet-50 group/btn"
                onClick={() => setSelectedPost(post)}
              >
                Read Full Story
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* MODAL VIEW */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden rounded-2xl bg-white border-zinc-200 [&>button]:hidden">
          
          <div className="relative h-64 w-full bg-zinc-100">
            {selectedPost?.image ? (
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400 bg-zinc-100">
                <ImageOff className="w-12 h-12 opacity-50" />
              </div>
            )}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6 space-y-4">
              {!isEditing && (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                    Blog Post
                  </Badge>
                  <span className="flex items-center gap-1.5 text-zinc-500" suppressHydrationWarning>
                    <Calendar className="w-4 h-4" />
                    {selectedPost && new Date(selectedPost.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <User className="w-4 h-4" />
                    {selectedPost?.authorName}
                  </span>
                </div>
              )}

              <DialogTitle className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
                {isEditing ? (
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-zinc-500">Title</label>
                     <Input 
                       value={editForm.title}
                       onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                       className="text-xl font-bold h-12"
                     />
                   </div>
                ) : (
                   selectedPost?.title
                )}
              </DialogTitle>
            </DialogHeader>

            {isEditing ? (
              <div className="space-y-2">
                 <label className="text-sm font-medium text-zinc-500">Content</label>
                 <Textarea 
                   value={editForm.summary}
                   onChange={(e) => setEditForm(prev => ({ ...prev, summary: e.target.value }))}
                   className="min-h-[200px]"
                 />
              </div>
            ) : (
              <ScrollArea className="max-h-[40vh] pr-4">
                <DialogDescription className="text-base leading-relaxed text-zinc-600 whitespace-pre-wrap">
                  {selectedPost?.summary}
                </DialogDescription>
              </ScrollArea>
            )}
            
            <DialogFooter className="mt-8 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-2">
              
              {isEditing ? (
                // EDIT MODE BUTTONS
                <div className="flex w-full gap-2 justify-end">
                   <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                     Cancel
                   </Button>
                   <Button onClick={handleSave} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700">
                     {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                     Save Changes
                   </Button>
                </div>
              ) : (
                // VIEW MODE BUTTONS
                <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-between items-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedPost(null)} className="w-full sm:w-auto">
                    Close Article
                  </Button>
                  
                  {/* Actions for Alumni */}
                  {role === "alumni" && (
                    <div className="flex w-full sm:w-auto gap-2">
                      <Button 
                        onClick={handleDelete} 
                        disabled={isDeleting}
                        variant="destructive"
                        className="w-full sm:w-auto bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 shadow-none"
                      >
                         {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                         Delete
                      </Button>
                      <Button onClick={startEditing} className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogFooter>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}