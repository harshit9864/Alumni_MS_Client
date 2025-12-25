import AlumniCard from "@/app/components/alumniCard";
import { auth } from "@clerk/nextjs/server";

export default async function AlEvents() {
  const { getToken } = await auth();
  const token = await getToken();
  try {
    const [eventsRes, alumniRes] = await Promise.all([
      fetch("http://localhost:8080/alumni/fetchEvents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch("http://localhost:8080/alumni/sync", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);
    var events = await eventsRes.json();
    var alumni = await alumniRes.json();

    if (!eventsRes.ok || !alumniRes.ok) {
      throw new Error("something went wrong");
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <AlumniCard events={events.data} alumni={alumni.data} />
    </>
  );
}
