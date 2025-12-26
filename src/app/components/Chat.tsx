"use client";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@clerk/nextjs";

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
  const { getToken } = useAuth();

  // 1️⃣ Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      const token = await getToken();
      const res = await fetch(
        `http://localhost:8080/api/messages/${peerUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      // console.log(result);
      if (result.success) {
        const normalized = result.data.map((m: any) => ({
          _id: m._id,
          sender: m.sender._id, // 👈 normalize
          receiver: m.receiver._id,
          text: m.text,
        }));
        setMessages(normalized);
      }
    };

    loadHistory();
  }, [peerUserId]);

  const addMessageSafely = (msg: Message) => {
    setMessages((prev) => {
      // ❗ prevent duplicates
      if (prev.some((m) => m._id === msg._id)) {
        return prev;
      }
      return [...prev, msg];
    });
  };

  // 2️⃣ Socket connection
  useEffect(() => {
    socket.auth = { clerkId };
    socket.connect();

    socket.on("receive_message", (msg) => {
      addMessageSafely(msg);
    });

    socket.on("message_sent", (msg) => {
      addMessageSafely(msg);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
    };
  }, []);

  // 3️⃣ Send message
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      toUserId: peerUserId,
      text,
    });

    setText("");
  };

  return (
    <>
      <div className="border rounded p-4 w-full max-w-xl bg-white">
        <div className="h-64 overflow-y-auto flex flex-col justify-center items-center">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No messages yet. Say hello 👋
            </p>
          ) : (
            <div className="w-full space-y-2">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`p-2 rounded max-w-xs ${
                    m.sender === peerUserId
                      ? "bg-gray-100 mr-auto"
                      : "bg-indigo-100 ml-auto"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-2 flex-1 rounded"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
