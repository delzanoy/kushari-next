"use client";

import { useState, useEffect } from "react";
import { RiWalletLine, RiCloseLine, RiCloseCircleFill } from "@remixicon/react";
import { useModalContext } from "@/components/molecules/modal/Modal";
import { TextInput } from "@/components/atoms/TextInput";
import { RadioGroup, RadioButton } from "@/components/atoms/RadioButton";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { createTrackedWallet } from "@/lib/mock-cache";

interface TrackWalletProps {
    onClose?: () => void;
    onWalletTracked?: () => void;
}

export default function TrackWallet({ onClose, onWalletTracked }: TrackWalletProps) {
    const [selectedWalletType, setSelectedWalletType] = useState<string>("ethereum");
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    // Ethereum form state
    const [ethereumAddress, setEthereumAddress] = useState("");
    const [ethereumName, setEthereumName] = useState("");
    const [ethereumAddressError, setEthereumAddressError] = useState("");
    const [ethereumNameError, setEthereumNameError] = useState("");

    // Binance form state
    const [binancePublicKey, setBinancePublicKey] = useState("");
    const [binanceSecretKey, setBinanceSecretKey] = useState("");
    const [binanceName, setBinanceName] = useState("");
    const [binancePublicKeyError, setBinancePublicKeyError] = useState("");
    const [binanceSecretKeyError, setBinanceSecretKeyError] = useState("");
    const [binanceNameError, setBinanceNameError] = useState("");

    // General state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending'>('idle');

    const { escStage, isTopModal } = useModalContext();

    const options = [
        { value: "ethereum", label: "Ethereum" },
        { value: "binance", label: "Binance" },
    ];

    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    const handleEthereumAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEthereumAddress(e.target.value);
        setEthereumAddressError("");
        setStatus('idle');
    };

    const handleEthereumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEthereumName(e.target.value);
        setEthereumNameError("");
        setStatus('idle');
    };

    const handleBinancePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBinancePublicKey(e.target.value);
        setBinancePublicKeyError("");
        setStatus('idle');
    };

    const handleBinanceSecretKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBinanceSecretKey(e.target.value);
        setBinanceSecretKeyError("");
        setStatus('idle');
    };

    const handleBinanceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBinanceName(e.target.value);
        setBinanceNameError("");
        setStatus('idle');
    };

    const validateEthereumForm = () => {
        let isValid = true;
        if (!ethereumAddress.trim()) {
            setEthereumAddressError("Wallet address is required");
            isValid = false;
        } else if (!ethereumAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            setEthereumAddressError("Invalid Ethereum address format");
            isValid = false;
        }
        if (!ethereumName.trim()) {
            setEthereumNameError("Wallet name is required");
            isValid = false;
        } else if (ethereumName.length < 2) {
            setEthereumNameError("Wallet name must be at least 2 characters");
            isValid = false;
        }
        return isValid;
    };

    const validateBinanceForm = () => {
        let isValid = true;
        if (!binancePublicKey.trim()) {
            setBinancePublicKeyError("Public key is required");
            isValid = false;
        }
        if (!binanceSecretKey.trim()) {
            setBinanceSecretKeyError("Secret key is required");
            isValid = false;
        } else if (binanceSecretKey.length < 8) {
            setBinanceSecretKeyError("Secret key must be at least 8 characters");
            isValid = false;
        }
        if (!binanceName.trim()) {
            setBinanceNameError("Wallet name is required");
            isValid = false;
        } else if (binanceName.length < 2) {
            setBinanceNameError("Wallet name must be at least 2 characters");
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = false;

        if (selectedWalletType === "ethereum") {
            isValid = validateEthereumForm();
        } else {
            isValid = validateBinanceForm();
        }

        if (!isValid) return;

        setIsSubmitting(true);
        setStatus('sending');

        try {
            if (selectedWalletType === "ethereum") {
                const newWallet = await createTrackedWallet({
                    name: ethereumName,
                    address: ethereumAddress,
                    type: "ethereum",
                });
                console.log("Demo tracked wallet created:", newWallet);
            } else {
                const newWallet = await createTrackedWallet({
                    name: binanceName,
                    address: binancePublicKey,
                    type: "binance",
                    publicKey: binancePublicKey,
                    secretKey: binanceSecretKey,
                });
                console.log("Demo tracked wallet created:", newWallet);
            }

            setEthereumAddress("");
            setEthereumName("");
            setBinancePublicKey("");
            setBinanceSecretKey("");
            setBinanceName("");
            setSelectedWalletType("ethereum");

            if (onClose) onClose();
            if (onWalletTracked) onWalletTracked();
            window.dispatchEvent(new CustomEvent('walletsUpdated'));

        } catch (error) {
            console.error("Error tracking wallet:", error);
            alert("Failed to track wallet. Please try again.");
        } finally {
            setIsSubmitting(false);
            setStatus('idle');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-[500px] p-4 flex-col items-start gap-6 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] shadow-2xl">
            {/* Header Section */}
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex justify-between items-center self-stretch">
                    <div className="flex p-2.5 items-center justify-center rounded-xl bg-[var(--color-text-brand)]/[0.08] border border-[var(--color-text-brand)]/[0.12]">
                        <RiWalletLine size={24} className="text-[var(--color-text-brand)]" />
                    </div>

                    <Tooltip content="Esc again to confirm" open={showEscTooltip} placement="bottom">
                        <div>
                            <IconButton
                                icon={showEscTooltip ? <RiCloseCircleFill size={20} /> : <RiCloseLine size={20} />}
                                size="sm"
                                flat
                                variant={showEscTooltip ? "danger" : "neutral"}
                                appearance="ghost"
                                onClick={onClose}
                                aria-label="Close modal"
                            />
                        </div>
                    </Tooltip>
                </div>

                <div className="flex flex-col items-start gap-1.5 self-stretch mt-1 px-2">
                    <span className="text-[var(--color-text-primary)] text-xl font-medium tracking-tight">
                        Track wallet
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm tracking-tight leading-relaxed">
                        Build visibility by tracking your wallets.
                    </span>
                </div>
            </div>

            {/* Inputs Section */}
            <div className="flex flex-col items-start gap-4 self-stretch px-2">
                <div className="w-full">
                    <RadioGroup
                        name="wallet-type"
                        value={selectedWalletType}
                        onChange={(val: string) => setSelectedWalletType(val)}
                        direction="horizontal"
                    >
                        <RadioButton value="ethereum" label="Ethereum" />
                        <RadioButton value="binance" label="Binance" />
                    </RadioGroup>
                </div>

                {/* Ethereum Form */}
                {selectedWalletType === "ethereum" && (
                    <>
                        <div className="w-full">
                            <TextInput
                                label="Wallet address"
                                placeholder="Hash of wallet you wish to track"
                                value={ethereumAddress}
                                onChange={handleEthereumAddressChange}
                                state={ethereumAddressError ? "error" : "default"}
                                errorMessage={ethereumAddressError}
                                helperText="Use 0xdadB0d80178819F2319190D340ce9A924f783711"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="w-full">
                            <TextInput
                                label="Wallet name"
                                placeholder="Use a identifiable name"
                                value={ethereumName}
                                onChange={handleEthereumNameChange}
                                state={ethereumNameError ? "error" : "default"}
                                errorMessage={ethereumNameError}
                                disabled={isSubmitting}
                            />
                        </div>
                    </>
                )}

                {/* Binance Form */}
                {selectedWalletType === "binance" && (
                    <>
                        <div className="w-full">
                            <TextInput
                                label="Public key"
                                placeholder="Profile > Account > API Management"
                                value={binancePublicKey}
                                onChange={handleBinancePublicKeyChange}
                                state={binancePublicKeyError ? "error" : "default"}
                                errorMessage={binancePublicKeyError}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="w-full">
                            <TextInput
                                label="Secret key"
                                placeholder="Your secret key"
                                value={binanceSecretKey}
                                onChange={handleBinanceSecretKeyChange}
                                type="password"
                                state={binanceSecretKeyError ? "error" : "default"}
                                errorMessage={binanceSecretKeyError}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="w-full">
                            <TextInput
                                label="Wallet name"
                                placeholder="Use a identifiable name"
                                value={binanceName}
                                onChange={handleBinanceNameChange}
                                state={binanceNameError ? "error" : "default"}
                                errorMessage={binanceNameError}
                                disabled={isSubmitting}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col items-end gap-3 self-stretch px-2 pt-4 border-t border-[var(--color-border-subtle)]">
                <Button
                    size="md"
                    variant="brand"
                    appearance="filled"
                    type="submit"
                    flat
                    disabled={isSubmitting || status === 'sending'}
                    className="w-full justify-center"
                >
                    {isSubmitting ? "Tracking..." : "Track wallet"}
                </Button>
            </div>
        </form>
    );
}
