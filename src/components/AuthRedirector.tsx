"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Client-side component that reactively detects Clerk auth state
 * and redirects signed-in users to their role-specific dashboard.
 *
 * Renders a full-screen loading overlay while redirecting,
 * or renders nothing if the user is not signed in.
 */
export default function AuthRedirector() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (isSignedIn && user) {
      const role = user.publicMetadata?.role as string | undefined;
      setIsRedirecting(true);

      if (!role) {
        router.push("/select-role");
      } else {
        router.push(`/${role}`);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show a full-screen loading overlay while we redirect
  // This hides the landing page content during the brief transition
  if (!isLoaded || isRedirecting) {
    if (!isLoaded) return null; // Don't show anything until Clerk loads
    // Only show overlay once we know we need to redirect
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 text-sm font-medium">Redirecting to your dashboard...</p>
      </div>
    );
  }

  // User is not signed in — render nothing and let the landing page show
  return null;
}
