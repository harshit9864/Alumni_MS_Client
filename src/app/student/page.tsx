"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Archive,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

// --------------------------------------------------------
// TYPES
// --------------------------------------------------------
interface Mentorship {
  _id: number;
  alumniUserId: string;
  alumniInfo: {
    fullName: string;
  };
  purpose: string;
  status: "pending" | "accepted" | "rejected" | "ended";
  date: string;
}

export default function StudentDashboard() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, userId } = useAuth();

  // Derive stats reactively from mentorships state
  const stats = useMemo(() => {
    const counts = { pending: 0, accepted: 0, rejected: 0, ended: 0 };
    mentorships.forEach((m) => {
      if (counts[m.status] !== undefined) counts[m.status]++;
    });
    return counts;
  }, [mentorships]);

  // --------------------------------------------------------
  // DATA FETCHING
  // --------------------------------------------------------
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      setError(null);
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");
      setMentorships(result.data ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [getToken, userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // --------------------------------------------------------
  // UI RENDER
  // --------------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-100 to-white p-6 rounded-2xl border border-violet-100">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-zinc-500 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            Manage your network and track your progress.
          </p>
        </div>
        <Button
          asChild
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 border-0"
        >
          <Link href="/student/findalumni">
            Find New Mentor <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Alumni Connections
            </CardTitle>
            <div className="p-2 bg-violet-100 rounded-lg">
              <Users className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">{loading ? "-" : stats.accepted}</div>
            <p className="text-xs text-zinc-500 mt-1">Active connections</p>
          </CardContent>
        </Card>

        {/* Stat Card 2 */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Requests Sent
            </CardTitle>
            <div className="p-2 bg-fuchsia-100 rounded-lg">
              <MessageSquare className="h-4 w-4 text-fuchsia-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">
              {loading ? "-" : stats.pending}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Awaiting responses</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Mentorship Requests Section --- */}
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900">
                Request History
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Track the status of your mentorship applications.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {error ? (
            // Error State
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-red-500 text-sm font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchProfile}>Retry</Button>
            </div>
          ) : loading ? (
            // Loading Skeleton
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              <p className="text-zinc-400 text-sm">Loading requests...</p>
            </div>
          ) : mentorships.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                No Requests Yet
              </h3>
              <p className="text-zinc-500 max-w-sm mt-2 mb-6">
                You haven't sent any mentorship requests. Browse the alumni
                directory to find a mentor.
              </p>
              <Button
                variant="outline"
                className="border-zinc-300 hover:bg-zinc-50 hover:text-violet-700"
                asChild
              >
                <Link href="/student/findalumni">Browse Alumni</Link>
              </Button>
            </div>
          ) : (
            // List View
            <div className="divide-y divide-zinc-100">
              {mentorships.map((request) => (
                <div
                  key={request._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-zinc-50/80 transition-colors gap-4 group"
                >
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                      {request.alumniInfo.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">
                        {request.alumniInfo.fullName}
                      </h4>
                      <p className="text-sm text-zinc-600 line-clamp-1 max-w-md">
                        {request.purpose}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {new Date(request.date).toLocaleDateString(
                            undefined,
                            { dateStyle: "medium" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Action */}
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    {/* Status Badge */}
                    {request.status === "pending" && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 px-3 py-1"
                      >
                        Pending
                      </Badge>
                    )}
                    {request.status === "accepted" && (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none px-3 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Accepted
                      </Badge>
                    )}
                    {request.status === "rejected" && (
                      <Badge variant="destructive" className="px-3 py-1">
                        Rejected
                      </Badge>
                    )}

                    {/* Chat Action (Only if accepted) */}
                    {request.status === "accepted" && (
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                        asChild
                      >
                        <Link
                          href={{
                            pathname: `/student/chat/${request.alumniUserId}`,
                            query: { name: request.alumniInfo.fullName },
                          }}
                        >
                          Chat Now
                        </Link>
                      </Button>
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
