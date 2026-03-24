"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
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

// Define the expected props
interface AdminDashboardProps {
  initialStats: any[];
}

const alumniSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .regex(/[a-zA-Z]/, "Name must contain letters"), // Ensures it's not just numbers
  email: z.string().email("Invalid email address"),
  batchYear: z.string().regex(/^\d{4}$/, "Batch Year must be a 4-digit number (e.g. 2024)"),
  company: z
    .string()
    .min(1, "Company is required")
    .regex(/[a-zA-Z]/, "Company name must contain at least one letter"), // Allows "3M" or "B2B Inc" but blocks "12345"
  currentProfession: z
    .string()
    .min(1, "Profession is required")
    .regex(/[a-zA-Z]/, "Profession must contain at least one letter"), // Blocks purely numeric professions
});

export default function AdminDashboard({ initialStats }: AdminDashboardProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  
  // Initialize state directly from the server-fetched props
  const [totalDocuments, setTotalDocuments] = useState<any[]>(initialStats);
  const [submitting, setSubmitting] = useState(false);

  // ------------------------------------------------------------------
  // 1. FORM HANDLING
  // ------------------------------------------------------------------
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentProfession: "",
    company: "",
    batchYear: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationResult = alumniSchema.safeParse(formData);
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

      // Optimistically update local state so the user sees immediate feedback
      setTotalDocuments((prev) => {
        const next = [...prev];
        if (result.data?.totalAlumni) next[0] = result.data.totalAlumni;
        return next;
      });

      // Clear the form
      setFormData({
        fullName: "",
        email: "",
        currentProfession: "",
        company: "",
        batchYear: "",
      });
      
      toast.success("Alumni added successfully!");

      // Refresh the route to ensure the server component is in sync with the new data
      router.refresh();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------------
  // 2. UI RENDER
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
            {/* We removed the loading spinner because the data arrives instantly from the server */}
            <div className="text-3xl font-bold text-zinc-900">{totalDocuments[0] ?? 0}</div>
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
            <div className="text-3xl font-bold text-zinc-900">{totalDocuments[1] ?? 0}</div>
          </CardContent>
        </Card>

        {/* Donations Card */}
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
                            <Label htmlFor="fullName" className={errors.fullName ? "text-red-500" : ""}>Full Name</Label>
                            <Input 
                                id="fullName"
                                name="fullName"
                                placeholder="e.g. ABC"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email Address</Label>
                            <Input 
                                id="email"
                                type="email"
                                name="email"
                                placeholder="ABC@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 md:col-span-1">
                            <Label htmlFor="batchYear" className={errors.batchYear ? "text-red-500" : ""}>Batch Year</Label>
                            <Input 
                                id="batchYear"
                                type="number"
                                name="batchYear"
                                placeholder="2024"
                                value={formData.batchYear}
                                onChange={handleChange}
                                className={errors.batchYear ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                            />
                            {errors.batchYear && <p className="text-red-500 text-xs">{errors.batchYear}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="company" className={errors.company ? "text-red-500" : ""}>Company / Organization</Label>
                            <Input 
                                id="company"
                                name="company"
                                placeholder="e.g. Google, Microsoft"
                                value={formData.company}
                                onChange={handleChange}
                                className={errors.company ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                            />
                            {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="space-y-2">
                        <Label htmlFor="currentProfession" className={errors.currentProfession ? "text-red-500" : ""}>Current Profession / Role</Label>
                        <Input 
                            id="currentProfession"
                            name="currentProfession"
                            placeholder="e.g. Senior Software Engineer"
                            value={formData.currentProfession}
                            onChange={handleChange}
                            className={errors.currentProfession ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                        />
                        {errors.currentProfession && <p className="text-red-500 text-xs">{errors.currentProfession}</p>}
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