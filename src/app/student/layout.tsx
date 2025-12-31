"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-violet-200">
      
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/student" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-violet-200 transition-transform group-hover:scale-105">
              A
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">
              Alumni<span className="text-violet-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
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

            {/* Mobile Menu Trigger (Visible on Mobile) */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-zinc-600">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="text-left text-lg font-bold mb-6">
                    Menu
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
    { name: "Dashboard", href: "/student" },
    { name: "Events", href: "/student/events" },
    { name: "Find Alumni", href: "/student/findalumni" },
    { name: "Blogs", href: "/student/blogs" },
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
              font-medium transition-all duration-200 rounded-lg
              ${mobile 
                ? "block w-full px-4 py-3 text-lg" // Mobile Styles
                : "px-4 py-2 text-sm"              // Desktop Styles
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