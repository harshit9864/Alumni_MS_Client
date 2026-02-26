"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function AlumniLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-violet-200">
      
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/alumni" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-violet-200 transition-transform group-hover:scale-105">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">
              Alumni<span className="text-violet-700">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border border-zinc-200 hover:border-violet-400 transition-colors"
                }
              }}
            />

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
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
                  <div className="flex flex-col gap-4 mt-6">
                    <NavLinks mobile onClick={() => setIsOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

// Helper Component for Links
function NavLinks({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/alumni" },
    { name: "Events", href: "/alumni/events" },
    { name: "My Blogs", href: "/alumni/blog" },
    { name: "Mentorship", href: "/alumni/mentorship" },
    { name: "Donate", href: "/alumni/donate" }
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`
              font-medium transition-all duration-200 rounded-lg whitespace-nowrap
              ${mobile 
                ? "block w-full px-4 py-3 text-lg" 
                : "px-4 py-2 text-sm"
              }
              ${isActive 
                ? "bg-violet-50 text-violet-700 font-semibold" 
                : "text-zinc-600 hover:text-violet-700 hover:bg-violet-50"
              }
            `}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}