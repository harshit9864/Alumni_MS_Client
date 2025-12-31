"use client";

import EventCard from "@/app/components/Card"; // Ensure path matches your folder structure
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Sparkles, CalendarOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Optional: npx shadcn-ui@latest add skeleton

interface Events {
  _id: string;
  title: string;
  date: Date;
  content: string;
  time?: string; // Optional in case backend doesn't send it
}

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Events[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8080/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        
        // Ensure result.data is an array before setting
        if (Array.isArray(result.data)) {
          setEvents(result.data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [getToken]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
            Upcoming Events <Sparkles className="w-6 h-6 text-violet-500" />
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">
            Workshops, webinars, and meetups curated for you.
          </p>
        </div>
      </div>

      {/* --- Content Area --- */}
      {loading ? (
        // Loading State: Skeletons
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl bg-zinc-200" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-zinc-200" />
                <Skeleton className="h-4 w-[200px] bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <CalendarOff className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900">No Upcoming Events</h3>
          <p className="text-zinc-500 max-w-sm mt-2">
            We are currently planning the next set of events. Check back soon!
          </p>
        </div>
      ) : (
        // Events Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <EventCard
              key={ev._id}
              title={ev.title}
              date={ev.date.toString()} // Ensure string format
              time={ev.time || "TBD"}
              content={ev.content}
            />
          ))}
        </div>
      )}
    </div>
  );
}