import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Mentorship() {
  const mentorshipRequests = [
    {
      id: 1,
      student: "Alice Johnson",
      subject: "Career Guidance",
      status: "pending",
      date: "2024-02-10",
    },
    {
      id: 2,
      student: "Bob Smith",
      subject: "Project Help",
      status: "accepted",
      date: "2024-02-08",
    },
    {
      id: 3,
      student: "Carol Davis",
      subject: "Interview Prep",
      status: "completed",
      date: "2024-02-05",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Mentorship Requests</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentorshipRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      From: {request.student}
                    </h4>
                    <p className="text-sm text-gray-600">{request.subject}</p>
                    <p className="text-xs text-gray-500">{request.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {request.status}
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <button className="border-3 border-indigo-600 px-1 cursor-pointer">
                        Accept
                      </button>
                      <button className="border-3 border-indigo-600 px-1 cursor-pointer">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
