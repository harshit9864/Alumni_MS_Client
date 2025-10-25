import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-5 h-10">
          <div className="mx-10 flex justify-between items-center mt-2">
            <div>Alumni Portal</div>
            <div className="flex justify-center gap-5">
              <Link href="/admin" className="font-semibold">
                Admin
              </Link>
              <Link href="/alumni" className="font-semibold">
                Alumni
              </Link>
              <Link href="/student" className="font-semibold">
                Student
              </Link>
            </div>
            <div>User Button</div>
          </div>
        </div>
      </nav>
    </>
  );
}
