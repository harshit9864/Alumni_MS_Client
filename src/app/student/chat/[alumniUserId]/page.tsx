"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Chat from "@/app/components/Chat";
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const { alumniUserId } = useParams();
  const searchParams = useSearchParams();
  const alumniName = searchParams.get("name");

  const { userId } = useAuth();
  console.log(alumniUserId);

  // userId from Clerk = clerkId
  if (!userId || !alumniUserId) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-2">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {alumniName?.[0] ?? "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {alumniName ?? "User"}
            </p>
          </div>
        </div>
      </div>
      <Chat
        clerkId={userId} // 👈 for socket auth
        peerUserId={alumniUserId as string} // 👈 alumni
      />
    </div>
  );
}
