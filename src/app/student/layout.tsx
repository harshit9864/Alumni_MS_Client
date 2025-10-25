import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="w-full ">
        <div className="px-5 flex justify-between items-center h-10 ">
          <p className="text-xl font-bold">Alumni Portal</p>
          <div className="flex justify-center items-center gap-5">
            <Link href="/student" className="font-semibold">
              DashBoard
            </Link>
            <Link href="/student/events" className="font-semibold">
              Events
            </Link>
            <Link href="/student/findalumni" className="font-semibold">
              Find Alumni
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
