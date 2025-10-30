"use client";
import Carddd from "@/app/components/Card";
import { useEffect, useState } from "react";

interface Events {
  title: string;
  date: Date;
  content: string;
  time: string;
}

export default function Events({ role }: { role: string }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Events[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8080/events");
        const result = await res.json();
        if (result.data.length == 0) {
          throw new Error("no upcoming events");
        }
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 mt-5">
          {events.map((ev) => (
            <Carddd
              key={ev.title} // always add a unique key when mapping
              title={ev.title}
              date={new Date(ev.date).toISOString().split("T")[0]}
              content={ev.content}
              role={role}
            />
          ))}
        </div>
      )}
    </div>
  );
}
