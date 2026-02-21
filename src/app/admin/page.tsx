import dynamic from "next/dynamic";

const AdAlumni = dynamic(() => import("../components/adAlumni"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
    </div>
  ),
});

export default function () {
  
  return (
    <>
      <AdAlumni/>
    </>
  );
}
