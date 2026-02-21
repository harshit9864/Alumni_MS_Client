
import dynamic from "next/dynamic";
import { updateUser } from "@/app/actions/updateUser";

const SelectRole = dynamic(() => import("./SelectRole"), {
  loading: () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});


export default async function SelectRolePage() {
  return <SelectRole updateUser={updateUser} />;
}
