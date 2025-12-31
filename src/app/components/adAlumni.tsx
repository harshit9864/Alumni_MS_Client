"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Calendar, DollarSign, UserPlus, Loader2, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const [totalDocuments, setTotalDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useAuth();

  // ------------------------------------------------------------------
  // 1. FETCH STATS
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchTotal = async () => {
      const token = await getToken();
      try {
        const result = await fetch("http://localhost:8080/api/totalAlumni", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await result.json();
        if (!result.ok) throw new Error("something went wrong");
        
        setTotalDocuments(res.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotal();
  }, [getToken]);

  // ------------------------------------------------------------------
  // 2. FORM HANDLING
  // ------------------------------------------------------------------
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentProfession: "",
    company: "",
    batchYear: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, batchYear, email, currentProfession, company } = formData;
    
    if ([fullName, batchYear, email, currentProfession, company].some((field) => field?.trim() === "")) {
      alert("All fields are required");
      return;
    }

    setSubmitting(true);
    const token = await getToken();
    
    try {
      const response = await fetch("http://localhost:8080/api/addAlumni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Something went wrong");

      // Update local state to reflect new count immediately
      setTotalDocuments((prev) => {
        const next = [...prev];
        if(result.data?.totalAlumni) next[0] = result.data.totalAlumni;
        return next;
      });

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        currentProfession: "",
        company: "",
        batchYear: "",
      });
      
      alert("Alumni added successfully!"); // Replace with toast if available

    } catch (error) {
      alert(error);
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------------
  // 3. UI RENDER
  // ------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            Admin Dashboard <Sparkles className="w-5 h-5 text-violet-500" />
          </h1>
          <p className="text-zinc-500 mt-1">
            Overview of database stats and management tools.
          </p>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Alumni Card */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Alumni</CardTitle>
            <div className="p-2 bg-violet-100 rounded-lg">
               <Users className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-zinc-900">{totalDocuments[0] ?? 0}</div>
            )}
            
          </CardContent>
        </Card>

        {/* Current Events Card */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Active Events</CardTitle>
            <div className="p-2 bg-fuchsia-100 rounded-lg">
               <Calendar className="h-4 w-4 text-fuchsia-600" />
            </div>
          </CardHeader>
          <CardContent>
             {loading ? (
              <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-zinc-900">{totalDocuments[1] ?? 0}</div>
            )}
           
          </CardContent>
        </Card>

        {/* Donations Card (Static for now as per original code) */}
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Donations</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
               <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">₹ 1,00,000</div>
            
          </CardContent>
        </Card>
      </div>

      {/* --- Add Alumni Form --- */}
      <div className="max-w-3xl mx-auto pt-4">
        <Card className="border-zinc-200 shadow-lg">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full border border-zinc-200 shadow-sm">
                        <UserPlus className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Add New Alumni</CardTitle>
                        <CardDescription>Manually register a graduate into the system.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input 
                                id="fullName"
                                name="fullName"
                                placeholder="e.g. ABC"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="focus-visible:ring-violet-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email"
                                type="email"
                                name="email"
                                placeholder="ABC@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="focus-visible:ring-violet-500"
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 md:col-span-1">
                            <Label htmlFor="batchYear">Batch Year</Label>
                            <Input 
                                id="batchYear"
                                type="number"
                                name="batchYear"
                                placeholder="2024"
                                value={formData.batchYear}
                                onChange={handleChange}
                                className="focus-visible:ring-violet-500"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="company">Company / Organization</Label>
                            <Input 
                                id="company"
                                name="company"
                                placeholder="e.g. Google, Microsoft"
                                value={formData.company}
                                onChange={handleChange}
                                className="focus-visible:ring-violet-500"
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="space-y-2">
                        <Label htmlFor="currentProfession">Current Profession / Role</Label>
                        <Input 
                            id="currentProfession"
                            name="currentProfession"
                            placeholder="e.g. Senior Software Engineer"
                            value={formData.currentProfession}
                            onChange={handleChange}
                            className="focus-visible:ring-violet-500"
                        />
                    </div>

                    <div className="pt-2">
                        <Button 
                            type="submit" 
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save to Database"
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