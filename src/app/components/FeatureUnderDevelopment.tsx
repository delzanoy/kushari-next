import { useState } from "react";
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

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzo1rL9yjw6ESYaSV_Cpr36dOu370eBNanX-HpTqEkNgEsVWHjyr44qpC0vsqoFbdVh/exec";

    const isValidEmail = (email: string) => {
        if (!email.trim()) return true; // Email is optional, so empty is valid
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation - email is optional, but if provided, must be valid
        if (email.trim() && !isValidEmail(email)) {
            setErrorMessage("Please enter a valid email address or leave it empty");
            return;
        }

        setStatus('sending');
        setErrorMessage("");

        try {
            // Using a proxy approach to avoid CORS issues with Google Apps Script
            // Google Apps Script doesn't support CORS headers, so we need to use a workaround
            
            const payload = {
                email: email.trim() || "No email provided",
                note: note.trim() || "No message",
                timestamp: new Date().toISOString(),
                source: "feature_feedback"
            };

            // Method 1: Using no-cors mode (you won't get response, assume success)
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important: This prevents CORS errors
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // Since we use 'no-cors', we can't read the response
            // So we assume success if no network error
            setStatus('success');
            
            // Clear form
            setNote("");
            setEmail("");
            
            // Reset status after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);

        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage("Failed to send. Please try again.");
        }
    };

    const handleClear = () => {
        setNote("");
        setEmail("");
        setErrorMessage("");
        setStatus('idle');
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
                    <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Feature under development</span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">I'd love your input.</span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        - del
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col items-start gap-4 self-stretch">
                    {/* Status messages at the top */}
                    {errorMessage && (
                        <div className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div className="w-full p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-green-400 text-sm font-medium">
                                ✅ Thank you! Your feedback has been sent.
                            </p>
                        </div>
                    )}
                    
                    {status === 'error' && !errorMessage && (
                        <div className="w-full p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-yellow-400 text-sm font-medium">
                                ⚠️ Something went wrong. Please try again.
                            </p>
                        </div>
                    )}

                    <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                        <TextArea
                            placeholder="Or just leave a note to say hi!"
                            leadingIcon={<DoubleQuotesL />}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            width="full"
                            disabled={status === 'sending' || status === 'success'}
                        />
                    </div>
                    
                    <div className="flex py-[0] px-[12px] flex-col items-end gap-3 self-stretch">
                        <TextInput
                            placeholder="email (so I can respond)"
                            leadingIcon={<EmailAtIcon />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            width={256}
                            disabled={status === 'sending' || status === 'success'}
                            error={!!errorMessage}
                        />
                        
                        <div className="flex items-center gap-3">
                            {/* <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-2 text-sm text-[#52525B] hover:text-[#F8FCFF]/70 transition-colors disabled:opacity-50"
                                disabled={status === 'sending'}
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
                                disabled={status === 'sending' || status === 'success'}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}