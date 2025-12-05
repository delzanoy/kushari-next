// "use client";
// import { useState, useEffect, useRef } from "react";
// import emailjs from "@emailjs/browser";
// import IconButton from "../buttons/IconButton";
// import PrimaryButton from "../buttons/PrimaryButton";
// import { BracesIcon, CloseIcon, DoubleQuotesL, EmailAtIcon } from "../icons";
// import TextArea from "../forms/TextArea";
// import TextInput from "../forms/TextInput";
// import useModal from "../../hooks/useModal";
// import { Modal } from "../modal/Modal";
// import SendingModal from "./SendingModal";
// import SuccessModal from "./SuccessModal";

// interface FeatureUnderDevelopmentProps {
//     onClose?: () => void;
// }

// export default function FeatureUnderDevelopment({ onClose }: FeatureUnderDevelopmentProps) {
//     const [note, setNote] = useState("");
//     const [email, setEmail] = useState("");
//     const [helperText, setHelperText] = useState("Min. 10 chars");
//     const [emailError, setEmailError] = useState("");
//     const [noteError, setNoteError] = useState("");
//     const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'success'>('idle');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const textareaRef = useRef<HTMLTextAreaElement>(null);
//     const { open, closeTop } = useModal();

//     useEffect(() => {
//         if (textareaRef.current) textareaRef.current.focus();
//     }, []);

//     const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || value.trim() === "";

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (isSubmitting) return;

//         setIsSubmitting(true);
//         setEmailError("");
//         setNoteError("");
//         setStatus('idle');

//         let hasError = false;
//         if (email.trim() && !isValidEmail(email)) { 
//             setEmailError("Please enter a valid email"); 
//             hasError = true; 
//         }
//         if (note.trim().length < 10) { 
//             setNoteError("Please write a message (at least 10 characters)"); 
//             hasError = true; 
//         }

//         if (hasError) {
//             setStatus('error');
//             setIsSubmitting(false);

//             // Focus on the first error field
//             if (note.trim().length < 10 && textareaRef.current) {
//                 textareaRef.current.focus();
//             }
//             return;
//         }

//         // Set sending status and open sending modal
//         setStatus('sending');
//         const sendingModalId = open(
//             <Modal onRequestClose={() => false}>
//                 <SendingModal message="Sending your message..." />
//             </Modal>
//         );

//         try {
//             const config = {
//                 serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
//                 templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
//                 publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
//             };

//             await emailjs.send(config.serviceId, config.templateId, {
//                 email: email.trim() || "No email provided",
//                 note: note.trim(),
//                 timestamp: new Date().toLocaleString(),
//                 source: "Feature Feedback Form",
//             }, config.publicKey);

//             // Success: close sending modal and open success modal
//             setStatus('success');
//             closeTop(); // Remove SendingModal

//             const successModalId = open(
//                 <Modal onRequestClose={() => false}>
//                     <SuccessModal
//                         message="Message sent"
//                         onClose={() => {
//                             closeTop(); // Remove SuccessModal
//                             onClose?.(); // Close the form modal
//                         }}
//                     />
//                 </Modal>
//             );

//         } catch (err) {
//             // Error: close sending modal and show error
//             setStatus('error');
//             closeTop(); // Remove SendingModal

//             setEmailError("Failed to send message. Please try again.");

