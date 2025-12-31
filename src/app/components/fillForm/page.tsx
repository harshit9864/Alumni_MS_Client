"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    passoutYear: "",
    email: "",
    interests: "",
    college: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      fullName: formData.fullName,
      passoutYear: Number(formData.passoutYear),
      email: formData.email,
      interests: formData.interests.split(",").map((i) => i.trim()),
      college: formData.college.toUpperCase(),
    };
    
    try {
      const token = await getToken();
      console.log("Submitting:", payload);
      
      const res = await fetch("http://localhost:8080/student/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "some error occured");
      }
      router.push("/student");
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Optional: Add a toast notification here for errors
    }
  }

  // Helper class for consistent input styling
  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6 font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-2xl animate-fade-in-up">
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 mt-2">
            Help us personalize your student experience.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-10 space-y-6"
        >
          {/* Full Name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. ABC"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="ABC@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Grid for College & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>College / University</label>
              <input
                type="text"
                name="college"
                placeholder="e.g. MIT"
                value={formData.college}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Passout Year</label>
              <input
                type="number"
                name="passoutYear"
                placeholder="2025"
                value={formData.passoutYear}
                onChange={handleChange}
                required
                min="1900"
                max="2099"
                className={inputClass}
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className={labelClass}>
              Areas of Interest <span className="text-slate-400 font-normal">(Comma separated)</span>
            </label>
            <input
              type="text"
              name="interests"
              placeholder="e.g. Web Development, AI, Data Science"
              value={formData.interests}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] 
                ${loading 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   Creating Profile...
                </span>
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}