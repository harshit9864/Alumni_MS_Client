"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Check,
  X,
  MessageCircle,
  Clock,
  UserX,
  Sparkles,
  Inbox,
  Loader2,
  Archive,
} from "lucide-react";
import { toast } from "sonner";

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------
interface Mentorship {
  _id: string;
  studentInfo: {
    fullName: string;
    userId: string;
  };
  purpose: string;
  status: "pending" | "accepted" | "declined" | "ended";
  date: string;
}

export default function MentorshipRequests() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null); // To track which specific item is updating
  const { getToken } = useAuth();

  // ------------------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchMentorship = async () => {
      const token = await getToken();
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/alumni/mentorships`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Something went wrong");
        }
        setMentorships(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentorship();
  }, [getToken]);

  // ------------------------------------------------------------------
  // ACTION HANDLER
  // ------------------------------------------------------------------
  const handleStatusChange = async (
    id: string,
    newStatus: "accepted" | "declined"
  ) => {
    const token = await getToken();
    setProcessingId(id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/alumni/mentorships/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update status");

      // Optimistic UI Update
      setMentorships((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
      toast.success(`Request ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };
  const handleEndMentorship = async (id: string) => {
    if (!confirm("Are you sure you want to end this mentorship?")) return;

    const token = await getToken();
    setProcessingId(id);

    try {
      // Assuming DELETE endpoint removes the mentorship record
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/alumni/mentorships/end/${id}`,
        {
          method: "PATCH", // Or PATCH if you just change status to "ended"
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to end mentorship");

      // Remove the mentorship from the UI immediately
      setMentorships((prev) =>
        prev.filter((m) => (m._id === id ? { ...m, status: "ended" } : m))
      );
      toast.success("Mentorship ended");
    } catch (error) {
      console.error(error);
      toast.error("Error ending mentorship");
    } finally {
      setProcessingId(null);
    }
  };

  // ------------------------------------------------------------------
  // UI RENDER
  // ------------------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            Mentorship Requests <Sparkles className="w-5 h-5 text-violet-500" />
          </h1>
          <p className="text-zinc-500 mt-1">
            Review and manage incoming mentorship applications from students.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
          <CardTitle className="text-lg font-semibold text-zinc-900">
            Pending & Active Requests
          </CardTitle>
          <CardDescription>
            You have {mentorships.filter((m) => m.status === "pending").length}{" "}
            pending requests.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            // Loading Skeletons
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : mentorships.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                No Requests Yet
              </h3>
              <p className="text-zinc-500 max-w-sm mt-2">
                Students haven't sent any mentorship requests yet. Check back
                later!
              </p>
            </div>
          ) : (
            // List View
            <div className="divide-y divide-zinc-100">
              {mentorships.map((request) => (
                <div
                  key={request._id}
                  className="p-6 hover:bg-zinc-50/60 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between group"
                >
                  {/* Left: User Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar Fallback */}
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg border border-violet-200 shrink-0">
                      {request.studentInfo.fullName.charAt(0)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-zinc-900">
                          {request.studentInfo.fullName}
                        </h4>
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(request.date).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-zinc-600 text-sm leading-relaxed max-w-2xl">
                        <span className="font-medium text-zinc-800">
                          Purpose:{" "}
                        </span>
                        {request.purpose}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                    {/* Status: Pending */}
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!!processingId}
                          onClick={() =>
                            handleStatusChange(request._id, "declined")
                          }
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        >
                          {processingId === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4 mr-1" />
                          )}
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          disabled={!!processingId}
                          onClick={() =>
                            handleStatusChange(request._id, "accepted")
                          }
                          className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200"
                        >
                          {processingId === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-1" />
                          )}
                          Accept
                        </Button>
                      </div>
                    )}

                    {/* Status: Accepted */}
                    {request.status === "accepted" && (
                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none px-3 py-1">
                          Accepted
                        </Badge>
                        {request.studentInfo.userId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-violet-600 border-violet-200 hover:bg-violet-50"
                            asChild
                          >
                            <Link
                              href={{
                                pathname: `/alumni/chat/${request.studentInfo.userId}`,
                                query: { name: request.studentInfo.fullName },
                              }}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" /> Start
                              Chat
                            </Link>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!!processingId}
                          onClick={() => handleEndMentorship(request._id)}
                          className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 shadow-none"
                        >
                          {processingId === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserX className="w-4 h-4 mr-2" />
                          )}
                          End
                        </Button>
                      </div>
                    )}

                    {/* Status: Declined */}
                    {request.status === "declined" && (
                      <Badge
                        variant="outline"
                        className="bg-zinc-100 text-zinc-500 border-zinc-200"
                      >
                        Declined
                      </Badge>
                    )}

                    {request.status === "ended" && (
                      <Badge
                        variant="outline"
                        className="bg-zinc-100 text-zinc-500 border-zinc-200 flex items-center gap-1 pl-2 pr-3 py-1"
                      >
                        <Archive className="w-3 h-3" />
                        Ended
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
