import React, { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSearch, DropdownCreateNew } from "@/components/atoms/Dropdown";
import { RiPencilLine, RiSearchLine, RiCloseLine } from "@remixicon/react";
import { RadioButton, RadioGroup } from "@/components/atoms/RadioButton";
import { TextInput } from "@/components/atoms/TextInput";
import { Wallet, MPCVaultWallet, GnosisSafeWallet, Member } from "../types";
import { Cryptocurrency } from '@/components/molecules/assets/types';
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { formatDollars } from '@/lib/formatters';
import { useOnboarding } from "@/lib/onboarding";

interface PolicyContentProps {
    wallet: Wallet;
    cryptocurrencies?: Cryptocurrency[];
    members?: Member[];
}

const AVATAR_PRESETS = [
    "Cyan Dusk", "Deep Sea", "Midnight", "Ember", "Sunset",
    "Rose Gold", "Emerald", "Aurora", "Neon", "Acid",
    "Chromatic", "Oil Slick", "Candy"
];

const SUPPORTED_NETWORKS = [
    "Ethereum", "Polygon", "Arbitrum", "Optimism",
    "Base", "Solana", "Bitcoin", "Avalanche", "BSC",
    "Tron", "Dogecoin", "Cardano", "Polkadot"
];

const getDaysAgo = (username: string) => {
    let hash = 0;
    if (username) {
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    return (Math.abs(hash) % 10) + 1;
};

const getPresetForUser = (username: string, member?: any) => {
    if (member?.avatarPreset) return member.avatarPreset;
    if (!username) return AVATAR_PRESETS[0];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_PRESETS.length;
    return AVATAR_PRESETS[index];
};

const NetworkListDisplay = ({ networks, isEditing, onRemove }: { networks: string | string[] | undefined, isEditing?: boolean, onRemove?: (network: string) => void }) => {
    if (!networks) return null;

    const arr = typeof networks === 'string' ? networks.split(',') : networks;
    if (arr.length === 0) return null;

    return (
        <div className="flex items-center justify-start gap-2 flex-wrap">
            {arr.map((item, index) => {
                const name = item.trim();
                if (!name) return null;
                return (
                    <div key={index} className="flex gap-2 items-center justify-center bg-white/[0.03] px-2 py-1 rounded-full border border-[var(--color-border-subtle)]">
                        <BlockchainIconStack blockchain={name} size={18} />
                        <div className="flex items-baseline gap-1.5 px-1">
                            <span className="text-[var(--color-text-primary)] text-sm not-italic font-medium leading-[normal] tracking-tight">{name}</span>
                        </div>
                        {isEditing && (
                            <button
                                type="button"
                                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-danger)] transition-colors p-0.5 rounded-full hover:bg-white/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove?.(name);
                                }}
                            >
                                <RiCloseLine size={14} />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const AssetListDisplay = ({ assets, isEditing, onRemove }: { assets: (Cryptocurrency & { assetId: number })[], isEditing?: boolean, onRemove?: (assetId: number) => void }) => {
    if (assets.length === 0) return null;

    return (
        <div className="flex items-center justify-start gap-2 flex-wrap">
            {assets.map((asset) => (
                <div key={asset.assetId} className="flex gap-2 items-center justify-center bg-white/[0.03] p-2 rounded-full border border-[var(--color-border-subtle)]">
                    <i className={`cf cf-${asset.symbol.toLowerCase()} text-lg`}></i>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[var(--color-text-primary)] text-sm not-italic font-medium leading-[normal] tracking-tight">{asset.name}</span>
                        <span className="text-[var(--color-text-muted)] text-[10px] not-italic font-normal leading-[normal] uppercase">{asset.symbol}</span>
                    </div>
                    {isEditing && (
                        <button
                            type="button"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-danger)] transition-colors p-0.5 rounded-full hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove?.(asset.assetId);
                            }}
                        >
                            <RiCloseLine size={14} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

const ApproverCard = memo(({ member, isCurrentUser, userPreset, userPins, onRemove, isEditing }: any) => {
    const [removing, setRemoving] = useState(false);
    return (
        <div className="flex items-center justify-between w-full p-2 hover:bg-white/5 rounded-lg transition-colors cursor-default gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-[12px] w-[200px] shrink-0">
                <div className="relative flex items-center justify-center">
                    <Avatar name={member.name} size="sm" preset={isCurrentUser ? userPreset : getPresetForUser(member.name, member)} pins={isCurrentUser ? (userPins || undefined) : undefined} />
                </div>
                <div className="flex flex-col items-start gap-[1px] min-w-0">
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px] truncate max-w-full">{member.name}</span>
                    <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.8px] opacity-70 truncate max-w-full">
                        {isCurrentUser ? "You" : (member.email || "el******@x.com")}
                    </span>
                </div>
            </div>
            <div className="flex-1 min-w-[120px]">
                <span className="text-[var(--color-text-muted)] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.8px] opacity-70">
                    {isCurrentUser ? "Active now" : `Active ${getDaysAgo(member.name)} days ago`}
                </span>
            </div>
            {isEditing && (
                <div className="shrink-0">
                    <Button
                        variant={removing ? "danger" : "neutral"}
                        appearance={removing ? "filled" : "outline"}
                        flat
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (removing) {
                                onRemove?.(member);
                            } else {
                                setRemoving(true);
                            }
                        }}
                    >
                        {removing ? "Confirm remove" : "Remove approver"}
                    </Button>
                </div>
            )}
        </div>
    );
});

const PolicyContent = memo(({ wallet, cryptocurrencies = [], members = [] }: PolicyContentProps) => {
    const { userName, userPreset, userPins } = useOnboarding();
    const [searchQuery, setSearchQuery] = useState("");
    const [approversOpen, setApproversOpen] = useState(false);
    const [additionalApprovers, setAdditionalApprovers] = useState<string[]>([]);
    const [removedApprovers, setRemovedApprovers] = useState<string[]>([]);
    const [editingSection, setEditingSection] = useState<string | null>(null);

    const isMPCVault = wallet.type === 1;
    const isGnosisSafe = wallet.type === 2;

    const transactionLimit = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).transactionLimit : undefined;
    const originalThreshold = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).threshold : undefined;
    const [localThreshold, setLocalThreshold] = useState<number | undefined>(originalThreshold);
    const [mockTransactionLimit, setMockTransactionLimit] = useState<number | undefined>(transactionLimit);
    const [localTransactionLimit, setLocalTransactionLimit] = useState<string>(transactionLimit ? transactionLimit.toString() : "");

    const blockedNetworks = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).blockedNetworks : undefined;
    const allowedNetworks = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).allowedNetworks : undefined;

    const initialBlockedNetworks = blockedNetworks ? (typeof blockedNetworks === 'string' ? blockedNetworks.split(',') : blockedNetworks) : [];
    const initialAllowedNetworks = allowedNetworks ? (typeof allowedNetworks === 'string' ? allowedNetworks.split(',') : allowedNetworks) : [];
    const [mockBlockedNetworks, setMockBlockedNetworks] = useState<string[]>(initialBlockedNetworks);
    const [mockAllowedNetworks, setMockAllowedNetworks] = useState<string[]>(initialAllowedNetworks);

    const [localNetworkType, setLocalNetworkType] = useState<"block" | "allow">("block");
    const [localNetworkList, setLocalNetworkList] = useState<string[]>([]);
    const [networkSearchQuery, setNetworkSearchQuery] = useState("");
    const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

    const blockedAssets = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).blockedAssets : undefined;
    const allowedAssets = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).allowedAssets : undefined;

    const initialBlockedAssets = blockedAssets || [];
    const initialAllowedAssets = allowedAssets || [];
    const [mockBlockedAssets, setMockBlockedAssets] = useState<{ assetId: number }[]>(initialBlockedAssets);
    const [mockAllowedAssets, setMockAllowedAssets] = useState<{ assetId: number }[]>(initialAllowedAssets);

    const [localAssetType, setLocalAssetType] = useState<"block" | "allow">("block");
    const [localAssetList, setLocalAssetList] = useState<{ assetId: number }[]>([]);
    const [assetSearchQuery, setAssetSearchQuery] = useState("");
    const [assetDropdownOpen, setAssetDropdownOpen] = useState(false);

    const supportedNetworksForWallet = useMemo(() => {
        if (isMPCVault) {
            return ["Ethereum", "BSC", "Polygon"];
        }
        if (isGnosisSafe) {
            if (Array.isArray(wallet.blockchain)) {
                return wallet.blockchain.map((b: any) => b.blockchain || b);
            } else if (typeof wallet.blockchain === 'string') {
                return [wallet.blockchain];
            }
        }
        return SUPPORTED_NETWORKS;
    }, [isMPCVault, isGnosisSafe, wallet.blockchain]);

    const filteredOptions = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        const baseOptions = members ? members.filter((m): m is Member => Boolean(m && typeof m === 'object')) : [];
        baseOptions.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));

        if (!query) return baseOptions;
        return baseOptions.filter(member =>
            (member?.name || '').toLowerCase().includes(query) ||
            (member?.email || "").toLowerCase().includes(query)
        );
    }, [members, searchQuery]);

    const walletMembers = useMemo(() => {
        if (isMPCVault || isGnosisSafe) {
            return (wallet as MPCVaultWallet | GnosisSafeWallet).members || [];
        }
        return [];
    }, [isMPCVault, isGnosisSafe, wallet]);

    const matchingMembers = useMemo(() => {
        return walletMembers.map(walletMember => {
            const fullMember = members.find(m => m.id === walletMember.memberId);
            return fullMember;
        }).filter((member): member is Member => member !== undefined);
    }, [walletMembers, members]);

    const getAssetDetailsByIds = (assetIds: { assetId: number }[], cryptocurrencies: Cryptocurrency[]): (Cryptocurrency & { assetId: number })[] => {
        if (!assetIds || !cryptocurrencies) return [];

        return assetIds
            .map(item => {
                const asset = cryptocurrencies.find(crypto => crypto.id === item.assetId);
                return asset ? { ...item, ...asset } : null;
            })
            .filter(Boolean) as (Cryptocurrency & { assetId: number })[];
    };

    const activeMatchingMembers = matchingMembers.filter(m => !removedApprovers.includes(m.id.toString()));
    const activeAdditionalApprovers = additionalApprovers.filter(a => !removedApprovers.includes(a));
    const totalApprovers = activeMatchingMembers.length + activeAdditionalApprovers.length;
    const displayThreshold = Math.min(localThreshold || 1, Math.max(totalApprovers, 1));

    const handleDiscard = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSection(null);
        setAdditionalApprovers([]);
        setRemovedApprovers([]);
        setLocalThreshold(originalThreshold);
    };

    const handleUpdate = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSection(null);
    };

    const blockedAssetDetails = useMemo(() =>
        getAssetDetailsByIds(mockBlockedAssets, cryptocurrencies),
        [mockBlockedAssets, cryptocurrencies]
    );

    const allowedAssetDetails = useMemo(() =>
        getAssetDetailsByIds(mockAllowedAssets, cryptocurrencies),
        [mockAllowedAssets, cryptocurrencies]
    );

    const localAssetDetails = useMemo(() =>
        getAssetDetailsByIds(localAssetList, cryptocurrencies),
        [localAssetList, cryptocurrencies]
    );

    const getNetworkSubheader = () => {
        if (typeof (blockedNetworks) != "undefined") {
            return "Blocked Networks";
        } else if (typeof (allowedNetworks) != "undefined") {
            return "Allowed Networks";
        } else {
            return "Create a block or allow only list for networks here.";
        }
    };

    const getAssetSubheader = () => {
        if (blockedAssets) {
            return "Blocked Assets";
        } else if (allowedAssets) {
            return "Allowed Assets";
        } else {
            return "Create a block or allow only list for assets here.";
        }
    };

    if (wallet.type === 3) {
        return (
            <div className="text-center py-16 text-[var(--color-text-muted)] border border-white/5 rounded-3xl mt-4 max-w-[1040px] mx-auto">
                Tracked wallets do not have configurable policies.
            </div>
        );
    }

    const getBlockClass = (section: string) => {
        const isEditingThis = editingSection === section;
        const isEditingOther = editingSection !== null && editingSection !== section;

        return `group/approver flex flex-col w-full max-w-[1040px] mx-auto pt-[32px] pb-[24px] px-[16px] gap-[24px] justify-center border-b border-[var(--color-border-subtle)] transition-all duration-200 relative cursor-pointer ${isEditingOther ? "opacity-60 pointer-events-none" : "hover:border-[var(--color-border-default)] hover:bg-[rgba(255,255,255,0.02)]"
            } ${isEditingThis ? "bg-[rgba(255,255,255,0.02)]" : ""}`;
    };

    const titleClass = "text-[var(--color-text-primary)] text-sm not-italic font-medium leading-[normal] tracking-tight";
    const subTitleClass = "text-[var(--color-text-muted)] text-sm not-italic font-normal leading-[normal] tracking-tight";

    const renderEditButton = (section: string) => {
        const isEditingThis = editingSection === section;
        const isEditingOther = editingSection !== null && editingSection !== section;

        if (isEditingOther) return null;

        return (
            <div className={`flex gap-[8px] items-center px-[8px] py-[4px] absolute right-[12px] top-[24px] transition-opacity rounded-md bg-white/5 ${isEditingThis ? "opacity-100 text-white cursor-pointer hover:bg-white/10" : "group-hover/approver:opacity-100 opacity-0 text-[var(--color-text-secondary)] hover:text-white"
                }`}>
                <RiPencilLine size={14} />
                <span className="text-xs font-medium leading-[normal]">{isEditingThis ? "Editing policy" : "Edit policy"}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full pb-16">
            {/* Approval Policy Section */}
            <div className={getBlockClass("approval")} onClick={() => {
                if (editingSection !== "approval") setEditingSection("approval");
            }}>
                <AnimatePresence mode="wait">
                    {editingSection !== "approval" ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-[24px] w-full"
                        >
                            <div className="flex gap-[16px] items-baseline">
                                <span className={titleClass}>Approval policy</span>
                                <span className={subTitleClass}>Requires {originalThreshold} of {matchingMembers.length} approvers</span>
                            </div>
                            <div className="flex gap-6 w-full flex-wrap">
                                {matchingMembers.map((member) => {
                                    const isCurrentUser = member.isCurrentUser || member.name === "Delanoy Kunil" || member.name === userName;
                                    return (
                                        <div key={member.id} className="flex items-start gap-[12px]">
                                            <div className="relative flex items-center justify-center">
                                                <Avatar name={member.name} size="sm" preset={isCurrentUser ? userPreset : getPresetForUser(member.name, member)} pins={isCurrentUser ? (userPins || undefined) : undefined} />
                                            </div>
                                            <div className="flex flex-col items-start gap-[1px]">
                                                <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">{member.name}</span>
                                                <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.8px] opacity-70">
                                                    {isCurrentUser ? "You" : `${getDaysAgo(member.name)} days ago`}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-[24px] w-full"
                        >
                            <div className="flex gap-[16px] items-center">
                                <span className={titleClass}>Approval policy</span>
                            </div>

                            <div className="w-full max-w-[320px]">
                                <Dropdown open={approversOpen} onOpenChange={setApproversOpen}>
                                    <DropdownTrigger
                                        placeholder="Search or invite members as approver"
                                        leadingIcon={<RiSearchLine size={16} />}
                                    />
                                    <DropdownMenu minWidth={452}>
                                        <DropdownSearch
                                            value={searchQuery}
                                            onChange={setSearchQuery}
                                            placeholder="Search or invite members as approver"
                                        />
                                        <div className="overflow-y-auto max-h-[180px] p-1">
                                            {filteredOptions.length > 0 ? (
                                                filteredOptions.map((member) => {
                                                    const isSelected = matchingMembers.some(m => m.id === member.id) || additionalApprovers.includes(member.email || member.name);
                                                    return (
                                                        <DropdownItem
                                                            key={member.id}
                                                            checkStyle="checkbox"
                                                            selected={isSelected}
                                                            icon={<Avatar name={member.name} size="xs" preset={getPresetForUser(member.name)} />}
                                                            description={member.email}
                                                            onSelect={() => {
                                                                if (isSelected) {
                                                                    if (!matchingMembers.some(m => m.id === member.id)) {
                                                                        const newSet = new Set(additionalApprovers);
                                                                        newSet.delete(member.email || member.name);
                                                                        setAdditionalApprovers(Array.from(newSet));
                                                                    }
                                                                } else {
                                                                    setAdditionalApprovers([...additionalApprovers, member.email || member.name]);
                                                                }
                                                            }}
                                                        >
                                                            {member.name}
                                                        </DropdownItem>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-3 text-xs text-[var(--color-text-muted)] text-center">
                                                    No members found
                                                </div>
                                            )}

                                            {searchQuery && !filteredOptions.some(m => (m.email || "").toLowerCase() === searchQuery.toLowerCase()) && (
                                                <DropdownCreateNew
                                                    label={searchQuery}
                                                    onAction={() => {
                                                        if (!additionalApprovers.includes(searchQuery)) {
                                                            setAdditionalApprovers([...additionalApprovers, searchQuery]);
                                                        }
                                                        setSearchQuery("");
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                {activeMatchingMembers.map((member) => {
                                    const isCurrentUser = member.isCurrentUser || member.name === "Delanoy Kunil" || member.name === userName;
                                    return (
                                        <ApproverCard key={member.id} member={member} isCurrentUser={isCurrentUser} userPreset={userPreset} userPins={userPins} onRemove={(m: any) => setRemovedApprovers([...removedApprovers, m.id.toString()])} isEditing={editingSection === "approval"} />
                                    )
                                })}
                                {activeAdditionalApprovers.map((emailOrName) => {
                                    const existingMember = members.find(m => m.email === emailOrName || m.name === emailOrName);
                                    const displayName = existingMember ? existingMember.name : emailOrName.split('@')[0];
                                    const mockMember = existingMember || { id: emailOrName, name: displayName, email: emailOrName };
                                    return (
                                        <ApproverCard key={emailOrName} member={mockMember} isCurrentUser={false} userPreset={userPreset} userPins={userPins} onRemove={(m: any) => setRemovedApprovers([...removedApprovers, emailOrName])} isEditing={editingSection === "approval"} />
                                    )
                                })}
                            </div>

                            {editingSection === "approval" && (
                                <>
                                    <div className="flex gap-[16px] items-center pt-2">
                                        <span className={subTitleClass}>Threshold</span>
                                        <Dropdown size="sm">
                                            <DropdownTrigger label={String(displayThreshold)} />
                                            <DropdownMenu>
                                                {Array.from({ length: totalApprovers }).map((_, i) => (
                                                    <DropdownItem key={i} onSelect={() => setLocalThreshold(i + 1)}>{i + 1}</DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </Dropdown>
                                        <span className={subTitleClass}>of {totalApprovers} approvers</span>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 w-full mt-2">
                                        <Button variant="neutral" appearance="filled" flat size="sm" onClick={handleDiscard}>Discard changes</Button>
                                        <Button variant="brand" appearance="filled" flat size="sm" onClick={handleUpdate}>Update policy</Button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                {renderEditButton("approval")}
            </div>

            {/* Transaction Limit Section */}
            <motion.div
                className={getBlockClass("transaction")}
                onClick={() => {
                    if (editingSection !== "transaction") {
                        setEditingSection("transaction");
                        setLocalTransactionLimit(mockTransactionLimit ? mockTransactionLimit.toString() : "");
                    }
                }}
            >
                <span className={titleClass}>Limit per transaction</span>
                <AnimatePresence mode="wait">
                    {editingSection === "transaction" ? (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-4 w-full"
                        >
                            <div className="flex items-center gap-2 text-3xl font-medium text-[var(--color-text-primary)]">
                                <span className="opacity-50">$</span>
                                <input
                                    type="text"
                                    className="bg-transparent border-none outline-none w-full"
                                    placeholder="0.00"
                                    value={localTransactionLimit}
                                    onChange={(e) => setLocalTransactionLimit(e.target.value.replace(/[^0-9.]/g, ''))}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 w-full mt-2">
                                <Button variant="neutral" appearance="filled" flat size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    setLocalTransactionLimit(mockTransactionLimit ? mockTransactionLimit.toString() : "");
                                    setEditingSection(null);
                                }}>Discard changes</Button>
                                <Button variant="brand" appearance="filled" flat size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    const parsed = parseFloat(localTransactionLimit);
                                    if (!isNaN(parsed)) {
                                        setMockTransactionLimit(parsed);
                                    } else if (localTransactionLimit === "") {
                                        setMockTransactionLimit(undefined);
                                    }
                                    setEditingSection(null);
                                }}>{mockTransactionLimit !== undefined ? "Update limit" : "Set limit"}</Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            {mockTransactionLimit ? (
                                <div className="flex items-baseline">
                                    <div className="text-xl font-medium tracking-tight text-[var(--color-text-primary)]">
                                        $ {formatDollars(mockTransactionLimit)}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Button variant="neutral" appearance="filled" flat size="sm" shape="rounded" onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSection("transaction");
                                    }}>Create transaction limit</Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                {renderEditButton("transaction")}
            </motion.div>

            {/* Network Limits Section */}
            <div className={getBlockClass("network")} onClick={() => {
                if (editingSection !== "network") {
                    setEditingSection("network");
                    const type = mockAllowedNetworks.length > 0 ? "allow" : "block";
                    setLocalNetworkType(type);
                    setLocalNetworkList(type === "allow" ? mockAllowedNetworks : mockBlockedNetworks);
                    setNetworkSearchQuery("");
                }
            }}>
                <AnimatePresence mode="wait">
                    {editingSection !== "network" ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-[12px] w-full"
                        >
                            <span className={titleClass}>Network limits</span>
                            <span className={subTitleClass}>{getNetworkSubheader()}</span>

                            {(mockBlockedNetworks.length > 0 || mockAllowedNetworks.length > 0) ? (
                                <div className="flex flex-col gap-2 mt-2 w-full">
                                    {mockBlockedNetworks.length > 0 && (
                                        <NetworkListDisplay networks={mockBlockedNetworks} />
                                    )}
                                    {mockAllowedNetworks.length > 0 && (
                                        <NetworkListDisplay networks={mockAllowedNetworks} />
                                    )}
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <Button variant="neutral" appearance="filled" size="sm" flat shape="pill" onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSection("network");
                                    }}>Restrict network(s)</Button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-[24px] w-full"
                        >
                            <div className="flex flex-col gap-[12px]">
                                <span className={titleClass}>Network limits</span>
                                <span className={subTitleClass}>Create a block or allow only list for blockchain network here.</span>
                            </div>

                            <div className="flex flex-col gap-[16px] w-full">
                                <RadioGroup
                                    name="networkType"
                                    value={localNetworkType}
                                    onChange={(val) => setLocalNetworkType(val as "block" | "allow")}
                                    direction="horizontal"
                                    className="flex gap-6 items-start"
                                >
                                    <RadioButton
                                        value="block"
                                        label="Block these network(s)"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <RadioButton
                                        value="allow"
                                        label="Allow only network(s)"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </RadioGroup>

                                <div className="w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                                    <Dropdown open={networkDropdownOpen} onOpenChange={setNetworkDropdownOpen}>
                                        <DropdownTrigger
                                            placeholder="Search networks to block/allow"
                                            leadingIcon={<RiSearchLine size={16} />}
                                        />
                                        <DropdownMenu minWidth={400}>
                                            <DropdownSearch
                                                value={networkSearchQuery}
                                                onChange={setNetworkSearchQuery}
                                                placeholder="Search networks to block/allow"
                                            />
                                            <div className="overflow-y-auto max-h-[180px] p-1">
                                                {supportedNetworksForWallet
                                                    .filter(n => n.toLowerCase().includes(networkSearchQuery.toLowerCase().trim()))
                                                    .map((network) => {
                                                        const isSelected = localNetworkList.includes(network);
                                                        return (
                                                            <DropdownItem
                                                                key={network}
                                                                checkStyle="checkbox"
                                                                selected={isSelected}
                                                                icon={<BlockchainIconStack blockchain={network} size={18} />}
                                                                onSelect={() => {
                                                                    if (isSelected) {
                                                                        setLocalNetworkList(localNetworkList.filter(n => n !== network));
                                                                    } else {
                                                                        setLocalNetworkList([...localNetworkList, network]);
                                                                    }
                                                                }}
                                                            >
                                                                {network}
                                                            </DropdownItem>
                                                        );
                                                    })
                                                }
                                                {networkSearchQuery && !supportedNetworksForWallet.some(n => n.toLowerCase() === networkSearchQuery.toLowerCase().trim()) && (
                                                    <DropdownCreateNew
                                                        label={networkSearchQuery}
                                                        onAction={() => {
                                                            if (!localNetworkList.includes(networkSearchQuery)) {
                                                                setLocalNetworkList([...localNetworkList, networkSearchQuery]);
                                                            }
                                                            setNetworkSearchQuery("");
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                                {localNetworkList.length > 0 && (
                                    <div className="flex flex-col gap-2 mt-2 w-full">
                                        <NetworkListDisplay
                                            networks={localNetworkList}
                                            isEditing={true}
                                            onRemove={(net) => setLocalNetworkList(localNetworkList.filter(n => n !== net))}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 w-full mt-2">
                                <Button variant="neutral" appearance="filled" flat size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    const type = mockAllowedNetworks.length > 0 ? "allow" : "block";
                                    setLocalNetworkType(type);
                                    setLocalNetworkList(type === "allow" ? mockAllowedNetworks : mockBlockedNetworks);
                                    setEditingSection(null);
                                }}>Discard changes</Button>
                                <Button variant="brand" appearance="filled" flat size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    if (localNetworkType === "block") {
                                        setMockBlockedNetworks(localNetworkList);
                                        setMockAllowedNetworks([]);
                                    } else {
                                        setMockAllowedNetworks(localNetworkList);
                                        setMockBlockedNetworks([]);
                                    }
                                    setEditingSection(null);
                                }}>{(mockBlockedNetworks.length > 0 || mockAllowedNetworks.length > 0) ? "Update restriction" : "Set restriction"}</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {renderEditButton("network")}
            </div>

            {/* Asset Limits Section */}
            <div className={getBlockClass("asset")} onClick={() => {
                if (editingSection !== "asset") {
                    setEditingSection("asset");
                    const type = mockAllowedAssets.length > 0 ? "allow" : "block";
                    setLocalAssetType(type);
                    setLocalAssetList(type === "allow" ? mockAllowedAssets : mockBlockedAssets);
                    setAssetSearchQuery("");
                }
            }}>
                <AnimatePresence mode="wait">
                    {editingSection !== "asset" ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-[12px] w-full"
                        >
                            <span className={titleClass}>Asset limits</span>
                            <span className={subTitleClass}>{getAssetSubheader()}</span>

                            {(mockBlockedAssets.length > 0 || mockAllowedAssets.length > 0) ? (
                                <div className="flex flex-col gap-2 mt-2 w-full">
                                    {mockBlockedAssets.length > 0 && (
                                        <AssetListDisplay assets={blockedAssetDetails} />
                                    )}
                                    {mockAllowedAssets.length > 0 && (
                                        <AssetListDisplay assets={allowedAssetDetails} />
                                    )}
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <Button variant="neutral" appearance="filled" size="sm" flat shape="pill" onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSection("asset");
                                    }}>Restrict token(s)</Button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-[24px] w-full"
                        >
                            <div className="flex flex-col gap-[12px]">
                                <span className={titleClass}>Asset limits</span>
                                <span className={subTitleClass}>Create a block or allow only list for token assets here.</span>
                            </div>

                            <div className="flex flex-col gap-[16px] w-full">
                                <RadioGroup
                                    name="assetType"
                                    value={localAssetType}
                                    onChange={(val) => setLocalAssetType(val as "block" | "allow")}
                                    direction="horizontal"
                                    className="flex gap-6 items-start"
                                >
                                    <RadioButton
                                        value="block"
                                        label="Block these token(s)"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <RadioButton
                                        value="allow"
                                        label="Allow only token(s)"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </RadioGroup>

                                <div className="w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                                    <Dropdown open={assetDropdownOpen} onOpenChange={setAssetDropdownOpen}>
                                        <DropdownTrigger
                                            placeholder="Search assets to block/allow"
                                            leadingIcon={<RiSearchLine size={16} />}
                                        />
                                        <DropdownMenu minWidth={400}>
                                            <DropdownSearch
                                                value={assetSearchQuery}
                                                onChange={setAssetSearchQuery}
                                                placeholder="Search assets to block/allow"
                                            />
                                            <div className="overflow-y-auto max-h-[180px] p-1">
                                                {cryptocurrencies
                                                    .filter(a => a.name.toLowerCase().includes(assetSearchQuery.toLowerCase().trim()) || a.symbol.toLowerCase().includes(assetSearchQuery.toLowerCase().trim()))
                                                    .map((asset) => {
                                                        const isSelected = localAssetList.some(la => la.assetId === asset.id);
                                                        return (
                                                            <DropdownItem
                                                                key={asset.id}
                                                                checkStyle="checkbox"
                                                                selected={isSelected}
                                                                icon={<i className={`cf cf-${asset.symbol.toLowerCase()} text-lg`}></i>}
                                                                onSelect={() => {
                                                                    if (isSelected) {
                                                                        setLocalAssetList(localAssetList.filter(a => a.assetId !== asset.id));
                                                                    } else {
                                                                        setLocalAssetList([...localAssetList, { assetId: asset.id }]);
                                                                    }
                                                                }}
                                                            >
                                                                {asset.name}
                                                            </DropdownItem>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                                {localAssetList.length > 0 && (
                                    <div className="flex flex-col gap-2 mt-2 w-full">
                                        <AssetListDisplay
                                            assets={localAssetDetails}
                                            isEditing={true}
                                            onRemove={(id) => setLocalAssetList(localAssetList.filter(a => a.assetId !== id))}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 w-full mt-2">
                                <Button variant="neutral" appearance="filled" flat size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    const type = mockAllowedAssets.length > 0 ? "allow" : "block";
                                    setLocalAssetType(type);
                                    setLocalAssetList(type === "allow" ? mockAllowedAssets : mockBlockedAssets);
                                    setEditingSection(null);
                                }}>Discard changes</Button>
                                <Button variant="brand" appearance="filled" flat size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    if (localAssetType === "block") {
                                        setMockBlockedAssets(localAssetList);
                                        setMockAllowedAssets([]);
                                    } else {
                                        setMockAllowedAssets(localAssetList);
                                        setMockBlockedAssets([]);
                                    }
                                    setEditingSection(null);
                                }}>{(mockBlockedAssets.length > 0 || mockAllowedAssets.length > 0) ? "Update restriction" : "Set restriction"}</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {renderEditButton("asset")}
            </div>
        </div>
    );
});

PolicyContent.displayName = 'PolicyContent';

export default PolicyContent;
