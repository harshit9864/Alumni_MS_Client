"use client";

import { useState } from "react";

export interface Alumni {
  fullName: string;
  batchYear: number;
  email: string;
  profession: string;
  company: string;
}

export default function Direc() {
  const alumni: Alumni[] = [
    {
      fullName: "Rahul Sharma",
      batchYear: 2018,
      email: "rahul.sharma@example.com",
      profession: "Software Engineer",
      company: "Google",
    },
    {
      fullName: "Priya Verma",
      batchYear: 2017,
      email: "priya.verma@example.com",
      profession: "Data Scientist",
      company: "Microsoft",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredAlumni = alumni.filter((a) => {
    const query = search.toLowerCase();

    return (
      a.fullName.toLowerCase().startsWith(query) ||
      a.email.toLowerCase().startsWith(query) ||
      a.profession.toLowerCase().startsWith(query) ||
      a.company.toLowerCase().startsWith(query) ||
      a.batchYear.toString().startsWith(search)
    );
  });

  return (
    <div className=" bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Alumni Directory</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, batch, email, or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Batch</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Profession</th>
              <th className="p-3 border">Company</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((a, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border">{a.fullName}</td>
                  <td className="p-3 border">{a.batchYear}</td>
                  <td className="p-3 border">{a.email}</td>
                  <td className="p-3 border">{a.profession}</td>
                  <td className="p-3 border">{a.company}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No alumni found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
