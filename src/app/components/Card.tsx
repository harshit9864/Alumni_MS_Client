"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------
interface EventProps {
  _id: string;
  title: string;
  date: string;
  time?: string;
  content: string;
  role?: string; // Checked for permissions
  onDelete?: (id: string) => void;
  onUpdate?: (updatedEvent: any) => void;
}

export default function EventCard({
  _id,
  title,
  date,
  time,

  content,
  role,
  onDelete,
  onUpdate,
}: EventProps) {
  // State for Modal & Editing
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title,
    date,
    time: time || "",
    location: location || "",
    content,
  });

  const { getToken } = useAuth();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      // Adjust URL to your actual backend endpoint
      const res = await fetch(`http://localhost:8080/api/edit-event/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update event");

      if (onUpdate) onUpdate({ _id, ...formData });

      setIsEditing(false);
      toast.success("Event updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8080/api/delete-event/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete event");

      setIsOpen(false);
      if (onDelete) onDelete(_id);
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* ------------------------------------------------------------------
          CARD TRIGGER (The Grid Item)
      ------------------------------------------------------------------ */}
      <DialogTrigger asChild>
        <Card className="flex flex-col h-full border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden cursor-pointer">
          <div className="h-2 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />

          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl font-bold text-zinc-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                {formData.title}
              </CardTitle>

              <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 rounded-lg p-2 min-w-[60px] text-center shrink-0">
                <span
                  className="text-xs font-bold text-violet-600 uppercase"
                  suppressHydrationWarning
                >
                  {new Date(formData.date).toLocaleString("default", {
                    month: "short",
                  })}
                </span>
                <span
                  className="text-xl font-extrabold text-zinc-900 leading-none"
                  suppressHydrationWarning
                >
                  {new Date(formData.date).getDate()}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-grow space-y-4">
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-violet-500" />
                <span suppressHydrationWarning>
                  {new Date(formData.date).toLocaleDateString()}
                </span>
              </div>
              {formData.time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-fuchsia-500" />
                  <span>{formData.time}</span>
                </div>
              )}
            </div>

            <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3">
              {formData.content}
            </p>
          </CardContent>

          <CardFooter className="pt-0 mt-auto">
            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200">
              View Details
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>

      {/* ------------------------------------------------------------------
          MODAL CONTENT
      ------------------------------------------------------------------ */}
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-900">
            {isEditing ? "Edit Event" : "Event Details"}
          </DialogTitle>
          {!isEditing && (
            <DialogDescription>
              Full information about this event.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isEditing ? (
            // --- EDIT FORM ---
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date.split("T")[0]}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Description</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="min-h-[150px]"
                />
              </div>
            </div>
          ) : (
            // --- VIEW MODE ---
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  {formData.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-100">
                    <CalendarDays className="w-4 h-4 text-violet-600" />
                    <span suppressHydrationWarning>
                      {new Date(formData.date).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                    </span>
                  </div>
                  {formData.time && (
                    <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-100">
                      <Clock className="w-4 h-4 text-fuchsia-600" />
                      <span>{formData.time}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-zinc-600 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {formData.content}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEditing ? (
            // Edit Mode Buttons
            <>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </>
          ) : (
            // View Mode Buttons
            <div className="flex w-full justify-between items-center">
              {/* Left Side: Close */}
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>

              {/* Right Side: Admin ONLY Actions */}
              {/* 🛑 CHANGE: Removed '|| role === "alumni"' */}
              {role === "admin" && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 shadow-none"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
