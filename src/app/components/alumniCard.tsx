"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Loader2, CalendarOff, Clock } from "lucide-react";


interface EventItem {
  _id: string;
  title: string;
  date: string;
  content: string;
  role: string;
  time?: string; // Optional time field
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

export default function AlumniEventGrid({
  events,
  alumni,
}: AlumniCardProps): React.ReactElement | null {
  const [currentAlumni, setCurrentAlumni] = useState(alumni);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const { getToken } = useAuth();

  // ------------------------------------------------------------------
  // ACTION HANDLER
  // ------------------------------------------------------------------
  const handleClick = async (_id: string) => {
    setJoiningId(_id);
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

      // Update local state on success
      setCurrentAlumni((prev) => ({
        ...prev,
        eventsJoined: [...prev.eventsJoined, _id],
      }));

    } catch (error) {
      console.error(error);
      toast.error("Failed to join event. Please try again.");
    } finally {
      setJoiningId(null);
    }
  };

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
          <CalendarOff className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900">No Upcoming Events</h3>
        <p className="text-zinc-500">There are no active events available to join right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {events.map((event) => {
        const hasJoined = currentAlumni.eventsJoined.includes(event._id);
        const isJoining = joiningId === event._id;
        const eventDate = new Date(event.date);

        return (
          <Card 
            key={event._id} 
            className="flex flex-col h-full border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
          >
            {/* Decorative Top Bar */}
            <div className={`h-2 w-full bg-gradient-to-r ${hasJoined ? 'from-emerald-400 to-green-500' : 'from-violet-500 to-fuchsia-500'}`} />

            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl font-bold text-zinc-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                  {event.title}
                </CardTitle>
                
                {/* Date Badge */}
                <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 rounded-lg p-2 min-w-[60px] text-center shrink-0">
                  <span className="text-xs font-bold text-violet-600 uppercase">
                    {eventDate.toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-xl font-extrabold text-zinc-900 leading-none">
                    {eventDate.getDate()}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span>{eventDate.getFullYear()}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>{event.time}</span>
                  </div>
                )}
              </div>

              <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3">
                {event.content}
              </p>
            </CardContent>

            <CardFooter className="pt-0 mt-auto">
              <Button
                onClick={() => !hasJoined && handleClick(event._id)}
                disabled={hasJoined || isJoining}
                variant={hasJoined ? "outline" : "default"}
                className={`w-full font-semibold transition-all duration-300 shadow-md ${
                  hasJoined
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 shadow-none cursor-default"
                    : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200"
                }`}
              >
                {isJoining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : hasJoined ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Already Joined
                  </>
                ) : (
                  "Join Event"
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}