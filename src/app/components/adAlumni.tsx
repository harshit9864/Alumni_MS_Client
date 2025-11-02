"use client";

import { useEffect, useState } from "react";

export default function AdAlumni() {
  const [totalDocuments, setTotalDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const result = await fetch("http://localhost:8080/api/totalAlumni");

        const res = await result.json();
        if (!result.ok) {
          throw new Error("something went wrong");
        }
        setTotalDocuments(res.data);
        setLoading(false);
        console.log(res.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchTotal();
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentProfession: "",
    company: "",
    batchYear: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, batchYear, email, currentProfession, company } = formData;
    if (
      [fullName, batchYear, email, currentProfession, company].some(
        (field) => field?.trim() === ""
      )
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/addAlumni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      // update state immutably instead of mutating the array
      setTotalDocuments((prev) => {
        const next = [...prev];
        next[0] = result.data.totalAlumni;
        return next;
      });
      console.log("Server response:", result);
    } catch (error) {
      // console.error("Error sending form data:", error.message);
      alert(error);
    } finally {
      setFormData({
        fullName: "",
        email: "",
        currentProfession: "",
        company: "",
        batchYear: "",
      });
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage alumni database and university events
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
              <div className="px-4 my-5 ">
                <p className="text-xl font-bold ">Total Alumni</p>
                {loading ? (
                  <p className="text-black animate-pulse">Loading...</p>
                ) : (
                  <p className="text-lg font-semibold ">{totalDocuments[0]}</p>
                )}
              </div>
            </div>
            <div>
              <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
                <div className="px-4 my-5 ">
                  <p className="text-xl font-bold ">Current Events</p>
                  {loading ? (
                    <p className="text-black animate-pulse">Loading...</p>
                  ) : (
                    <p className="text-lg font-semibold ">
                      {totalDocuments[1]}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
                <div className="px-4 my-5 ">
                  <p className="text-xl font-bold ">Total Donations</p>
                  <p className="text-lg font-semibold ">1,00,000</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-5">
            <p className="text-2xl font-bold">Add Alumni</p>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded shadow space-y-4 max-w-2xl w-full"
            >
              <div>
                <label className="block text-md font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  placeholder="Enter alumni name"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Batch Year
                </label>
                <input
                  type="number"
                  name="batchYear"
                  value={formData.batchYear}
                  placeholder="e.g. 2018"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter alumni email"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Profession
                </label>
                <input
                  type="text"
                  name="currentProfession"
                  value={formData.currentProfession}
                  placeholder="e.g. Software Engineer"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  placeholder="e.g. Google"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              {/* add toast to add interactivity */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Alumni
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
