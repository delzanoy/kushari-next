"use client";

import { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import { RiUserAddLine, RiHashtag, RiCloseLine } from "@remixicon/react";
import { IconButton } from "@/components/atoms/IconButton";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { Group } from './types';
import { createAddress } from '@/lib/mock-cache';

interface AddAddressModalProps {
  onClose: () => void;
  groups?: Group[];
  onAddressAdded?: () => void;
}

interface AddressFormData {
  walletAddress: string;
  addressName: string;
  selectedGroups: string[];
}

export default function AddAddressModal({ onClose, groups = [], onAddressAdded }: AddAddressModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    walletAddress: '',
    addressName: '',
    selectedGroups: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [walletAddressError, setWalletAddressError] = useState<string>('');
  const [addressNameError, setAddressNameError] = useState<string>('');

  const allGroups = useMemo(() => groups, [groups]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'walletAddress' && walletAddressError) setWalletAddressError('');
    if (name === 'addressName' && addressNameError) setAddressNameError('');
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    let isValid = true;
    setWalletAddressError('');
    setAddressNameError('');
    setError('');

    if (!formData.walletAddress.trim()) {
      setWalletAddressError('Wallet address is required');
      isValid = false;
    } 

    if (!formData.addressName.trim()) {
      setAddressNameError('Address name is required');
      isValid = false;
    } else if (formData.addressName.trim().length < 2) {
      setAddressNameError('Address name must be at least 2 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const groupIds = formData.selectedGroups.map(id => parseInt(id, 10));

      await createAddress({
        walletHash: formData.walletAddress.trim(),
        name: formData.addressName.trim(),
        groupIds: groupIds.length > 0 ? groupIds : undefined,
      });

      setFormData({ walletAddress: '', addressName: '', selectedGroups: [] });
      onClose();

      window.dispatchEvent(new CustomEvent('addressesUpdated'));
      
      if (onAddressAdded) {
        onAddressAdded();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-[500px] p-6 flex-col items-start gap-6 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] shadow-2xl">
      <div className="flex flex-col items-start gap-2 self-stretch">
        <div className="flex justify-between items-start self-stretch">
          <div className="flex p-3 items-center justify-center rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-subtle)]">
            <RiUserAddLine size={24} className="text-[var(--color-icon-primary)]" />
          </div>

          <IconButton
            icon={<RiCloseLine size={20} />}
            size="sm"
            variant="neutral"
            appearance="ghost"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>
        <div className="flex flex-col items-start gap-1 self-stretch mt-2">
          <span className="text-[var(--color-text-primary)] text-xl font-medium tracking-tight">
            Add address
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="w-full">
           <TextInput
             name="walletAddress"
             placeholder="Wallet Hash (0x...)"
             leadingIcon={<RiHashtag size={16} className="text-[var(--color-icon-muted)]" />}
             value={formData.walletAddress}
             onChange={handleInputChange}
             disabled={loading}
           />
           {walletAddressError && <span className="text-[var(--color-text-danger)] text-xs mt-1 block px-1">{walletAddressError}</span>}
        </div>

        <div className="w-full">
           <TextInput
             name="addressName"
             placeholder="Alias for this address"
             value={formData.addressName}
             onChange={handleInputChange}
             disabled={loading}
           />
           {addressNameError && <span className="text-[var(--color-text-danger)] text-xs mt-1 block px-1">{addressNameError}</span>}
        </div>

        {error && (
          <div className="text-sm text-[var(--color-text-danger)] bg-[var(--color-surface-danger)] px-3 py-2 rounded-lg w-full">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-3 self-stretch pt-4 border-t border-[var(--color-border-subtle)]">
        <Button
          size="md"
          variant="brand"
          appearance="filled"
          type="submit"
          disabled={loading || !formData.walletAddress.trim() || !formData.addressName.trim()}
          loading={loading}
          className="w-full justify-center"
        >
          {loading ? "Adding..." : "Add address"}
        </Button>
      </div>
    </form>
  );
}
