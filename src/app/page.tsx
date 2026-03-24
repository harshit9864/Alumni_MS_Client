import Link from "next/link";
import AuthRedirector from "@/components/AuthRedirector";
import { 
  BookOpen, Search, UserPlus, Calendar, 
  Award, Edit3, CheckCircle, Users, 
  Shield, Database, CalendarDays, Activity, 
  ArrowRight, GraduationCap 
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased selection:bg-[#dde1ff] selection:text-[#001453]">
      
      {/* Reactively redirects signed-in users to their role dashboard */}
      <AuthRedirector />
      
      {/* --- TopNavBar --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <span className="text-2xl font-bold tracking-tighter text-slate-900">
            AlumniConnect
          </span>
          <div className="flex items-center gap-4">
            <Link 
              href="/sign-in" 
              className="text-[#2b4bb9] font-semibold text-sm tracking-tight hover:opacity-80 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-gradient-to-br from-[#2b4bb9] to-[#4865d3] text-white px-5 py-2.5 rounded-xl font-semibold text-sm tracking-tight hover:opacity-90 transition-all duration-300 active:scale-[0.98] shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-8">
        {/* --- Section 1: Hero Section --- */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dae2fd] text-[#3f465c] text-xs font-bold tracking-wide mb-6 uppercase">
                Legacy & Connection
              </span>
              <h1 className="font-extrabold text-5xl md:text-7xl text-[#191c1e] leading-[1.1] tracking-tighter mb-8">
                Connect with Your <span className="text-[#2b4bb9] italic">Legacy</span>,<br /> Build the Future.
              </h1>
              <p className="text-[#434655] text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
                A unified platform for students to find mentorship, alumni to give back, and the administration to manage the community efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/sign-up" 
                  className="bg-gradient-to-br from-[#2b4bb9] to-[#4865d3] text-white px-8 py-4 rounded-xl font-bold text-base hover:opacity-90 transition-all shadow-[0_12px_48px_-12px_rgba(43,75,185,0.4)] text-center"
                >
                  Join the Community
                </Link>
                <Link 
                  href="/about" 
                  className="bg-white border border-[#c3c6d7]/40 text-[#2b4bb9] px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-50 transition-all text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-[#e0e3e5] relative shadow-2xl shadow-slate-200">
                <img 
                  alt="Academic Community" 
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700" 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-[#2b4bb9]/10 mix-blend-multiply"></div>
              </div>
              
              {/* Accent Element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-[0_12px_48px_-12px_rgba(25,28,30,0.08)] max-w-xs border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="text-[#2b4bb9] w-6 h-6" />
                  <span className="font-bold text-[#191c1e]">Top Mentors</span>
                </div>
                <p className="text-sm text-[#434655]">Access a network of 15,000+ active alumni from Fortune 500 companies.</p>
              </div>
            </div>

          </div>
          
          {/* Background Tonal Shape */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-[#2b4bb9]/5 rounded-full blur-[120px] pointer-events-none"></div>
        </section>

        {/* --- Section 2: 'Designed for Everyone' Section --- */}
        <section className="py-24 bg-[#f2f4f6]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20 text-center md:text-left max-w-3xl">
              <h2 className="font-extrabold text-4xl text-[#191c1e] mb-6 tracking-tight">Designed for Everyone</h2>
              <p className="text-[#434655] text-lg">Whether you're starting your journey, looking to give back, or managing the ecosystem, AlumniConnect provides tailored tools for your success.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* For Students Card */}
              <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_-4px_rgba(25,28,30,0.04)] group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-[#c3c6d7]/20">
                <div className="w-14 h-14 rounded-xl bg-[#2b4bb9]/10 flex items-center justify-center mb-8">
                  <BookOpen className="text-[#2b4bb9] w-7 h-7" />
                </div>
                <h3 className="font-bold text-2xl text-[#191c1e] mb-6">For Students</h3>
                <ul className="space-y-6 flex-grow">
                  <li className="flex items-start gap-4">
                    <Search className="text-[#2b4bb9]/60 w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Browse Alumni directory</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <UserPlus className="text-[#2b4bb9]/60 w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Request 1-on-1 Mentorship</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Calendar className="text-[#2b4bb9]/60 w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Access exclusive events</span>
                  </li>
                </ul>
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <Link href="/sign-up" className="text-[#505f76] font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Get Mentored <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* For Alumni Card */}
              <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_-4px_rgba(25,28,30,0.04)] group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-[#c3c6d7]/20">
                <div className="w-14 h-14 rounded-xl bg-[#d0e1fb]/40 flex items-center justify-center mb-8">
                  <Award className="text-[#54647a] w-7 h-7" />
                </div>
                <h3 className="font-bold text-2xl text-[#191c1e] mb-6">For Alumni</h3>
                <ul className="space-y-6 flex-grow">
                  <li className="flex items-start gap-4">
                    <Edit3 className="text-[#505f76] w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Share expertise via Blogs</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="text-[#505f76] w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Accept Mentorship requests</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Users className="text-[#505f76] w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Join Networking Events</span>
                  </li>
                </ul>
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <Link href="/sign-up" className="text-[#505f76] font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Give Back <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* For Administration Card */}
              <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_-4px_rgba(25,28,30,0.04)] group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-[#c3c6d7]/20">
                <div className="w-14 h-14 rounded-xl bg-[#dae2fd] flex items-center justify-center mb-8">
                  <Shield className="text-[#3f465c] w-7 h-7" />
                </div>
                <h3 className="font-bold text-2xl text-[#191c1e] mb-6">Administration</h3>
                <ul className="space-y-6 flex-grow">
                  <li className="flex items-start gap-4">
                    <Database className="text-[#656d84] w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Manage Alumni Database</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CalendarDays className="text-[#656d84] w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Organize & Post Events</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Activity className="text-[#656d84] w-5 h-5 shrink-0" />
                    <span className="text-[#434655] leading-tight">Monitor Community Health</span>
                  </li>
                </ul>
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <Link href="/sign-in" className="text-[#656d84] font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Platform Login <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* --- Footer --- */}
      <footer className="w-full py-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-xl font-bold tracking-tight text-slate-900">AlumniConnect</span>
            <p className="text-sm text-slate-500 text-center md:text-left">
              © 2026 AlumniConnect. Bridging generations together.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-[#2b4bb9] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-[#2b4bb9] transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-[#2b4bb9] transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}