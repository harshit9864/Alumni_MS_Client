"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Menu, GraduationCap, LayoutDashboard, Calendar, FileText, Lightbulb, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function AlumniLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-violet-200 flex">
      
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 min-h-screen sticky top-0 py-6 px-4">
        {/* Logo */}
        <Link href="/alumni" className="flex items-center gap-2 group mb-8 px-2">
          <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-violet-200 transition-transform group-hover:scale-105">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-zinc-900 tracking-tight">
            Alumni<span className="text-violet-700">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex flex-col gap-2 flex-1">
          <NavLinks />
        </div>

        {/* User Profile Desktop */}
        <div className="mt-auto px-2 pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Alumni</span>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border border-slate-200 hover:border-violet-400 transition-colors"
              }
            }}
          />
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- Mobile Header --- */}
        <header className="md:hidden sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link href="/alumni" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-violet-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">
              Alumni<span className="text-violet-700">Connect</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border border-zinc-200 hover:border-violet-400 transition-colors"
                }
              }}
            />
            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-600">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="text-left text-lg font-bold mb-6 ml-2">
                  Alumni Menu
                </SheetTitle>
                <div className="flex flex-col gap-2 mt-6">
                  <NavLinks mobile onClick={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* --- Page Content --- */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Helper Component for Links (Reused for Desktop & Mobile)
// ----------------------------------------------------------------------
function NavLinks({ 
  mobile = false, 
  onClick 
}: { 
  mobile?: boolean; 
  onClick?: () => void 
}) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/alumni", icon: LayoutDashboard },
    { name: "Events", href: "/alumni/events", icon: Calendar },
    { name: "My Blogs", href: "/alumni/blog", icon: FileText },
    { name: "Mentorship", href: "/alumni/mentorship", icon: Lightbulb },
    // { name: "Donate", href: "/alumni/donate", icon: DollarSign }
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`
              flex items-center gap-3 transition-all duration-200 rounded-md
              ${mobile ? "px-4 py-3 text-lg" : "px-3 py-2 text-sm"}
              ${isActive 
                ? "bg-white text-blue-600 shadow-sm font-medium" 
                : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 font-medium"
              }
            `}
          >
            <Icon className="w-5 h-5" />
            {link.name}
          </Link>
        );
      })}
    </>
  );
}