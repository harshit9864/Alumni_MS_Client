"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const BlogPublishForm = dynamic(() => import("../components/blogPublish"), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, BookOpen, Users, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlumniDashboard() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [eventsJoined, setEventsJoined] = useState(0);
  const [mentorship, setMentorship] = useState(0);
  const [blogs, setBlogs] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchAlumni = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch("http://localhost:8080/alumni/sync", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Something went wrong");

        const result = await response.json();
        
        setEventsJoined(result?.data?.eventsJoined?.length || 0);
        setMentorship(result?.data?.mentorship?.length || 0);
        setBlogs(result?.data?.blogs?.length || 0);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAlumni();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

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
            {loadingData ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-zinc-900">{eventsJoined}</div>
            )}
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
            {loadingData ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-zinc-900">{blogs}</div>
            )}
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
            {loadingData ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-zinc-900">{mentorship}</div>
            )}
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