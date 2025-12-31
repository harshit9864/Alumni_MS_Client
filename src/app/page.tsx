import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();

  // ------------------------------------------------------------------
  // 🔄 LOGIC SECTION
  // If the user IS logged in, we perform your existing role-based redirects.
  // ------------------------------------------------------------------
  if (userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role as string | undefined;

    console.log("Server Log - Role:", role);

    if (!role) {
      redirect("/select-role");
    } else {
      redirect(`/${role}`);
    }
  }

  // ------------------------------------------------------------------
  // 🎨 UI SECTION (Only visible to non-logged-in users)
  // Designed for Light Mode, Clean & Professional Alumni System
  // ------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100">
      
      {/* --- Navbar --- */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl text-blue-700 tracking-tight">
            Alumni<span className="text-slate-800">Connect</span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/sign-in" 
              className="text-slate-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition-shadow shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm uppercase tracking-wider">
            Bridging the Gap
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Connect with Your Legacy, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Build the Future.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A unified platform for students to find mentorship, alumni to give back, and the administration to manage the community efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-up" 
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-xl"
            >
              Join the Community
            </Link>
            <Link 
              href="/about" 
              className="bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* --- Features / Roles Overview --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Designed for Everyone</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Whether you are looking to guide the next generation or seeking guidance yourself, our platform provides the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Student Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <svg className="w-7 h-7 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Students</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Browse Alumni directory
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Request 1-on-1 Mentorship
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Access exclusive events
                </li>
              </ul>
            </div>

            {/* Alumni Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <svg className="w-7 h-7 text-indigo-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Alumni</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Share expertise via Blogs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Accept Mentorship requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Join Event
                </li>
              </ul>
            </div>

            {/* Admin Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-800 transition-colors">
                <svg className="w-7 h-7 text-slate-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Administration</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Manage Alumni Database
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Organize & Post Events
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Monitor Community Health
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500">© 2025 Alumni Management System. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}