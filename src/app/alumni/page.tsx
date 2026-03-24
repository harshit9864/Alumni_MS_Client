// 1. We remove "use client". This is now a Server Component by default!
import { auth } from "@clerk/nextjs/server"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, BookOpen, Users, Sparkles } from "lucide-react";
import BlogPublishForm from "../components/blogPublish"; 
// Note: BlogPublishForm should probably have "use client" at the top of its own file 
// since it likely handles form inputs and button clicks.

// 2. We make the component itself 'async'
export default async function AlumniDashboard() {
  
  // 3. We grab the secure token directly on the server
  const { getToken, userId } = await auth();
  
  // If they aren't logged in, Clerk usually intercepts this via middleware, 
  // but it's good practice to check.
  if (!userId) return <div>Unauthorized</div>;

  const token = await getToken();

  // 4. We set up default stats
  let stats = { events: 0, mentorships: 0, blogs: 0 };

  // 5. We fetch the data Server-to-Server. No useEffect needed!
  try {
    const response = await fetch("http://localhost:8080/alumni/sync", {
      headers: { Authorization: `Bearer ${token}` },
      // 'no-store' tells Next.js not to cache this, ensuring the dashboard is always fresh
      cache: "no-store" 
    });

    if (response.ok) {
      const result = await response.json();
      stats.events = result?.data?.eventsJoined?.length || 0;
      stats.mentorships = result?.data?.mentorship?.length || 0;
      stats.blogs = result?.data?.blogs?.length || 0;
    }
  } catch (error) {
    console.error("Error fetching alumni:", error);
    // You could render a specific error UI here if you wanted
  }

  // 6. We render the UI. Because this is built on the server, 
  // we don't need any loading Skeletons for the numbers! They will just be there.
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            Alumni Dashboard <Sparkles className="w-5 h-5 text-violet-500" />
          </h1>
          <p className="text-zinc-500 mt-1">
            Track your contributions and connect with students.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Events Card */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Events Joined</CardTitle>
            <div className="p-2 bg-violet-100 rounded-lg">
               <CalendarCheck className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Look how clean this is without the ternary loading checks! */}
            <div className="text-3xl font-bold text-zinc-900">{stats.events}</div>
            <p className="text-xs text-zinc-500 mt-1">Participated events</p>
          </CardContent>
        </Card>

        {/* Blogs Card */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Blogs Published</CardTitle>
            <div className="p-2 bg-fuchsia-100 rounded-lg">
               <BookOpen className="h-4 w-4 text-fuchsia-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">{stats.blogs}</div>
            <p className="text-xs text-zinc-500 mt-1">Articles shared</p>
          </CardContent>
        </Card>

        {/* Mentorship Card */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Mentorships</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
               <Users className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">{stats.mentorships}</div>
            <p className="text-xs text-zinc-500 mt-1">Active connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Blog Form Section */}
      <div className="mt-10">
        <BlogPublishForm />
      </div>
    </div>
  );
}