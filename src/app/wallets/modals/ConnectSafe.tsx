"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    CloseIcon,
    CloseCircleFilledIcon,
    InactiveLineIcon,
    ActiveLineIcon,
    GnosisSafeIcon,
    MetamaskIcon,
    WalletConnectIcon,
    ExecutingIcon,
    CheckIcon,
    PolygonIcon,
    GnosisIcon,
    EthereumIcon,
    ArrowLeftIcon,
    UserAvatarIcon
} from "../../components/icons";
import IconButton from "@/app/components/buttons/IconButton";
import useModal from "@/app/hooks/useModal";
import NoSafeFound from "./NoSafeFound";
import { useModalContext, Modal } from "@/app/components/modal/Modal";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import Dropdown from "@/app/components/forms/Dropdown";
import { createGnosisSafe } from "@/app/api/mock-cache";

interface Member {
    id: number;
    name: string;
    email: string;
}

interface ConnectSafeProps {
    onClose?: () => void;
    members?: Member[];
    onSafeConnected?: () => void; // Add callback to refresh wallet list
}

interface SafeInfo {
    address: string;
    chain: string;
    confirmations: string;
}

type WalletType = 'metamask' | 'walletconnect';
type WalletState = 'idle' | 'connecting' | 'connected' | 'detecting';
type StepState = 'connect' | 'locate' | 'assign';

const steps: StepState[] = ['connect', 'locate', 'assign'];

