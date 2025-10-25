import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="w-full h-10 ">
        <div className="px-5 flex justify-between items-center h-full ">
          <p className="text-xl font-bold">Alumni Portal</p>
          <div className="flex justify-center items-center gap-10">
            <Link href="/alumni" className="font-semibold">
              DashBoard
            </Link>
            <Link href="/alumni/events" className="font-semibold">
              Events
            </Link>
            <Link href="/alumni/blog" className="font-semibold">
              My Blogs
            </Link>
            <Link href="/alumni/mentorship" className="font-semibold">
              Mentorship
            </Link>
          </div>
          <button>
            <UserButton />
          </button>
        </div>
      </nav>
      {children}
    </>
  );
}
