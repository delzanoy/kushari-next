"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGroups, useAddresses } from "@/hooks/useData";
import {
    RiCloseLine,
    RiCloseCircleFill,
    RiArrowRightUpLine,
    RiSafeLine,
    RiWallet3Line,
    RiWalletLine,
    RiSendPlaneFill,
    RiCheckLine,
    RiQrCodeLine,
    RiFileCopyLine,
    RiArrowLeftSLine,
    RiAddLine,
    RiDeleteBinLine,
    RiDeleteBinFill,
    RiInformationLine,
    RiUploadCloud2Line,
    RiFileTextLine,
    RiGroupLine,
    RiFileDownloadLine,
    RiSearchLine,
    RiArrowUpLine,
    RiPriceTag3Line,
    RiErrorWarningLine,
} from "@remixicon/react";
import { QRCodeSVG } from 'qrcode.react';
import { formatDollars, formatCents } from "@/lib/formatters";
import { useModalContext } from "@/components/molecules/modal/Modal";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Avatar } from "@/components/atoms/Avatar";
import { TextInput } from "@/components/atoms/TextInput";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@/components/atoms/Dropdown";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";
import type { WalletSummary, Wallet, Member } from "../types";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";

const renderWalletIcon = (walletType?: number, size = 16) => {
    const iconMap: Record<number, React.ReactElement> = {
        1: <RiSafeLine size={size} />,
        2: <GnosisSafeIcon size={size} />,
        3: <RiWalletLine size={size} />,
    };
    return (walletType && iconMap[walletType]) || <RiSafeLine size={size} />;
};

interface SendTokensProps {
    wallet?: WalletSummary | Wallet;
    selectedWallet?: WalletSummary | Wallet;
    wallets?: (WalletSummary | Wallet)[];
    members?: Member[];
    onClose?: () => void;
}

type StepState = "source" | "recipient" | "review";
const steps: StepState[] = ["source", "recipient", "review"];

function CopyQrButton({ wallet }: { wallet: WalletSummary | Wallet }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (wallet.address) {
            navigator.clipboard.writeText(wallet.address);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <Tooltip
            content={
                <div className="flex flex-col items-center gap-2 p-2 min-w-[160px]">
                    <span className={`text-xs font-medium ${isCopied ? "text-[var(--color-text-success)]" : "text-white"}`}>
                        {isCopied ? "Address copied!" : wallet.name}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <QRCodeSVG
                            value={wallet.address || "0x0000000000000000000000000000000000000000"}
                            size={140}
                            bgColor="transparent"
                            fgColor="white"
                            level="L"
                        />
                    </div>
                    {wallet.address && (
                        <span className="text-[11px] font-mono text-[var(--color-text-muted)] truncate max-w-[150px]">
                            {wallet.address}
                        </span>
                    )}
                </div>
            }
            placement="top"
            showArrow
        >
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <IconButton
                    icon={
                        isCopied ? (
                            <RiCheckLine size={16} className="text-[var(--color-text-success)]" />
                        ) : isHovered ? (
                            <RiFileCopyLine size={16} />
                        ) : (
                            <RiQrCodeLine size={16} />
                        )
                    }
                    aria-label={isCopied ? "Address copied" : isHovered ? "Copy address" : "View QR code"}
                    variant={isCopied ? "success" : "neutral"}
                    appearance="ghost"
                    flat
                    onClick={handleCopy}
                />
            </div>
        </Tooltip>
    );
}

const DEFAULT_MEMBERS: Member[] = [
    { id: 1, name: "Delanoy Kunil", email: "delanoy@kushari.io", colour: "#26C9C9" },
    { id: 2, name: "Elena Rostova", email: "elena@kushari.io", colour: "#7C3AED" },
    { id: 3, name: "Marcus Vance", email: "marcus@kushari.io", colour: "#0EA5E9" },
    { id: 4, name: "Aria Tanaka", email: "aria@kushari.io", colour: "#F97316" },
    { id: 5, name: "Viktor Draganov", email: "viktor@kushari.io", colour: "#6366F1" },
    { id: 6, name: "Sarah Jenkins", email: "sarah@kushari.io", colour: "#EC4899" },
];

