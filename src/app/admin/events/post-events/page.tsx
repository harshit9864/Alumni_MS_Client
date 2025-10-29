export default function postEvents() {
  return (
    <>
      <h1 className="text-center mt-2 text-2xl font-bold">Post New Event</h1>
      <div className="flex flex-col items-center justify-center mt-5">
        <form className="bg-white p-6 rounded shadow space-y-4 max-w-2xl w-full">
          <div>
            <label className="block text-md font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              placeholder="Enter event name"
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="Date"
              name="eventDate"
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              content
            </label>
            <textarea
              name="content"
              placeholder="Enter event details "
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event time
            </label>
            <input
              type="time"
              name="eventTime"
              placeholder="e.g. Software Engineer"
              className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Event
          </button>
        </form>
      </div>
    </>
  );
}
