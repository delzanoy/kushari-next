import WalletsPage from "./wallets/page"

export default function Home() {
  return (
    <div className="h-[100vh]">
      <WalletsPage />
    </div>
  );
}

// import ResponsiveLayout from '@/app/components/ResponsiveLayout';
// import WalletsPage from "./wallets/page";
// import MobileView from '@/app/components/MobileView';

// export default function Home() {
//   return (
//     // <ResponsiveLayout
//     //   mobileLayout={<MobileView />}
//     //   desktopLayout={<WalletsPage />}
//     // />
//     <MobileView />
//   );
// }