import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="w-full h-10 ">
        <div className="px-5 flex justify-between items-center h-full ">
          <p className="text-xl font-bold">Alumni Portal</p>
          <div className="flex justify-center items-center gap-2 mr-20">
            <Link href="/admin" className="font-semibold">
              DashBoard
            </Link>
            <Link href="/admin/directory" className="font-semibold">
              Directory
            </Link>
            <Link href="/admin/events" className="font-semibold">
              Events
            </Link>
            <Link href="/admin/events/post-events" className="font-semibold">
              Post-Event
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
