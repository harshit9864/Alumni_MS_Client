import SelectRole from "./SelectRole";
import { updateUser } from "@/app/actions/updateUser"; // import the action

export default function SelectRolePage() {
  return <SelectRole updateUser={updateUser} />;
}
