import Carddd from "@/app/components/Card";

export default function Events({ role }: { role: string }) {
  const upcomingEvents = [
    { id: 1, title: "Annual Alumni Meet", date: "2024-02-15", attendees: 125 },
    { id: 2, title: "Career Fair", date: "2024-02-20", attendees: 89 },
    { id: 3, title: "Tech Talk Series", date: "2024-02-25", attendees: 67 },
    { id: 4, title: "Tech Talk Series", date: "2024-02-25", attendees: 67 },
  ];

  return (
    <div>
      <div className="font-bold text-2xl text-center">Events</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 mt-5">
        {upcomingEvents.map((ev) => (
          <Carddd
            key={ev.id} // always add a unique key when mapping
            title={ev.title}
            date={ev.date}
            attend={ev.attendees}
            role = {role}
          />
        ))}
      </div>
    </div>
  );
}
