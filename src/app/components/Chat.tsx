"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2, MessageSquareDashed } from "lucide-react";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
}

export default function Chat({
  clerkId,
  peerUserId,
}: {
  clerkId: string;
  peerUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); 

  // ... (Keep your existing useEffects for loading history and socket connection here) ...
  // Re-pasting just the core logic for brevity, assuming you have the socket code from previous steps
  useEffect(() => {
      const loadHistory = async () => {
        try {
          const token = await getToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${peerUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (result.success) {
            const normalized = result.data.map((m: any) => ({
              _id: m._id,
              sender: m.sender._id,
              receiver: m.receiver._id,
              text: m.text,
            }));
            setMessages(normalized);
          }
        } catch (err) { console.error(err); } finally { setLoading(false); }
      };
      loadHistory();
  }, [peerUserId, getToken]);

  const addMessageSafely = (msg: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };

  useEffect(() => {
    socket.auth = { clerkId };
    socket.connect();
    socket.on("receive_message", addMessageSafely);
    socket.on("message_sent", addMessageSafely);
    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
      socket.disconnect();
    };
  }, [clerkId]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send_message", { toUserId: peerUserId, text });
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    // MAIN CONTAINER: 
    // h-full ensures it fits in the parent page div we fixed above.
    // flex-col stacks the list and the input.
    <div className="flex flex-col h-full w-full bg-zinc-50/50 overflow-hidden">
      
      {/* SCROLLABLE MESSAGES: 
          flex-1 makes it fill all available space. 
          overflow-y-auto enables scroll ONLY inside this div. */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {loading ? (
           <div className="h-full flex items-center justify-center text-zinc-400">
             <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
           </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquareDashed className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const isOwnMessage = m.sender !== peerUserId;
              return (
                <div key={m._id} className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm break-words ${
                      isOwnMessage ? "bg-violet-600 text-white rounded-br-sm" : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>

      {/* INPUT AREA: 
          shrink-0 ensures this never gets compressed or hidden. 
          It sits naturally at the bottom of the flex column. */}
      <div className="p-3 bg-white border-t border-zinc-200 shrink-0 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-2 items-center">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-zinc-50 border-zinc-200 focus-visible:ring-violet-500 rounded-full px-4 h-11"
            placeholder="Type a message..."
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="h-11 w-11 rounded-full bg-violet-600 hover:bg-violet-700 text-white p-0 flex items-center justify-center shrink-0"
          >
            <SendHorizontal className="w-5 h-5 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}