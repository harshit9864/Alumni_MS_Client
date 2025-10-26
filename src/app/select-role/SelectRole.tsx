"use client";

import { useTransition } from "react";
import { redirect } from "next/navigation";

export default function SelectRole({
  updateUser,
}: {
  updateUser: (role: "admin" | "alumni" | "student") => Promise<any>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (role: "admin" | "alumni" | "student") => {
    startTransition(async () => {
      await updateUser(role);
      redirect(`/${role}`);
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-semibold">Select your role</h1>

      <div className="flex gap-4">
        <button
          onClick={() => handleSelect("admin")}
          className="p-4 bg-blue-500 text-white rounded-xl"
          disabled={isPending}
        >
          Admin
        </button>
        <button
          onClick={() => handleSelect("alumni")}
          className="p-4 bg-green-500 text-white rounded-xl"
          disabled={isPending}
        >
          Alumni
        </button>
        <button
          onClick={() => handleSelect("student")}
          className="p-4 bg-purple-500 text-white rounded-xl"
          disabled={isPending}
        >
          Student
        </button>
      </div>

      {isPending && <p className="text-gray-500">Updating role...</p>}
    </main>
  );
}
