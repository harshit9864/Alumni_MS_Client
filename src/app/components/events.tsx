"use client";

import EventCard from "@/app/components/Card"; // Updated import path to match previous steps
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Sparkles, CalendarOff, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Match the interface with your EventCard props
interface Events {
  _id: string;
  title: string;
  date: string; // Changed to string to match API/JSON response often being a string
  content: string;
  time?: string;
}

export default function Events({ role }: { role?: string }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Events[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8080/events", { // Or /api/events
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        
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

  
  // Remove event from UI after successful delete in Card
  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((event) => event._id !== id));
  };

  // Update event in UI after successful edit in Card
  const handleUpdate = (updatedEvent: Events) => {
    setEvents((prev) => 
      prev.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
    );
  };

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
            Manage Events <Sparkles className="w-6 h-6 text-violet-500" />
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">
            Create, edit, or delete upcoming workshops and webinars.
          </p>
        </div>
        
        {/* Optional: Add Event Button (You can implement the create logic separately) */}
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200">
          <Plus className="w-4 h-4 mr-2" />
          Post New Event
        </Button>
      </div>

      {/* --- Content Area --- */}
      {loading ? (
        // Loading State
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
          <h3 className="text-xl font-semibold text-zinc-900">No Events Found</h3>
          <p className="text-zinc-500 max-w-sm mt-2">
            There are no active events. Click the button above to create one.
          </p>
        </div>
      ) : (
        // Events Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <EventCard
              key={ev._id}
              _id={ev._id} 
              title={ev.title}
              date={ev.date.toString()}
              time={ev.time || "TBD"}
        
              content={ev.content}
              role={role}          // 👈 Forces Admin Mode (Edit/Delete buttons visible)
              onDelete={handleDelete} // 👈 Connects the delete logic 
              onUpdate={handleUpdate} // 👈 Connects the update logic 
            />
          ))}
        </div>
      )}
    </div>
  );
}