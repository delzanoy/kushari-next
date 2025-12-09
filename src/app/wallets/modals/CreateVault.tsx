import IconButton from "@/app/components/buttons/IconButton";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { TrackWalletIcon, CloseIcon, SearchIcon } from "@/app/components/icons";
import { useModalContext } from "../../components/modal/Modal";
import { RadioGroup } from "@/app/components/forms/RadioGroup";
import { TextInput } from "@/app/components/forms";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import Dropdown from "@/app/components/forms/Dropdown";

// Define the Member interface based on your data structure
interface Member {
    id: number;
    name: string;
    email: string;
}

interface CreateVaultProps {
    onClose?: () => void;
    members?: Member[]; // Add members prop
}

interface VaultFormData {
    vaultName: string;
    approvers: string[]; // Array of member addresses or IDs
    threshold: number;
}

export default function CreateVault({ onClose, members: propMembers = [] }: CreateVaultProps) {
    const [showEscTooltip, setShowEscTooltip] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<VaultFormData>({
        vaultName: "",
        approvers: [],
        threshold: 1
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMembers, setFilteredMembers] = useState<Member[]>(propMembers);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

    // Handle escape key for closing
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (showEscTooltip) {
                    onClose?.();
                } else {
                    setShowEscTooltip(true);
                    setTimeout(() => setShowEscTooltip(false), 2000);
                }
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [showEscTooltip, onClose]);

    // Filter members based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredMembers(propMembers);
        } else {
            const filtered = propMembers.filter(member =>
                member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMembers(filtered);
        }
    }, [searchTerm, propMembers]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleMemberSelect = (member: Member) => {
        setSelectedMembers(prev => {
            const isSelected = prev.some(m => m.id === member.id);
            if (isSelected) {
                // Remove member
                const updated = prev.filter(m => m.id !== member.id);
                setFormData(prevData => ({
                    ...prevData,
                    approvers: updated.map(m => m.email || m.id.toString())
                }));
                return updated;
            } else {
                // Add member
                const updated = [...prev, member];
                setFormData(prevData => ({
                    ...prevData,
                    approvers: updated.map(m => m.email || m.id.toString()),
                    threshold: Math.max(prevData.threshold, 1)
                }));
                return updated;
            }
        });
    };

    const handleThresholdChange = (value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0 && numValue <= selectedMembers.length) {
            setFormData(prev => ({
                ...prev,
                threshold: numValue
            }));
        }
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

            if (selectedMembers.length === 0) {
                alert("Please select at least one approver");
                return;
            }

            if (formData.threshold > selectedMembers.length) {
                alert("Threshold cannot be greater than number of approvers");
                return;
            }

            // Prepare vault data
            const vaultData = {
                name: formData.vaultName,
                approvers: formData.approvers,
                threshold: formData.threshold,
                type: 1, // MPC Vault type
            };

            // Call your API to create vault
            // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vaults`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(vaultData)
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Creating vault with data:", vaultData);
            alert("Vault created successfully!");
            onClose?.();
            
        } catch (error) {
            console.error("Error creating vault:", error);
            alert("Failed to create vault. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Threshold options based on selected members
    const thresholdOptions = selectedMembers.length > 0 
        ? Array.from({ length: selectedMembers.length }, (_, i) => ({
              value: (i + 1).toString(),
              label: `${i + 1} of ${selectedMembers.length}`
          }))
        : [{ value: "1", label: "1 of 1" }];

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

                <Dropdown
                    label="Approvers"
                    // placeholder="Search or invite approver"
                    placeholder="Use an identifiable name"
                    // leadingIcon={<SearchIcon />}
                    options={[]}
                    value={""}
                    onChange={() => {}}
                    width="full"
                    disabled={isSubmitting}
                />

                <Dropdown
                    label="Approval required"
                    placeholder="Set threshold"
                    options={[]}
                    value={""}
                    onChange={() => {}}
                    width="full"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex py-[0] px-[12px] flex-col items-end gap-3 self-stretch">
                <PrimaryButton
                    size="md"
                    variant="brand"
                    label={isSubmitting ? "Creating..." : "Create vault"}
                    type="submit"
                    disabled={isSubmitting || !formData.vaultName.trim() || selectedMembers.length === 0}
                />
            </div>
        </form>
    );
}