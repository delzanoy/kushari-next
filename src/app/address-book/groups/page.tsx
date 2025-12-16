import GroupListClient from "./GroupListClient";
import { getGroups, getAddresses } from "../../api/server-data";

export default async function GroupsPage() {
  const groups = await getGroups();
  const addresses  = await getAddresses();

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
      <GroupListClient groups={groups} addresses={addresses} />
    </div>
  );
}