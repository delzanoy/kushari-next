// app/components/MobileView.tsx
"use client";
import { usePlatform } from "../hooks/usePlatform";
import { ShareIcon } from "@/app/components/icons";
import PrimaryButton from "./buttons/PrimaryButton";
import Background from "./Background";

export default function MobileView() {
  const { isIOS, isAndroid } = usePlatform();

  const getPlatform = () => {
    if (isAndroid) return "android";
    if (isIOS) return "ios";
    // Default to iOS if platform detection fails
    return "ios";
  };

  return (
    <div className="bg-[#0E1011] h-[100vh] w-[100vw] relative">
      <div className="flex w-full h-full pt-[262px] pr-[44px] pb-[190px] pl-[44px] flex-col justify-end items-start gap-8 relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" viewBox="0 0 82 82" fill="none">
          <path d="M47.8335 61.5V68.3333L54.6668 71.75V75.1667H27.3335L27.3212 71.7623L34.1668 68.3333V61.5H10.2221C8.35067 61.5 6.8335 59.9663 6.8335 58.0577V13.6922C6.8335 11.7912 8.38914 10.25 10.2221 10.25H71.7782C73.6498 10.25 75.1668 11.7838 75.1668 13.6922V58.0577C75.1668 59.9587 73.6112 61.5 71.7782 61.5H47.8335ZM13.6668 47.8333V54.6667H68.3335V47.8333H13.6668Z" fill="url(#paint0_linear_1231_129109)" />
          <defs>
            <linearGradient id="paint0_linear_1231_129109" x1="41.0002" y1="10.25" x2="41.0002" y2="75.1667" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="0.704762" stopColor="#B0B9E8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col items-start gap-2 self-stretch">
          <span className="text-[#F8FCFF] font-[Geist] text-[28px] not-italic font-semibold leading-[125%] self-stretch">Product designed for Desktop</span>
          <span className="text-[#F8FCFF] font-[Figtree] text-base not-italic font-light leading-[150%] self-stretch">Best judged on a larger screen</span>
        </div>
        <PrimaryButton
          size="lg"
          variant="inverted"
          label="Share"
          leadingIcon={<ShareIcon platform={getPlatform()} />}
        />
      </div>
      <Background />
    </div>
  );
}