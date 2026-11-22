"use client";

import { useState, useEffect, ChangeEvent, FormEvent, useMemo } from "react";
import {
    RiSafeLine,
    RiCloseLine,
    RiCloseCircleFill,
    RiSearchLine
} from "@remixicon/react";
import { useModalContext } from "@/components/molecules/modal/Modal";
import { TextInput } from "@/components/atoms/TextInput";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
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
import { createVault } from "@/lib/mock-cache";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";

// Define the Member interface based on data structure
interface Member {
    id: number;
    name?: string; // pending invitees come from the API with an email but no name
    email: string;
}

// Invitees have no name yet, so fall back to the email
const memberLabel = (member: Member) => member.name || member.email || "";

interface CreateVaultProps {
    onClose?: () => void;
    members?: Member[];
    onVaultCreated?: () => void;
}

interface VaultFormData {
    vaultName: string;
    approvers: string[];
    threshold: number;
}

const AVATAR_PRESETS = [
    "Cyan Dusk",
    "Deep Sea",
    "Midnight",
    "Ember",
    "Sunset",
    "Rose Gold",
    "Emerald",
    "Aurora",
    "Neon",
    "Acid",
    "Chromatic",
    "Oil Slick",
    "Candy"
];

const getPresetForUser = (username: string = "") => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_PRESETS.length;
    return AVATAR_PRESETS[index];
};

