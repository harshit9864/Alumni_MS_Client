"use client";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface Mentorship {
  _id: number;
  alumniInfo: {
    fullName: string;
  };
  purpose: string;
  status: string;
  date: string;
}

export default function Student() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      try {
        const res = await fetch("http://localhost:8080/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "something went wrong");
        }
        setMentorships(result.data ?? []);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600">
              Connect with alumni and grow your professional network
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
                <div className="px-4 my-5 ">
                  <p className="text-xl font-bold ">Alumni Connections</p>
                  <p className="text-lg font-semibold ">3</p>
                </div>
              </div>
            </div>
            <div>
              <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
                <div className="px-4 my-5 ">
                  <p className="text-xl font-bold ">Mentorship Request</p>
                  <p className="text-lg font-semibold ">1,00,000</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    My Mentorship Requests
                  </h3>
                  <Button size="sm">
                    <Link href="/student/findalumni">Find Mentors </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                ) : (
                  <div className="space-y-4">
                    {mentorships.map((request) => (
                      <div
                        key={request._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          <MessageSquare className="w-5 h-5 text-purple-500 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              To: {request.alumniInfo.fullName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {request.purpose}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.date.split("T")[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={
                              request.status === "pending"
                                ? "secondary"
                                : request.status === "accepted"
                                ? "default"
                                : "default"
                            }
                          >
                            {request.status}
                          </Badge>
                          {request.status === "accepted" && (
                            <Button size="sm" variant="outline">
                              Start Chat
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
        </div>
      </div>
    </>
  );
}
