"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Mentorship {
  _id: string;
  studentInfo: {
    fullName: string;
    userId: string;
  };
  purpose: string;
  status: string;
  date: string;
}

export default function Mentorship() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    const fetchMentorship = async () => {
      const token = await getToken();
      try {
        const res = await fetch("http://localhost:8080/alumni/mentorships", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Something went wrong");
        }
        setMentorships(result.data);
        console.log(result.data);
        console.log(userId);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchMentorship();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: "accepted" | "declined"
  ) => {
    const token = await getToken();
    setStatusLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/alumni/mentorships/${id}/status`,
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

      // Update UI instantly without refetching everything
      setMentorships((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
      setStatusLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
      setStatusLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Mentorship Requests</h3>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
          ) : mentorships.length == 0 ? (
            <div className="text-center font-semibold mt-2">
              No Mentorship Requests
            </div>
          ) : (
            <div className="space-y-4">
              {mentorships.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        From: {request.studentInfo.fullName}
                      </h4>
                      <p className="text-sm text-gray-600">{request.purpose}</p>
                      <p className="text-xs text-gray-500">
                        {request.date.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {request.status}
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          disabled={statusLoading}
                          className="px-3 py-1 rounded-md border border-indigo-600 text-indigo-600 
    hover:bg-indigo-600 hover:text-white transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() =>
                            handleStatusChange(request._id, "accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          disabled={statusLoading}
                          className="px-3 py-1 rounded-md border border-indigo-600 text-indigo-600 
    hover:bg-indigo-600 hover:text-white transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() =>
                            handleStatusChange(request._id, "declined")
                          }
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {request.status === "accepted" &&
                      request.studentInfo.userId && (
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            href={`/alumni/chat/${request.studentInfo.userId}`}
                          >
                            Start Chat
                          </Link>
                        </Button>
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
