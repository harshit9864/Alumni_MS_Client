"use client";

import { useTransition } from "react";
import { redirect } from "next/navigation";

export default function SelectRole({
  updateUser,
}: {
  updateUser: (role: "admin" | "alumni" | "student") => Promise<any>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (role: "admin" | "alumni" | "student") => {
    startTransition(async () => {
      await updateUser(role);
      // ---------------------------------------------------------
      // 🔒 YOUR LOGIC PRESERVED BELOW
      // ---------------------------------------------------------
      if (role === "student") {
        redirect("/components/fillForm");
      } else if (role === "admin") {
        redirect("/components/adminForm");
      } else {
        redirect(`/${role}`);
      }
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="max-w-5xl w-full space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Choose Your Role
          </h1>
          <p className="text-slate-500 text-lg">
            Select how you will interact with the Alumni Management System.
          </p>
        </div>

        {/* Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {/* --- STUDENT CARD --- */}
          <button
            onClick={() => handleSelect("student")}
            disabled={isPending}
            className="group relative bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col items-center md:items-start"
          >
            <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Student</h3>
            <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">
              Join to find mentors, browse alumni directories, and access student-exclusive events.
            </p>
            <div className="mt-6 w-full py-2 text-center rounded-lg bg-slate-100 text-slate-700 font-semibold group-hover:bg-slate-800 group-hover:text-white transition-colors">
              Select Student
            </div>
          </button>

          {/* --- ALUMNI CARD --- */}
          <button
            onClick={() => handleSelect("alumni")}
            disabled={isPending}
            className="group relative bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col items-center md:items-start"
          >
            <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Alumni</h3>
            <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">
              Share your expertise, post blogs, accept mentorships, and network with peers.
            </p>
            <div className="mt-11 w-full py-2 text-center rounded-lg bg-slate-100 text-slate-700 font-semibold group-hover:bg-slate-800 group-hover:text-white transition-colors">
              Select Alumni
            </div>
          </button>

          {/* --- ADMIN CARD --- */}
          <button
            onClick={() => handleSelect("admin")}
            disabled={isPending}
            className="group relative bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col items-center md:items-start"
          >
            <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Admin</h3>
            <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">
              Manage the platform, oversee users, organize events, and maintain system health.
            </p>
            <div className="mt-6 w-full py-2 text-center rounded-lg bg-slate-100 text-slate-700 font-semibold group-hover:bg-slate-800 group-hover:text-white transition-colors">
              Select Admin
            </div>
          </button>

        </div>

        {/* Loading Indicator */}
        {isPending && (
          <div className="flex items-center justify-center gap-2 text-slate-500 animate-pulse mt-8">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Setting up your profile...</span>
          </div>
        )}
      </div>
    </main>
  );
}