"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect from root to /wallets
    router.replace('/wallets');
  }, [router]);

  // Show nothing or a loading state while redirecting
  return (
    <div className="h-[100vh] bg-[#0E1011] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
}