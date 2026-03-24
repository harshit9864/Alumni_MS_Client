"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label";
import { CalendarPlus, Type, Calendar, Clock, FileText, Loader2, Sparkles } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const eventSchema = z.object({
  title: z
    .string()
    .min(5, "Event Name must be at least 5 characters")
    .regex(/[a-zA-Z]/, "Event Name must contain at least one letter"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Valid date is required"),
  time: z.string().min(1, "Time is required"),
  content: z
    .string()
    .min(15, "Description must be at least 15 characters")
    .regex(/[a-zA-Z]/, "Description must contain at least one letter"),
});

export default function PostEvents() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    content: "",
    time: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = eventSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      const zodErrors = validationResult.error.flatten().fieldErrors;
      Object.keys(zodErrors).forEach((key) => {
        fieldErrors[key] = zodErrors[key as keyof typeof zodErrors]?.[0] || "";
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

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

      toast.success("Event posted successfully!");
      setFormData({ title: "", date: "", content: "", time: "" });
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
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
                <Label htmlFor="title" className={`flex items-center gap-2 ${errors.title ? "text-red-500" : "text-zinc-700"}`}>
                    <Type className="w-4 h-4 text-violet-500" /> Event Name
                </Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={formData.title}
                  placeholder="e.g. Annual Alumni Meetup 2025"
                  className={errors.title ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              </div>

              {/* Grid for Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className={`flex items-center gap-2 ${errors.date ? "text-red-500" : "text-zinc-700"}`}>
                    <Calendar className="w-4 h-4 text-violet-500" /> Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    name="date"
                    onChange={handleChange}
                    value={formData.date}
                    className={`block ${errors.date ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className={`flex items-center gap-2 ${errors.time ? "text-red-500" : "text-zinc-700"}`}>
                    <Clock className="w-4 h-4 text-violet-500" /> Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    name="time"
                    onChange={handleChange}
                    value={formData.time}
                    className={`block ${errors.time ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}`}
                  />
                  {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
                </div>
              </div>

              {/* Content / Description */}
              <div className="space-y-2">
                <Label htmlFor="content" className={`flex items-center gap-2 ${errors.content ? "text-red-500" : "text-zinc-700"}`}>
                   <FileText className="w-4 h-4 text-violet-500" /> Description / Agenda
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  onChange={handleChange}
                  value={formData.content}
                  placeholder="Enter detailed event description, agenda, and location..."
                  className={`min-h-[150px] resize-y ${errors.content ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}`}
                />
                {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
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