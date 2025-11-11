import SelectRole from "./SelectRole";
import { updateUser } from "@/app/actions/updateUser"; // import the action


export default async function SelectRolePage() {
  return <SelectRole updateUser={updateUser} />;
}
