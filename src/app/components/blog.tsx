"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar, User, ImageOff, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; 

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
}

export default function BlogCardGrid({ posts }: BlogCardGridProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // ------------------------------------------------------------------
  // EMPTY STATE
  // ------------------------------------------------------------------
  if (posts.length === 0) {
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
      {/* ------------------------------------------------------------------
          GRID VIEW
      ------------------------------------------------------------------ */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Card
            key={post._id || index}
            className="group flex flex-col h-full overflow-hidden border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white"
          >
            {/* Image Section (Clean, no date) */}
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

            {/* Content Section */}
            <CardHeader className="pb-2">
              {/* Meta Row: Author & Date */}
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium mb-3">
                <span className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                   <User className="w-3.5 h-3.5 text-violet-600" /> 
                   {post.authorName}
                </span>
                <span className="flex items-center gap-1.5">
                   <Calendar className="w-3.5 h-3.5" /> 
                   {new Date(post.date).toLocaleDateString()}
                </span>
              </div>

              <CardTitle className="text-xl font-bold text-zinc-900 line-clamp-2 leading-tight group-hover:text-violet-700 transition-colors">
                {post.title}
              </CardTitle>
            </CardHeader>

            {/* Footer / Action */}
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

      {/* ------------------------------------------------------------------
          MODAL (DIALOG) VIEW
      ------------------------------------------------------------------ */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        {/* [&>button]:hidden removes the default Shadcn X button */}
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden rounded-2xl bg-white border-zinc-200 [&>button]:hidden">
          
          {/* Modal Header Image */}
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
            
            {/* Custom Close Button on Image */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                  Blog Post
                </Badge>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  {selectedPost && new Date(selectedPost.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <User className="w-4 h-4" />
                  {selectedPost?.authorName}
                </span>
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
                {selectedPost?.title}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Content Area */}
            <ScrollArea className="max-h-[40vh] pr-4">
              <DialogDescription className="text-base leading-relaxed text-zinc-600 whitespace-pre-wrap">
                {selectedPost?.summary}
              </DialogDescription>
            </ScrollArea>
            
            <DialogFooter className="mt-8 pt-4 border-t border-zinc-100">
              <Button variant="outline" onClick={() => setSelectedPost(null)} className="w-full sm:w-auto">
                Close Article
              </Button>
            </DialogFooter>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}