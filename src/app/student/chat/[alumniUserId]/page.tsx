"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Chat from "@/app/components/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function StudentChatPage() {
  const { alumniUserId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const alumniName = searchParams.get("name");

  const { userId } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;
    socket.auth = { clerkId: userId };
    socket.connect();
    socket.on("get_online_users", (users: any[]) => {
      const isAlumniOnline = users.some((u) => u.userId === alumniUserId);
      setIsOnline(isAlumniOnline);
    });
    return () => {
      socket.off("get_online_users");
    };
  }, [userId, alumniUserId]);

  if (!userId || !alumniUserId) return null;

  return (
    // 🔴 FIX: Increased subtraction to 9rem to account for Layout Padding + Navbar
    // This ensures the total height never exceeds the screen.
    <div className="flex flex-col h-[calc(100vh-9rem)] bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      {/* --- Chat Header --- */}
      <div className="bg-white border-b border-zinc-200 px-4 py-2 flex items-center justify-between shrink-0 h-16 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-zinc-500"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="relative">
            <Avatar className="h-10 w-10 border border-zinc-200">
              <AvatarImage src="" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                {alumniName?.[0]?.toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full transition-colors duration-300 ${
                isOnline ? "bg-emerald-500" : "bg-zinc-300"
              }`}
            ></span>
          </div>

          <div>
            <h2 className="font-bold text-zinc-900 text-sm md:text-base leading-tight">
              {alumniName ?? "Alumni"}
            </h2>
            <p
              className={`text-xs font-medium transition-colors duration-300 ${
                isOnline ? "text-emerald-600" : "text-zinc-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* --- Chat Body --- */}
      <div className="flex-1 overflow-hidden relative bg-zinc-50/50">
        <Chat clerkId={userId} peerUserId={alumniUserId as string} />
      </div>
    </div>
  );
}
