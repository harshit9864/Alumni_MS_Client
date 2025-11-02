"use client";
import { useAuth } from "@clerk/nextjs";
import BlogPublishForm from "../components/blogPublish";
import { useEffect, useState } from "react";


export default function Alumni() {
  const { getToken } = useAuth();
  const [eventsJoined, setEventsJoined] = useState(0);
  const [mentorship, setMentorship] = useState(0);
  
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        var token = await getToken();
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
        const joinedCount = result?.data?.eventsJoined?.length ;
        const mentorshipCount = result?.data?.mentorship?.length ;

        // update state
        setEventsJoined(joinedCount);
        setMentorship(mentorshipCount);

        console.log(result);
        
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };

    fetchAlumni();
  }, [getToken]);

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
                <p className="text-lg font-semibold ">3</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
              <div className="px-4 my-5 ">
                <p className="text-xl font-bold ">Mentorship Requests</p>
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
