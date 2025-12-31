"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Chat from "@/app/components/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket"; // Import your shared socket instance

export default function AlumniChatPage() {
  const { studentUserId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentName = searchParams.get("name");
  
  const { userId } = useAuth(); // Alumni's ID

  // --- 🆕 STATE FOR ONLINE STATUS ---
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // 1. Ensure socket knows who WE are
    socket.auth = { clerkId: userId };
    socket.connect();

    // 2. Listen for the online users list
    socket.on("get_online_users", (users: any[]) => {
      // Check if the student we are talking to is in the list
      const isStudentOnline = users.some((u) => u.userId === studentUserId);
      setIsOnline(isStudentOnline);
    });

    return () => {
      socket.off("get_online_users");
    };
  }, [userId, studentUserId]);


  if (!userId || !studentUserId) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      
      {/* --- Chat Header --- */}
      <div className="bg-white border-b border-zinc-200 px-4 py-2 flex items-center justify-between shadow-sm shrink-0 h-14 z-20">
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
            <Avatar className="h-9 w-9 border border-zinc-200">
              <AvatarImage src="" /> 
              <AvatarFallback className="bg-violet-100 text-violet-700 font-bold text-xs">
                {studentName?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            
            {/* 🆕 REAL-TIME INDICATOR DOT */}
            <span 
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full transition-colors duration-300 ${
                isOnline ? "bg-emerald-500" : "bg-zinc-300"
              }`}
            ></span>
          </div>
          
          <div>
            <h2 className="font-bold text-zinc-900 text-sm leading-tight">
              {studentName ?? "Student"}
            </h2>
            {/* 🆕 REAL-TIME TEXT STATUS */}
            <p className={`text-[10px] font-medium transition-colors duration-300 ${
              isOnline ? "text-emerald-600" : "text-zinc-400"
            }`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-violet-600">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-violet-600">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-violet-600">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* --- Chat Body --- */}
      <div className="flex-1 overflow-hidden relative">
        <Chat
          clerkId={userId} 
          peerUserId={studentUserId as string} 
        />
      </div>
    </div>
  );
}