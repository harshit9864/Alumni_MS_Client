import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ImageOff } from "lucide-react";

interface BlogPost {
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
  return posts.length === 0 ? (
    <p className="text-black text-center">No Blogs</p>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {posts?.map((post, index) => (
        <Card
          className="overflow-hidden rounded-2xl shadow hover:shadow-lg transition-all duration-300"
          key={post.title}
        >
          <div className="h-48 overflow-hidden">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageOff className="w-8 h-8 mb-2" />
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p className="line-clamp-3">{post.summary}</p>
            <div className="flex justify-between text-xs pt-2">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {post.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />{" "}
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              Read More
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
