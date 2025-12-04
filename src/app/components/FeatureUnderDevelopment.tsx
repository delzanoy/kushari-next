import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import IconButton from "./buttons/IconButton";
import PrimaryButton from "./buttons/PrimaryButton";
import { BracesIcon, CloseIcon, DoubleQuotesL, EmailAtIcon } from "./icons";
import TextArea from "./forms/TextArea";
import TextInput from "./forms/TextInput";

interface FeatureUnderDevelopmentProps {
    onClose?: () => void;
}

export default function FeatureUnderDevelopment({ onClose }: FeatureUnderDevelopmentProps) {
    const [note, setNote] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const [helperText, setHelperText] = useState("Min. 10 chars");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus textarea when component mounts
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    // Update helper text based on character count
    useEffect(() => {
        const currentLength = note.trim().length;
        
        if (currentLength >= 10) {
            setHelperText(""); // Empty string will hide the helper text
        } else {
            const remaining = 10 - currentLength;
            if (remaining === 10) {
                setHelperText("Min. 10 chars");
            } else if (remaining === 1) {
                setHelperText("1 more char");
            } else {
                setHelperText(`${remaining} more chars`);
            }
        }
    }, [note]);

    // For Next.js, use process.env
    const getEmailJSConfig = () => {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        
        if (!serviceId || !templateId || !publicKey) {
            const message = process.env.NODE_ENV === 'development'
                ? `EmailJS is not configured. Please add these to your .env.local file:\n` +
                  `NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id\n` +
                  `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id\n` +
                  `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key\n\n` +
                  `Get these from EmailJS.com dashboard`
                : "Email service is temporarily unavailable. Please try again later.";
            
            throw new Error(message);
        }
        
        return { serviceId, templateId, publicKey };
    };

    const isValidEmail = (email: string) => {
        const trimmed = email.trim();
        if (!trimmed) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email.trim() && !isValidEmail(email)) {
            setErrorMessage("Please enter a valid email address or leave it empty");
            return;
        }

        if (note.trim().length < 10) {
            setErrorMessage("Please write a message (at least 10 characters)");
            return;
        }

        setStatus('sending');
        setErrorMessage("");

        try {
            const config = getEmailJSConfig();
            
            const templateParams = {
                email: email.trim() || "No email provided",
                note: note.trim(),
                timestamp: new Date().toLocaleString(),
                source: "Feature Feedback Form",
                pageUrl: typeof window !== 'undefined' ? window.location.href : ''
            };

            const response = await emailjs.send(
                config.serviceId,
                config.templateId,
                templateParams,
                config.publicKey
            );

            console.log('EmailJS Response:', response);
            
            if (response.status === 200) {
                setStatus('success');
                setNote("");
                setEmail("");
                setHelperText("Min. 10 chars");
                
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                throw new Error(`EmailJS returned status: ${response.status}`);
            }

        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }
    };

    const handleClear = () => {
        setNote("");
        setEmail("");
        setErrorMessage("");
        setStatus('idle');
        setHelperText("Min. 10 chars");
    };

    return (
        <div className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl bg-[#151819] border-[0.5px] border-solid border-[rgba(248,252,255,0.24)]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        <BracesIcon className="w-8 h-8 aspect-square" />
                    </div>
                    <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        status="neutral"
                        onClick={onClose}
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

            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col items-start gap-4 self-stretch">
                    {errorMessage && (
                        <div className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                                <span className="text-lg">⚠️</span>
                                {errorMessage}
                            </p>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div className="w-full p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                                <span className="text-lg">✅</span>
                                Thank you! Your feedback has been sent.
                            </p>
                            <p className="text-green-400/80 text-xs mt-1 pl-7">
                                I'll get back to you if you left an email!
                            </p>
                        </div>
                    )}
                    
                    {status === 'sending' && (
                        <div className="w-full p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-blue-400 text-sm font-medium flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Sending your message...
                            </p>
                        </div>
                    )}

                    <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                        <TextArea
                            ref={textareaRef}
                            placeholder="Share your thoughts, ideas, or just say hi!"
                            leadingIcon={<DoubleQuotesL />}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            width="full"
                            disabled={status === 'sending' || status === 'success'}
                            helperText={helperText}
                            error={note.trim().length < 10 && note.trim().length > 0}
                        />
                    </div>
                    
                    <div className="flex py-[0] px-[12px] flex-col items-end gap-3 self-stretch">
                        <TextInput
                            placeholder="email"
                            leadingIcon={<EmailAtIcon />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            width={256}
                            disabled={status === 'sending' || status === 'success'}
                            error={!!errorMessage && errorMessage.includes("email")}
                            helperText="Optional, so I can respond"
                        />
                        
                        <div className="flex items-center gap-3">
                            {/* <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-2 text-sm text-[#52525B] hover:text-[#F8FCFF]/70 transition-colors disabled:opacity-50"
                                disabled={status === 'sending' || status === 'success'}
                            >
                                Clear
                            </button> */}
                            
                            <PrimaryButton
                                size="md"
                                variant="brand"
                                label={
                                    status === 'sending' ? 'Sending...' :
                                    status === 'success' ? '✓ Sent!' :
                                    'Send to del'
                                }
                                type="submit"
                                disabled={status === 'sending' || status === 'success' || note.trim().length < 10}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}