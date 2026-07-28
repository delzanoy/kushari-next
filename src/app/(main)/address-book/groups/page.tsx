import GroupListClient from "@/components/molecules/address-book/groups/GroupListClient";
import { getGroups, getAddresses } from "@/lib/server-data";

export default async function GroupsPage() {
  const groups = await getGroups();
  const addresses = await getAddresses();

  return (
    <div className="min-h-full bg-black flex flex-col pt-[52px] pb-24 px-8 overflow-x-hidden selection:bg-cyan-500/30">
      <div className="w-full max-w-[1040px] mx-auto">
        <GroupListClient groups={groups} addresses={addresses} />
      </div>
    </div>
  );
}
