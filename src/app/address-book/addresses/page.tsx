import AddressListClient from "./AddressListClient";
import { AddressCardProps } from "./types";

export default async function AddressesPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/addresses`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error('Failed to load addresses');
  }

  const addressesData: AddressCardProps[] = await res.json();

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
      <AddressListClient addresses={addressesData} />
    </div>
  );
}
