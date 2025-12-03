import GroupListClient from "./GroupListClient";
import { getGroups } from "../../api/server-data";
// import { GroupCardProps } from "./types"

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
      <GroupListClient groups={groups} />
    </div>
  );
}
