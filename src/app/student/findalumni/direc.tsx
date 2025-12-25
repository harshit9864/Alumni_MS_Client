"use client";

import FetchAlumni from "@/lib/api/alumni";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export interface Alumni {
  fullName: string;
  batchYear: number;
  email: string;
  currentProfession: string;
  company: string;
}

export default function Direc() {
  const [search, setSearch] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alumni, setAlumnis] = useState<Alumni[]>([]);
  const [purpose, setPurpose] = useState("");
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchAlumni = async () => {
      const token = await getToken();
      try {
        const alumni = await FetchAlumni(token || "","student");
        setAlumnis(alumni.data);
        console.log(alumni.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter((a) => {
    const query = search.toLowerCase();

    return (
      a.fullName.toLowerCase().startsWith(query) ||
      a.email.toLowerCase().startsWith(query) ||
      a.currentProfession.toLowerCase().startsWith(query) ||
      a.company.toLowerCase().startsWith(query) ||
      a.batchYear.toString().startsWith(search)
    );
  });

  const handleRowClick = (alumnus: Alumni) => {
    setSelectedAlumni(alumnus);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedAlumni) return;
    const token = await getToken();

    try {
      // Example fetch call
      const res = await fetch("http://localhost:8080/student/mentorship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: selectedAlumni.email, purpose }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "something went wrong");
      }

      alert(
        `mentorship request succesfully sent to  ${selectedAlumni.fullName}`
      );
    } catch (error) {
      alert(error);
    } finally {
      setShowModal(false);
      setSelectedAlumni(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedAlumni(null);
  };

  return (
    <div className="bg-white shadow rounded p-6 relative">
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
                <tr
                  key={index}
                  onClick={() => handleRowClick(a)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
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

      {/* Modal */}
      {showModal && selectedAlumni && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-3">
              Purpose for mentorship
            </h3>
            {/* New input field */}
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Explain your purpose..."
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-lg font-bold text-blue-600 mb-6">
              {selectedAlumni.fullName}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
