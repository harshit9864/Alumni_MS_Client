import { auth } from "@clerk/nextjs/server";
import AdminDirectory from "@/app/components/direc"; // Adjust path as needed
import FetchAlumni from "@/lib/api/alumni"; 

export default async function DirectoryPage() {
  const { getToken } = await auth();
  const token = await getToken();
  
  let initialAlumnis = [];
  
  try {
    // Fetch data server-side
    // Ensure your FetchAlumni utility works in a Node.js environment
    const alumniRes = await FetchAlumni(token || "", "admin");
    initialAlumnis = Array.isArray(alumniRes.data) ? alumniRes.data : [];
  } catch (error) {
    console.error("Failed to fetch alumni on server:", error);
  }

  return (
    <main className="p-4 md:p-8 bg-zinc-50/30 min-h-screen">
      {/* Pass the server-fetched data as a prop */}
      <AdminDirectory initialAlumnis={initialAlumnis} />
    </main>
  );
}