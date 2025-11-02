import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

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
  return (
    posts.length === 0 ? <h1>no blogs</h1> : 
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {posts?.map((post, index) => (
        <Card
          className="overflow-hidden rounded-2xl shadow hover:shadow-lg transition-all duration-300"
          key={post.title}
        >
          <div className="h-48 overflow-hidden">
            <img
              src={post.image ? post.image : "null"}
              alt={post.title}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
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
                <Calendar className="w-4 h-4" /> {post.date}
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
