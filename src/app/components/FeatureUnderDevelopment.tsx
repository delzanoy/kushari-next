// import { useState, useEffect, useRef } from "react";
// import emailjs from "@emailjs/browser";
// import IconButton from "./buttons/IconButton";
// import PrimaryButton from "./buttons/PrimaryButton";
// import { BracesIcon, CheckBoxCircleFilledIcon, CloseIcon, DoubleQuotesL, EmailAtIcon, ExecutingIcon, MailFilledIcon } from "./icons";
// import TextArea from "./forms/TextArea";
// import TextInput from "./forms/TextInput";

// interface FeatureUnderDevelopmentProps {
//     onClose?: () => void;
// }

// export default function FeatureUnderDevelopment({ onClose }: FeatureUnderDevelopmentProps) {
//     const [note, setNote] = useState("");
//     const [email, setEmail] = useState("");
//     const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
//     const [helperText, setHelperText] = useState("Min. 10 chars");
//     const [emailError, setEmailError] = useState("");
//     const [noteError, setNoteError] = useState("");
//     const textareaRef = useRef<HTMLTextAreaElement>(null);
//     const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     // Focus textarea when component mounts
//     useEffect(() => {
//         if (textareaRef.current && status === 'idle') {
//             textareaRef.current.focus();
//         }
//     }, [status]);

//     // Update helper text based on character count
//     useEffect(() => {
//         const currentLength = note.trim().length;

//         if (currentLength >= 10) {
//             setHelperText(""); // Empty string will hide the helper text
//             setNoteError(""); // Clear note error when length requirement is met
//         } else {
//             const remaining = 10 - currentLength;
//             if (remaining === 10) {
//                 setHelperText("Min. 10 chars");
//             } else if (remaining === 1) {
//                 setHelperText("1 more char");
//             } else {
//                 setHelperText(`${remaining} more chars`);
//             }
//         }
//     }, [note]);

//     // Clear errors when user starts typing
//     useEffect(() => {
//         if (email.trim()) {
//             setEmailError("");
//         }
//     }, [email]);

//     // Handle auto-dismiss after successful submission
//     useEffect(() => {
//         if (status === 'success') {
//             // Set timeout to dismiss the dialog after 4 seconds
//             dismissTimeoutRef.current = setTimeout(() => {
//                 if (onClose) {
//                     onClose();
//                 }
//             }, 4000);
//         }

//         // Cleanup timeout
//         return () => {
//             if (dismissTimeoutRef.current) {
//                 clearTimeout(dismissTimeoutRef.current);
//             }
//         };
//     }, [status, onClose]);

//     // For Next.js, use process.env
//     const getEmailJSConfig = () => {
//         const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
//         const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
//         const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

//         if (!serviceId || !templateId || !publicKey) {
//             const message = process.env.NODE_ENV === 'development'
//                 ? `EmailJS is not configured. Please add these to your .env.local file:\n` +
//                 `NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id\n` +
//                 `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id\n` +
//                 `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key\n\n` +
//                 `Get these from EmailJS.com dashboard`
//                 : "Email service is temporarily unavailable. Please try again later.";

//             throw new Error(message);
//         }

//         return { serviceId, templateId, publicKey };
//     };

//     const isValidEmail = (email: string) => {
//         const trimmed = email.trim();
//         if (!trimmed) return true;
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // Clear previous errors
//         setEmailError("");
//         setNoteError("");

//         let hasError = false;

//         // Validate email
//         if (email.trim() && !isValidEmail(email)) {
//             setEmailError("Please enter a valid email address or leave it empty");
//             hasError = true;
//         }

//         // Validate note
//         if (note.trim().length < 10) {
//             setNoteError("Please write a message (at least 10 characters)");
//             hasError = true;
//         }

//         if (hasError) {
//             setStatus('error');
//             return;
//         }

//         setStatus('sending');

//         try {
//             const config = getEmailJSConfig();

//             const templateParams = {
//                 email: email.trim() || "No email provided",
//                 note: note.trim(),
//                 timestamp: new Date().toLocaleString(),
//                 source: "Feature Feedback Form",
//                 pageUrl: typeof window !== 'undefined' ? window.location.href : ''
//             };

//             const response = await emailjs.send(
//                 config.serviceId,
//                 config.templateId,
//                 templateParams,
//                 config.publicKey
//             );

//             console.log('EmailJS Response:', response);

//             if (response.status === 200) {
//                 setStatus('success');
//             } else {
//                 throw new Error(`EmailJS returned status: ${response.status}`);
//             }

//         } catch (error) {
//             console.error('EmailJS Error:', error);
//             setStatus('error');
//             setEmailError("An unexpected error occurred. Please try again.");
//         }
//     };

//     const handleClear = () => {
//         setNote("");
//         setEmail("");
//         setStatus('idle');
//         setHelperText("Min. 10 chars");
//         setEmailError("");
//         setNoteError("");
//     };

//     // Determine TextArea helper text
//     const getTextAreaHelperText = () => {
//         if (noteError) return noteError;
//         return helperText;
//     };

//     // Determine TextInput helper text
//     const getTextInputHelperText = () => {
//         if (emailError) return emailError;
//         return "Optional, so I can respond";
//     };

