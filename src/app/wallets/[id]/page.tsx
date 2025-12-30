// // app/wallet/[id]/page.tsx (Server Component)
// import { getAddresses } from "../../api/server-data";
// import WalletDetailsClient from "./WalletDetailsClient";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function WalletDetailsPage({ params }: PageProps) {
//   const addresses = await getAddresses();

//   return (
//     <WalletDetailsClient 
//       walletId={params.id} 
//       addresses={addresses} 
//     />
//   );
// }


// app/wallet/[id]/page.tsx (Server Component)
import { getAddresses } from "../../api/server-data";
import WalletDetailsClient from "./WalletDetailsClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WalletDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const addresses = await getAddresses();

  return (
    <WalletDetailsClient 
      walletId={id} 
      addresses={addresses} 
    />
  );
}