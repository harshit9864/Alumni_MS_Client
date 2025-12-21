"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Chat from "@/app/components/Chat";

export default function AlumniChatPage() {
  const { studentUserId } = useParams();
  const { userId } = useAuth(); // clerkId

  if (!userId || !studentUserId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Chat
        clerkId={userId}             // alumni clerkId
         peerUserId={studentUserId as string}  // student userId
      />
    </div>
  );
}
