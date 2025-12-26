"use client";
import { useAuth } from "@clerk/nextjs";
import BlogPublishForm from "../components/blogPublish";
import { useEffect, useState } from "react";

export default function Alumni() {
  // 1. Destructure isLoaded and isSignedIn
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [eventsJoined, setEventsJoined] = useState(0);
  const [mentorship, setMentorship] = useState(0);
  const [blogs, setBlogs] = useState(0);

  useEffect(() => {
    // 2. Add a guard clause.
    // If Clerk isn't loaded or user isn't signed in, STOP. Do not fetch yet.
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const fetchAlumni = async () => {
      try {
        const token = await getToken();

        // Safety check: ensure token exists before sending
        if (!token) {
          console.log("No token available yet");
          return;
        }

        const response = await fetch("http://localhost:8080/alumni/sync", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Something went wrong while fetching alumni data");
        }

        const result = await response.json();

        // safely extract lengths
        const joinedCount = result?.data?.eventsJoined?.length || 0;
        const mentorshipCount = result?.data?.mentorship?.length || 0;
        const blogsCount = result?.data?.blogs?.length || 0;

        setEventsJoined(joinedCount);
        setMentorship(mentorshipCount);
        setBlogs(blogsCount);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };

    fetchAlumni();

    // 3. Add isLoaded and isSignedIn to the dependency array
    // This ensures the effect re-runs as soon as Clerk finishes loading.
  }, [isLoaded, isSignedIn]);

  // Optional: Show a loading state while Clerk initializes
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Alumni Dashboard</h1>
          <p className="text-gray-600">Join events and connect with students</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
            <div className="px-4 my-5 ">
              <p className="text-xl font-bold ">Events Joined</p>
              <p className="text-lg font-semibold ">{eventsJoined}</p>
            </div>
          </div>
          <div>
            <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
              <div className="px-4 my-5 ">
                <p className="text-xl font-bold ">Blogs Published</p>
                <p className="text-lg font-semibold ">{blogs}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
              <div className="px-4 my-5 ">
                <p className="text-xl font-bold ">Mentorship Connections</p>
                <p className="text-lg font-semibold ">{mentorship}</p>
              </div>
            </div>
          </div>
        </div>

        <BlogPublishForm />
      </div>
    </div>
  );
}
