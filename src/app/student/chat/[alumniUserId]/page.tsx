"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Chat from "@/app/components/Chat";

export default function ChatPage() {
  const { alumniUserId } = useParams();
  const { userId } = useAuth();
  console.log(alumniUserId);

  // userId from Clerk = clerkId
  if (!userId || !alumniUserId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Chat
        clerkId={userId} // 👈 for socket auth
        peerUserId={alumniUserId as string} // 👈 alumni
      />
    </div>
  );
}
