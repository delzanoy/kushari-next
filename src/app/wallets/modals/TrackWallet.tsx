import IconButton from "@/app/components/buttons/IconButton";
import { useState, useEffect } from "react";
import { TrackWalletIcon, CloseIcon } from "@/app/components/icons";
import { useModalContext } from "../../components/modal/Modal";
import { RadioGroup } from "@/app/components/forms/RadioGroup";
import { TextInput } from "@/app/components/forms";
import PrimaryButton from "../../components/buttons/PrimaryButton";

interface TrackWalletProps {
    onClose?: () => void;
}

export default function TrackWallet({ onClose }: TrackWalletProps) {
    const [selectedWalletType, setSelectedWalletType] = useState<string>("ethereum");
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    // Ethereum form state
    const [ethereumAddress, setEthereumAddress] = useState("");
    const [ethereumName, setEthereumName] = useState("");
    const [ethereumAddressError, setEthereumAddressError] = useState("");
    const [ethereumNameError, setEthereumNameError] = useState(""); // Added name error state

    // Binance form state
    const [binancePublicKey, setBinancePublicKey] = useState("");
    const [binanceSecretKey, setBinanceSecretKey] = useState("");
    const [binanceName, setBinanceName] = useState("");
    const [binancePublicKeyError, setBinancePublicKeyError] = useState("");
    const [binanceSecretKeyError, setBinanceSecretKeyError] = useState("");
    const [binanceNameError, setBinanceNameError] = useState(""); // Added name error state

    // General state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending'>('idle');

    const { escStage, isTopModal } = useModalContext();

    const options = [
        { value: "ethereum", label: "Ethereum" },
        { value: "binance", label: "Binance" },
    ];

    // Show/hide ESC tooltip based on ESC stage
    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    // Reset Ethereum errors when typing
    const handleEthereumAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEthereumAddress(e.target.value);
        setEthereumAddressError("");
        setStatus('idle');
    };

    const handleEthereumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEthereumName(e.target.value);
        setEthereumNameError(""); // Reset name error when typing
        setStatus('idle');
    };

    // Reset Binance errors when typing
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
        setBinanceNameError(""); // Reset name error when typing
        setStatus('idle');
    };

    // Validation functions
    const validateEthereumForm = () => {
        let isValid = true;

        // Validate address
        if (!ethereumAddress.trim()) {
            setEthereumAddressError("Wallet address is required");
            isValid = false;
        } else if (!ethereumAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            setEthereumAddressError("Invalid Ethereum address format");
            isValid = false;
        }

        // Validate name (now required)
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

        // Validate public key
        if (!binancePublicKey.trim()) {
            setBinancePublicKeyError("Public key is required");
            isValid = false;
        }

        // Validate secret key
        if (!binanceSecretKey.trim()) {
            setBinanceSecretKeyError("Secret key is required");
            isValid = false;
        } else if (binanceSecretKey.length < 8) {
            setBinanceSecretKeyError("Secret key must be at least 8 characters");
            isValid = false;
        }

        // Validate name (now required)
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
        let formData = {};

        if (selectedWalletType === "ethereum") {
            isValid = validateEthereumForm();
            if (isValid) {
                formData = {
                    type: "ethereum",
                    address: ethereumAddress,
                    name: ethereumName,
                };
            }
        } else {
            isValid = validateBinanceForm();
            if (isValid) {
                formData = {
                    type: "binance",
                    publicKey: binancePublicKey,
                    secretKey: binanceSecretKey,
                    name: binanceName,
                };
            }
        }

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);
        setStatus('sending');

        try {
            // TODO: Replace with actual API call
            console.log("Submitting form data:", formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success - you can add success handling here
            console.log("Wallet tracking successful!");

            // Close modal on success
            if (onClose) {
                onClose();
            }

        } catch (error) {
            console.error("Error tracking wallet:", error);
            // Handle error appropriately
        } finally {
            setIsSubmitting(false);
            setStatus('idle');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        <TrackWalletIcon className="w-8 h-8 aspect-square" />
                    </div>

                    <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        status={showEscTooltip ? "danger" : "neutral"}
                        onClick={onClose}
                        tooltipTitle="Esc again to confirm"
                        showTooltip={showEscTooltip}
                    />
                </div>
                <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
                    <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
                        Track wallet
                    </span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        Build visibility by tracking your wallets.
                    </span>
                </div>
            </div>

            <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                <RadioGroup
                    name="wallet-type"
                    label="Select wallet type"
                    options={options}
                    value={selectedWalletType}
                    onChange={setSelectedWalletType}
                    orientation="horizontal"
                />

                {/* Ethereum Form */}
                {selectedWalletType === "ethereum" && (
                    <>
                        <TextInput
                            label="Wallet address"
                            placeholder="Hash of wallet you wish to track"
                            value={ethereumAddress}
                            onChange={handleEthereumAddressChange}
                            width="full"
                            error={!!ethereumAddressError}
                            helperText={ethereumAddressError}
                            disabled={isSubmitting}
                        />
                        <TextInput
                            label="Wallet name"
                            placeholder="Use a identifiable name"
                            value={ethereumName}
                            onChange={handleEthereumNameChange}
                            width="full"
                            error={!!ethereumNameError}
                            helperText={ethereumNameError}
                            disabled={isSubmitting}
                        />
                    </>
                )}

                {/* Binance Form */}
                {selectedWalletType === "binance" && (
                    <>
                        <TextInput
                            label="Public key"
                            placeholder="Profile > Account > API Management"
                            value={binancePublicKey}
                            onChange={handleBinancePublicKeyChange}
                            width="full"
                            error={!!binancePublicKeyError}
                            helperText={binancePublicKeyError}
                            disabled={isSubmitting}
                            info={{
                                title: "Steps to create Binance API keys",
                                subtitle: `Log In & Navigate: Log into your Binance account, go to your profile/account, and find API Management.
Create API: Click Create API.
Label Key: Give your key a descriptive name (e.g., "TradingBot").
Security: Complete 2FA (email, SMS, authenticator).
Get Keys: Your API Key (Public) and Secret Key will be displayed. Copy them immediately and store them securely (especially the Secret Key).`
                            }}
                        />
                        <TextInput
                            label="Secret key"
                            placeholder="Your secret key"
                            value={binanceSecretKey}
                            onChange={handleBinanceSecretKeyChange}
                            type="password" // For security
                            width="full"
                            error={!!binanceSecretKeyError}
                            helperText={binanceSecretKeyError}
                            disabled={isSubmitting}
                            info={{
                                title: "Steps to Find/Generate Your Secret Key",
                                subtitle: `Log In & Navigate: Log into your Binance account, go to your profile/account, and find API Management.
Create API: Click Create API.
Label Key: Give your key a descriptive name (e.g., "TradingBot").
Security: Complete 2FA (email, SMS, authenticator).
Get Keys: Your API Key (Public) and Secret Key will be displayed. Copy them immediately and store them securely (especially the Secret Key).`
                            }}
                        />
                        <TextInput
                            label="Wallet name"
                            placeholder="Use a identifiable name"
                            value={binanceName}
                            onChange={handleBinanceNameChange}
                            width="full"
                            error={!!binanceNameError}
                            helperText={binanceNameError}
                            disabled={isSubmitting}
                        />
                    </>
                )}
            </div>

            <div className="flex py-[0] px-[12px] flex-col items-end gap-3 self-stretch">
                <PrimaryButton
                    size="md"
                    variant="brand"
                    label={isSubmitting ? "Tracking..." : "Track Wallet"}
                    type="submit"
                    disabled={isSubmitting || status === 'sending'}
                />
            </div>
        </form>
    );
}