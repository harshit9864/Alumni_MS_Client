"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label";
import { CalendarPlus, Type, Calendar, Clock, FileText, Loader2, Sparkles } from "lucide-react";

export default function PostEvents() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    content: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, date, content, time } = formData;
    if ([title, date, content, time].some((field) => field.trim() === "")) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    const token = await getToken();

    try {
      const res = await fetch("http://localhost:8080/api/postEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(result.message || "Failed to post event");

      alert("Event posted successfully!");
      setFormData({ title: "", date: "", content: "", time: "" });
    } catch (error: any) {
      alert(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            Post New Event <Sparkles className="w-5 h-5 text-violet-500" />
          </h1>
          <p className="text-zinc-500 mt-1">
            Publish workshops, webinars, and meetups for the community.
          </p>
        </div>
      </div>

      {/* --- Form Section --- */}
      <div className="max-w-2xl mx-auto pt-4">
        <Card className="border-zinc-200 shadow-lg">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
             <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full border border-zinc-200 shadow-sm">
                    <CalendarPlus className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <CardTitle className="text-xl">Event Details</CardTitle>
                    <CardDescription>Fill in the information below to broadcast a new event.</CardDescription>
                </div>
             </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2 text-zinc-700">
                    <Type className="w-4 h-4 text-violet-500" /> Event Name
                </Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={formData.title}
                  placeholder="e.g. Annual Alumni Meetup 2025"
                  className="focus-visible:ring-violet-500"
                />
              </div>

              {/* Grid for Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2 text-zinc-700">
                    <Calendar className="w-4 h-4 text-violet-500" /> Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    name="date"
                    onChange={handleChange}
                    value={formData.date}
                    className="focus-visible:ring-violet-500 block"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2 text-zinc-700">
                    <Clock className="w-4 h-4 text-violet-500" /> Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    name="time"
                    onChange={handleChange}
                    value={formData.time}
                    className="focus-visible:ring-violet-500 block"
                  />
                </div>
              </div>

              {/* Content / Description */}
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2 text-zinc-700">
                   <FileText className="w-4 h-4 text-violet-500" /> Description / Agenda
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  onChange={handleChange}
                  value={formData.content}
                  placeholder="Enter detailed event description, agenda, and location..."
                  className="min-h-[150px] resize-y focus-visible:ring-violet-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6 shadow-md shadow-violet-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing Event...
                    </>
                  ) : (
                    "Post Event"
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}