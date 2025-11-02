import { auth } from "@clerk/nextjs/server";
import SelectRole from "./SelectRole";
import { updateUser } from "@/app/actions/updateUser"; // import the action
import { redirect } from "next/navigation";

export default async function SelectRolePage() {
  const {sessionClaims} = await auth()
  const role = sessionClaims?.metadata.role as string | undefined;
  
    // 3️⃣ Redirect based on role
    if (!role) {
      redirect("/select-role");
    } else {
      redirect(`/${role}`);
    }
  return <SelectRole updateUser={updateUser} />;
}
