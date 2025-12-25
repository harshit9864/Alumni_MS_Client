"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    passoutYear: "",
    email: "",
    interests: "",
    college: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      fullName: formData.fullName,
      passoutYear: Number(formData.passoutYear),
      email: formData.email,
      interests: formData.interests.split(",").map((i) => i.trim()),
      college: formData.college.toUpperCase(),
    };
    const token = await getToken();

    console.log("Submitting:", payload);
    // Example POST
    try {
      const res = await fetch("http://localhost:8080/student/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "some error occured");
      }
      router.push("/student");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-slate-800">User Details</h2>

        <div>
          <label className="block mb-1 text-slate-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-slate-700">
            Name of College/University
          </label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-slate-700">Passout Year</label>
          <input
            type="number"
            name="passoutYear"
            value={formData.passoutYear}
            onChange={handleChange}
            required
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-slate-700">
            Interests (comma separated)
          </label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            required
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring focus:ring-slate-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition"
        >
          {loading ? "Submiting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
