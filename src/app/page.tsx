// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <>
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="px-5 h-10">
//           <div className="mx-10 flex justify-between items-center mt-2">
//             <div>Alumni Portal</div>
//             <div className="flex justify-center gap-5">
//               <Link href="/admin" className="font-semibold">
//                 Admin
//               </Link>
//               <Link href="/alumni" className="font-semibold">
//                 Alumni
//               </Link>
//               <Link href="/student" className="font-semibold">
//                 Student
//               </Link>
//             </div>
//             <div>User Button</div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId, sessionClaims } = await auth();

  // 1️⃣ If not logged in, go to sign-in
  if (!userId) {
    redirect("/sign-in");
  }
 
  const role = sessionClaims?.metadata.role as string | undefined;

  // 3️⃣ Redirect based on role
  if (!role) {
    redirect("/select-role");
  } else {
    redirect(`/${role}`);
  }
}
