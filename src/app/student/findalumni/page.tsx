import { auth } from "@clerk/nextjs/server";
import AlumniDirectory from "./direc"; // Adjust this path to wherever your client component lives
import FetchAlumni from "@/lib/api/alumni";

export default async function DirectoryPage() {
  const { getToken } = await auth();
  const token = await getToken();
  
  let initialAlumni = [];
  
  try {
    // Fetch data on the server before the page even renders to the user
    const res = await FetchAlumni(token || "", "student");
    initialAlumni = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Failed to fetch alumni on server:", error);
  }

  return (
    <main className="p-4 md:p-8 bg-zinc-50/30 min-h-screen">
      <AlumniDirectory initialAlumni={initialAlumni} />
    </main>
  );
}