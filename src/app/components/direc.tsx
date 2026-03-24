"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Briefcase, 
  Building2, 
  UserCircle2, 
  Mail, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Loader2
} from "lucide-react";

export interface Alumni {
  _id: string;
  fullName: string;
  batchYear: number;
  email: string;
  currentProfession: string;
  company: string;
}

interface AdminDirectoryProps {
  initialAlumnis: Alumni[];
}

export default function AdminDirectory({ initialAlumnis }: AdminDirectoryProps) {
  // Initialize state with the SSR data
  const [alumnis, setAlumnis] = useState<Alumni[]>(initialAlumnis);
  const [search, setSearch] = useState("");
  const { getToken } = useAuth();

  // --- EDIT STATE ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentAlumni, setCurrentAlumni] = useState<Alumni | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- DELETE STATE ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [alumniToDelete, setAlumniToDelete] = useState<Alumni | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- HANDLERS ---
  const handleEditClick = (alumni: Alumni) => {
    setCurrentAlumni({ ...alumni }); 
    setIsEditOpen(true);
  };

  const handleUpdateAlumni = async () => {
    if (!currentAlumni) return;
    setIsSaving(true);
    const token = await getToken();

    try {
      const res = await fetch(`http://localhost:8080/api/edit-alumni/${currentAlumni._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentAlumni),
      });

      if (!res.ok) throw new Error("Failed to update alumni");

      // Update UI locally
      setAlumnis((prev) => 
        prev.map((a) => (a._id === currentAlumni._id ? currentAlumni : a))
      );
      
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error updating record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (alumni: Alumni) => {
    setAlumniToDelete(alumni);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!alumniToDelete) return;
    setIsDeleting(true);
    const token = await getToken();

    try {
      const res = await fetch(`http://localhost:8080/api/delete-alumni/${alumniToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete alumni");

      // Remove from UI locally
      setAlumnis((prev) => prev.filter((a) => a._id !== alumniToDelete._id));
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error deleting record");
    } finally {
      setIsDeleting(false);
    }
  };

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
                  <TableHead className="font-semibold text-zinc-600 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlumni.length > 0 ? (
                  filteredAlumni.map((a) => (
                    <TableRow key={a._id} className="group hover:bg-violet-50/40 transition-colors">
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
                      
                      {/* ACTION COLUMN */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditClick(a)}>
                              <Pencil className="mr-2 h-4 w-4 text-zinc-500" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(a)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                      No alumni found matching "{search}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Alumni Record</DialogTitle>
            <DialogDescription>
              Update the details for this alumni here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {currentAlumni && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-zinc-500">Name</Label>
                <Input
                  id="name"
                  value={currentAlumni.fullName}
                  onChange={(e) => setCurrentAlumni({ ...currentAlumni, fullName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-zinc-500">Email</Label>
                <Input
                  id="email"
                  value={currentAlumni.email}
                  onChange={(e) => setCurrentAlumni({ ...currentAlumni, email: e.target.value })}
                  className="col-span-3 bg-zinc-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batch" className="text-right text-zinc-500">Batch</Label>
                <Input
                  id="batch"
                  type="number"
                  value={currentAlumni.batchYear}
                  onChange={(e) => setCurrentAlumni({ ...currentAlumni, batchYear: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profession" className="text-right text-zinc-500">Profession</Label>
                <Input
                  id="profession"
                  value={currentAlumni.currentProfession}
                  onChange={(e) => setCurrentAlumni({ ...currentAlumni, currentProfession: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right text-zinc-500">Company</Label>
                <Input
                  id="company"
                  value={currentAlumni.company}
                  onChange={(e) => setCurrentAlumni({ ...currentAlumni, company: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}

          <DialogFooter>
             <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
             <Button 
                onClick={handleUpdateAlumni} 
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={isSaving}
             >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the record for <strong>{alumniToDelete?.fullName}</strong>? 
              <br /><br />
              This action cannot be undone and will remove their access to the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}