export default function SendTokens({ wallet: propWallet, selectedWallet: propSelectedWallet, wallets = [], members = [], onClose }: SendTokensProps) {
    const [currentStep, setCurrentStep] = useState<StepState>("source");
    const [recipientType, setRecipientType] = useState<"few" | "mass" | null>(null);

    const initialWallet = propWallet || propSelectedWallet || wallets[0] || {
        id: 1,
        type: 1,
        name: "Company Treasury",
        USDBalance: 0,
        percent_change_24h: 0,
        address: "0x0000000000000000000000000000000000000000",
        blockchain: "Ethereum",
    };
    const [selectedWallet, setSelectedWallet] = useState<WalletSummary | Wallet>(initialWallet);

    useEffect(() => {
        setSelectedWallet(initialWallet);
    }, [initialWallet]);

    const sourceWalletsList = useMemo(() => {
        if (Array.isArray(wallets) && wallets.length > 0) {
            const exists = wallets.some(w => w.id === initialWallet.id);
            if (!exists) {
                return [initialWallet, ...wallets];
            }
            return wallets;
        }
        return [initialWallet];
    }, [wallets, initialWallet]);

    // Step 1 State
    const [sourceWalletOpen, setSourceWalletOpen] = useState(false);
    const [networkOpen, setNetworkOpen] = useState(false);
    const [assetOpen, setAssetOpen] = useState(false);

    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

    // Mass Transfer Form State
    const [massOption, setMassOption] = useState<"group" | "csv" | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [groupSearchQuery, setGroupSearchQuery] = useState("");
    const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
    const groupInputRef = useRef<HTMLInputElement>(null);
    const groupSearchContainerRef = useRef<HTMLDivElement>(null);

    // Group Mass Transfer Table State
    const [showGroupTable, setShowGroupTable] = useState(false);
    const [activeTableMode, setActiveTableMode] = useState<"tokens" | "usd">("tokens");
    const [groupTableRows, setGroupTableRows] = useState<Array<{
        id: string;
        name: string;
        groupName: string;
        address: string;
        tokenAmount: string;
        usdAmount: string;
    }>>([]);
    const [tableValidationAttempted, setTableValidationAttempted] = useState(false);
    const [hasShownBatchTooltip, setHasShownBatchTooltip] = useState(false);
    const [batchTooltipInfo, setBatchTooltipInfo] = useState<{
        rowId: string;
        tokenVal: string;
        usdVal: string;
    } | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const previousStepRef = useRef<StepState>("source");

    const hasMissingTableInputs = useMemo(() => {
        if (recipientType !== "mass" || massOption !== "group" || groupTableRows.length === 0) {
            return false;
        }
        return groupTableRows.some(row => !row.tokenAmount.trim() && !row.usdAmount.trim());
    }, [recipientType, massOption, groupTableRows]);

    useEffect(() => {
        const stepsOrder = ["source", "recipient", "review"];
        const currentStepIndex = stepsOrder.indexOf(currentStep);
        const previousStepIndex = stepsOrder.indexOf(previousStepRef.current);

        if (scrollContainerRef.current) {
            requestAnimationFrame(() => {
                if (currentStepIndex < previousStepIndex) {
                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                } else if (currentStepIndex > previousStepIndex && currentStep === "review") {
                    scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: "smooth" });
                }
            });
        }

        previousStepRef.current = currentStep;
    }, [currentStep]);

    // Fetch real API data for groups and address book members
    const { groups: apiGroups } = useGroups();
    const { addresses: apiAddresses } = useAddresses();

    const groupsList = useMemo(() => {
        if (Array.isArray(apiGroups) && apiGroups.length > 0) {
            return apiGroups.map((g: any) => ({
                id: String(g.id),
                name: g.name,
                count: typeof g.count === "number" ? g.count : (Array.isArray(g.addressIds) ? g.addressIds.length : 4),
            }));
        }
        return [
            { id: "g1", name: "Core Contributors", count: 8 },
            { id: "g2", name: "Dev Team", count: 12 },
            { id: "g3", name: "Design Guild", count: 5 },
            { id: "g4", name: "Marketing Ops", count: 4 },
            { id: "g5", name: "Advisors & Investors", count: 3 },
        ];
    }, [apiGroups]);

    // Step 3 Review State
    const [classificationsList, setClassificationsList] = useState<string[]>([
        "Payroll",
        "Operations",
        "Vendor Payment",
        "Grant",
        "Treasury Management",
        "Marketing",
        "Advisory",
        "Legal & Compliance",
    ]);
    const [comment, setComment] = useState("");
    const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
    const [classificationOpen, setClassificationOpen] = useState(false);
    const [classificationQuery, setClassificationQuery] = useState("");
    const classificationInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (classificationOpen && classificationInputRef.current) {
            const timer = setTimeout(() => {
                classificationInputRef.current?.focus();
            }, 30);
            return () => clearTimeout(timer);
        }
    }, [classificationOpen]);

    const filteredClassifications = useMemo(() => {
        if (!classificationQuery.trim()) return classificationsList;
        return classificationsList.filter(c =>
            c.toLowerCase().includes(classificationQuery.trim().toLowerCase())
        );
    }, [classificationsList, classificationQuery]);

    const showCreateOption = useMemo(() => {
        const query = classificationQuery.trim().toLowerCase();
        if (!query) return false;
        return !classificationsList.some(c => c.toLowerCase() === query);
    }, [classificationsList, classificationQuery]);

    // Success state & auto-close countdown timer
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSubmitted) {
            setCountdown(5);
            timer = setInterval(() => {
                setCountdown((prev) => Math.max(0, prev - 1));
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isSubmitted]);

    useEffect(() => {
        if (isSubmitted && countdown === 0) {
            onClose?.();
        }
    }, [isSubmitted, countdown, onClose]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                groupSearchContainerRef.current &&
                !groupSearchContainerRef.current.contains(event.target as Node)
            ) {
                setGroupDropdownOpen(false);
            }
        }
        if (groupDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [groupDropdownOpen]);

    const totalUniqueAddresses = useMemo(() => {
        return groupTableRows.length;
    }, [groupTableRows]);

    useEffect(() => {
        // Map from normalized address to recipient record
        const addressMap = new Map<string, {
            id: string;
            name: string;
            groupNames: Set<string>;
            address: string;
        }>();

        selectedGroupIds.forEach((groupId) => {
            const groupObj = groupsList.find(g => String(g.id) === String(groupId));
            const groupName = groupObj ? groupObj.name : "Group";
            const targetCount = groupObj?.count || 4;

            // Find matching address records directly from API addresses for this group
            const apiGroupAddrs = Array.isArray(apiAddresses)
                ? apiAddresses.filter((addr: any) =>
                    Array.isArray(addr.groups) && addr.groups.some((g: any) =>
                        String(g.groupId) === String(groupId) ||
                        String(g.id) === String(groupId) ||
                        (g.groupName && g.groupName.toLowerCase() === groupName.toLowerCase()) ||
                        (g.name && g.name.toLowerCase() === groupName.toLowerCase())
                    )
                )
                : [];

            // Helper to register an address in addressMap
            const registerAddress = (rawAddr: string, name: string, id: string) => {
                if (!rawAddr) return;
                const normAddr = rawAddr.toLowerCase();

                if (addressMap.has(normAddr)) {
                    // Already exists in table: add this group's name to groupNames Set
                    const existing = addressMap.get(normAddr)!;
                    existing.groupNames.add(groupName);
                } else {
                    // New address: create record
                    addressMap.set(normAddr, {
                        id,
                        name,
                        groupNames: new Set([groupName]),
                        address: rawAddr,
                    });
                }
            };

            // 1. Process matching API addresses
            apiGroupAddrs.forEach((m: any, idx: number) => {
                const rawAddr = m.walletHash || m.address;
                registerAddress(rawAddr, m.name || `Member ${idx + 1}`, `${groupId}-${m.id || idx}`);
            });

            // 2. Fill remaining group members up to targetCount if API data has fewer items
            const currentGroupMemberCount = Array.from(addressMap.values()).filter(item => item.groupNames.has(groupName)).length;
            if (currentGroupMemberCount < targetCount) {
                const remainingNeeded = targetCount - currentGroupMemberCount;
                const availableAddrs = Array.isArray(apiAddresses) && apiAddresses.length > 0 ? apiAddresses : [];

                for (let idx = 0; idx < remainingNeeded; idx++) {
                    const memberNum = currentGroupMemberCount + idx + 1;
                    const baseItem = availableAddrs[idx % Math.max(1, availableAddrs.length)];

                    // Shared members (member 1 and 2 share common address pattern across groups to illustrate A ∩ B)
                    // Non-shared members generate group-unique addresses (to illustrate A \ B and B \ A)
                    const isSharedMember = memberNum <= 2;
                    const hashGroupSuffix = isSharedMember
                        ? "0000"
                        : String(groupId).replace(/[^a-zA-Z0-9]/g, "").padStart(4, "0").slice(0, 4);

                    const hexIndex = memberNum.toString(16).padStart(2, "0");
                    const rawAddr = baseItem?.walletHash
                        ? `${baseItem.walletHash.slice(0, 6)}${hashGroupSuffix}${hexIndex}${baseItem.walletHash.slice(12)}`
                        : `0x56A4${hashGroupSuffix}${hexIndex}b83EE41Dfaca37eD50edCCbf22F9185C29D5C29D`;

                    const memberName = baseItem?.name ? `${baseItem.name}` : `Member ${memberNum}`;
                    registerAddress(rawAddr, memberName, `${groupId}-fill-${idx}`);
                }
            }
        });

        // Convert addressMap to table rows with combined group names (e.g. "Group A + Group B")
        const rows = Array.from(addressMap.values()).map(item => ({
            id: item.id,
            name: item.name,
            groupName: Array.from(item.groupNames).join(" + "),
            address: item.address,
            tokenAmount: "",
            usdAmount: "",
        }));

        setGroupTableRows(rows);
    }, [selectedGroupIds, groupsList, apiAddresses]);

    const renderFormattedAddress = (addr: string) => {
        if (!addr || addr.length < 12) return addr;
        const first = addr.slice(0, 6);
        const middle = addr.slice(6, -5);
        const last = addr.slice(-5);
        return (
            <span className="font-mono text-xs text-white/70 tracking-tight">
                <span className="font-bold text-white">{first}</span>
                <span>{middle}</span>
                <span className="font-bold text-white">{last}</span>
            </span>
        );
    };

    // Pay to few Form State (supports max 5 recipients)
    const [recipients, setRecipients] = useState<Array<{
        id: string;
        address: string;
        tokenAmount: string;
        usdAmount: string;
        activeAmountMode: "tokens" | "usd" | null;
    }>>([
        { id: "1", address: "", tokenAmount: "", usdAmount: "", activeAmountMode: null }
    ]);

    const assetPrice = useMemo(() => {
        if (selectedAsset && typeof selectedAsset.price === "number" && selectedAsset.price > 0) {
            return selectedAsset.price;
        }
        const sym = (selectedAsset?.symbol || "ETH").toUpperCase();
        if (sym === "ETH") return 3000;
        if (sym === "SOL") return 150;
        if (sym === "MATIC") return 0.7;
        return 1;
    }, [selectedAsset]);

    const handleTableTokenChange = (rowId: string, val: string) => {
        const num = parseFloat(val);
        const calcUsd = !isNaN(num) && num >= 0 ? (num * assetPrice).toFixed(2) : "";

        setGroupTableRows(prev => prev.map(r => {
            if (r.id !== rowId) return r;
            if (!val) return { ...r, tokenAmount: "", usdAmount: "" };
            return { ...r, tokenAmount: val, usdAmount: calcUsd };
        }));

        if (!hasShownBatchTooltip) {
            if (val.trim() !== "" && !isNaN(num) && num > 0) {
                setBatchTooltipInfo({ rowId, tokenVal: val, usdVal: calcUsd });
            } else if (batchTooltipInfo?.rowId === rowId && !val.trim()) {
                setBatchTooltipInfo(null);
            }
        }
    };

    const handleTableUsdChange = (rowId: string, val: string) => {
        const num = parseFloat(val);
        const calcTokens = !isNaN(num) && num >= 0 && assetPrice > 0 ? (num / assetPrice).toFixed(4) : "";

        setGroupTableRows(prev => prev.map(r => {
            if (r.id !== rowId) return r;
            if (!val) return { ...r, tokenAmount: "", usdAmount: "" };
            return { ...r, usdAmount: val, tokenAmount: calcTokens };
        }));

        if (!hasShownBatchTooltip) {
            if (val.trim() !== "" && !isNaN(num) && num > 0) {
                setBatchTooltipInfo({ rowId, tokenVal: calcTokens, usdVal: val });
            } else if (batchTooltipInfo?.rowId === rowId && !val.trim()) {
                setBatchTooltipInfo(null);
            }
        }
    };

    const handleApplyToAllRecipients = () => {
        if (!batchTooltipInfo) return;
        const { tokenVal, usdVal } = batchTooltipInfo;
        setGroupTableRows(prev => prev.map(r => ({
            ...r,
            tokenAmount: tokenVal,
            usdAmount: usdVal,
        })));
        setBatchTooltipInfo(null);
        setHasShownBatchTooltip(true);
    };

    const handleDismissBatchTooltip = () => {
        setBatchTooltipInfo(null);
        setHasShownBatchTooltip(true);
    };

    const handleRemoveTableRow = (rowId: string) => {
        setGroupTableRows(prev => prev.filter(r => r.id !== rowId));
    };

    const handleTableKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            const inputs = Array.from(tableContainerRef.current?.querySelectorAll<HTMLInputElement>("input:not([disabled])") || []);
            const currentIndex = inputs.indexOf(e.currentTarget);
            if (currentIndex !== -1) {
                if (!e.shiftKey && currentIndex < inputs.length - 1) {
                    e.preventDefault();
                    inputs[currentIndex + 1].focus();
                } else if (e.shiftKey && currentIndex > 0) {
                    e.preventDefault();
                    inputs[currentIndex - 1].focus();
                }
            }
        }
    };

    const handleAddRecipient = () => {
        if (recipients.length >= 5) return;
        setRecipients(prev => [
            ...prev,
            { id: String(Date.now()), address: "", tokenAmount: "", usdAmount: "", activeAmountMode: null }
        ]);
    };

    const handleRemoveRecipient = (id: string) => {
        if (recipients.length <= 1) return;
        setRecipients(prev => prev.filter(r => r.id !== id));
    };

    const handleAddressChange = (id: string, address: string) => {
        setRecipients(prev => prev.map(r => r.id === id ? { ...r, address } : r));
    };

    const handleRowTokenChange = (id: string, val: string) => {
        setRecipients(prev => prev.map(r => {
            if (r.id !== id) return r;
            if (!val) {
                return { ...r, tokenAmount: "", usdAmount: "", activeAmountMode: null };
            }
            const num = parseFloat(val);
            const calcUsd = !isNaN(num) && num >= 0 ? (num * assetPrice).toFixed(2) : "";
            return {
                ...r,
                tokenAmount: val,
                usdAmount: calcUsd,
                activeAmountMode: "tokens",
            };
        }));
    };

    const handleRowUsdChange = (id: string, val: string) => {
        setRecipients(prev => prev.map(r => {
            if (r.id !== id) return r;
            if (!val) {
                return { ...r, tokenAmount: "", usdAmount: "", activeAmountMode: null };
            }
            const num = parseFloat(val);
            const calcTokens = !isNaN(num) && num >= 0 && assetPrice > 0 ? (num / assetPrice).toFixed(4) : "";
            return {
                ...r,
                usdAmount: val,
                tokenAmount: calcTokens,
                activeAmountMode: "usd",
            };
        }));
    };

    const setRowActiveMode = (id: string, mode: "tokens" | "usd" | null) => {
        setRecipients(prev => prev.map(r => r.id === id ? { ...r, activeAmountMode: mode } : r));
    };

    const USER_PRESETS: Record<string, string> = {
        "Delanoy Kunil": "Sunset",
        "Elena Rostova": "Deep Sea",
        "Marcus Vance": "Cyan Dusk",
        "Aria Tanaka": "Ember",
        "Viktor Draganov": "Midnight",
        "Sarah Jenkins": "Sunset",
    };

    const getPresetForUser = (name: string) => {
        return USER_PRESETS[name] || "Cyan Dusk";
    };

    const capitalizeFirstLetter = (str: string): string => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const MOCK_GAS_FEES: Record<string, { amount: string; symbol: string }> = {
        ethereum: { amount: "0.0008", symbol: "ETH" },
        eth: { amount: "0.0008", symbol: "ETH" },
        polygon: { amount: "0.0150", symbol: "MATIC" },
        matic: { amount: "0.0150", symbol: "MATIC" },
        gnosis: { amount: "0.0100", symbol: "xDAI" },
        arbitrum: { amount: "0.0001", symbol: "ETH" },
        optimism: { amount: "0.0001", symbol: "ETH" },
        base: { amount: "0.00005", symbol: "ETH" },
        solana: { amount: "0.00005", symbol: "SOL" },
    };

    const getMockGasFee = (networkName: string | null): string | undefined => {
        if (!networkName) return undefined;
        const key = networkName.toLowerCase();
        const feeInfo = MOCK_GAS_FEES[key] || { amount: "0.0005", symbol: "ETH" };
        return `Gas: ${feeInfo.amount} ${feeInfo.symbol}`;
    };

    const formatAssetUSD = (asset: any): string => {
        if (!asset) return "";
        const usd = typeof asset.USD === "number" ? asset.USD : (asset.tokens && asset.price ? asset.tokens * asset.price : 0);
        return `$${formatDollars(usd)}.${formatCents(usd)}`;
    };

    const getThresholdDesc = (w: WalletSummary | Wallet) => {
        const item = w as any;
        if (!item) return "";
        if (item.confirmations) {
            const match = String(item.confirmations).match(/(\d+)\s+(?:out\s+of|of)\s+(\d+)/i);
            if (match) return `${match[1]}/${match[2]}`;
            return String(item.confirmations);
        }
        const threshold = item.threshold ?? 1;
        let totalSigners = 0;
        if (Array.isArray(item.members)) totalSigners = item.members.length;
        else if (Array.isArray(item.owners)) totalSigners = item.owners.length;
        else if (typeof item.memberCount === "number") totalSigners = item.memberCount;

        if (threshold && totalSigners > 0) return `${threshold}/${totalSigners}`;
        return `${threshold}`;
    };

    const getBalanceDesc = (w: WalletSummary | Wallet) => {
        const item = w as any;
        if (!item) return "$0.00";
        let total = 0;
        if (typeof item.USDBalance === "number" && item.USDBalance > 0) {
            total = item.USDBalance;
        } else if (typeof item.totalBalance === "number" && item.totalBalance > 0) {
            total = item.totalBalance;
        } else if (Array.isArray(item.balance) && item.balance.length > 0) {
            total = item.balance.reduce((sum: number, it: any) => sum + (it.USD || 0), 0);
        }
        return `$${formatDollars(total)}.${formatCents(total)}`;
    };

    const supportedNetworks = useMemo(() => {
        let baseNetworks: string[] = ["Ethereum"];
        if (selectedWallet.blockchain) {
            if (Array.isArray(selectedWallet.blockchain)) {
                baseNetworks = selectedWallet.blockchain.map((b: any) => typeof b === 'string' ? b : b.blockchain).filter(Boolean);
            } else if (typeof selectedWallet.blockchain === 'string') {
                baseNetworks = [selectedWallet.blockchain];
            }
        }

        const w = selectedWallet as any;
        const allowedNetworksStr = w.allowedNetworks || "";
        const blockedNetworksStr = w.blockedNetworks || "";

        const allowed = allowedNetworksStr ? allowedNetworksStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
        const blocked = blockedNetworksStr ? blockedNetworksStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [];

        let result = baseNetworks;
        if (allowed.length > 0) {
            result = result.filter(n => allowed.includes(n));
        }
        if (blocked.length > 0) {
            result = result.filter(n => !blocked.includes(n));
        }

        return result;
    }, [selectedWallet]);

    const availableAssets = useMemo(() => {
        const w = selectedWallet as any;
        const rawBalance = selectedWallet.balance || w.assets || w.tokens || w.balances || [];

        // Fallback default assets if wallet balance array is empty or undefined
        const fallbackAssets = [
            { uniqueId: `${selectedWallet.id}-1`, assetId: 1, symbol: "ETH", name: "Ethereum", fullName: "Ethereum", tokens: 2.5, USD: 7500, price: 3000 },
            { uniqueId: `${selectedWallet.id}-2`, assetId: 2, symbol: "USDC", name: "USD Coin", fullName: "USD Coin", tokens: 5000, USD: 5000, price: 1 },
            { uniqueId: `${selectedWallet.id}-3`, assetId: 3, symbol: "USDT", name: "Tether", fullName: "Tether USD", tokens: 2400, USD: 2400, price: 1 },
        ];

        const baseAssets = Array.isArray(rawBalance) && rawBalance.length > 0 ? rawBalance : fallbackAssets;

        const allowedAssets = w.allowedAssets || [];
        const blockedAssets = w.blockedAssets || [];

        let result = baseAssets;

        if (Array.isArray(allowedAssets) && allowedAssets.length > 0) {
            const allowedIds = new Set(allowedAssets.map((a: any) => typeof a === 'number' ? a : (a?.assetId ?? a?.id)));
            const allowedSymbols = new Set(allowedAssets.map((a: any) => typeof a === 'string' ? a.toUpperCase() : a?.symbol?.toUpperCase()).filter(Boolean));

            result = result.filter((a: any) => {
                const id = a?.assetId ?? a?.id;
                const sym = a?.symbol?.toUpperCase();
                if (id !== undefined && allowedIds.has(Number(id))) return true;
                if (sym && allowedSymbols.has(sym)) return true;
                return false;
            });
        }

        if (Array.isArray(blockedAssets) && blockedAssets.length > 0) {
            const blockedIds = new Set(blockedAssets.map((a: any) => typeof a === 'number' ? a : (a?.assetId ?? a?.id)));
            const blockedSymbols = new Set(blockedAssets.map((a: any) => typeof a === 'string' ? a.toUpperCase() : a?.symbol?.toUpperCase()).filter(Boolean));

            result = result.filter((a: any) => {
                const id = a?.assetId ?? a?.id;
                const sym = a?.symbol?.toUpperCase();
                if (id !== undefined && blockedIds.has(Number(id))) return true;
                if (sym && blockedSymbols.has(sym)) return true;
                return true;
            });
        }

        return result.length > 0 ? result : baseAssets;
    }, [selectedWallet]);

    const approversList = useMemo(() => {
        const w = selectedWallet as any;
        if (!w) return [];

        const memberPool = (members && members.length > 0) ? members : DEFAULT_MEMBERS;
        let list: { id: number | string; name: string; email?: string }[] = [];

        if (Array.isArray(w.members) && w.members.length > 0) {
            list = w.members.map((m: any, idx: number) => {
                const targetId = typeof m === "number" ? m : (m?.memberId ?? m?.id);
                const found = memberPool.find(mem => mem.id === targetId || Number(mem.id) === Number(targetId));
                if (found) return { id: found.id, name: found.name, email: found.email };

                if (typeof m === "string") {
                    const foundByName = memberPool.find(mem => mem.name.toLowerCase() === m.toLowerCase());
                    return foundByName ? { id: foundByName.id, name: foundByName.name, email: foundByName.email } : { id: idx, name: m };
                }

                if (m?.name) return { id: m.id || idx, name: m.name, email: m.email };

                const fallbackMember = memberPool[idx % memberPool.length];
                return {
                    id: targetId || fallbackMember.id,
                    name: fallbackMember.name,
                    email: fallbackMember.email,
                };
            });
        } else if (Array.isArray(w.owners) && w.owners.length > 0) {
            list = w.owners.map((o: any, idx: number) => {
                if (typeof o === "string") {
                    const found = memberPool.find(mem => mem.name.toLowerCase() === o.toLowerCase());
                    return found ? { id: found.id, name: found.name, email: found.email } : { id: idx, name: o };
                }
                const targetId = o?.memberId ?? o?.id;
                const found = memberPool.find(mem => mem.id === targetId || Number(mem.id) === Number(targetId));
                return found
                    ? { id: found.id, name: found.name, email: found.email }
                    : { id: o.id || idx, name: o.name || memberPool[idx % memberPool.length]?.name };
            });
        } else if (Array.isArray(w.approvers) && w.approvers.length > 0) {
            list = w.approvers.map((a: any, idx: number) => {
                if (typeof a === "string") {
                    const found = memberPool.find(mem => mem.name.toLowerCase() === a.toLowerCase());
                    return found ? { id: found.id, name: found.name, email: found.email } : { id: idx, name: a };
                }
                const targetId = a?.memberId ?? a?.id;
                const found = memberPool.find(mem => mem.id === targetId || Number(mem.id) === Number(targetId));
                return found
                    ? { id: found.id, name: found.name, email: found.email }
                    : { id: a.id || idx, name: a.name || memberPool[idx % memberPool.length]?.name };
            });
        }

        if (list.length === 0) {
            const count = Math.min(w.threshold || 3, memberPool.length);
            list = memberPool.slice(0, Math.max(1, count));
        }

        return list;
    }, [selectedWallet, members]);

    const walletThresholdDescription = useMemo(() => {
        return getThresholdDesc(selectedWallet);
    }, [selectedWallet]);

    const walletAvailableBalance = useMemo(() => {
        return getBalanceDesc(selectedWallet);
    }, [selectedWallet]);

    const walletPolicyLimit = useMemo(() => {
        if (!selectedWallet) return null;
        const w = selectedWallet as any;
        const limit = w.transactionLimit ?? w.policy?.transactionLimit ?? w.limitPerTransaction ?? w.policy?.limitPerTransaction ?? w.policyLimit;
        if (typeof limit === "number" && limit > 0) {
            return `$${limit.toLocaleString("en-US")}`;
        }
        if (typeof limit === "string" && limit.trim() !== "") {
            const num = parseFloat(limit.replace(/[^0-9.]/g, ""));
            if (!isNaN(num) && num > 0) {
                return `$${num.toLocaleString("en-US")}`;
            }
            return limit;
        }
        return null;
    }, [selectedWallet]);

    const { escStage, isTopModal } = useModalContext();
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    const modalRef = useRef<HTMLDivElement | null>(null);

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

    const getStepText = (step: StepState) => {
        if (step === "source") return "Source";
        if (step === "recipient") return "Recipient";
        return "Review";
    };

    const getStepStatus = (step: StepState) => {
        const currentStepIndex = steps.indexOf(currentStep);
        const stepIndex = steps.indexOf(step);

        if (stepIndex < currentStepIndex) return "completed";
        if (stepIndex === currentStepIndex) return "active";
        return "upcoming";
    };

    return (
        <motion.div
            ref={modalRef as React.RefObject<HTMLDivElement>}
            tabIndex={-1}
            layout={isSubmitted ? true : false}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className={cn(
                "rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] backdrop-blur-xl outline-none shadow-2xl",
                isSubmitted
                    ? `${MODAL_WIDTH.standard} p-6 flex flex-col gap-6`
                    : `flex flex-col lg:flex-row ${MODAL_WIDTH.wide} p-4 items-start gap-[30px]`
            )}
            aria-live="polite"
            role="status"
        >
            {isSubmitted ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col w-full gap-6 select-none"
                >
                    {/* Top-left Icon Badge */}
                    <div className="flex p-3 items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-text-brand)]/[0.08] border border-[var(--color-text-brand)]/[0.16] text-[var(--color-text-brand)] shrink-0">
                        <RiSendPlaneFill size={22} />
                    </div>

                    {/* Title & Subtext */}
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="text-white text-2xl font-medium tracking-tight">
                            Transfer proposed
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] flex-wrap">
                            <span className="shrink-0">{renderWalletIcon(selectedWallet.type, 16)}</span>
                            <span className="font-medium text-white">{selectedWallet.name}</span>
                            <span className="text-[var(--color-text-muted)] text-xs font-mono">
                                {getThresholdDesc(selectedWallet)}
                            </span>
                            <span>wallet approvers will be notified.</span>
                        </div>

                        {recipientType === "mass" && massOption === "csv" && (
                            <p className="text-sm font-medium text-white pt-2">
                                Do you want to save these addresses to your address book?
                            </p>
                        )}
                    </div>

                    {/* Bottom Row: Countdown + Action Buttons */}
                    <div className="flex justify-between items-center gap-4 w-full pt-4 border-t border-[var(--color-border-subtle)]">
                        <span className="text-xs text-[var(--color-text-muted)] tracking-tight">
                            Closing modal in {countdown}s
                        </span>
                        {recipientType === "mass" && massOption === "csv" ? (
                            <div className="flex items-center gap-3">
                                <Button
                                    size="md"
                                    variant="neutral"
                                    appearance="tonal"
                                    flat
                                    onClick={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    size="md"
                                    variant="brand"
                                    appearance="filled"
                                    flat
                                    onClick={onClose}
                                >
                                    Save addresses
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="md"
                                variant="neutral"
                                appearance="filled"
                                flat
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        )}
                    </div>
                </motion.div>
            ) : (
                <>
                    {/* Left sidebar - Steps */}
                    <div className="flex flex-row lg:flex-col w-full lg:w-[270px] lg:self-stretch gap-1.5 shrink-0 justify-between lg:justify-start border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-4 lg:pb-0 lg:pr-6">
                        {steps.map((step) => {
                            const status = getStepStatus(step);
                            const isActive = status === "active";
                            const isCompleted = status === "completed";

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
                                    <RiSendPlaneFill className="w-6 h-6 text-[var(--color-text-brand)]" />
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
                                    Propose transfer
                                </span>
                                <span className="text-[var(--color-text-muted)] text-sm tracking-tight leading-relaxed">
                                    Send tokens to one or more addresses.
                                </span>
                            </div>
                        </div>

                        {/* Scrollable body */}
                        <div ref={scrollContainerRef} className="flex flex-col items-start pt-6 pb-3 px-2 gap-6 self-stretch min-h-0 overflow-y-auto max-h-[calc(80vh-140px)]">
                            {/* Step 1 & Step 2 Content */}
                            <div className="flex flex-col w-full">

                                <div className="flex flex-col gap-6 w-full">
                                    {/* Row 1 */}
                                    <div className="flex w-full">
                                        <div className="w-1/2 pr-3 flex flex-col gap-2">
                                            <Dropdown
                                                disabled={currentStep !== "source"}
                                                open={sourceWalletOpen}
                                                onOpenChange={setSourceWalletOpen}
                                                label="Source wallet"
                                            >
                                                <DropdownTrigger
                                                    placeholder="Select source wallet"
                                                    label={selectedWallet.name ? capitalizeFirstLetter(selectedWallet.name) : undefined}
                                                    description={walletThresholdDescription}
                                                    trailingText={walletAvailableBalance}
                                                    trailingIconButton={<CopyQrButton wallet={selectedWallet} />}
                                                    leadingIcon={renderWalletIcon(selectedWallet.type)}
                                                />
                                                <DropdownMenu minWidth={240}>
                                                    {sourceWalletsList.map((w) => {
                                                        const isSel = w.id === selectedWallet.id;
                                                        return (
                                                            <DropdownItem
                                                                key={w.id}
                                                                icon={renderWalletIcon(w.type)}
                                                                description={getThresholdDesc(w)}
                                                                trailingText={getBalanceDesc(w)}
                                                                selected={isSel}
                                                                onSelect={() => {
                                                                    setSelectedWallet(w);
                                                                    setSelectedNetwork(null);
                                                                    setSelectedAsset(null);
                                                                    setSourceWalletOpen(false);
                                                                }}
                                                            >
                                                                {capitalizeFirstLetter(w.name)}
                                                            </DropdownItem>
                                                        );
                                                    })}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <div className="w-1/2 pl-3 flex flex-col gap-2">
                                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                                                Approvers ({approversList.length})
                                            </span>
                                            <div className="flex flex-wrap items-center gap-2 pt-1 min-h-[40px]">
                                                {approversList.map((approver, idx) => (
                                                    <Tooltip key={approver.id || idx} content={approver.email ? `${approver.name} (${approver.email})` : approver.name} placement="top">
                                                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 transition-colors cursor-default">
                                                            <Avatar
                                                                name={approver.name}
                                                                size="xs"
                                                                preset={getPresetForUser(approver.name)}
                                                            />
                                                            <span className="text-xs font-medium text-white truncate max-w-[110px]">
                                                                {approver.name}
                                                            </span>
                                                        </div>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="flex w-full">
                                        <div className="w-1/2 pr-3 flex flex-col gap-2">
                                            <Dropdown disabled={currentStep !== "source"} open={networkOpen} onOpenChange={setNetworkOpen} label="Blockchain network">
                                                <DropdownTrigger
                                                    placeholder="Select network to use"
                                                    label={selectedNetwork ? capitalizeFirstLetter(selectedNetwork) : undefined}
                                                    trailingText={getMockGasFee(selectedNetwork)}
                                                    leadingIcon={selectedNetwork ? <BlockchainIconStack blockchain={selectedNetwork} size={16} max={1} /> : undefined}
                                                />
                                                <DropdownMenu minWidth={200}>
                                                    {supportedNetworks.map(network => (
                                                        <DropdownItem
                                                            key={network}
                                                            icon={<BlockchainIconStack blockchain={network} size={16} max={1} />}
                                                            trailingText={getMockGasFee(network)}
                                                            selected={selectedNetwork === network}
                                                            onSelect={() => { setSelectedNetwork(network); setNetworkOpen(false); }}
                                                        >
                                                            {capitalizeFirstLetter(network)}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <div className="w-1/2 pl-3 flex flex-col gap-2">
                                            <Dropdown disabled={currentStep !== "source"} open={assetOpen} onOpenChange={setAssetOpen} label="Asset to send">
                                                <DropdownTrigger
                                                    placeholder="Assets"
                                                    label={selectedAsset ? capitalizeFirstLetter(selectedAsset.symbol || selectedAsset.name) : undefined}
                                                    trailingText={selectedAsset ? formatAssetUSD(selectedAsset) : undefined}
                                                    leadingIcon={selectedAsset?.symbol ? <i className={`cf cf-${selectedAsset.symbol.toLowerCase()} text-base text-[var(--color-text-primary)]`} /> : undefined}
                                                />
                                                <DropdownMenu minWidth={200}>
                                                    {availableAssets.map((asset: any) => (
                                                        <DropdownItem
                                                            key={asset.assetId || asset.uniqueId || asset.symbol}
                                                            icon={asset.symbol ? <i className={`cf cf-${asset.symbol.toLowerCase()} text-base text-[var(--color-text-primary)]`} /> : undefined}
                                                            trailingText={formatAssetUSD(asset)}
                                                            selected={selectedAsset?.assetId === asset.assetId}
                                                            onSelect={() => { setSelectedAsset(asset); setAssetOpen(false); }}
                                                        >
                                                            {capitalizeFirstLetter(asset.symbol || asset.name)}
                                                        </DropdownItem>
                                                    ))}
                                                    {availableAssets.length === 0 && (
                                                        <DropdownItem disabled>
                                                            No assets available
                                                        </DropdownItem>
                                                    )}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Button for Step 1 */}
                                {currentStep === "source" && (
                                    <div className="flex justify-end items-center self-stretch pt-6 border-t border-[var(--color-border-subtle)] mt-6">
                                        <Button
                                            size="md"
                                            variant="brand"
                                            appearance="filled"
                                            disabled={!selectedNetwork || !selectedAsset}
                                            onClick={() => setCurrentStep("recipient")}
                                            flat
                                        >
                                            Continue
                                        </Button>
                                    </div>
                                )}

                                {/* Step 2: Recipient Selection */}
                                {(currentStep === "recipient" || currentStep === "review") && (
                                    <div className="flex flex-col gap-6 w-full pt-6 border-t border-[var(--color-border-subtle)] mt-6">
                                        <div className="flex flex-col gap-3 w-full">
                                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                                                Number of recipients
                                            </span>
                                            <div className="flex w-full items-start">
                                                {/* Card 1: Pay to few */}
                                                <div className="w-1/2 pr-3 flex flex-col">
                                                    <div
                                                        className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 gap-3 relative w-full ${currentStep === "review" ? "opacity-70 pointer-events-none" : ""} ${recipientType === "few"
                                                            ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]/[0.03] cursor-default"
                                                            : "border-[var(--color-border-subtle)] bg-white/[0.02] cursor-pointer hover:border-white/20 hover:bg-white/[0.04]"
                                                            }`}
                                                        onClick={() => {
                                                            if (currentStep !== "review") setRecipientType("few");
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-center w-full min-h-[16px]">
                                                            <span className="text-white font-medium text-base">Pay to few</span>
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 shrink-0">
                                                                {recipientType === "few" && (
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-text-brand)] shadow-[0_0_8px_var(--color-text-brand)]" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="text-[var(--color-text-muted)] text-xs leading-relaxed">
                                                            Send tokens to a few recipients (5 or less)
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Card 2: Mass transfer */}
                                                <div className="w-1/2 pl-3 flex flex-col">
                                                    <div
                                                        className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 gap-3 relative w-full ${currentStep === "review" ? "opacity-70 pointer-events-none" : ""} ${recipientType === "mass"
                                                            ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]/[0.03] cursor-default"
                                                            : "border-[var(--color-border-subtle)] bg-white/[0.02] cursor-pointer hover:border-white/20 hover:bg-white/[0.04]"
                                                            }`}
                                                        onClick={() => {
                                                            if (currentStep !== "review") setRecipientType("mass");
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-center w-full min-h-[16px]">
                                                            <span className="text-white font-medium text-base">Mass transfer</span>
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 shrink-0">
                                                                {recipientType === "mass" && (
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-text-brand)] shadow-[0_0_8px_var(--color-text-brand)]" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="text-[var(--color-text-muted)] text-xs leading-relaxed">
                                                            Send tokens to a group or any number of recipients
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-[var(--color-text-muted)] mt-1">
                                                Choose number of recipients to proceed.
                                            </span>
                                        </div>

                                        {/* Form for "Pay to few" */}
                                        {recipientType === "few" && (
                                            <div className="flex flex-col gap-4 w-full pt-2 pb-2 px-2 animate-in fade-in duration-200 overflow-y-auto max-h-[380px]">
                                                {walletPolicyLimit && (
                                                    <div className="flex justify-end items-center w-full">
                                                        <span className="text-xs font-mono text-[var(--color-text-muted)]">
                                                            Limit per transaction: <strong className="text-white font-medium">{walletPolicyLimit}</strong>
                                                        </span>
                                                    </div>
                                                )}
                                                {recipients.map((row, idx) => (
                                                    <div key={row.id} className="flex w-full items-start gap-2 relative">
                                                        {/* Input 1: Address (Left half using TextInput atom) */}
                                                        <div className="w-1/2 pr-3">
                                                            <TextInput
                                                                disabled={currentStep === "review"}
                                                                label={recipients.length > 1 ? `Recipient ${idx + 1} Address` : "Address"}
                                                                placeholder="Search or paste address"
                                                                value={row.address}
                                                                onChange={(e) => handleAddressChange(row.id, e.target.value)}
                                                            />
                                                        </div>

                                                        {/* Input 2: Customized 2-in-1 Token/USD Input (Right half) */}
                                                        <div className="w-1/2 pl-3 flex flex-col gap-1.5">
                                                            <div className="flex justify-between items-center select-none">
                                                                <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                                                                    Token to send
                                                                </span>
                                                                {currentStep !== "review" && recipients.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveRecipient(row.id)}
                                                                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-danger)] transition-colors flex items-center gap-1"
                                                                        title="Remove recipient"
                                                                    >
                                                                        <RiDeleteBinLine size={13} />
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center w-full h-10 rounded-xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] hover:border-[var(--color-input-border-hover)] focus-within:border-[var(--color-input-border-focus)] focus-within:shadow-[0_0_0_2px_#0A0A0A,0_0_0_4px_rgba(38,201,201,0.50)] transition-all px-2">
                                                                {/* Left side: Icon + Eth + Tokens placeholder */}
                                                                <div
                                                                    className={`flex items-center flex-1 gap-2 min-w-0 pr-1 transition-opacity ${row.activeAmountMode === "usd" ? "cursor-pointer opacity-50" : ""
                                                                        }`}
                                                                    onClick={() => {
                                                                        if (currentStep !== "review" && row.activeAmountMode === "usd") {
                                                                            setRowActiveMode(row.id, "tokens");
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-1.5 pl-1 shrink-0">
                                                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 border border-white/15 shrink-0">
                                                                            {selectedAsset?.symbol ? (
                                                                                <i className={`cf cf-${selectedAsset.symbol.toLowerCase()} text-xs text-white`} />
                                                                            ) : (
                                                                                <RiSafeLine size={14} className="text-white" />
                                                                            )}
                                                                        </div>
                                                                        <span className="text-sm font-medium text-white shrink-0">
                                                                            {capitalizeFirstLetter(selectedAsset?.symbol || selectedAsset?.name || "Eth")}
                                                                        </span>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={row.tokenAmount}
                                                                        disabled={currentStep === "review" || row.activeAmountMode === "usd"}
                                                                        onFocus={() => {
                                                                            if (row.activeAmountMode === "usd") setRowActiveMode(row.id, "tokens");
                                                                        }}
                                                                        onChange={(e) => handleRowTokenChange(row.id, e.target.value)}
                                                                        placeholder="Tokens"
                                                                        className={`w-full bg-transparent text-sm outline-none px-1.5 ${row.activeAmountMode === "usd"
                                                                            ? "text-[var(--color-text-muted)] cursor-pointer"
                                                                            : "text-white placeholder:text-[var(--color-text-muted)] cursor-text"
                                                                            }`}
                                                                    />
                                                                </div>

                                                                {/* Vertical Divider Line */}
                                                                <div className="w-[1px] h-5 bg-white/15 shrink-0 mx-1" />

                                                                {/* Right side: USD placeholder + USD label */}
                                                                <div
                                                                    className={`flex items-center flex-1 gap-1.5 min-w-0 pl-1 pr-1.5 transition-opacity ${row.activeAmountMode === "tokens" ? "cursor-pointer opacity-50" : ""
                                                                        }`}
                                                                    onClick={() => {
                                                                        if (currentStep !== "review" && row.activeAmountMode === "tokens") {
                                                                            setRowActiveMode(row.id, "usd");
                                                                        }
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        value={row.usdAmount}
                                                                        disabled={currentStep === "review" || row.activeAmountMode === "tokens"}
                                                                        onFocus={() => {
                                                                            if (row.activeAmountMode === "tokens") setRowActiveMode(row.id, "usd");
                                                                        }}
                                                                        onChange={(e) => handleRowUsdChange(row.id, e.target.value)}
                                                                        placeholder="USD"
                                                                        className={`w-full bg-transparent text-sm outline-none px-1.5 text-right ${row.activeAmountMode === "tokens"
                                                                            ? "text-[var(--color-text-muted)] cursor-pointer"
                                                                            : "text-white placeholder:text-[var(--color-text-muted)] cursor-text"
                                                                            }`}
                                                                    />
                                                                    <span className={`text-xs font-medium shrink-0 ${row.activeAmountMode === "tokens" ? "text-[var(--color-text-muted)] opacity-50" : "text-white"
                                                                        }`}>
                                                                        USD
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add another recipient button */}
                                                {currentStep !== "review" && recipients.length < 5 && (
                                                    <div className="flex items-center">
                                                        <Button
                                                            size="sm"
                                                            variant="neutral"
                                                            appearance="tonal"
                                                            flat
                                                            onClick={handleAddRecipient}
                                                            leadingIcon={<RiAddLine size={16} />}
                                                        >
                                                            Add another recipient
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Form for "Mass transfer" */}
                                        {recipientType === "mass" && (
                                            <div className={`flex flex-col gap-4 w-full pt-2 animate-in fade-in duration-200 ${currentStep === "review" ? "opacity-70 pointer-events-none" : ""}`}>
                                                {/* Two Options Side-by-Side */}
                                                <div className="flex w-full items-start">
                                                    {/* Option 1: Transfer to group(s) */}
                                                    <div className="w-1/2 pr-3 flex flex-col">
                                                        <div
                                                            className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 gap-3 relative w-full ${massOption === "group"
                                                                ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]/[0.03] cursor-default"
                                                                : "border-[var(--color-border-subtle)] bg-white/[0.02] cursor-pointer hover:border-white/20 hover:bg-white/[0.04]"
                                                                }`}
                                                            onClick={() => {
                                                                if (currentStep !== "review" && massOption !== "group") {
                                                                    setMassOption("group");
                                                                    setTimeout(() => groupInputRef.current?.focus(), 50);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-center w-full min-h-[16px]">
                                                                <div className="flex items-center gap-2">
                                                                    <RiGroupLine size={18} className="text-[var(--color-text-secondary)]" />
                                                                    <span className="text-white font-medium text-base">Transfer to group(s)</span>
                                                                </div>
                                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 shrink-0">
                                                                    {massOption === "group" && (
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-text-brand)] shadow-[0_0_8px_var(--color-text-brand)]" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-[var(--color-text-muted)] text-xs leading-relaxed">
                                                                Select group(s) from address book. Supports up to 30 recipients
                                                            </span>

                                                            {/* Search Bar & Multiselect Dropdown when group option is selected */}
                                                            {massOption === "group" && (
                                                                <div className="flex flex-col gap-2 w-full pt-1 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                                                                    {/* Dedicated relative anchor wrapper for search bar + dropdown */}
                                                                    <div ref={groupSearchContainerRef} className="relative w-full">
                                                                        {/* Search Bar Input */}
                                                                        <div className="flex items-center w-full h-10 rounded-xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] focus-within:border-[var(--color-input-border-focus)] focus-within:shadow-[0_0_0_2px_#0A0A0A,0_0_0_4px_rgba(38,201,201,0.50)] transition-all px-3 gap-2">
                                                                            <RiSearchLine size={16} className="text-[var(--color-text-muted)] shrink-0" />
                                                                            <input
                                                                                ref={groupInputRef}
                                                                                type="text"
                                                                                disabled={currentStep === "review"}
                                                                                autoFocus
                                                                                value={groupSearchQuery}
                                                                                onFocus={() => {
                                                                                    if (currentStep !== "review") setGroupDropdownOpen(true);
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    setGroupSearchQuery(e.target.value);
                                                                                    setGroupDropdownOpen(true);
                                                                                }}
                                                                                placeholder="Search group to send"
                                                                                className="w-full bg-transparent text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none"
                                                                            />
                                                                            {groupSearchQuery && currentStep !== "review" && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setGroupSearchQuery("")}
                                                                                    className="text-white/40 hover:text-white"
                                                                                >
                                                                                    <RiCloseLine size={16} />
                                                                                </button>
                                                                            )}
                                                                        </div>

                                                                        {/* Multiselect Dropdown Menu fixed directly below Search Bar */}
                                                                        {groupDropdownOpen && currentStep !== "review" && (
                                                                            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-sunken)]/95 backdrop-blur-xl shadow-xl py-1 z-50 max-h-48 overflow-y-auto">
                                                                                {groupsList.filter(g => g.name.toLowerCase().includes(groupSearchQuery.toLowerCase())).map((group) => {
                                                                                    const isSelected = selectedGroupIds.includes(group.id);
                                                                                    return (
                                                                                        <div
                                                                                            key={group.id}
                                                                                            onClick={() => {
                                                                                                if (isSelected) {
                                                                                                    setSelectedGroupIds(prev => prev.filter(id => id !== group.id));
                                                                                                } else {
                                                                                                    setSelectedGroupIds(prev => [...prev, group.id]);
                                                                                                }
                                                                                            }}
                                                                                            className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${isSelected
                                                                                                ? "bg-[var(--color-control-tint-brand)] text-white font-medium"
                                                                                                : "text-white/80 hover:bg-white/5"
                                                                                                }`}
                                                                                        >
                                                                                            <div className="flex items-center gap-2">
                                                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]" : "border-white/20"
                                                                                                    }`}>
                                                                                                    {isSelected && <RiCheckLine size={12} className="text-white" />}
                                                                                                </div>
                                                                                                <span>{group.name}</span>
                                                                                            </div>
                                                                                            <span className="text-[var(--color-text-muted)] text-[11px]">
                                                                                                {group.count} members
                                                                                            </span>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                                {groupsList.filter(g => g.name.toLowerCase().includes(groupSearchQuery.toLowerCase())).length === 0 && (
                                                                                    <div className="px-3 py-2 text-xs text-[var(--color-text-muted)]">
                                                                                        No matching groups found
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Multiselect Selected Tag Pills & Unique Addresses Helper Text */}
                                                                    {selectedGroupIds.length > 0 && (
                                                                        <div className="flex flex-col gap-1.5 pt-1">
                                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                                {selectedGroupIds.map((id) => {
                                                                                    const group = groupsList.find((g) => String(g.id) === String(id));
                                                                                    if (!group) return null;
                                                                                    return (
                                                                                        <div
                                                                                            key={id}
                                                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-text-brand)]/15 border border-[var(--color-text-brand)]/30 text-white text-xs font-medium"
                                                                                        >
                                                                                            <RiGroupLine size={12} className="text-[var(--color-text-brand)] shrink-0" />
                                                                                            <span>{group.name}</span>
                                                                                            <span className="text-[var(--color-text-muted)] text-[11px] font-normal shrink-0">
                                                                                                ({group.count} addresses)
                                                                                            </span>
                                                                                            {currentStep !== "review" && (
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => setSelectedGroupIds(prev => prev.filter(gId => gId !== id))}
                                                                                                    className="text-white/60 hover:text-white ml-0.5"
                                                                                                >
                                                                                                    <RiCloseLine size={13} />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                            <span className="text-[var(--color-text-muted)] text-[11px] font-normal pt-0.5">
                                                                                {totalUniqueAddresses} unique addresses
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Option 2: Use a csv list (Pick & Drop Box aesthetic) */}
                                                    <div className="w-1/2 pl-3 flex flex-col">
                                                        <div
                                                            className={`flex flex-col p-4 rounded-2xl border border-dashed transition-all duration-200 gap-3 relative w-full ${massOption === "csv"
                                                                ? "border-[var(--color-text-brand)] bg-[var(--color-text-brand)]/[0.04]"
                                                                : "border-white/20 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                                                                }`}
                                                            onClick={() => {
                                                                if (currentStep !== "review") setMassOption("csv");
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-center w-full min-h-[16px]">
                                                                <div className="flex items-center gap-2">
                                                                    <RiUploadCloud2Line size={18} className="text-[var(--color-text-secondary)]" />
                                                                    <span className="text-white font-medium text-base">Use a csv list</span>
                                                                </div>
                                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 shrink-0">
                                                                    {massOption === "csv" && (
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-text-brand)] shadow-[0_0_8px_var(--color-text-brand)]" />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {massOption === "csv" && uploadedFileName ? (
                                                                /* Report UI matching attached reference image */
                                                                <div className="flex flex-col gap-3 w-full pt-1 animate-in fade-in duration-200">
                                                                    <div className="flex items-start justify-between gap-3 w-full">
                                                                        <div className="flex items-center gap-2.5">
                                                                            <RiFileTextLine size={24} className="text-white shrink-0" />
                                                                            <span className="text-sm font-semibold text-white">
                                                                                Report for {uploadedFileName}
                                                                            </span>
                                                                        </div>
                                                                        {currentStep !== "review" && (
                                                                            <IconButton
                                                                                icon={<RiDeleteBinFill size={15} />}
                                                                                size="sm"
                                                                                variant="neutral"
                                                                                hoverVariant="danger"
                                                                                appearance="ghost"
                                                                                flat
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setUploadedFileName(null);
                                                                                }}
                                                                                aria-label="Remove CSV file"
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    <p className="text-xs text-[var(--color-text-muted)]">
                                                                        Here is a summary of uploaded file
                                                                    </p>

                                                                    <div className="flex flex-col gap-2 text-xs pt-1">
                                                                        <div className="flex items-center">
                                                                            <span className="text-[var(--color-text-secondary)] min-w-[140px] font-sans">Records read:</span>
                                                                            <span className="text-white font-mono font-medium">500</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-[var(--color-text-secondary)] min-w-[140px] font-sans">Assets:</span>
                                                                            <span className="text-white font-mono font-medium">$35,016.02 in Eth</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-[#26C9C9] min-w-[140px] font-sans font-medium">Valid entries:</span>
                                                                            <span className="text-[#26C9C9] font-mono font-medium">413</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Red Error Inset Card */}
                                                                    <div className="p-3.5 rounded-xl border border-red-500/50 bg-red-950/20 flex flex-col gap-2 text-xs mt-1">
                                                                        <div className="flex items-center">
                                                                            <span className="text-white min-w-[150px] font-sans font-medium">Invalid addresses:</span>
                                                                            <span className="text-white font-mono font-medium">61</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-white min-w-[150px] font-sans font-medium">Invalid amount:</span>
                                                                            <span className="text-white font-mono font-medium">18</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-white min-w-[150px] font-sans font-medium">Missing amount:</span>
                                                                            <span className="text-white font-mono font-medium">8</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
                                                                        <label className={`inline-flex ${currentStep === "review" ? "cursor-default" : "cursor-pointer text-[var(--color-text-brand)] hover:underline"} font-medium focus:outline-none`}>
                                                                            Upload
                                                                            <input
                                                                                type="file"
                                                                                accept=".csv"
                                                                                disabled={currentStep === "review"}
                                                                                className="hidden"
                                                                                onChange={(e) => {
                                                                                    const file = e.target.files?.[0];
                                                                                    if (file) {
                                                                                        setUploadedFileName(file.name);
                                                                                        setMassOption("csv");
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </label>{" "}
                                                                        a .csv file with addresses and asset amounts against each. Supports any number of recipients.
                                                                    </p>

                                                                    {/* Next line of Description: Reverted Download sample button with leading info icon */}
                                                                    <div className="flex items-center pt-1">
                                                                        <Tooltip
                                                                            content={
                                                                                <div className="flex flex-col gap-1.5 p-1 max-w-[280px]">
                                                                                    <span className="text-xs font-semibold text-white">CSV Requirements:</span>
                                                                                    <ol className="list-decimal list-inside text-xs text-[var(--color-text-muted)] flex flex-col gap-1 leading-normal">
                                                                                        <li>Columns must be in the order: Address, Amount, Name (Optional).</li>
                                                                                        <li>First row will be ignored as header.</li>
                                                                                        <li>Zero value in amount will be ignored.</li>
                                                                                        <li>File size up to 5MB.</li>
                                                                                    </ol>
                                                                                </div>
                                                                            }
                                                                            placement="top"
                                                                        >
                                                                            <Button
                                                                                size="sm"
                                                                                variant="brand"
                                                                                appearance="ghost"
                                                                                flat
                                                                                leadingIcon={<RiInformationLine size={16} />}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    const element = document.createElement("a");
                                                                                    const file = new Blob([
                                                                                        "Address,Amount,Name\n0x1234567890abcdef1234567890abcdef12345678,1.5,Satoshi\n0xabcdef1234567890abcdef1234567890abcdef12,100,Alice"
                                                                                    ], { type: 'text/csv' });
                                                                                    element.href = URL.createObjectURL(file);
                                                                                    element.download = "sample_transfer_list.csv";
                                                                                    document.body.appendChild(element);
                                                                                    element.click();
                                                                                    document.body.removeChild(element);
                                                                                }}
                                                                            >
                                                                                Download sample
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Table for Mass Transfer -> Transfer to group(s) */}
                                                {massOption === "group" && selectedGroupIds.length > 0 && (
                                                    <div className="flex flex-col gap-3 w-full pt-4 animate-in fade-in duration-300">
                                                        {/* Title above table */}
                                                        <div className="flex justify-between items-center w-full">
                                                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                                                                Select asset type and add amount for each recipient
                                                            </span>
                                                            <span className="text-xs font-mono text-[var(--color-text-muted)]">
                                                                {walletPolicyLimit ? (
                                                                    <span>Limit per transaction: <strong className="text-white font-medium">{walletPolicyLimit}</strong></span>
                                                                ) : (
                                                                    <span>{groupTableRows.length} {groupTableRows.length === 1 ? "recipient" : "recipients"}</span>
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* Table container */}
                                                        <div
                                                            ref={tableContainerRef}
                                                            className="w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)]"
                                                        >
                                                            <div className="overflow-x-visible overflow-y-visible w-full">
                                                                <table className="w-full text-left border-collapse select-none">
                                                                    <thead className="bg-[var(--color-surface-sunken)] border-b border-white/10">
                                                                        <tr className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                                                                            <th className="py-2.5 px-3 w-10 text-center font-normal">#</th>
                                                                            <th className="py-2.5 px-3 min-w-[130px] font-normal">Name</th>
                                                                            <th className="py-2.5 px-3 min-w-[100px] font-normal">Group</th>
                                                                            <th className="py-2.5 px-3 min-w-[220px] font-normal">Address</th>
                                                                            <th className="py-2.5 px-3 min-w-[230px] font-normal">
                                                                                <div className="flex items-center w-full rounded-lg p-[2px] border border-white/10 bg-white/5 h-7">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setActiveTableMode("tokens")}
                                                                                        className={`flex-1 h-full flex items-center justify-center rounded text-[11px] font-semibold tracking-tight cursor-pointer transition-all border box-border leading-none ${activeTableMode === "tokens"
                                                                                            ? "bg-[color-mix(in_srgb,var(--color-text-brand)_25%,transparent)] border-[var(--color-text-brand)]/40 text-[var(--color-text-brand)] shadow-sm"
                                                                                            : "border-transparent text-white/60 hover:text-white"
                                                                                            }`}
                                                                                    >
                                                                                        {selectedAsset?.symbol ? selectedAsset.symbol.toUpperCase() : "Ether"}
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setActiveTableMode("usd")}
                                                                                        className={`flex-1 h-full flex items-center justify-center rounded text-[11px] font-semibold tracking-tight cursor-pointer transition-all border box-border leading-none ${activeTableMode === "usd"
                                                                                            ? "bg-[color-mix(in_srgb,var(--color-text-brand)_25%,transparent)] border-[var(--color-text-brand)]/40 text-[var(--color-text-brand)] shadow-sm"
                                                                                            : "border-transparent text-white/60 hover:text-white"
                                                                                            }`}
                                                                                    >
                                                                                        USD
                                                                                    </button>
                                                                                </div>
                                                                            </th>
                                                                            <th className="py-2.5 px-3 w-14 text-center font-normal">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-white/[0.06] text-xs">
                                                                        {groupTableRows.map((row, idx) => (
                                                                            <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                                                                                <td className="py-2 px-3 font-mono text-[var(--color-text-muted)] text-center text-[11px]">
                                                                                    {idx + 1}
                                                                                </td>
                                                                                <td className="py-2 px-3 font-medium text-white whitespace-nowrap text-xs">
                                                                                    {row.name}
                                                                                </td>
                                                                                <td className="py-2 px-3 text-[var(--color-text-muted)] whitespace-nowrap text-xs">
                                                                                    {row.groupName}
                                                                                </td>
                                                                                <td className="py-2 px-3 text-xs">
                                                                                    {renderFormattedAddress(row.address)}
                                                                                </td>
                                                                                <td className="py-2 px-3 relative">
                                                                                    {batchTooltipInfo?.rowId === row.id && (
                                                                                        <div className="absolute bottom-full mb-1.5 right-3 z-[100] flex flex-col gap-2 p-2.5 rounded-xl border border-white/20 bg-[#121316] text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-1 duration-200 select-none whitespace-nowrap">
                                                                                            <span className="text-xs font-medium leading-tight">
                                                                                                {activeTableMode === "tokens"
                                                                                                    ? `Apply ${selectedAsset?.symbol || "ETH"} ${batchTooltipInfo.tokenVal} to all recipients?`
                                                                                                    : `Apply $${batchTooltipInfo.usdVal} to all recipients?`}
                                                                                            </span>
                                                                                            <div className="flex items-center justify-end gap-1.5 w-full">
                                                                                                <IconButton
                                                                                                    icon={<RiCheckLine size={14} />}
                                                                                                    size="sm"
                                                                                                    variant="neutral"
                                                                                                    appearance="ghost"
                                                                                                    flat
                                                                                                    onClick={handleApplyToAllRecipients}
                                                                                                    aria-label="Apply to all recipients"
                                                                                                />
                                                                                                <IconButton
                                                                                                    icon={<RiCloseLine size={14} />}
                                                                                                    size="sm"
                                                                                                    variant="neutral"
                                                                                                    appearance="ghost"
                                                                                                    flat
                                                                                                    onClick={handleDismissBatchTooltip}
                                                                                                    aria-label="Dismiss tooltip"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    {(() => {
                                                                                        const isRowMissingValue = tableValidationAttempted && !row.tokenAmount.trim() && !row.usdAmount.trim();
                                                                                        return (
                                                                                            <div className={cn(
                                                                                                "flex items-center w-full h-8 rounded-lg border transition-all px-2 overflow-hidden",
                                                                                                isRowMissingValue
                                                                                                    ? "border-[var(--color-text-danger)] bg-[color-mix(in_srgb,var(--color-text-danger)_8%,transparent)]"
                                                                                                    : "border-[var(--color-input-border)] bg-[var(--color-input-bg)] focus-within:border-[var(--color-input-border-focus)]"
                                                                                            )}>
                                                                                                {/* Token cell */}
                                                                                                <div
                                                                                                    className={`flex items-center flex-1 min-w-0 pr-1 transition-opacity ${activeTableMode === "usd" ? "cursor-pointer opacity-50" : ""
                                                                                                        }`}
                                                                                                    onClick={() => {
                                                                                                        if (currentStep !== "review" && activeTableMode === "usd") setActiveTableMode("tokens");
                                                                                                    }}
                                                                                                >
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        value={row.tokenAmount}
                                                                                                        placeholder={`${selectedAsset?.symbol || "ETH"} amount`}
                                                                                                        disabled={activeTableMode === "usd" || currentStep === "review"}
                                                                                                        onChange={(e) => handleTableTokenChange(row.id, e.target.value)}
                                                                                                        onKeyDown={handleTableKeyDown}
                                                                                                        className={`w-full bg-transparent text-xs outline-none ${activeTableMode === "usd" ? "text-[var(--color-text-muted)]" : "text-white placeholder:text-[var(--color-text-muted)]"
                                                                                                            }`}
                                                                                                    />
                                                                                                </div>

                                                                                                <div className="w-[1px] h-3.5 bg-white/15 shrink-0 mx-1" />

                                                                                                {/* USD cell */}
                                                                                                <div
                                                                                                    className={`flex items-center flex-1 min-w-0 pl-1 transition-opacity ${activeTableMode === "tokens" ? "cursor-pointer opacity-50" : ""
                                                                                                        }`}
                                                                                                    onClick={() => {
                                                                                                        if (currentStep !== "review" && activeTableMode === "tokens") setActiveTableMode("usd");
                                                                                                    }}
                                                                                                >
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        value={row.usdAmount}
                                                                                                        placeholder="USD amount"
                                                                                                        disabled={activeTableMode === "tokens" || currentStep === "review"}
                                                                                                        onChange={(e) => handleTableUsdChange(row.id, e.target.value)}
                                                                                                        onKeyDown={handleTableKeyDown}
                                                                                                        className={`w-full bg-transparent text-xs outline-none text-right ${activeTableMode === "tokens" ? "text-[var(--color-text-muted)]" : "text-white placeholder:text-[var(--color-text-muted)]"
                                                                                                            }`}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })()}
                                                                                </td>
                                                                                <td className="py-2 px-3 text-center">
                                                                                    {currentStep !== "review" && (
                                                                                        <IconButton
                                                                                            icon={<RiDeleteBinLine size={15} />}
                                                                                            size="sm"
                                                                                            variant="neutral"
                                                                                            hoverVariant="danger"
                                                                                            appearance="ghost"
                                                                                            flat
                                                                                            tabIndex={-1}
                                                                                            onClick={() => handleRemoveTableRow(row.id)}
                                                                                            aria-label="Remove recipient"
                                                                                        />
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        {groupTableRows.length === 0 && (
                                                                            <tr>
                                                                                <td colSpan={6} className="py-6 text-center text-xs text-[var(--color-text-muted)]">
                                                                                    No recipients in selected group(s)
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {/* Helper text when missing inputs exist */}
                                                        {tableValidationAttempted && hasMissingTableInputs && (
                                                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-text-danger)]/40 bg-[color-mix(in_srgb,var(--color-text-danger)_10%,transparent)] text-[var(--color-text-danger)] text-xs font-medium mt-1">
                                                                <RiErrorWarningLine size={16} className="shrink-0" />
                                                                <span>Enter all values or remove address to continue</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Step 2 Action Buttons */}
                                        {currentStep === "recipient" && (
                                            <div className="flex justify-between items-center self-stretch pt-6 border-t border-[var(--color-border-subtle)] mt-6">
                                                <Button
                                                    size="md"
                                                    variant="neutral"
                                                    appearance="tonal"
                                                    onClick={() => setCurrentStep("source")}
                                                    leadingIcon={<RiArrowLeftSLine />}
                                                    flat
                                                >
                                                    Source
                                                </Button>
                                                <Button
                                                    size="md"
                                                    variant="brand"
                                                    appearance="filled"
                                                    disabled={!recipientType || (recipientType === "mass" && massOption === "group" && selectedGroupIds.length === 0)}
                                                    onClick={() => {
                                                        if (recipientType === "mass" && massOption === "group") {
                                                            if (hasMissingTableInputs) {
                                                                setTableValidationAttempted(true);
                                                                requestAnimationFrame(() => {
                                                                    tableContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                                                });
                                                                return;
                                                            }
                                                        }
                                                        setTableValidationAttempted(false);
                                                        setCurrentStep("review");
                                                    }}
                                                    flat
                                                >
                                                    Review
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Step 3: Review & Classification */}
                            {currentStep === "review" && (
                                <div className="flex flex-col gap-6 w-full pt-6 border-t border-[var(--color-border-subtle)] mt-6">
                                    {/* Line 1: Right-aligned Edit details button on right edge with trailing up arrow */}
                                    <div className="flex justify-end items-center w-full">
                                        <Button
                                            size="sm"
                                            variant="neutral"
                                            appearance="tonal"
                                            flat
                                            trailingIcon={<RiArrowUpLine size={16} />}
                                            onClick={() => setCurrentStep("recipient")}
                                        >
                                            Edit details
                                        </Button>
                                    </div>

                                    {/* Line 2: 12-column grid, 4 columns for Comment & 4 columns for Classification, right-aligned */}
                                    <div className="grid grid-cols-12 gap-3 w-full">
                                        {/* Input 1: Comment (Columns 5 to 8) */}
                                        <div className="col-start-5 col-span-4 flex flex-col">
                                            <TextInput
                                                label="Comment"
                                                placeholder="Add a note (optional)"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </div>

                                        {/* Input 2: Classification (Columns 9 to 12) */}
                                        <div className="col-span-4 flex flex-col">
                                            <Dropdown
                                                open={classificationOpen}
                                                onOpenChange={(v) => {
                                                    setClassificationOpen(v);
                                                    if (!v) setClassificationQuery("");
                                                }}
                                                label="Classification"
                                                required
                                            >
                                                <DropdownTrigger
                                                    placeholder="Select or create classification"
                                                    label={selectedClassification || undefined}
                                                    leadingIcon={<RiPriceTag3Line size={16} />}
                                                />
                                                <DropdownMenu minWidth={220} maxHeight={220} align="end">
                                                    {/* Search Bar Header */}
                                                    <div className="p-1.5 border-b border-[var(--color-border-subtle)]" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center w-full h-8 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] focus-within:border-[var(--color-input-border-focus)] px-2 gap-1.5">
                                                            <RiSearchLine size={14} className="text-[var(--color-text-muted)] shrink-0" />
                                                            <input
                                                                ref={classificationInputRef}
                                                                type="text"
                                                                value={classificationQuery}
                                                                onChange={(e) => setClassificationQuery(e.target.value)}
                                                                placeholder="Search or create..."
                                                                className="w-full bg-transparent text-xs text-white placeholder:text-[var(--color-text-muted)] outline-none"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter" && showCreateOption) {
                                                                        e.preventDefault();
                                                                        const newCat = classificationQuery.trim();
                                                                        if (newCat) {
                                                                            setClassificationsList(prev => [...prev, newCat]);
                                                                            setSelectedClassification(newCat);
                                                                            setClassificationOpen(false);
                                                                            setClassificationQuery("");
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            {classificationQuery && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setClassificationQuery("")}
                                                                    className="text-white/40 hover:text-white"
                                                                >
                                                                    <RiCloseLine size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Filtered Classifications & Create New Option */}
                                                    <div className="flex flex-col py-1">
                                                        {filteredClassifications.map((c) => (
                                                            <DropdownItem
                                                                key={c}
                                                                selected={selectedClassification === c}
                                                                onSelect={() => {
                                                                    setSelectedClassification(c);
                                                                    setClassificationOpen(false);
                                                                    setClassificationQuery("");
                                                                }}
                                                            >
                                                                {c}
                                                            </DropdownItem>
                                                        ))}

                                                        {showCreateOption && (
                                                            <DropdownItem
                                                                icon={<RiAddLine size={14} className="text-[var(--color-text-brand)]" />}
                                                                onSelect={() => {
                                                                    const newCat = classificationQuery.trim();
                                                                    if (newCat) {
                                                                        setClassificationsList(prev => [...prev, newCat]);
                                                                        setSelectedClassification(newCat);
                                                                        setClassificationOpen(false);
                                                                        setClassificationQuery("");
                                                                    }
                                                                }}
                                                            >
                                                                <span className="text-[var(--color-text-brand)] font-medium">
                                                                    Create "{classificationQuery.trim()}"
                                                                </span>
                                                            </DropdownItem>
                                                        )}

                                                        {filteredClassifications.length === 0 && !showCreateOption && (
                                                            <div className="px-3 py-2 text-xs text-[var(--color-text-muted)]">
                                                                No matching classification
                                                            </div>
                                                        )}
                                                    </div>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    {/* Line 3: Classify and submit button on right edge */}
                                    <div className="flex justify-end items-center self-stretch">
                                        <Button
                                            size="md"
                                            variant="brand"
                                            appearance="filled"
                                            disabled={!selectedClassification}
                                            onClick={() => {
                                                setIsSubmitted(true);
                                            }}
                                            flat
                                        >
                                            Classify and submit
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
}