//             // Focus back to form
//             if (textareaRef.current) {
//                 textareaRef.current.focus();
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const getButtonLabel = () => {
//         if (status === 'error') return 'Try again';
//         if (status === 'sending') return 'Sending...';
//         return 'Send to del';
//     };

//     return (
//         <div className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
//             <div className="flex flex-col items-start gap-2.5 self-stretch">
//                 <div className="flex justify-between items-start self-stretch">
//                     <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
//                         <BracesIcon className="w-8 h-8 aspect-square" />
//                     </div>
//                     <IconButton
//                         icon={<CloseIcon />}
//                         size="sm"
//                         status="neutral"
//                         onClick={onClose}
//                     />
//                 </div>
//                 <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
//                     <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//                         Feature under development
//                     </span>
//                     <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                         I'd love your input.
//                     </span>
//                     <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
//                         - del
//                     </span>
//                 </div>
//             </div>

//             <form onSubmit={handleSubmit} className="w-full" aria-label="Feature feedback form">
//                 <div className="flex flex-col items-start gap-4 self-stretch">
//                     <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
//                         <TextArea
//                             ref={textareaRef}
//                             placeholder="Share your thoughts, ideas, or just say hi!"
//                             leadingIcon={<DoubleQuotesL />}
//                             value={note}
//                             onChange={(e) => {
//                                 setNote(e.target.value);
//                                 setNoteError("");
//                                 setStatus('idle');
//                             }}
//                             rows={3}
//                             width="full"
//                             helperText={noteError || helperText}
//                             error={!!noteError}
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div className="flex py-[0] px-[12px] flex-col items-end gap-3 self-stretch">
//                         <TextInput
//                             placeholder="email"
//                             leadingIcon={<EmailAtIcon />}
//                             value={email}
//                             onChange={(e) => {
//                                 setEmail(e.target.value);
//                                 setEmailError("");
//                                 setStatus('idle');
//                             }}
//                             width={256}
//                             error={!!emailError}
//                             helperText={emailError || "Optional, so I can respond"}
//                             disabled={isSubmitting}
//                         />

//                         <div className="flex items-center gap-3">
//                             <PrimaryButton
//                                 size="md"
//                                 variant="brand"
//                                 label={getButtonLabel()}
//                                 type="submit"
//                                 disabled={isSubmitting || status === 'sending'}
//                                 // loading={status === 'sending'}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// }



"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import IconButton from "../buttons/IconButton";
import PrimaryButton from "../buttons/PrimaryButton";
import { BracesIcon, CloseIcon, DoubleQuotesL, EmailAtIcon } from "../icons";
import TextArea from "../forms/TextArea";
import TextInput from "../forms/TextInput";
import useModal from "../../hooks/useModal";
import { Modal, useModalContext } from "../modal/Modal";
import SendingModal from "./SendingModal";
import SuccessModal from "./SuccessModal";

interface FeatureUnderDevelopmentProps {
    onClose?: () => void;
}

export default function FeatureUnderDevelopment({ onClose }: FeatureUnderDevelopmentProps) {
    const [note, setNote] = useState("");
    const [email, setEmail] = useState("");
    const [helperText, setHelperText] = useState("Min. 10 chars");
    const [emailError, setEmailError] = useState("");
    const [noteError, setNoteError] = useState("");
    const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'success'>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { open, closeTop } = useModal();

    // Get ESC stage from modal context
    const { escStage, isTopModal } = useModalContext();

    // Show/hide ESC tooltip based on ESC stage
    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    useEffect(() => {
        if (textareaRef.current) textareaRef.current.focus();
    }, []);

    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || value.trim() === "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setEmailError("");
        setNoteError("");
        setStatus('idle');

        let hasError = false;
        if (email.trim() && !isValidEmail(email)) {
            setEmailError("Please enter a valid email");
            hasError = true;
        }
        if (note.trim().length < 10) {
            setNoteError("Please write a message (at least 10 characters)");
            hasError = true;
        }

        if (hasError) {
            setStatus('error');
            setIsSubmitting(false);

            if (note.trim().length < 10 && textareaRef.current) {
                textareaRef.current.focus();
            }
            return;
        }

        setStatus('sending');
        const sendingModalId = open(
            <Modal onRequestClose={() => false}>
                <SendingModal message="Sending your message..." />
            </Modal>
        );

        try {
            const config = {
                serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
            };

            await emailjs.send(config.serviceId, config.templateId, {
                email: email.trim() || "No email provided",
                note: note.trim(),
                timestamp: new Date().toLocaleString(),
                source: "Feature Feedback Form",
            }, config.publicKey);

            setStatus('success');
            closeTop();

            const successModalId = open(
                <Modal onRequestClose={() => false}>
                    <SuccessModal
                        message="Message sent"
                        onClose={() => {
                            closeTop();
                            onClose?.();
                        }}
                    />
                </Modal>
            );

        } catch (err) {
            setStatus('error');
            closeTop();

            setEmailError("Failed to send message. Please try again.");

            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getButtonLabel = () => {
        if (status === 'error') return 'Try again';
        if (status === 'sending') return 'Sending...';
        return 'Send to del';
    };

    return (
        <div className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        <BracesIcon className="w-8 h-8 aspect-square" />
                    </div>

                    <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        status={showEscTooltip ? "danger" : "neutral"}
                        onClick={onClose}
                        tooltipTitle="Esc again to confirm"
                        showTooltip={showEscTooltip} // Control from external state
                    />

                    
                </div>
                <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
                    <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
                        Feature under development
                    </span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        I'd love your input.
                    </span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        - del
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full" aria-label="Feature feedback form">
                <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                        <TextArea
                            ref={textareaRef}
                            placeholder="Share your thoughts, ideas, or just say hi!"
                            leadingIcon={<DoubleQuotesL />}
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setNoteError("");
                                setStatus('idle');
                            }}
                            rows={3}
                            width="full"
                            helperText={noteError || helperText}
                            error={!!noteError}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex py-[0] px-[12px] flex-col items-end gap-3 self-stretch">
                        <TextInput
                            placeholder="email"
                            leadingIcon={<EmailAtIcon />}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                                setStatus('idle');
                            }}
                            width={256}
                            error={!!emailError}
                            helperText={emailError || "Optional, so I can respond"}
                            disabled={isSubmitting}
                        />

                        <div className="flex flex-col items-center gap-2">
                            <PrimaryButton
                                size="md"
                                variant="brand"
                                label={getButtonLabel()}
                                type="submit"
                                disabled={isSubmitting || status === 'sending'}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}