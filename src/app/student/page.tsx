import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Calendar,
  MessageSquare,
  Filter,
  MapPin,
  Briefcase,
} from "lucide-react";

export default function Student() {
  const mentorshipRequests = [
    {
      id: 1,
      alumni: "John Smith",
      subject: "Software Development Career",
      status: "pending",
      date: "2024-02-10",
    },
    {
      id: 2,
      alumni: "Sarah Johnson",
      subject: "Product Management Guidance",
      status: "accepted",
      date: "2024-02-08",
    },
  ];
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
            <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
              <div className="px-4 my-5 ">
                <p className="text-xl font-bold ">Current events</p>
                <p className="text-lg font-semibold ">100</p>
              </div>
            </div>
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
                  <Button size="sm">Find Mentors</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentorshipRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <MessageSquare className="w-5 h-5 text-purple-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            To: {request.alumni}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {request.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {request.date}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
