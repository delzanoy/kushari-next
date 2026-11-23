"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    RiCloseLine,
    RiCloseCircleFill,
    RiSearchLine,
    RiArrowLeftSLine,
    RiCheckLine,
    RiLoaderFill,
    RiMailLine,
} from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal, Modal } from "@/components/molecules/modal";
import { useModalContext } from "@/components/molecules/modal/Modal";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { IconButton } from "@/components/atoms/IconButton";
import { TextInput } from "@/components/atoms/TextInput";
import { Avatar } from "@/components/atoms/Avatar";
import { Tooltip } from "@/components/atoms/Tooltip";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSearch,
    DropdownCreateNew
} from "@/components/atoms/Dropdown";
import { createGnosisSafe } from "@/lib/mock-cache";
import { GnosisSafeIcon } from "@/components/ui/GnosisSafeIcon";
import { MetamaskIcon } from "@/components/ui/Metamask";
import { WalletConnectIcon } from "@/components/ui/WalletConnect";
import NoSafeFound from "./NoSafeFound";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";
import { pressable } from "@/lib/pressable";

interface Member {
    id: number;
    name?: string; // pending invitees come from the API with an email but no name
    email: string;
}

// Invitees have no name yet, so fall back to the email
const memberLabel = (member: Member) => member.name || member.email || "";

interface ConnectSafeProps {
    onClose?: () => void;
    members?: Member[];
    onSafeConnected?: () => void;
}

interface SafeInfo {
    address: string;
    chain: string;
    confirmations: string;
}

type WalletType = "metamask" | "walletconnect";
type WalletState = "idle" | "connecting" | "connected" | "detecting";
type StepState = "connect" | "locate" | "assign";

const steps: StepState[] = ["connect", "locate", "assign"];

const AVATAR_PRESETS = [
    "Cyan Dusk", "Deep Sea", "Midnight", "Ember", "Sunset",
    "Rose Gold", "Emerald", "Aurora", "Neon", "Acid",
    "Chromatic", "Oil Slick", "Candy"
];

const getPresetForUser = (username: string = "") => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_PRESETS.length;
    return AVATAR_PRESETS[index];
};

// ─── Inline Brand SVGs ────────────────────────────────────────────────────────

// ─── Inline Brand SVGs ────────────────────────────────────────────────────────

const PolygonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#8247E5]">
        <path d="M12 2L2 7.8v11.5L12 22l10-5.8V7.8L12 2zm8 16.3l-8 4.6-8-4.6V8.9l8-4.6 8 4.6v9.4z" fill="currentColor" />
    </svg>
);

const GnosisIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00B4AD]">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="currentColor" />
    </svg>
);

const EthereumIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#627EEA]">
        <path d="M12 2L4 12.5l8 4.7 8-4.7L12 2zM4 14l8 4.7 8-4.7-8 10L4 14z" fill="currentColor" />
    </svg>
);

