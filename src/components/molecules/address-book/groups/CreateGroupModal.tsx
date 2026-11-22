"use client";

import { useState, useMemo, FormEvent } from 'react';
import { 
  RiGroupLine, 
  RiCloseLine, 
  RiCloseCircleFill 
} from '@remixicon/react';
import { IconButton } from '@/components/atoms/IconButton';
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Button } from '@/components/atoms/Button';
import { TextInput } from '@/components/atoms/TextInput';
import { RadioGroup, RadioButton } from '@/components/atoms/RadioButton';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSearch } from '@/components/atoms/Dropdown';
import { AddressCardProps } from "../addresses/types";
import { createGroup } from '@/lib/mock-cache';
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";

interface CreateGroupModalProps {
    onClose: () => void;
    addresses?: AddressCardProps[];
    onGroupCreated?: () => void;
}

export default function CreateGroupModal({ onClose, addresses = [], onGroupCreated }: CreateGroupModalProps) {
    const [name, setName] = useState('');
    const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMethodType, setSelectedMethodType] = useState<string>("");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const filteredAddresses = useMemo(() => {
        if (!searchQuery.trim()) return addresses;
        const q = searchQuery.toLowerCase();
        return addresses.filter(a => 
            a.name.toLowerCase().includes(q) || 
            a.walletHash.toLowerCase().includes(q)
        );
    }, [addresses, searchQuery]);

    const removeAddress = (addressId: string) => {
        setSelectedAddresses(prev => prev.filter(id => id !== addressId));
    };
    
    const toggleAddress = (addressId: string) => {
        setSelectedAddresses(prev => 
            prev.includes(addressId) 
                ? prev.filter(id => id !== addressId) 
                : [...prev, addressId]
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Group name is required');
            return;
        }

        const count = selectedAddresses.length;
        const addressIds = selectedAddresses.map(id => parseInt(id, 10));

        setLoading(true);
        try {
            await createGroup({
                name: name.trim(),
                count,
                lastModifiedBy: 'Delanoy Kunil',
                addressIds
            });

            if (onGroupCreated) onGroupCreated();
            onClose();
        } catch (err) {
            console.error('Failed to create group:', err);
            setError('Failed to create group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className={`flex ${MODAL_WIDTH.standard} p-6 flex-col items-start gap-8 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-2xl)]`}
        >
            <div className="flex flex-col items-start gap-2 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)]">
                        <RiGroupLine size={24} className="text-[var(--color-text-primary)]" />
                    </div>

                    <IconButton
                        icon={<RiCloseLine />}
                        size="sm"
                        variant="neutral"
                        appearance="ghost"
                        onClick={onClose}
                        aria-label="Close modal"
                    />
                </div>
                <h2 className="text-[var(--color-text-primary)] text-xl font-medium tracking-tight mt-2">
                    Create group
                </h2>
            </div>

            <div className="flex flex-col items-start gap-6 self-stretch">
                <TextInput
                    label="Group name"
                    placeholder="Use an identifiable name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    state={!!error && !name.trim() ? "error" : "default"}
                    errorMessage="Group name is required"
                    disabled={loading}
                />

                <div className="flex flex-col gap-2 w-full">
                    <RadioGroup
                        name="method-type"
                        label="Add address to group"
                        value={selectedMethodType}
                        onChange={setSelectedMethodType}
                        direction="horizontal"
                    >
                        <RadioButton value="few" label="Add few" />
                        <RadioButton value="bulk" label="Add in bulk (csv)" />
                    </RadioGroup>
                </div>

                {selectedMethodType === "few" && (
                    <div className="w-full flex flex-col gap-4">
                        <Dropdown open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownTrigger 
                                label={selectedAddresses.length > 0 ? `${selectedAddresses.length} selected` : undefined} 
                                placeholder="Search address to add..." 
                                disabled={loading}
                            />
                            <DropdownMenu maxHeight={240}>
                                <DropdownSearch 
                                    value={searchQuery} 
                                    onChange={setSearchQuery} 
                                    placeholder="Search addresses..." 
                                />
                                {filteredAddresses.map(address => (
                                    <DropdownItem
                                        key={address.id}
                                        checkStyle="checkbox"
                                        selected={selectedAddresses.includes(address.id.toString())}
                                        onSelect={() => toggleAddress(address.id.toString())}
                                        description={address.walletHash}
                                    >
                                        {address.name || `Address ${address.id}`}
                                    </DropdownItem>
                                ))}
                                {filteredAddresses.length === 0 && (
                                    <div className="py-4 px-2 text-center text-[var(--color-text-muted)] text-sm">
                                        No addresses found.
                                    </div>
                                )}
                            </DropdownMenu>
                        </Dropdown>

                        {selectedAddresses.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedAddresses.map((addressId) => {
                                    const address = addresses.find(a => a.id.toString() === addressId);
                                    if (!address) return null;
                                    return (
                                        <div 
                                            key={address.id} 
                                            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[rgba(255,255,255,0.06)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-sm tracking-tight"
                                        >
                                            {address.name || `Address ${address.id}`}
                                            <IconButton
                                                icon={<RiCloseCircleFill size={14} />}
                                                size="sm"
                                                variant="neutral"
                                                appearance="ghost"
                                                onClick={() => removeAddress(addressId)}
                                                className="opacity-60 hover:opacity-100"
                                                aria-label="Remove address"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {selectedMethodType === "bulk" && (
                    <div className="w-full flex flex-col items-center justify-center p-8 border border-dashed border-[var(--color-border-default)] rounded-xl bg-[rgba(255,255,255,0.02)]">
                        <p className="text-[var(--color-text-secondary)] text-sm tracking-tight mb-2">
                            Add your CSV upload component here
                        </p>
                        <div className="text-[var(--color-text-muted)] text-xs text-center tracking-tight">
                            You can implement your CSV file upload functionality here.
                        </div>
                    </div>
                )}

                {error && !error.includes('name') && (
                    <InlineAlert>{error}</InlineAlert>
                )}
            </div>

            <div className="flex justify-end w-full pt-4">
                <Button
                    size="md"
                    variant="brand"
                    appearance="filled"
                    type="submit"
                    disabled={loading || !name.trim()}
                >
                    {loading ? "Creating..." : "Create group"}
                </Button>
            </div>
        </form>
    );
}
