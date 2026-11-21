import { Suspense } from "react";
import { getAddresses, getGroups } from "@/lib/server-data";
import AddressListClient from "@/components/molecules/address-book/addresses/AddressListClient";

export default async function AddressesPage() {
  const addresses = await getAddresses();
  const groups = await getGroups();

  return (
    <div className="min-h-full bg-black flex flex-col pt-[52px] pb-24 px-8 overflow-x-hidden selection:bg-cyan-500/30">
      <div className="w-full max-w-[1040px] mx-auto">
        <Suspense fallback={<div className="p-12 text-center text-[var(--color-text-muted)]">Loading address list...</div>}>
          <AddressListClient addresses={addresses} groups={groups} />
        </Suspense>
      </div>
    </div>
  );
}