export default function CreateVault({ onClose, members: propMembers = [], onVaultCreated }: CreateVaultProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<VaultFormData>({
        vaultName: "",
        approvers: [],
        threshold: 1
    });
    const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [approversOpen, setApproversOpen] = useState(false);
    // Field-level errors, shown with the TextInput / Dropdown error states
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; approvers?: string; threshold?: string }>({});
    const [submitError, setSubmitError] = useState("");
    const clearFieldError = (field: "name" | "approvers" | "threshold") => {
        setFieldErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
        setSubmitError("");
    };

    const { escStage, isTopModal } = useModalContext();
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    // Calculate suggested threshold (1/3 of approvers, rounded up)
    const suggestedThreshold = useMemo(() => {
        if (selectedApprovers.length === 0) return 1;
        return Math.max(1, Math.ceil(selectedApprovers.length / 3));
    }, [selectedApprovers.length]);

    // Update threshold when approvers change to use suggested threshold
    useEffect(() => {
        if (selectedApprovers.length > 0) {
            setFormData(prev => ({
                ...prev,
                threshold: suggestedThreshold
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                threshold: 1
            }));
        }
    }, [selectedApprovers.length, suggestedThreshold]);

    // Filter and sort members alphabetically
    const filteredOptions = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        const baseOptions = propMembers ? propMembers.filter(m => Boolean(m && typeof m === 'object')) : [];

        // Sort alphabetically by member.name
        baseOptions.sort((a, b) => memberLabel(a).localeCompare(memberLabel(b)));

        if (!query) return baseOptions;
        return baseOptions.filter(member =>
            (member?.name || '').toLowerCase().includes(query) ||
            (member?.email || '').toLowerCase().includes(query)
        );
    }, [propMembers, searchQuery]);

    // Handle input change
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearFieldError("name");
        setFormData(prev => ({
            ...prev,
            vaultName: e.target.value
        }));
    };

    // Toggle approver selection
    const handleToggleApprover = (email: string) => {
        clearFieldError("approvers");
        clearFieldError("threshold");
        const index = selectedApprovers.indexOf(email);
        let newApprovers: string[];
        if (index === -1) {
            newApprovers = [...selectedApprovers, email];
        } else {
            newApprovers = selectedApprovers.filter(approver => approver !== email);
        }
        setSelectedApprovers(newApprovers);
        setFormData(prev => ({
            ...prev,
            approvers: newApprovers,
            threshold: Math.min(prev.threshold, Math.max(newApprovers.length, 1))
        }));
    };

    // Invite new guest member by email. Returns true when the invite was added.
    const handleInviteMember = (email: string): boolean => {
        const emailTrim = email.trim();
        if (!emailTrim || selectedApprovers.includes(emailTrim)) return false;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
            // Close the menu so the error under the field is visible; the typed text is kept
            setFieldErrors(prev => ({ ...prev, approvers: "Enter a full email address to invite someone, like name@company.com" }));
            setApproversOpen(false);
            return false;
        }

        clearFieldError("approvers");
        clearFieldError("threshold");
        const newApprovers = [...selectedApprovers, emailTrim];
        setSelectedApprovers(newApprovers);
        setFormData(prev => ({
            ...prev,
            approvers: newApprovers,
            threshold: Math.min(prev.threshold, Math.max(newApprovers.length, 1))
        }));
        return true;
    };

    // Handle threshold change
    const handleThresholdChange = (value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0 && numValue <= selectedApprovers.length) {
            clearFieldError("threshold");
            setFormData(prev => ({
                ...prev,
                threshold: numValue
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        setIsSubmitting(true);

        try {
            // Normally unreachable (the submit button is disabled until these hold),
            // but if they fail, show it on the field instead of a browser alert.
            const errors: { name?: string; approvers?: string; threshold?: string } = {};
            if (!formData.vaultName.trim()) errors.name = "Give the vault a name";
            if (selectedApprovers.length === 0) errors.approvers = "Choose at least one approver";
            else if (formData.threshold > selectedApprovers.length) errors.threshold = "Approvals required can't be more than the number of approvers";
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
            }

            // Create vault in user mock cache
            await createVault({
                name: formData.vaultName.trim(),
                approvers: selectedApprovers,
                threshold: formData.threshold,
                blockchain: 'ethereum',
            });

            // Close modal
            onClose?.();

            if (onVaultCreated) {
                onVaultCreated();
            }

            // Dispatch event to notify layout
            window.dispatchEvent(new CustomEvent('walletsUpdated'));

        } catch (error) {
            console.error("Error creating demo vault:", error);
            setSubmitError("Couldn't create the vault. Your details are still here, so try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Threshold options based on selected approvers
    const thresholdOptions = useMemo(() => {
        if (selectedApprovers.length > 0) {
            return Array.from({ length: selectedApprovers.length }, (_, i) => ({
                value: (i + 1).toString(),
                label: `${i + 1} of ${selectedApprovers.length}`
            }));
        }
        return [{ value: "1", label: "Select or invite approvers" }];
    }, [selectedApprovers.length]);

    // Helper text for threshold dropdown
    const thresholdHelperText = useMemo(() => {
        if (selectedApprovers.length === 0) {
            return "Add approvers first";
        } else if (formData.threshold === suggestedThreshold) {
            return `Suggested: ${suggestedThreshold} of ${selectedApprovers.length} (⅓ of total)`;
        } else {
            return `Minimum approvals required: ${formData.threshold} of ${selectedApprovers.length}`;
        }
    }, [selectedApprovers.length, formData.threshold, suggestedThreshold]);

    const removeApprover = (email: string) => {
        const newApprovers = selectedApprovers.filter(approver => approver !== email);
        setSelectedApprovers(newApprovers);
        setFormData(prev => ({
            ...prev,
            approvers: newApprovers,
            threshold: Math.min(prev.threshold, Math.max(newApprovers.length, 1))
        }));
    };

    return (
        <form onSubmit={handleSubmit} className={`flex ${MODAL_WIDTH.standard} p-4 flex-col items-start gap-6 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] shadow-2xl`}>
            {/* Header Section */}
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex justify-between items-center self-stretch">
                    <div className="flex p-2.5 items-center justify-center rounded-xl bg-[var(--color-text-brand)]/[0.08] border border-[var(--color-text-brand)]/[0.12]">
                        <RiSafeLine size={24} className="text-[var(--color-text-brand)]" />
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
                        Create vault
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm tracking-tight">
                        Trustless, secure wallet with multi-approver and multi-chain support.
                    </span>
                </div>
            </div>

            {/* Inputs Section */}
            <div className="flex flex-col items-start gap-4 self-stretch px-2">
                <div className="w-full">
                    <TextInput
                        label="Vault name"
                        name="vaultName"
                        placeholder="Use an identifiable name"
                        value={formData.vaultName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        state={fieldErrors.name ? "error" : "default"}
                        errorMessage={fieldErrors.name}
                        required
                    />
                </div>

                {/* Approvers Dropdown Selection */}
                <div className="w-full flex flex-col gap-2.5">
                    <Dropdown
                        label="Approvers"
                        open={approversOpen}
                        onOpenChange={setApproversOpen}
                        disabled={isSubmitting}
                        state={fieldErrors.approvers ? "error" : "default"}
                        errorMessage={fieldErrors.approvers}
                    >
                        <DropdownTrigger
                            placeholder="Search or invite approver"
                            leadingIcon={<RiSearchLine size={16} />}
                        />
                        <DropdownMenu minWidth={452}>
                            <DropdownSearch
                                value={searchQuery}
                                onChange={(value: string) => {
                                    setSearchQuery(value);
                                    clearFieldError("approvers");
                                }}
                                placeholder="Search or invite approver"
                            />
                            <div className="overflow-y-auto max-h-[180px] p-1">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((member) => {
                                        const isSelected = selectedApprovers.includes(member.email);
                                        return (
                                            <DropdownItem
                                                key={member.email}
                                                checkStyle="checkbox"
                                                selected={isSelected}
                                                icon={<Avatar name={memberLabel(member)} size="xs" preset={getPresetForUser(memberLabel(member))} />}
                                                description={member.name ? member.email : "Invited"}
                                                onSelect={() => handleToggleApprover(member.email)}
                                            >
                                                {memberLabel(member)}
                                            </DropdownItem>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 text-xs text-[var(--color-text-muted)] text-center">
                                        No members found
                                    </div>
                                )}

                                {searchQuery && !filteredOptions.some(m => (m.email || '').toLowerCase() === searchQuery.toLowerCase()) && (
                                    <DropdownCreateNew
                                        label={searchQuery}
                                        onAction={() => {
                                            // Keep the typed text when the email is invalid, so it can be corrected
                                            if (handleInviteMember(searchQuery)) setSearchQuery("");
                                        }}
                                    />
                                )}
                            </div>
                        </DropdownMenu>
                    </Dropdown>

                    {/* Chips Display */}
                    {selectedApprovers.length > 0 && (
                        <div className="flex items-start content-start gap-2 self-stretch flex-wrap mt-1">
                            {selectedApprovers.map((email) => {
                                const member = propMembers.find(m => m.email === email);
                                const displayName = member?.name || email.split('@')[0];
                                return (
                                    <div
                                        key={email}
                                        className="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)]/10 hover:border-[var(--color-border-default)] transition-colors duration-150 select-none max-w-full"
                                    >
                                        <Avatar name={displayName} size="xs" preset={getPresetForUser(displayName)} />
                                        <div className="flex flex-col min-w-0 pr-1">
                                            <span className="text-[var(--color-text-primary)] text-xs font-semibold leading-tight truncate max-w-[120px]">{displayName}</span>
                                            <span className="text-[var(--color-text-muted)] text-[10px] leading-none mt-0.5 truncate max-w-[140px]">{email}</span>
                                        </div>
                                        <IconButton
                                            icon={<RiCloseLine size={12} />}
                                            flat
                                            shape="pill"
                                            size="sm"
                                            variant="neutral"
                                            hoverVariant="danger"
                                            appearance="ghost"
                                            onClick={() => removeApprover(email)}
                                            className="!bg-transparent hover:!bg-transparent"
                                            aria-label={`Remove ${displayName}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Threshold Dropdown */}
                <div className="w-full">
                    <Dropdown
                        label="Threshold"
                        disabled={isSubmitting || selectedApprovers.length === 0}
                        helperText={thresholdHelperText}
                        state={fieldErrors.threshold ? "error" : "default"}
                        errorMessage={fieldErrors.threshold}
                    >
                        <DropdownTrigger
                            placeholder={selectedApprovers.length === 0 ? "Add approvers first" : `${formData.threshold} of ${selectedApprovers.length}`}
                        />
                        <DropdownMenu minWidth={452}>
                            {thresholdOptions.map((opt) => (
                                <DropdownItem
                                    key={opt.value}
                                    selected={formData.threshold.toString() === opt.value}
                                    onSelect={() => handleThresholdChange(opt.value)}
                                >
                                    {opt.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>

                {submitError && (
                    <InlineAlert>{submitError}</InlineAlert>
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
                    disabled={isSubmitting || !formData.vaultName.trim() || selectedApprovers.length === 0}
                    loading={isSubmitting}
                    className="w-full justify-center"
                >
                    {isSubmitting ? "Creating..." : "Create vault"}
                </Button>
            </div>
        </form>
    );
}
