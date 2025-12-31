"use client";

import { useEffect, useState } from "react";
import FetchAlumni from "@/lib/api/alumni";
import { useAuth } from "@clerk/nextjs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Briefcase, Building2, UserCircle2, Mail } from "lucide-react";

// Types
export interface Alumni {
  fullName: string;
  batchYear: number;
  email: string;
  currentProfession: string;
  company: string;
}

export default function AdminDirectory() {
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { getToken } = useAuth();

  // ------------------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      const token = await getToken();
      try {
        const alumniRes = await FetchAlumni(token || "", "admin");
        // Ensure we always set an array to avoid crashes
        setAlumnis(Array.isArray(alumniRes.data) ? alumniRes.data : []);
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, [getToken]);

  // ------------------------------------------------------------------
  // FILTER LOGIC
  // ------------------------------------------------------------------
  const filteredAlumni = alumnis.filter((a) => {
    const term = search.toLowerCase();
    return (
      a.fullName?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.currentProfession?.toLowerCase().includes(term) ||
      a.company?.toLowerCase().includes(term) ||
      a.batchYear?.toString().includes(term)
    );
  });

  // ------------------------------------------------------------------
  // UI RENDER
  // ------------------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Alumni Directory</h1>
          <p className="text-zinc-500 mt-1">Manage and view all registered alumni records.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-zinc-200 rounded-lg shadow-sm">
           <span className="text-sm text-zinc-500 font-medium">Total Records:</span>
           <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-100">{alumnis.length}</Badge>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/30">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by name, year, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-zinc-200 focus-visible:ring-violet-500"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow>
                  <TableHead className="font-semibold text-zinc-600">Alumni Name</TableHead>
                  <TableHead className="font-semibold text-zinc-600">Batch</TableHead>
                  <TableHead className="font-semibold text-zinc-600">Contact</TableHead>
                  <TableHead className="font-semibold text-zinc-600">Profession</TableHead>
                  <TableHead className="font-semibold text-zinc-600">Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading Skeletons
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32 bg-zinc-100" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-zinc-100" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40 bg-zinc-100" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 bg-zinc-100" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 bg-zinc-100" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAlumni.length > 0 ? (
                  // Data Rows
                  filteredAlumni.map((a, index) => (
                    <TableRow 
                      key={index} 
                      className="group hover:bg-violet-50/40 transition-colors"
                    >
                      <TableCell className="font-medium text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                            <UserCircle2 className="w-5 h-5" />
                          </div>
                          {a.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-zinc-600 border-zinc-300">
                          {a.batchYear}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-zinc-600 text-sm">
                            <Mail className="w-3.5 h-3.5 text-zinc-400" />
                            {a.email}
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-zinc-600 text-sm">
                          <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                          {a.currentProfession}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-zinc-600 text-sm">
                          <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                          {a.company}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Empty State
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                      No alumni found matching "{search}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}