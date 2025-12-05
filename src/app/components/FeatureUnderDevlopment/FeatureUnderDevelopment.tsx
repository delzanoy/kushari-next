"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import IconButton from "../buttons/IconButton";
import PrimaryButton from "../buttons/PrimaryButton";
import { BracesIcon, CloseIcon, DoubleQuotesL, EmailAtIcon } from "../icons";
import TextArea from "../forms/TextArea";
import TextInput from "../forms/TextInput";
import useModal from "../../hooks/useModal";
import { Modal } from "../modal/Modal";
import SendingModal from "./SendingModal";
import SuccessModal from "./SuccessModal";

interface FeatureUnderDevelopmentProps {
    onClose?: () => void; // parent will wire closeTop()
}

export default function FeatureUnderDevelopment({ onClose }: FeatureUnderDevelopmentProps) {
    const [note, setNote] = useState("");
    const [email, setEmail] = useState("");
    const [helperText, setHelperText] = useState("Min. 10 chars");
    const [emailError, setEmailError] = useState("");
    const [noteError, setNoteError] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { open, closeTop } = useModal();

    // keep small local validations as before...
    useEffect(() => {
        if (textareaRef.current) textareaRef.current.focus();
    }, []);

    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || value.trim() === "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setEmailError("");
        setNoteError("");

        let hasError = false;
        if (email.trim() && !isValidEmail(email)) { setEmailError("Please enter a valid email"); hasError = true; }
        if (note.trim().length < 10) { setNoteError("Please write a message (at least 10 characters)"); hasError = true; }
        if (hasError) return;

        // 1) Open sending modal on top and block escape/backdrop
        open(
            <Modal onRequestClose={() => false}>
                <SendingModal message="Sending your message..." />
            </Modal>
        );

        try {
            // 2) perform send (emailjs or mock)
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

            // 3) Replace sending with success:
            closeTop(); // remove SendingModal
            open(
                <Modal onRequestClose={() => false}>
                    <SuccessModal
                        message="Message sent"
                        onClose={() => {
                            // close the success modal and then close the underlying form modal
                            closeTop(); // removes SuccessModal
                            // now remove the form modal (FeatureUnderDevelopment). Parent passed onClose -> closeTop()
                            onClose?.();
                        }}
                    />
                </Modal>
            );

        } catch (err) {
            // remove sending overlay
            closeTop();
            // handle error inline - you can reopen an error variant or show message in the form
            setEmailError("An unexpected error occurred. Please try again.");
        }
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
                    <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                        <TextArea
                            ref={textareaRef}
                            placeholder="Share your thoughts, ideas, or just say hi!"
                            leadingIcon={<DoubleQuotesL />}
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setNoteError("");
                            }}
                            rows={3}
                            width="full"
                            helperText={noteError || helperText}
                            error={!!noteError}
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
                            }}
                            width={256}
                            error={!!emailError}
                            helperText={emailError || "Optional, so I can respond"}
                        />

                        <div className="flex items-center gap-3">
                            <PrimaryButton
                                size="md"
                                variant="brand"
                                label={status === 'error' ? 'Try again' : 'Send to del'}
                                type="submit"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}