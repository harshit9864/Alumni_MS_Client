import BlogPublishForm from "../components/blogPublish";

export default function alumni() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Alumni Dashboard</h1>
          <p className="text-gray-600">Join events and connect with students</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
            <div className="px-4 my-5 ">
              <p className="text-xl font-bold ">Events Joined</p>
              <p className="text-lg font-semibold ">8</p>
            </div>
          </div>
          <div>
            <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
              <div className="px-4 my-5 ">
                <p className="text-xl font-bold ">Blogs Published</p>
                <p className="text-lg font-semibold ">3</p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-auto w-auto border-2 border-sky-200 rounded-md">
              <div className="px-4 my-5 ">
                <p className="text-xl font-bold ">Mentorship Requests</p>
                <p className="text-lg font-semibold ">10</p>
              </div>
            </div>
          </div>
        </div>

        <BlogPublishForm />
      </div>
    </div>
  );
}
