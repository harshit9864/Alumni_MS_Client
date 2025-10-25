import Link from "next/link";

export default function () {
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
                <p className="text-lg font-semibold ">100</p>
              </div>
            </div>
            <div>
              <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
                <div className="px-4 my-5 ">
                  <p className="text-xl font-bold ">Current Events</p>
                  <p className="text-lg font-semibold ">3</p>
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
            <form className="bg-white p-6 rounded shadow space-y-4 max-w-2xl w-full">
              <div>
                <label className="block text-md font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter alumni name"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Batch Year
                </label>
                <input
                  type="number"
                  name="batchYear"
                  placeholder="e.g. 2018"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter alumni email"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Profession
                </label>
                <input
                  type="text"
                  name="profession"
                  placeholder="e.g. Software Engineer"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Google"
                  className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
