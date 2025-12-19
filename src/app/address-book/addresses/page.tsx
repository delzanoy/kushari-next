import { getAddresses, getGroups } from "@/app/api/server-data";
import AddressListClient from "./AddressListClient";
import { Suspense } from "react";

export default async function AddressesPage() {
  const addresses = await getAddresses();
  const groups = await getGroups();

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
      <Suspense fallback={<div>Loading address list...</div>}>
        <AddressListClient addresses={addresses} groups={groups} />
      </Suspense>

    </div>
  );
}
