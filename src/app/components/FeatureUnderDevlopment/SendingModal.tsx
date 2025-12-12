// "use client";
// import React, { useEffect, useRef } from "react";
// import { ExecutingIcon, MailFilledIcon } from "../icons";

// export default function SendingModal({ message = "Sending..." }: { message?: string }) {
//   const ref = useRef<HTMLDivElement | null>(null);
  
//   useEffect(() => {
//     const el = ref.current;
//     if (el) {
//       el.focus();
//       el.setAttribute('aria-live', 'polite');
//     }
//   }, []);

//   return (
//     <div 
//       ref={ref} 
//       tabIndex={-1} 
//       className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]" 
//       aria-live="polite"
//       aria-busy="true"
//       role="status"
//     >
//       <span className="sr-only">Sending your message, please wait...</span>
      
//       <div className="flex flex-col items-start gap-2.5 self-stretch">
//         <div className="flex justify-between items-start self-stretch">
//           <div className="flex relative p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
//             <MailFilledIcon className="w-8 h-8 aspect-square opacity-20" />
//             <ExecutingIcon className="absolute inline-flex w-5 h-5 aspect-square bottom-[4px] right-[4px]" />
//           </div>
//         </div>
//         <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
//           <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//             {message}
//           </span>
//           <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//             Looking forward to hearing from you!
//           </span>
//           <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//             - del
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useRef } from "react";
import { ExecutingIcon, MailFilledIcon } from "../icons";
import TertiaryButton from "../buttons/TertiaryButton";
import useModal from "../../hooks/useModal";
import { Modal } from "../modal/Modal";
import SuccessModal from "./SuccessModal";

export default function SendingModal({ message = "Sending..." }: { message?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  
  // ADD THIS: Actually call the useModal hook to get the functions
  const { open, closeTop } = useModal();
  
  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.focus();
      el.setAttribute('aria-live', 'polite');
    }
  }, []);

  return (
    <div 
      ref={ref} 
      tabIndex={-1} 
      className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]" 
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">Sending your message, please wait...</span>
      
      <div className="flex flex-col items-start gap-2.5 self-stretch">
        <div className="flex justify-between items-start self-stretch">
          <div className="flex relative p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
            <MailFilledIcon className="w-8 h-8 aspect-square opacity-20" />
            <ExecutingIcon className="absolute inline-flex w-5 h-5 aspect-square bottom-[4px] right-[4px]" />
          </div>
        </div>
        <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
          <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
            {message}
          </span>
          <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
            Looking forward to hearing from you!
          </span>
          <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
            - del
          </span>
        </div>
      </div>
      
      {/* Button to open 2nd level modal */}
      {/* <div className="flex py-[0] px-[12px] w-full">
        <TertiaryButton 
          size="lg" 
          label="Open 2nd Level Modal" 
          onClick={handleOpenSecondModal}
        />
      </div> */}
    </div>
  );
}