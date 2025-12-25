"use client";
import Carddd from "@/app/components/Card";
import { useAuth } from "@clerk/nextjs";
import { headers } from "next/headers";
import { useEffect, useState } from "react";

interface Events {
  _id: string;
  title: string;
  date: Date;
  content: string;
  time: string;
}

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Events[]>([]);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchEvents = async () => {
      const token = await getToken();
      try {
        const res = await fetch("http://localhost:8080/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        setEvents(result.data);
        setLoading(false);
      } catch (error) {
        alert(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <div className="font-bold text-2xl text-center">Events</div>
      {loading ? (
        <p className="text-black animate-pulse text-center">Loading...</p>
      ) : events.length == 0 ? (
        <p className="text-black text-center">
          No Upcoming Events
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 mt-5">
          {events.map((ev) => (
            <Carddd
              key={ev._id} // always add a unique key when mapping
              title={ev.title}
              date={new Date(ev.date).toISOString().split("T")[0]}
              content={ev.content}
            />
          ))}
        </div>
      )}
    </div>
  );
}