export default function ConnectSafe({ onClose, members: propMembers = [], onSafeConnected }: ConnectSafeProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [walletState, setWalletState] = useState<Record<WalletType, WalletState>>({
        metamask: "idle",
        walletconnect: "idle"
    });
    const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
    const [currentStep, setCurrentStep] = useState<StepState>("connect");
    const [connecting, setConnecting] = useState(false);
    const [detectedSafes, setDetectedSafes] = useState<SafeInfo[]>([]);
    const [selectedSafe, setSelectedSafe] = useState<string | null>(null);
    const [walletName, setWalletName] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ walletName?: string; owners?: string }>({});
    const [submitError, setSubmitError] = useState("");
    const [safeDetectionComplete, setSafeDetectionComplete] = useState(false);

    const { open, closeTop } = useModal();
    const { escStage, isTopModal } = useModalContext();
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const previousStepRef = useRef<StepState>("connect");
    const previousDetectedSafesCountRef = useRef<number>(0);

    const [localMembers, setLocalMembers] = useState<Member[]>(propMembers);
    const [hoveredWallet, setHoveredWallet] = useState<WalletType | null>(null);


    useEffect(() => {
        setLocalMembers(propMembers);
    }, [propMembers]);

    // State for owner selections - single string per address
    const [selectedOwners, setSelectedOwners] = useState<Record<string, string>>({
        "0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64": "",
        "0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1": "",
        "0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9": "",
        "0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E": ""
    });

    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
        "0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64": "",
        "0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1": "",
        "0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9": "",
        "0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E": ""
    });

    const ownerAddresses = useMemo(() => [
        "0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64",
        "0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1",
        "0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9",
        "0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E"
    ], []);

    const selectedSafeDetails = useMemo(() => {
        return detectedSafes.find(s => s.address === selectedSafe);
    }, [detectedSafes, selectedSafe]);

    const totalOwners = useMemo(() => {
        if (!selectedSafeDetails) return 4;
        const match = selectedSafeDetails.confirmations.match(/out\s+of\s+(\d+)/i);
        return match ? parseInt(match[1], 10) : 4;
    }, [selectedSafeDetails]);

    const activeOwnerAddresses = useMemo(() => {
        return ownerAddresses.slice(0, totalOwners);
    }, [ownerAddresses, totalOwners]);

    const getFilteredOptionsForAddress = useCallback((address: string) => {
        const selectedEmails = Object.entries(selectedOwners)
            .filter(([addr]) => addr !== address)
            .map(([, email]) => email)
            .filter(Boolean);

        const query = (searchQueries[address] || "").toLowerCase().trim();
        const baseOptions = localMembers.filter(option =>
            !selectedEmails.includes(option.email) ||
            selectedOwners[address] === option.email
        );

        if (!query) return baseOptions;
        return baseOptions.filter(m =>
            (m.name || '').toLowerCase().includes(query) ||
            (m.email || '').toLowerCase().includes(query)
        );
    }, [localMembers, selectedOwners, searchQueries]);

    const handleOwnerChange = (address: string, email: string) => {
        setSubmitError("");
        setFieldErrors(prev => (prev.owners ? { ...prev, owners: undefined } : prev));
        setSelectedOwners(prev => ({
            ...prev,
            [address]: email
        }));
    };

    const handleInviteOwner = (address: string, input: string) => {
        let email = input.trim();
        let name = email.split("@")[0];
        if (!email.includes("@")) {
            email = `${name.toLowerCase()}@kushari.co`;
        }

        const newMember = {
            id: -Date.now(),
            name,
            email
        };

        setLocalMembers(prev => [...prev, newMember]);
        setSubmitError("");
        setFieldErrors(prev => (prev.owners ? { ...prev, owners: undefined } : prev));
        setSelectedOwners(prev => ({
            ...prev,
            [address]: email
        }));
    };

    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    useEffect(() => {
        const el = modalRef.current;
        if (el) {
            el.focus();
        }
    }, []);

    // Auto-scroll logic for step progression
    useEffect(() => {
        const stepsOrder = ["connect", "locate", "assign"];
        const currentStepIndex = stepsOrder.indexOf(currentStep);
        const previousStepIndex = stepsOrder.indexOf(previousStepRef.current);

        if (currentStepIndex > previousStepIndex) {
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: "smooth"
                    });
                }
            });
        } else if (currentStepIndex < previousStepIndex) {
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            });
        }

        previousStepRef.current = currentStep;
    }, [currentStep]);

    // Auto-scroll when safe detection completes and shows safes
    useEffect(() => {
        if (safeDetectionComplete && detectedSafes.length > previousDetectedSafesCountRef.current) {
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: "smooth"
                    });
                }
            });

            previousDetectedSafesCountRef.current = detectedSafes.length;
        }
    }, [safeDetectionComplete, detectedSafes.length]);

    // Auto-scroll when a safe is selected
    useEffect(() => {
        if (selectedSafe && (detectedSafes.length === 1 || currentStep === "locate")) {
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: "smooth"
                    });
                }
            });
        }
    }, [selectedSafe, detectedSafes.length, currentStep]);

    const resetToConnectStep = useCallback(() => {
        setCurrentStep("connect");
        setSelectedWallet(null);
        setConnecting(false);
        setDetectedSafes([]);
        setSelectedSafe(null);
        setWalletName("");
        setSafeDetectionComplete(false);
        setSelectedOwners({
            "0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64": "",
            "0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1": "",
            "0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9": "",
            "0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E": ""
        });
        setWalletState({
            metamask: "idle",
            walletconnect: "idle"
        });
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        }, 50);
    }, []);

    const generateRandomAddress = () => {
        const chars = "0123456789abcdef";
        let address = "0x";
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * 16)];
        }
        return address;
    };

    const simulateSafeDetectionWithRandom = useCallback(() => {
        const scenario = Math.random();

        if (scenario < 0.33) {
            return { success: false, safes: [] };
        } else if (scenario < 0.66) {
            return {
                success: true,
                safes: [{
                    address: generateRandomAddress(),
                    chain: Math.random() > 0.5 ? "polygon" : "ethereum",
                    confirmations: "2 out of 2"
                }]
            };
        } else {
            const safeCount = Math.floor(Math.random() * 3) + 1;
            const safes = [];
            const chains = ["polygon", "gnosis", "ethereum"];

            for (let i = 0; i < safeCount; i++) {
                const chain = chains[Math.floor(Math.random() * chains.length)];
                const owners = Math.floor(Math.random() * 2) + 2; // 2-3 owners
                const threshold = Math.floor(Math.random() * owners) + 1;

                safes.push({
                    address: generateRandomAddress(),
                    chain: chain,
                    confirmations: `${threshold} out of ${owners}`
                });
            }

            return {
                success: true,
                safes: safes
            };
        }
    }, []);

    const handleWalletClick = (wallet: WalletType) => {
        if (connecting) return;

        setSelectedWallet(wallet);
        setConnecting(true);

        const otherWallet = wallet === "metamask" ? "walletconnect" : "metamask";
        setWalletState(prev => ({
            ...prev,
            [otherWallet]: "idle",
            [wallet]: "connecting"
        }));

        if (selectedWallet === null) {
            setDetectedSafes([]);
            setSelectedSafe(null);
            setWalletName("");
            setSafeDetectionComplete(false);
        } else {
            // Reset safe, name, and owners when switching wallets so user has to re-select and re-name
            setSelectedSafe(null);
            setWalletName("");
            setSelectedOwners({
                "0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64": "",
                "0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1": "",
                "0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9": "",
                "0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E": ""
            });
            setCurrentStep("locate");
        }

        setTimeout(() => {
            setWalletState(prev => ({
                ...prev,
                [wallet]: "connected"
            }));

            setCurrentStep("locate");

            setWalletState(prev => ({
                ...prev,
                [wallet]: "detecting"
            }));

            setTimeout(() => {
                const detectionResult = simulateSafeDetectionWithRandom();

                if (!detectionResult.success) {
                    open(
                        <Modal onClose={() => {
                            closeTop();
                            onClose?.();
                        }}>
                            <NoSafeFound
                                onClose={() => {
                                    closeTop();
                                    onClose?.();
                                }}
                                onRetry={() => {
                                    closeTop();
                                    resetToConnectStep();
                                }}
                            />
                        </Modal>
                    );
                    setWalletState(prev => ({
                        ...prev,
                        [wallet]: "idle"
                    }));
                    setConnecting(false);
                } else {
                    setDetectedSafes(detectionResult.safes);

                    if (detectionResult.safes.length === 1) {
                        setSelectedSafe(detectionResult.safes[0].address);
                    }

                    setWalletState(prev => ({
                        ...prev,
                        [wallet]: "connected"
                    }));
                    setSafeDetectionComplete(true);
                    setConnecting(false);
                }
            }, 2000);
        }, 2000);
    };

    const handleSwitchWallet = (wallet: WalletType) => {
        if (wallet === selectedWallet || connecting || isSubmitting) return;
        handleWalletClick(wallet);
    };

    const getWalletClickHandler = (wallet: WalletType) => {
        if (connecting || isSubmitting) return undefined;
        if (selectedWallet === null) {
            return () => handleWalletClick(wallet);
        } else if (selectedWallet === wallet) {
            return undefined;
        } else {
            return () => handleSwitchWallet(wallet);
        }
    };

    const handleSafeSelect = (safeAddress: string) => {
        setSelectedSafe(safeAddress);
    };

    const handleConfirmSafeSelection = () => {
        if (!selectedSafe || !walletName.trim()) return;
        setCurrentStep("assign");
    };

    const handleEditWalletConnection = () => {
        resetToConnectStep();
    };

    const handleSelectAnotherSafe = () => {
        setSelectedOwners({
            "0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64": "",
            "0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1": "",
            "0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9": "",
            "0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E": ""
        });
        setCurrentStep("locate");
    };

    const handleConfirmAndConnect = async () => {
        setSubmitError("");
        const safeDetails = selectedSafe ? detectedSafes.find(safe => safe.address === selectedSafe) : undefined;
        if (!safeDetails) {
            // The safe is gone or was never picked: send the user back to choose one
            setCurrentStep("locate");
            return;
        }

        if (!walletName.trim()) {
            setFieldErrors(prev => ({ ...prev, walletName: "Give the safe a name" }));
            setCurrentStep("locate");
            return;
        }

        const thresholdMatch = safeDetails.confirmations.match(/^(\d+)\s+out\s+of\s+(\d+)$/);
        const threshold = thresholdMatch ? parseInt(thresholdMatch[1]) : 1;

        const assignedOwners = activeOwnerAddresses.map(addr => selectedOwners[addr]).filter(email => email !== "");

        if (assignedOwners.length === 0) {
            setFieldErrors(prev => ({ ...prev, owners: "Assign at least one owner to connect this safe" }));
            return;
        }

        setIsSubmitting(true);

        try {
            await createGnosisSafe({
                name: walletName,
                address: safeDetails.address,
                chain: safeDetails.chain,
                owners: assignedOwners,
                threshold: threshold,
            });

            setWalletName("");
            setSelectedOwners({
                "0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64": "",
                "0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1": "",
                "0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9": "",
                "0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E": ""
            });

            onClose?.();
            onSafeConnected?.();

            window.dispatchEvent(new CustomEvent("walletsUpdated"));
        } catch (error) {
            console.error("Error creating demo Gnosis Safe:", error);
            setSubmitError("Couldn't connect the safe. Your owner assignments are still here, so try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStepText = (step: StepState) => {
        if (step === "connect") return "Connect wallet";
        if (step === "locate") return "Locate safe";
        return "Assign owners";
    };

    const getStepStatus = (step: StepState) => {
        const currentStepIndex = steps.indexOf(currentStep);
        const stepIndex = steps.indexOf(step);

        if (stepIndex < currentStepIndex) return "completed";
        if (stepIndex === currentStepIndex) return "active";
        return "upcoming";
    };

    const isSafeClickable = () => {
        return currentStep === "locate" && !connecting && !isSubmitting;
    };

    const getWalletSectionTitle = (step: StepState) => {
        return step === "connect" ? "Select a wallet to connect" : "Connected wallet";
    };

    const shouldShowSwitchWallet = (wallet: WalletType) => {
        return selectedWallet !== null && selectedWallet !== wallet && !connecting && currentStep !== "assign";
    };

    const getChainIcon = (chain: string) => {
        if (!chain) return null;
        switch (chain.toLowerCase().trim()) {
            case "polygon":
            case "matic":
                return <PolygonIcon />;
            case "gnosis":
            case "gnosis chain":
            case "gnosis-chain":
            case "xdai":
                return <GnosisIcon />;
            case "ethereum":
            case "eth":
                return <EthereumIcon />;
            default:
                return null;
        }
    };

    return (
        <div
            ref={modalRef as React.RefObject<HTMLDivElement>}
            tabIndex={-1}
            className={`flex flex-col lg:flex-row ${MODAL_WIDTH.wide} p-4 items-start gap-[30px] rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] backdrop-blur-xl outline-none`}
            aria-live="polite"
            role="status"
        >
            {/* Left sidebar - Steps */}
            <div className="flex flex-row lg:flex-col w-full lg:w-[270px] lg:self-stretch gap-1.5 shrink-0 justify-between lg:justify-start border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-4 lg:pb-0 lg:pr-6">
                {steps.map((step) => {
                    const status = getStepStatus(step);
                    const isCompleted = status === "completed";
                    const isActive = status === "active";

                    return (
                        <div
                            key={step}
                            className={`flex w-full h-9 px-3 items-center gap-3 rounded-lg transition-all duration-200 ${isActive ? "bg-white/[0.04] border border-white/[0.06]" : "border border-transparent"
                                }`}
                        >
                            <div className="flex items-center justify-end shrink-0 w-6 h-6">
                                {isCompleted ? (
                                    <RiCheckLine className="text-[var(--color-text-success)] w-4 h-4 shrink-0" />
                                ) : isActive ? (
                                    <div className="w-3.5 h-0.5 rounded bg-[var(--color-text-success)] shrink-0" />
                                ) : (
                                    <div className="w-1.5 h-0.5 rounded bg-white/20 shrink-0" />
                                )}
                            </div>
                            <span className={`font-medium text-[13px] tracking-tight ${isActive ? "text-white" : isCompleted ? "text-[var(--color-text-muted)]" : "text-white/30"
                                }`}>
                                {getStepText(step)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Right content */}
            <div className="flex w-full lg:w-[1040px] flex-col shrink-0 min-w-0 max-h-[80vh]">
                {/* Header */}
                <div className="flex flex-col items-start gap-3 self-stretch border-b border-[var(--color-border-subtle)] pb-4 flex-shrink-0">
                    <div className="flex justify-between items-center self-stretch">
                        <div className="flex p-2.5 items-center justify-center rounded-xl bg-[var(--color-text-brand)]/[0.08] border border-[var(--color-text-brand)]/[0.12]">
                            <GnosisSafeIcon className="w-6 h-6 text-[var(--color-text-brand)]" color="currentColor" />
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
                            Connecting Gnosis Safe
                        </span>
                        <span className="text-[var(--color-text-muted)] text-sm tracking-tight leading-relaxed">
                            Improve your multi-sig experience
                        </span>
                    </div>
                </div>

                {/* Main scrollable body */}
                <div
                    ref={scrollContainerRef}
                    className="flex flex-col items-start gap-10 w-full overflow-y-auto scroll-smooth pl-4 pr-3 py-6 flex-grow"
                >
                    {/* Wallet connection grid */}
                    <div className="flex flex-col items-start gap-3 self-stretch">
                        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">
                            {getWalletSectionTitle(currentStep)}
                        </span>
                        <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
                            {/* Metamask */}
                            <div {...pressable({ pressed: selectedWallet === "metamask", disabled: connecting || isSubmitting })}
                                className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 gap-3 relative w-full lg:w-[490px] flex-shrink-0 ${selectedWallet === "metamask"
                                    ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]/[0.03] cursor-default"
                                    : "border-[var(--color-border-subtle)] bg-white/[0.02] cursor-pointer hover:border-white/20 hover:bg-white/[0.04]"
                                    } ${(connecting || isSubmitting) ? "opacity-50 pointer-events-none" : ""}`}
                                onClick={getWalletClickHandler("metamask")}
                                onMouseEnter={() => setHoveredWallet("metamask")}
                                onMouseLeave={() => setHoveredWallet(null)}
                            >
                                <div className="flex items-center gap-3">
                                    <MetamaskIcon />
                                    <span className="text-white font-medium text-base">Metamask</span>
                                </div>
                                <div className="flex justify-between items-center w-full min-h-[16px]">
                                    {walletState.metamask === "connected" && (
                                        <span className="text-[var(--color-text-success)] text-xs font-medium">Connected</span>
                                    )}
                                    {(walletState.metamask === "connecting" || walletState.metamask === "detecting") && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[var(--color-text-muted)] text-xs">
                                                {walletState.metamask === "connecting" ? "Connecting..." : "Detecting safe..."}
                                            </span>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                                className="inline-flex text-[var(--color-text-brand)] shrink-0"
                                            >
                                                <RiLoaderFill size={14} />
                                            </motion.span>
                                        </div>
                                    )}
                                    {shouldShowSwitchWallet("metamask") && (
                                        <span className={`text-[var(--color-text-brand)] text-xs font-semibold hover:underline transition-opacity duration-200 ${hoveredWallet === "metamask" ? "opacity-100" : "opacity-0"
                                            }`}>
                                            Switch wallet
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* WalletConnect */}
                            <div {...pressable({ pressed: selectedWallet === "walletconnect", disabled: connecting || isSubmitting })}
                                className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 gap-3 relative w-full lg:w-[490px] flex-shrink-0 ${selectedWallet === "walletconnect"
                                    ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]/[0.03] cursor-default"
                                    : "border-[var(--color-border-subtle)] bg-white/[0.02] cursor-pointer hover:border-white/20 hover:bg-white/[0.04]"
                                    } ${(connecting || isSubmitting) ? "opacity-50 pointer-events-none" : ""}`}
                                onClick={getWalletClickHandler("walletconnect")}
                                onMouseEnter={() => setHoveredWallet("walletconnect")}
                                onMouseLeave={() => setHoveredWallet(null)}
                            >
                                <div className="flex items-center gap-3">
                                    <WalletConnectIcon />
                                    <span className="text-white font-medium text-base">WalletConnect</span>
                                </div>
                                <div className="flex justify-between items-center w-full min-h-[16px]">
                                    {walletState.walletconnect === "connected" && (
                                        <span className="text-[var(--color-text-success)] text-xs font-medium">Connected</span>
                                    )}
                                    {(walletState.walletconnect === "connecting" || walletState.walletconnect === "detecting") && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[var(--color-text-muted)] text-xs">
                                                {walletState.walletconnect === "connecting" ? "Connecting..." : "Detecting safe..."}
                                            </span>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                                className="inline-flex text-[var(--color-text-brand)] shrink-0"
                                            >
                                                <RiLoaderFill size={14} />
                                            </motion.span>
                                        </div>
                                    )}
                                    {shouldShowSwitchWallet("walletconnect") && (
                                        <span className={`text-[var(--color-text-brand)] text-xs font-semibold hover:underline transition-opacity duration-200 ${hoveredWallet === "walletconnect" ? "opacity-100" : "opacity-0"
                                            }`}>
                                            Switch wallet
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Safe locate results */}
                    {safeDetectionComplete && detectedSafes.length > 0 && (
                        <div className={`flex flex-col gap-6 w-full ${(connecting || isSubmitting) ? "opacity-40 pointer-events-none" : ""}`}>
                            <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
                                {/* Safe list */}
                                <div className="flex w-full lg:w-[490px] flex-col items-start gap-1.5 flex-shrink-0 min-w-0">
                                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">
                                        Select Safe
                                    </span>
                                    <div className="flex flex-col gap-4 self-stretch">
                                        {detectedSafes.map((safe) => (
                                            <div
                                                key={safe.address}
                                                {...pressable({ pressed: selectedSafe === safe.address, disabled: !isSafeClickable() })}
                                                className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 gap-3 relative w-full ${selectedSafe === safe.address
                                                    ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]/[0.03] cursor-default"
                                                    : "border-[var(--color-border-subtle)] bg-white/[0.02] cursor-pointer hover:border-white/20 hover:bg-white/[0.04]"
                                                    } ${currentStep === "assign" && selectedSafe !== safe.address ? "opacity-40 pointer-events-none" : ""}`}
                                                onClick={isSafeClickable() ? () => handleSafeSelect(safe.address) : undefined}
                                            >
                                                <div className="flex justify-between items-center w-full min-w-0">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] relative text-white">
                                                            <GnosisSafeIcon className="w-5 h-5" color="currentColor" />
                                                            <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/[0.06]">
                                                                {getChainIcon(safe.chain)}
                                                            </div>
                                                        </div>
                                                        <span className="text-white font-mono text-sm font-medium flex-1">
                                                            {safe.address}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 shrink-0 ml-3">
                                                        {selectedSafe === safe.address && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-text-brand)] shadow-[0_0_8px_var(--color-text-brand)]" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center w-full min-h-[16px]">
                                                    <span className="text-[var(--color-text-muted)] text-xs pl-11">
                                                        {safe.confirmations} approvals required
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Wallet name setup */}
                                {(selectedSafe || detectedSafes.length === 1) && (
                                    <div className="flex flex-col p-5 border border-[var(--color-border-subtle)] rounded-2xl bg-white/[0.01] w-full lg:w-[490px] gap-4 flex-shrink-0">
                                        <TextInput
                                            label="Wallet name"
                                            placeholder="Use an identifiable name"
                                            value={walletName}
                                            onChange={(e) => {
                                                setWalletName(e.target.value);
                                                setFieldErrors(prev => (prev.walletName ? { ...prev, walletName: undefined } : prev));
                                            }}
                                            disabled={currentStep === "assign" || connecting || isSubmitting}
                                            state={fieldErrors.walletName ? "error" : "default"}
                                            errorMessage={fieldErrors.walletName}
                                            required
                                        />
                                        {currentStep !== "assign" && (
                                            <Button
                                                variant="brand"
                                                appearance="filled"
                                                flat
                                                disabled={!walletName.trim() || !selectedSafe || connecting || isSubmitting}
                                                onClick={handleConfirmSafeSelection}
                                                className="w-full justify-center"
                                            >
                                                Confirm safe selection
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {currentStep !== "assign" && (
                                <div className="flex self-stretch pt-2 border-t border-[var(--color-border-subtle)]">
                                    <Button
                                        variant="neutral"
                                        appearance="tonal"
                                        flat
                                        disabled={connecting || isSubmitting}
                                        onClick={handleEditWalletConnection}
                                        leadingIcon={<RiArrowLeftSLine />}
                                    >
                                        Edit wallet connection
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Owner assignment step */}
                    {currentStep === "assign" && (
                        <div className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-4 self-stretch">
                                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">
                                    Assign Owners to Safe
                                </span>
                                <div className="flex w-full flex-col items-start gap-4">
                                    {activeOwnerAddresses.map((address, index) => {
                                        const filteredOptions = getFilteredOptionsForAddress(address);
                                        const currentSelectedEmail = selectedOwners[address] || "";
                                        const currentSelectedMember = localMembers.find(m => m.email === currentSelectedEmail);

                                        return (
                                            <div key={address} className="w-full flex flex-col gap-2.5">
                                                <span className="text-xs font-mono text-[var(--color-text-muted)] truncate block" title={address}>
                                                    {address}
                                                </span>
                                                <div className="w-full flex flex-col lg:flex-row gap-4 items-center">
                                                    {/* Dropdown Input Column */}
                                                    <div className="w-full lg:w-[490px] flex-shrink-0">
                                                        <Dropdown
                                                            disabled={isSubmitting || connecting}
                                                            // The rule covers the whole safe, so the message shows once, under the first owner
                                                            state={fieldErrors.owners ? "error" : "default"}
                                                            errorMessage={index === 0 ? fieldErrors.owners : undefined}
                                                        >
                                                            <DropdownTrigger
                                                                placeholder="Search or invite owner"
                                                                leadingIcon={<RiSearchLine size={16} />}
                                                                label={currentSelectedMember ? (currentSelectedMember.name ? `${currentSelectedMember.name} (${currentSelectedMember.email})` : currentSelectedMember.email) : undefined}
                                                            />
                                                            <DropdownMenu minWidth={380}>
                                                                <DropdownSearch
                                                                    value={searchQueries[address] || ""}
                                                                    onChange={(val) => setSearchQueries(prev => ({ ...prev, [address]: val }))}
                                                                    placeholder="Search or invite owner"
                                                                />
                                                                <div className="overflow-y-auto max-h-[180px] p-1">
                                                                    {filteredOptions.length > 0 ? (
                                                                        filteredOptions.map((member) => (
                                                                            <DropdownItem
                                                                                key={member.email}
                                                                                selected={currentSelectedEmail === member.email}
                                                                                icon={<Avatar name={memberLabel(member)} size="xs" preset={getPresetForUser(memberLabel(member))} />}
                                                                                description={member.name ? member.email : "Invited"}
                                                                                onSelect={() => handleOwnerChange(address, member.email)}
                                                                            >
                                                                                {memberLabel(member)}
                                                                            </DropdownItem>
                                                                        ))
                                                                    ) : (
                                                                        <div className="p-3 text-xs text-[var(--color-text-muted)] text-center">
                                                                            No members found
                                                                        </div>
                                                                    )}

                                                                    {searchQueries[address] && !filteredOptions.some(m => (m.email || '').toLowerCase() === searchQueries[address].toLowerCase()) && (
                                                                        <DropdownCreateNew
                                                                            label={searchQueries[address]}
                                                                            customText="Invite and assign as owner"
                                                                            onAction={() => {
                                                                                handleInviteOwner(address, searchQueries[address]);
                                                                                setSearchQueries(prev => ({ ...prev, [address]: "" }));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>

                                                    {/* Assignment Status Message */}
                                                    <div className="flex items-center gap-2 min-w-0 flex-grow">
                                                        {currentSelectedEmail && (
                                                            currentSelectedMember ? (
                                                                <div className="flex items-center gap-2 min-w-0 text-xs font-semibold leading-none text-[var(--color-text-success)]">
                                                                    <Avatar name={memberLabel(currentSelectedMember)} size="xs" preset={getPresetForUser(memberLabel(currentSelectedMember))} />
                                                                    <span className="truncate max-w-[150px] text-white">
                                                                        {memberLabel(currentSelectedMember)}
                                                                    </span>
                                                                    <span className="text-[var(--color-text-muted)] font-normal">
                                                                        will be assigned as an owner.
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 min-w-0 text-xs font-semibold leading-none text-[var(--color-text-brand)]">
                                                                    <RiMailLine size={16} className="text-[var(--color-text-muted)] shrink-0" />
                                                                    <span className="truncate max-w-[180px] text-white">
                                                                        {currentSelectedEmail}
                                                                    </span>
                                                                    <span className="text-[var(--color-text-muted)] font-normal">
                                                                        to be invited to join <span className="text-white font-medium">Acme & Co.</span> as an <span className="text-white font-medium">approver</span> for this safe.
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {submitError && (
                                <InlineAlert>{submitError}</InlineAlert>
                            )}

                            {/* Back and Confirm buttons */}
                            <div className="flex justify-between items-center self-stretch pt-6 border-t border-[var(--color-border-subtle)] mt-4">
                                <Button
                                    variant="neutral"
                                    appearance="tonal"
                                    flat
                                    disabled={isSubmitting || connecting}
                                    onClick={handleSelectAnotherSafe}
                                    leadingIcon={<RiArrowLeftSLine />}
                                >
                                    Select another Safe
                                </Button>

                                <Button
                                    variant="brand"
                                    appearance="filled"
                                    flat
                                    loading={isSubmitting || connecting}
                                    disabled={isSubmitting || Object.values(selectedOwners).filter(Boolean).length === 0 || connecting}
                                    onClick={handleConfirmAndConnect}
                                >
                                    Confirm & connect
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
