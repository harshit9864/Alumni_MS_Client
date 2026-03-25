import { auth } from "@clerk/nextjs/server";
import AdminDashboard from "@/app/components/adAlumni";

// Next.js pages should have named exports
export default async function AdminPage() {
  // 1. Get the auth token securely on the server
  const { getToken } = await auth();
  const token = await getToken();

  let initialStats = [0, 0];

  // 2. Fetch the initial data (SSR)
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/totalAlumni`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Ensure we don't cache stale dashboard data
      cache: "no-store", 
    });

    if (result.ok) {
      const res = await result.json();
      initialStats = res.data || [0, 0];
    }
  } catch (error) {
    console.error("Failed to fetch initial stats:", error);
  }

  // 3. Pass the fetched data to the Client Component
  return (
    <main className="p-4 md:p-8 bg-zinc-50/30 min-h-screen">
      <AdminDashboard initialStats={initialStats} />
    </main>
  );
}