export default function ConnectSafe({ onClose, members: propMembers = [], onSafeConnected }: ConnectSafeProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [walletState, setWalletState] = useState<Record<WalletType, WalletState>>({
        metamask: 'idle',
        walletconnect: 'idle'
    });
    const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
    const [currentStep, setCurrentStep] = useState<StepState>('connect');
    const [connecting, setConnecting] = useState(false);
    const [detectedSafes, setDetectedSafes] = useState<SafeInfo[]>([]);
    const [selectedSafe, setSelectedSafe] = useState<string | null>(null);
    const [walletName, setWalletName] = useState('');
    const [safeDetectionComplete, setSafeDetectionComplete] = useState(false);

    const { open, closeTop } = useModal();
    const { escStage, isTopModal } = useModalContext();
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const previousStepRef = useRef<StepState>('connect');
    const previousDetectedSafesCountRef = useRef<number>(0);

    // State for owner selections - single string per address
    const [selectedOwners, setSelectedOwners] = useState<Record<string, string>>({
        '0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64': '',
        '0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1': '',
        '0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9': '',
        '0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E': ''
    });

    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
        '0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64': '',
        '0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1': '',
        '0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9': '',
        '0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E': ''
    });

    const memberOptions = useMemo(() => {
        return propMembers.map(member => ({
            value: member.email,
            label: member.name,
            metadata: member.email,
            icon: <UserAvatarIcon member={member.name} size={16}/>
        }));
    }, [propMembers]);

    // Mock data for owners - in real app this would come from props or API
    const ownerAddresses = useMemo(() => [
        '0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64',
        '0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1',
        '0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9',
        '0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E'
    ], []);

    // Get filtered options for each address (exclude already selected owners from other dropdowns)
    const getFilteredOptionsForAddress = useCallback((address: string) => {
        // Get all currently selected owner emails (except the current address)
        const selectedEmails = Object.entries(selectedOwners)
            .filter(([addr]) => addr !== address)
            .map(([, email]) => email)
            .filter(email => email !== '');

        // Filter out options that are already selected in other dropdowns
        return memberOptions.filter(option => 
            !selectedEmails.includes(option.value) || 
            selectedOwners[address] === option.value
        );
    }, [memberOptions, selectedOwners]);

    const handleOwnerChange = (address: string, value: string | string[]) => {
        if (typeof value === 'string') {
            setSelectedOwners(prev => ({
                ...prev,
                [address]: value
            }));
        } else if (Array.isArray(value) && value.length > 0) {
            // If somehow an array is passed, take the first value
            setSelectedOwners(prev => ({
                ...prev,
                [address]: value[0]
            }));
        } else {
            // Clear the selection
            setSelectedOwners(prev => ({
                ...prev,
                [address]: ''
            }));
        }
    };

    const handleSearchChange = (address: string, query: string) => {
        setSearchQueries(prev => ({
            ...prev,
            [address]: query
        }));
        console.log(`Search query for ${address}:`, query);
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
            el.setAttribute('aria-live', 'polite');
        }
    }, []);

    // Auto-scroll logic for step progression
    useEffect(() => {
        const stepsOrder = ['connect', 'locate', 'assign'];
        const currentStepIndex = stepsOrder.indexOf(currentStep);
        const previousStepIndex = stepsOrder.indexOf(previousStepRef.current);

        if (currentStepIndex > previousStepIndex) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                }
            }, 100);
        }
        
        previousStepRef.current = currentStep;
    }, [currentStep]);

    // Auto-scroll when safe detection completes and shows safes
    useEffect(() => {
        if (safeDetectionComplete && detectedSafes.length > previousDetectedSafesCountRef.current) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                }
            }, 150);
            
            previousDetectedSafesCountRef.current = detectedSafes.length;
        }
    }, [safeDetectionComplete, detectedSafes.length]);

    // Auto-scroll when a safe is selected and wallet naming card appears
    useEffect(() => {
        if (selectedSafe && (detectedSafes.length === 1 || currentStep === 'locate')) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [selectedSafe, detectedSafes.length, currentStep]);

    const resetToConnectStep = useCallback(() => {
        setCurrentStep('connect');
        setSelectedWallet(null);
        setConnecting(false);
        setDetectedSafes([]);
        setSelectedSafe(null);
        setWalletName('');
        setSafeDetectionComplete(false);
        setWalletState({
            metamask: 'idle',
            walletconnect: 'idle'
        });
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        }, 50);
    }, []);

    // Generate random wallet addresses for variety
    const generateRandomAddress = () => {
        const chars = '0123456789abcdef';
        let address = '0x';
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
                    chain: Math.random() > 0.5 ? 'polygon' : 'ethereum',
                    confirmations: '2 out of 2'
                }]
            };
        } else {
            // Generate 1-3 random safes
            const safeCount = Math.floor(Math.random() * 3) + 1;
            const safes = [];
            const chains = ['polygon', 'gnosis', 'ethereum'];
            
            for (let i = 0; i < safeCount; i++) {
                const chain = chains[Math.floor(Math.random() * chains.length)];
                const owners = Math.floor(Math.random() * 4) + 2; // 2-5 owners
                const threshold = Math.floor(Math.random() * owners) + 1; // 1-owners threshold
                
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

        // Reset other wallet to idle
        const otherWallet = wallet === 'metamask' ? 'walletconnect' : 'metamask';
        setWalletState(prev => ({
            ...prev,
            [otherWallet]: 'idle',
            [wallet]: 'connecting'
        }));

        // Clear previous safes
        setDetectedSafes([]);
        setSelectedSafe(null);
        setWalletName('');
        setSafeDetectionComplete(false);

        setTimeout(() => {
            setWalletState(prev => ({
                ...prev,
                [wallet]: 'connected'
            }));

            // Move to locate step if not already there
            if (currentStep === 'connect') {
                setCurrentStep('locate');
            }

            setWalletState(prev => ({
                ...prev,
                [wallet]: 'detecting'
            }));

            setTimeout(() => {
                const detectionResult = simulateSafeDetectionWithRandom();

                if (!detectionResult.success) {
                    open(
                        <Modal onRequestClose={() => true}>
                            <NoSafeFound
                                onClose={() => {
                                    if (onClose) onClose();
                                }}
                                onRetry={resetToConnectStep}
                            />
                        </Modal>
                    );
                    setWalletState(prev => ({
                        ...prev,
                        [wallet]: 'idle'
                    }));
                    setConnecting(false);
                } else {
                    setDetectedSafes(detectionResult.safes);

                    if (detectionResult.safes.length === 1) {
                        setSelectedSafe(detectionResult.safes[0].address);
                    }

                    setWalletState(prev => ({
                        ...prev,
                        [wallet]: 'connected'
                    }));
                    setSafeDetectionComplete(true);
                    setConnecting(false);
                }
            }, 2000);
        }, 2000);
    };

    // Handle switching to a different wallet
    const handleSwitchWallet = (wallet: WalletType) => {
        if (wallet === selectedWallet || connecting) return;
        handleWalletClick(wallet);
    };

    const getWalletClickHandler = (wallet: WalletType) => {
        if (connecting) return undefined;
        
        if (selectedWallet === null) {
            // No wallet selected yet
            return () => handleWalletClick(wallet);
        } else if (selectedWallet === wallet) {
            // This is the currently selected wallet
            return undefined; // Don't allow clicking the already selected wallet
        } else {
            // Switching to the other wallet
            return () => handleSwitchWallet(wallet);
        }
    };

    const getWalletCardStyle = (wallet: WalletType) => {
        const isCurrentWallet = selectedWallet === wallet;
        const isConnectingState = walletState[wallet] === 'connecting' || walletState[wallet] === 'detecting';
        const isConnected = walletState[wallet] === 'connected';
        
        // Determine if this wallet is clickable
        const isClickable = getWalletClickHandler(wallet) !== undefined;
        
        if (isClickable) {
            // Wallet is clickable (either for initial connection or switching)
            if (isConnectingState) {
                return 'border-[#63F3C5]/64 bg-[#1A2523] cursor-default';
            }
            return 'border-[#F8FCFF]/24 bg-[#151819] cursor-pointer hover:border-[#63F3C5]/64 hover:bg-[#1A2523]';
        } else {
            // Wallet is not clickable
            if (isCurrentWallet) {
                // Currently selected wallet
                if (isConnected) {
                    return 'border-[#F8FCFF]/80 bg-[#151819] cursor-default';
                } else if (isConnectingState) {
                    return 'border-[#63F3C5]/64 bg-[#1A2523] cursor-default';
                }
            }
            // Other wallet that's not clickable (shouldn't happen, but as fallback)
            return 'border-[#F8FCFF]/24 bg-[#151819] cursor-default opacity-50';
        }
    };

    const handleSafeSelect = (safeAddress: string) => {
        setSelectedSafe(safeAddress);
    };

    const handleConfirmSafeSelection = () => {
        if (!selectedSafe || !walletName.trim()) return;
        setCurrentStep('assign');
    };

    const handleEditWalletConnection = () => {
        resetToConnectStep();
    };

    const handleSelectAnotherSafe = () => {
        setCurrentStep('locate');
    };

    // Handle final confirmation and create the Gnosis Safe
    const handleConfirmAndConnect = async () => {
        if (!selectedSafe || !walletName.trim()) {
            alert("Please complete all required fields");
            return;
        }

        // Get the selected safe details
        const safeDetails = detectedSafes.find(safe => safe.address === selectedSafe);
        if (!safeDetails) {
            alert("Selected safe not found");
            return;
        }

        // Extract threshold from confirmations (e.g., "2 out of 4" -> threshold = 2)
        const thresholdMatch = safeDetails.confirmations.match(/^(\d+)\s+out\s+of\s+(\d+)$/);
        const threshold = thresholdMatch ? parseInt(thresholdMatch[1]) : 1;

        // Get all selected owners (filter out empty selections)
        const assignedOwners = Object.values(selectedOwners).filter(email => email !== '');

        if (assignedOwners.length === 0) {
            alert("Please assign at least one owner");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create demo Gnosis Safe using mock cache
            const newSafe = await createGnosisSafe({
                name: walletName,
                address: selectedSafe,
                chain: safeDetails.chain,
                owners: assignedOwners,
                threshold: threshold,
            });

            console.log("Demo Gnosis Safe created:", newSafe);

            // Reset form
            setWalletName('');
            setSelectedOwners({
                '0x3aD7fBb24e6aC198Dc3c1Ee74Bf89b327e845C64': '',
                '0x91C5a2D4E7BaB3b134E0Df3AeBE4a9C6f8D057F1': '',
                '0x6Fe8CbeBcF2D2170EbAdB801927aDd3a1C15E5b9': '',
                '0xC2E7f41eA8D5Fa66eC3FbF1eBb0e9A59AbDc9D6E': ''
            });

            // Close modal
            if (onClose) {
                onClose();
            }

            // Notify parent to refresh the list
            if (onSafeConnected) {
                onSafeConnected();
            }

            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('walletsUpdated'));

        } catch (error) {
            console.error("Error creating demo Gnosis Safe:", error);
            alert("Failed to connect safe. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStepText = (step: StepState) => {
        if (step === 'connect') return "Connect wallet";
        if (step === 'locate') return "Locate safe";
        return "Assign owners";
    };

    const getStepStatus = (step: StepState) => {
        const currentStepIndex = steps.indexOf(currentStep);
        const stepIndex = steps.indexOf(step);

        if (stepIndex < currentStepIndex) {
            return 'completed';
        } else if (stepIndex === currentStepIndex) {
            return 'active';
        } else {
            return 'upcoming';
        }
    };

    const isSafeClickable = () => {
        return currentStep === 'locate';
    };

    const getWalletSectionTitle = (step: StepState) => {
        return step === 'connect'
            ? "Select a wallet to connect"
            : "Connected wallet";
    };

    const shouldShowSwitchWallet = (wallet: WalletType) => {
        return selectedWallet !== null && 
               selectedWallet !== wallet && 
               !connecting && 
               currentStep !== 'assign'; // Don't show switch during assign step
    };

    const getChainIcon = (chain: string) => {
        switch (chain) {
            case 'polygon': return <PolygonIcon className="absolute inline-flex items-center w-[16px] h-[16px] -space-x-0.25 bottom-[14px] left-[14px]" />;
            case 'gnosis': return <GnosisIcon className="absolute inline-flex items-center w-[16px] h-[16px] -space-x-0.25 bottom-[14px] left-[14px]" />;
            case 'ethereum': return <EthereumIcon className="absolute inline-flex items-center w-[16px] h-[16px] -space-x-0.25 bottom-[14px] left-[14px]" />;
            default: return null;
        }
    };

    return (
        <div
            ref={modalRef}
            tabIndex={-1}
            className="flex w-[1372px] p-4 items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] mt-[80px] transition-all duration-300 bg-[#151819]"
            aria-live="polite"
            role="status"
        >
            {/* Left sidebar - Steps - Fixed, not scrollable */}
            <div className="flex w-[270px] h-[327px] flex-col justify-end items-start gap-2.5 shrink-0">
                {steps.map((step) => {
                    const status = getStepStatus(step);

                    let icon;
                    let textOpacity = 1;
                    let bgClass = '';

                    switch (status) {
                        case 'completed':
                            icon = <CheckIcon className="text-[#069668] w-[18px] h-[18px]" />;
                            textOpacity = 0.6;
                            break;
                        case 'active':
                            icon = <ActiveLineIcon />;
                            bgClass = 'bg-white/10';
                            break;
                        case 'upcoming':
                            icon = <InactiveLineIcon />;
                            textOpacity = 0.3;
                            break;
                    }

                    return (
                        <div
                            key={step}
                            className={`flex h-[34px] pt-[8px] pr-[12px] pb-[8px] pl-[8px] items-center gap-2.5 shrink-0 self-stretch rounded-[10px] ${bgClass}`}
                        >
                            {icon}
                            <span
                                className="text-[#C8CACB] font-[Figtree] text-sm not-italic font-medium leading-[normal] tracking-[0.112px] flex-[1_0_0]"
                                style={{ opacity: textOpacity }}
                            >
                                {getStepText(step)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Right content - Split into fixed header and scrollable content */}
            <div className="flex w-[1040px] flex-col shrink-0 min-h-[600px] max-h-[80vh]">
                {/* Header - Fixed, not scrollable */}
                <div className="flex flex-col items-start gap-2.5 self-stretch bg-[#151819] pt-2 pb-4 z-10 flex-shrink-0">
                    <div className="flex justify-between items-start self-stretch">
                        <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                            <GnosisSafeIcon className="w-8 h-8 aspect-square" />
                        </div>
                        <IconButton
                            icon={showEscTooltip ? <CloseCircleFilledIcon /> : <CloseIcon />}
                            size="sm"
                            status={showEscTooltip ? "danger" : "neutral"}
                            onClick={onClose}
                            tooltipTitle="Esc again to confirm"
                            showTooltip={showEscTooltip}
                        />
                    </div>
                    <div className="flex py-[0] flex-col items-start gap-2.5 self-stretch">
                        <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
                            Connecting Gnosis Safe
                        </span>
                        <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                            Improve your multi-sig experience
                        </span>
                    </div>
                </div>

                {/* Main content - Scrollable section */}
                <div
                    ref={scrollContainerRef}
                    className="flex flex-col items-start gap-16 w-full overflow-y-auto scroll-smooth pr-2 flex-grow"
                >
                    {/* Wallet selection section - ALWAYS VISIBLE */}
                    <div className="flex py-[0] flex-col items-start gap-1.5 self-stretch">
                        <div className="flex flex-col items-start gap-1.5 w-full">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px]">
                                {getWalletSectionTitle(currentStep)}
                            </span>
                            <div className="flex items-start content-start gap-4 flex-wrap">
                                {/* Metamask Option */}
                                <div
                                    className={`group flex w-[336px] h-[76px] pt-[16px] pr-[10px] pb-[16px] pl-[16px] flex-col justify-center items-end gap-1.5 rounded-[14px] border-[0.5px] border-solid transition-all duration-200
                                        ${getWalletCardStyle('metamask')}`}
                                    onClick={getWalletClickHandler('metamask')}
                                >
                                    <div className="flex items-center gap-2.5 self-stretch">
                                        <MetamaskIcon className="w-8 h-8 aspect-square" />
                                        <span className="text-[#F8FCFF] font-[Geist] text-base not-italic font-normal leading-[125%] flex-[1_0_0]">
                                            Metamask
                                        </span>
                                    </div>

                                    {/* Bottom text area */}
                                    <div className={`flex justify-between items-start self-stretch ${walletState.metamask === 'connecting' || walletState.metamask === 'detecting' || walletState.metamask === 'connected' || shouldShowSwitchWallet('metamask') ? '' : 'hidden'}`}>
                                        {walletState.metamask === 'connected' && (
                                            <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[150%]">
                                                Connected
                                            </span>
                                        )}
                                        {walletState.metamask === 'connecting' && (
                                            <>
                                                <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[150%]">
                                                    Connecting wallet...
                                                </span>
                                                <ExecutingIcon className="w-[18px] h-[18px] aspect-square" />
                                            </>
                                        )}
                                        {walletState.metamask === 'detecting' && (
                                            <>
                                                <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[150%]">
                                                    Detecting your safe
                                                </span>
                                                <ExecutingIcon className="w-[18px] h-[18px] aspect-square" />
                                            </>
                                        )}
                                        {shouldShowSwitchWallet('metamask') && (
                                            <span className="text-[#63F3C5] font-[Geist] text-xs not-italic font-light leading-[150%] opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                Switch wallet
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* WalletConnect Option */}
                                <div
                                    className={`group flex w-[336px] h-[76px] pt-[16px] pr-[10px] pb-[16px] pl-[16px] flex-col justify-center items-end gap-1.5 rounded-[14px] border-[0.5px] border-solid transition-all duration-200
                                        ${getWalletCardStyle('walletconnect')}`}
                                    onClick={getWalletClickHandler('walletconnect')}
                                >
                                    <div className="flex items-center gap-2.5 self-stretch">
                                        <WalletConnectIcon className="w-8 h-8 aspect-square" />
                                        <span className="text-[#F8FCFF] font-[Geist] text-base not-italic font-normal leading-[125%] flex-[1_0_0]">
                                            Wallet Connect
                                        </span>
                                    </div>

                                    {/* Bottom text area */}
                                    <div className={`flex justify-between items-start self-stretch ${walletState.walletconnect === 'connecting' || walletState.walletconnect === 'detecting' || walletState.walletconnect === 'connected' || shouldShowSwitchWallet('walletconnect') ? '' : 'hidden'}`}>
                                        {walletState.walletconnect === 'connected' && (
                                            <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[150%]">
                                                Connected
                                            </span>
                                        )}
                                        {walletState.walletconnect === 'connecting' && (
                                            <>
                                                <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[150%]">
                                                    Connecting wallet...
                                                </span>
                                                <ExecutingIcon className="w-[18px] h-[18px] aspect-square" />
                                            </>
                                        )}
                                        {walletState.walletconnect === 'detecting' && (
                                            <>
                                                <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[150%]">
                                                    Detecting your safe
                                                </span>
                                                <ExecutingIcon className="w-[18px] h-[18px] aspect-square" />
                                            </>
                                        )}
                                        {shouldShowSwitchWallet('walletconnect') && (
                                            <span className="text-[#63F3C5] font-[Geist] text-xs not-italic font-light leading-[150%] opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                Switch wallet
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Locate step content - shows when safe detection is successful */}
                    {safeDetectionComplete && detectedSafes.length > 0 && (
                        <>
                            <div className="flex py-[0] flex-col items-start gap-1.5 self-stretch">
                                <div className="flex items-end gap-4 self-stretch">
                                    {/* Safe List */}
                                    <div className="flex w-[688px] flex-col items-start gap-1.5">
                                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px]">
                                            Select safe
                                        </span>

                                        <div className="flex flex-col items-start gap-4 self-stretch">
                                            {detectedSafes.map((safe) => (
                                                <div
                                                    key={safe.address}
                                                    className={`group/option flex pt-[16px] pr-[10px] pb-[10px] pl-[16px] flex-col justify-center items-start gap-1.5 self-stretch border-[0.5px] border-solid rounded-[14px] transition-all duration-200
                                                        ${selectedSafe === safe.address
                                                            ? 'border-[#F8FCFF]/80 bg-[#151819]' 
                                                            : 'border-[#F8FCFF]/24 hover:bg-[#1A2523]'}`}
                                                    onClick={isSafeClickable() ? () => handleSafeSelect(safe.address) : undefined}
                                                    style={{
                                                        cursor: isSafeClickable() ? 'pointer' : 'default',
                                                        opacity: currentStep === 'assign' && selectedSafe !== safe.address ? 0.5 : 1
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-5 h-5 shrink-0 relative flex items-center justify-center">
                                                            <GnosisSafeIcon className="w-5 h-[18px] text-[#F8FCFF]" />
                                                            {getChainIcon(safe.chain)}
                                                        </div>
                                                        <span className="text-[#F8FCFF] font-[Geist] text-base not-italic font-normal leading-[125%]">
                                                            {safe.address}
                                                        </span>
                                                    </div>
                                                    <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[150%]">
                                                        {safe.confirmations} approvals required
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Wallet Naming Card */}
                                    {(selectedSafe || detectedSafes.length === 1) && (
                                        <div className="flex w-[336px] px-3 pb-3 pt-4 flex-col items-end gap-3 rounded-[14px] border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#151819]">
                                            <div className="w-full">
                                                <div className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] mb-2">
                                                    Wallet name
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Use an identifiable name"
                                                    className="w-full bg-[#151819] border border-[#F8FCFF]/24 rounded-lg px-3 py-2 text-[#F8FCFF] placeholder-[#F8FCFF]/40"
                                                    value={walletName}
                                                    onChange={(e) => setWalletName(e.target.value)}
                                                    disabled={currentStep === 'assign'}
                                                />
                                            </div>
                                            {currentStep !== 'assign' && (
                                                <PrimaryButton
                                                    label={"Confirm"}
                                                    variant="brand"
                                                    size="md"
                                                    onClick={handleConfirmSafeSelection}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {currentStep !== 'assign' && (
                                <div className="flex items-center self-stretch">
                                    <PrimaryButton
                                        label="Edit wallet connection"
                                        variant="neutral"
                                        leadingIcon={<ArrowLeftIcon />}
                                        onClick={handleEditWalletConnection}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Assign step content */}
                    {currentStep === 'assign' && (
                        <>
                            <div className="flex py-[0] flex-col items-start gap-1.5 self-stretch">
                                <div className="flex flex-col items-start gap-1.5 w-full">
                                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px]">
                                        Assign owners to your safe
                                    </span>
                                    <div className="flex w-[512px] flex-col items-start gap-4">
                                        {ownerAddresses.map((address) => (
                                            <Dropdown
                                                key={address}
                                                placeholder="Search or invite owner"
                                                label={address}
                                                options={getFilteredOptionsForAddress(address)}
                                                value={selectedOwners[address] || ''}
                                                onChange={(value) => handleOwnerChange(address, value)}
                                                onSearchChange={(query) => handleSearchChange(address, query)}
                                                width="full"
                                                disabled={isSubmitting}
                                                allowSearch={true}
                                                searchPlaceholder="Search or invite approvers..."
                                                emptyText="No members found"
                                                allowCreate={true}
                                                createText="Invite new member"
                                                maxHeight="300px"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center self-stretch">
                                <PrimaryButton
                                    label="Select another Safe"
                                    variant="neutral"
                                    leadingIcon={<ArrowLeftIcon />}
                                    onClick={handleSelectAnotherSafe}
                                />

                                <PrimaryButton
                                    label="Confirm & connect"
                                    variant="brand"
                                    onClick={handleConfirmAndConnect}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}