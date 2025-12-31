"use client";

import FetchAlumni from "@/lib/api/alumni";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Search,
  Briefcase,
  GraduationCap,
  Building2,
  Send,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this: npx shadcn-ui@latest add textarea
import { Skeleton } from "@/components/ui/skeleton";

export interface Alumni {
  fullName: string;
  batchYear: number;
  email: string;
  currentProfession: string;
  company: string;
}

export default function AlumniDirectory() {
  const [search, setSearch] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [alumni, setAlumnis] = useState<Alumni[]>([]);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useAuth();

  // ------------------------------------------------------------------
  // 1. FETCH DATA
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      const token = await getToken();
      try {
        const res = await FetchAlumni(token || "", "student");
        // Ensure we are setting an array
        setAlumnis(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, [getToken]);

  // ------------------------------------------------------------------
  // 2. FILTER LOGIC
  // ------------------------------------------------------------------
  const filteredAlumni = alumni.filter((a) => {
    const query = search.toLowerCase();
    return (
      a.fullName.toLowerCase().includes(query) ||
      a.currentProfession.toLowerCase().includes(query) ||
      a.company.toLowerCase().includes(query) ||
      a.batchYear.toString().includes(query)
    );
  });

  // ------------------------------------------------------------------
  // 3. ACTION HANDLERS
  // ------------------------------------------------------------------
  const handleConfirm = async () => {
    if (!selectedAlumni || !purpose.trim()) return;
    setSubmitting(true);
    const token = await getToken();

    try {
      const res = await fetch("http://localhost:8080/student/mentorship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: selectedAlumni.email, purpose }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Request failed");

      // Reset and Close
      setPurpose("");
      setSelectedAlumni(null);
      alert(`Mentorship request sent to ${selectedAlumni.fullName}!`); // Replace with toast if available
    } catch (error) {
      alert("Error sending request: " + error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-zinc-500 mt-1">
            Connect with mentors and industry professionals.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by name, company, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-zinc-200 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-zinc-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-zinc-600">
                    Alumni Name
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-600">
                    Batch
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-600">
                    Profession
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-600">
                    Company
                  </TableHead>
                  <TableHead className="text-right font-semibold text-zinc-600">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading Skeletons
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAlumni.length > 0 ? (
                  // Data Rows
                  filteredAlumni.map((a, index) => (
                    <TableRow
                      key={index}
                      className="group hover:bg-violet-50/30 transition-colors"
                    >
                      <TableCell className="font-medium text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs">
                            {a.fullName.charAt(0)}
                          </div>
                          {a.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-zinc-500 border-zinc-300 font-normal"
                        >
                          {a.batchYear}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                          {a.currentProfession}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                          {a.company}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-violet-600 hover:text-violet-700 hover:bg-violet-100 font-medium"
                          onClick={() => setSelectedAlumni(a)}
                        >
                          Request Mentorship
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Empty State
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-zinc-500"
                    >
                      No alumni found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* --- Request Modal (Dialog) --- */}
      <Dialog
        open={!!selectedAlumni}
        onOpenChange={(open) => !open && setSelectedAlumni(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              Request Mentorship
            </DialogTitle>
            <DialogDescription>
              Reach out to{" "}
              <span className="font-semibold text-zinc-900">
                {selectedAlumni?.fullName}
              </span>{" "}
              for guidance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Alumni Summary Card inside Modal */}
            <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
                {selectedAlumni?.fullName.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-zinc-900 text-sm">
                  {selectedAlumni?.fullName}
                </h4>
                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                  <Briefcase className="w-3 h-3" />{" "}
                  {selectedAlumni?.currentProfession} at{" "}
                  {selectedAlumni?.company}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Why do you want to connect?
              </label>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Hi, I'm interested in your career path as a Software Engineer and would love to ask a few questions..."
                className="min-h-[120px] resize-none focus-visible:ring-violet-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedAlumni(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={submitting || !purpose.trim()}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {submitting ? "Sending..." : "Send Request"}
              {!submitting && <Send className="w-4 h-4 ml-2" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
