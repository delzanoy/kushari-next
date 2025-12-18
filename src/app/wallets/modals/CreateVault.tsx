import IconButton from "@/app/components/buttons/IconButton";
import { useState, useEffect, ChangeEvent, FormEvent, useMemo } from "react";
import { VaultIcon, CloseIcon, SearchIcon, CloseCircleFilledIcon, UserAvatarIcon } from "@/app/components/icons";
import { useModalContext } from "../../components/modal/Modal";
import { TextInput } from "@/app/components/forms";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import Dropdown from "@/app/components/forms/Dropdown";
import UserAvatar from "./UserAvatar";
import { createVault } from "@/app/api/mock-cache";

// Define the Member interface based on your data structure
interface Member {
    id: number;
    name: string;
    email: string;
}

interface CreateVaultProps {
    onClose?: () => void;
    members?: Member[];
    onVaultCreated?: () => void; // Add callback to refresh wallet list
}

interface VaultFormData {
    vaultName: string;
    approvers: string[]; // Array of member emails or IDs
    threshold: number;
}

export default function CreateVault({ onClose, members: propMembers = [], onVaultCreated }: CreateVaultProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<VaultFormData>({
        vaultName: "",
        approvers: [],
        threshold: 1
    });
    const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    // Convert members to dropdown options
    const memberOptions = useMemo(() => {
        return propMembers.map(member => ({
            value: member.email,
            label: member.name,
            metadata: member.email,
            icon: <UserAvatarIcon member={member.name} size={16}/>
        }));
    }, [propMembers]);

    // Handle input change
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle approvers selection change (multi-select)
    const handleApproversChange = (value: string | string[]) => {
        if (Array.isArray(value)) {
            setSelectedApprovers(value);
            setFormData(prev => ({
                ...prev,
                approvers: value,
                threshold: Math.min(prev.threshold, Math.max(value.length, 1))
            }));
        }
    };

    // Handle threshold change
    const handleThresholdChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue > 0 && numValue <= selectedApprovers.length) {
                setFormData(prev => ({
                    ...prev,
                    threshold: numValue
                }));
            }
        }
    };

    // Handle search in the dropdown
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        console.log("Search query:", query);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate form
            if (!formData.vaultName.trim()) {
                alert("Please enter a vault name");
                return;
            }

            if (selectedApprovers.length === 0) {
                alert("Please select at least one approver");
                return;
            }

            if (formData.threshold > selectedApprovers.length) {
                alert("Threshold cannot be greater than number of approvers");
                return;
            }

            // Create demo vault using mock cache
            const newVault = await createVault({
                name: formData.vaultName,
                approvers: selectedApprovers,
                threshold: formData.threshold,
                blockchain: 'ethereum', // Default to ethereum
            });

            console.log("Demo vault created:", newVault);

            // Reset form
            setFormData({
                vaultName: "",
                approvers: [],
                threshold: 1
            });
            setSelectedApprovers([]);
            setSearchQuery("");

            // Close modal
            onClose?.();

            // Notify parent to refresh the list
            if (onVaultCreated) {
                onVaultCreated();
            }

            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('walletsUpdated'));

        } catch (error) {
            console.error("Error creating demo vault:", error);
            alert("Failed to create vault. Please try again.");
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

    // Remove a specific approver
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
        <form onSubmit={handleSubmit} className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        <VaultIcon className="w-8 h-8 aspect-square" />
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
                <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
                    <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
                        Create vault
                    </span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        Trustless, secure wallet with multi-approver and multi-chain support.
                    </span>
                    <TertiaryButton label="How does it work?" size="sm" status="neutral" />
                </div>
            </div>

            <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                <TextInput
                    label="Vault name"
                    name="vaultName"
                    placeholder="Use an identifiable name"
                    value={formData.vaultName}
                    onChange={handleInputChange}
                    width="full"
                    error={!formData.vaultName.trim() && isSubmitting}
                    helperText={!formData.vaultName.trim() && isSubmitting ? "Vault name is required" : ""}
                    disabled={isSubmitting}
                    required
                />

                <div className="w-full flex flex-col gap-2">
                    <Dropdown
                        placeholder="Search or invite approvers..."
                        label="Approvers"
                        leadingIcon={<SearchIcon />}
                        options={memberOptions}
                        value={selectedApprovers}
                        onChange={handleApproversChange}
                        onSearchChange={handleSearchChange}
                        width="full"
                        disabled={isSubmitting}
                        allowSearch={true}
                        multiple={true}
                        searchPlaceholder="Search or invite approvers..."
                        emptyText="No members found"
                        allowCreate={true}
                        createText="Invite new member"
                        maxHeight="300px"
                    />

                    {/* Selected approvers display as chips */}
                    {selectedApprovers.length > 0 && (
                        <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
                            {selectedApprovers.map((email, index) => {
                                const member = propMembers.find(m => m.email === email);

                                if (member) {
                                    return (
                                        <UserAvatar
                                            key={member.id}
                                            member={member}
                                            index={index}
                                            onRemove={() => removeApprover(email)}
                                        />
                                    );
                                }

                                // Handle invited users (not in propMembers)
                                const invitedMember: Member = {
                                    id: -index - 1,
                                    name: email.split('@')[0],
                                    email: email
                                };

                                return (
                                    <UserAvatar
                                        key={`invited-${email}`}
                                        member={invitedMember}
                                        index={index}
                                        onRemove={() => removeApprover(email)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {selectedApprovers.length === 0 && isSubmitting && (
                        <span className="text-[#F25C54] font-[Geist] text-xs not-italic font-normal leading-[normal] tracking-[0.48px] mt-1 block">
                            Please select at least one approver
                        </span>
                    )}
                </div>

                <Dropdown
                    label="Approval required"
                    placeholder={`${formData.threshold} of ${selectedApprovers.length || 1}`}
                    options={thresholdOptions}
                    value={formData.threshold.toString()}
                    onChange={handleThresholdChange}
                    width="full"
                    disabled={isSubmitting || selectedApprovers.length === 0}
                    helperText={thresholdHelperText}
                />
            </div>

            <div className="flex flex-col items-end gap-3 self-stretch">
                <PrimaryButton
                    size="md"
                    variant="brand"
                    label={isSubmitting ? "Creating..." : "Create vault"}
                    type="submit"
                    disabled={isSubmitting || !formData.vaultName.trim() || selectedApprovers.length === 0}
                />
            </div>
        </form>
    );
}