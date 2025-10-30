"use client";

import { useState } from "react";

export default function PostEvents() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    content: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, date, content, time } = formData;
    if ([title, date, content, time].some((field) => field.trim() === "")) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/postEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(result.message || "Failed to post event");

      alert("Event posted successfully!");
      setFormData({ title: "", date: "", content: "", time: "" });
    } catch (error) {
      alert(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center mt-2 text-2xl font-bold">Post New Event</h1>
      <div className="flex flex-col items-center justify-center mt-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4 max-w-2xl w-full"
        >
          <div>
            <label className="block text-md font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={formData.title}
              placeholder="Enter event name"
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              value={formData.date}
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              onChange={handleChange}
              value={formData.content}
              placeholder="Enter event details"
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Time
            </label>
            <input
              type="time"
              name="time"
              onChange={handleChange}
              value={formData.time}
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Posting..." : "Post Event"}
          </button>
        </form>
      </div>
    </>
  );
}