//     return (
//         <div className={`flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] ${
//             status === 'sending' || status === 'success' 
//                 ? 'bg-[#2A2C2E] scale-90 -translate-y-[10px]' 
//                 : 'bg-[#151819]'
//         }`}>
            
//             {/* Sending state */}
//             {status === 'sending' && (
//                 <div className="w-full">
//                     <div className="flex flex-col items-start gap-2.5 self-stretch">
//                         <div className="flex justify-between items-start self-stretch">
//                             <div className="flex relative p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
//                                 <MailFilledIcon className="w-8 h-8 aspect-square opacity-20" />
//                                 <ExecutingIcon className="absolute inline-flex w-5 h-5 aspect-square bottom-[4px] right-[4px]" />
//                             </div>
//                             <IconButton
//                                 icon={<CloseIcon />}
//                                 size="sm"
//                                 status="neutral"
//                                 onClick={onClose}
//                             />
//                         </div>
//                         <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
//                             <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//                                 Sending your message...
//                             </span>
//                             <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                                 Looking forward to hearing from you!
//                             </span>
//                             <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                                 - del
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Success state */}
//             {status === 'success' && (
//                 <div className="w-full">
//                     <div className="flex flex-col items-start gap-2.5 self-stretch">
//                         <div className="flex justify-between items-start self-stretch">
//                             <div className="flex relative p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
//                                 <MailFilledIcon className="w-8 h-8 aspect-square opacity-70" />
//                                 <CheckBoxCircleFilledIcon className="absolute inline-flex w-5 h-5 aspect-square bottom-[4px] right-[4px] text-green-500" />
//                             </div>
//                             <IconButton
//                                 icon={<CloseIcon />}
//                                 size="sm"
//                                 status="neutral"
//                                 onClick={onClose}
//                             />
//                         </div>
//                         <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
//                             <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//                                 Message sent
//                             </span>
//                             <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                                 Thank you for your time!
//                             </span>
//                             <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                                 This will close in a moment...
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Idle or Error state - Original form */}
//             {(status === 'idle' || status === 'error') && (
//                 <>
//                     <div className="flex flex-col items-start gap-2.5 self-stretch">
//                         <div className="flex justify-between items-start self-stretch">
//                             <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
//                                 <BracesIcon className="w-8 h-8 aspect-square" />
//                             </div>
//                             <IconButton
//                                 icon={<CloseIcon />}
//                                 size="sm"
//                                 status="neutral"
//                                 onClick={onClose}
//                             />
//                         </div>
//                         <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
//                             <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//                                 Feature under development
//                             </span>
//                             <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                                 I'd love your input.
//                             </span>
//                             <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                                 - del
//                             </span>
//                         </div>
//                     </div>

//                     <form onSubmit={handleSubmit} className="w-full">
//                         <div className="flex flex-col items-start gap-4 self-stretch">
//                             <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
//                                 <TextArea
//                                     ref={textareaRef}
//                                     placeholder="Share your thoughts, ideas, or just say hi!"
//                                     leadingIcon={<DoubleQuotesL />}
//                                     value={note}
//                                     onChange={(e) => {
//                                         setNote(e.target.value);
//                                         setNoteError("");
//                                     }}
//                                     rows={3}
//                                     width="full"
//                                     helperText={getTextAreaHelperText()}
//                                     error={!!noteError}
//                                 />
//                             </div>

//                             <div className="flex py-[0] px-[12px] flex-col items-end gap-3 self-stretch">
//                                 <TextInput
//                                     placeholder="email"
//                                     leadingIcon={<EmailAtIcon />}
//                                     value={email}
//                                     onChange={(e) => {
//                                         setEmail(e.target.value);
//                                         setEmailError("");
//                                     }}
//                                     width={256}
//                                     error={!!emailError}
//                                     helperText={getTextInputHelperText()}
//                                 />

//                                 <div className="flex items-center gap-3">
//                                     <PrimaryButton
//                                         size="md"
//                                         variant="brand"
//                                         label={status === 'error' ? 'Try again' : 'Send to del'}
//                                         type="submit"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </>
//             )}
//         </div>
//     );
// }



// components/FeatureFeedbackContent.tsx
import React from "react";
import TextArea from "./forms/TextArea";
import TextInput from "./forms/TextInput";
import PrimaryButton from "./buttons/PrimaryButton";

export default function FeatureFeedbackContent({ initialNote = "", initialEmail = "", onSubmit }: { initialNote?: string; initialEmail?: string; onSubmit?: (payload: any)=>void }) {
  const [note, setNote] = React.useState(initialNote);
  const [email, setEmail] = React.useState(initialEmail);
  const [error, setError] = React.useState<string | null>(null);

  const isDirty = note.trim().length > 0 || email.trim().length > 0;

  return (
    <div>
      <div className="mb-4">
        <TextArea
          placeholder="Share your thoughts"
          value={note}
          onChange={(e:any)=> setNote(e.target.value)}
          rows={6}
        />
      </div>
      <div className="mb-4">
        <TextInput placeholder="email (optional)" value={email} onChange={(e:any)=> setEmail(e.target.value)} />
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-3 py-2 rounded-md border" onClick={()=>{ if(onSubmit) onSubmit({note, email}); }}>
          Send
        </button>
      </div>
      <div className="text-sm text-white/60 mt-3">Debug: isDirty = {isDirty ? "true" : "false"}</div>
    </div>
  );
}
