"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EventItem {
  _id: string;
  title: string;
  date: string;
  content: string;
  role: string;
}

interface Alumni {
  id: string;
  eventsJoined: string[];
  mentorship: [];
}

type AlumniCardProps = {
  events: EventItem[];
  alumni: Alumni;
};

export default function AlumniCard({
  events,
  alumni,
}: AlumniCardProps): React.ReactElement | null {
  const [Alumni, setAlumni] = useState(alumni);

  const { getToken } = useAuth();

  const handleClick = async (_id: string) => {
    const token = await getToken();
    try {
      const res = await fetch("http://localhost:8080/alumni/join-event", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setAlumni({
        ...Alumni,
        eventsJoined: [...Alumni.eventsJoined, _id],
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const hasJoined = Alumni.eventsJoined.includes(event._id);
          return (
            <Card key={event._id} className="w-full">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {new Date(event.date).toISOString().split("T")[0]}
                </CardDescription>
                <CardAction>
                  <button
                    onClick={() => !hasJoined && void handleClick(event._id)}
                    disabled={hasJoined}
                    className={`px-4 py-2 rounded-md font-medium transition 
                      ${
                        hasJoined
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      }`}
                  >
                    {hasJoined ? "Joined" : "Join Event"}
                  </button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p>{event.content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
