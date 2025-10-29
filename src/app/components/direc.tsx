"use client";

import { useEffect, useState } from "react";

export interface Alumni {
  fullName: string;
  batchYear: number;
  email: string;
  currentProfession: string;
  company: string;
}

export default function Direc() {
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/direc");
        if (!res.ok) {
          throw new Error("something went wrong");
        }
        const result = await res.json();
        setAlumnis(result.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchAlumni();
  }, []);

  const [search, setSearch] = useState("");

  const filteredAlumni = alumnis.filter((a) => {
    const searchTerm = search.toLowerCase();
    return (
      a.fullName?.toLowerCase().startsWith(searchTerm) ||
      a.email?.toLowerCase().startsWith(searchTerm) ||
      a.currentProfession?.toLowerCase().startsWith(searchTerm) ||
      a.company?.toLowerCase().startsWith(searchTerm) ||
      a.batchYear?.toString().startsWith(search)
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
        <table className="w-full">
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
                  <td className="p-3 border">{a.currentProfession}</td>
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
