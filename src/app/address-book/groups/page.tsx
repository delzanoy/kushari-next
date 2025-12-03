import GroupListClient from "./GroupListClient";
import { getGroups } from "../../api/server-data";
// import { GroupCardProps } from "./types"

export default async function GroupsPage() {
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/groups`,
  //   { cache: "no-store" }
  // );

  // if (!res.ok) {
  //   return <div className="p-8">Failed to load groups</div>;
  // }

  // const groupsData: GroupCardProps[] = await res.json();

  const groups = await getGroups();

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
      <GroupListClient groups={groups} />
    </div>
  );
}
