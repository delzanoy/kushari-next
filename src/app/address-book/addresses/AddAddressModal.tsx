import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from 'react';
import { AddAddressIcon, CloseIcon, CloseCircleFilledIcon, HashIcon, AddToGroupIcon } from "@/app/components/icons"
import IconButton from "@/app/components/buttons/IconButton";
import { TextInput } from "@/app/components/forms";
import Dropdown from "@/app/components/forms/Dropdown";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import { useModalContext } from '@/app/components/modal/Modal';
import { GroupCardProps } from '../groups/types';
import { createAddress } from '@/app/api/mock-cache';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups?: GroupCardProps[];
  onAddressAdded?: () => void;
}

interface AddressFormData {
  walletAddress: string;
  addressName: string;
  selectedGroups: string[];
}

export default function AddAddressModal({ isOpen, onClose, groups = [], onAddressAdded }: AddAddressModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    walletAddress: '',
    addressName: '',
    selectedGroups: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [walletAddressError, setWalletAddressError] = useState<string>('');
  const [addressNameError, setAddressNameError] = useState<string>('');

  const { escStage, isTopModal } = useModalContext();
  const [showEscTooltip, setShowEscTooltip] = useState(false);

  useEffect(() => {
    if (escStage === 1 && isTopModal) {
      setShowEscTooltip(true);
    } else {
      setShowEscTooltip(false);
    }
  }, [escStage, isTopModal]);

  // Use ALL groups (both API and user)
  const allGroups = useMemo(() => groups, [groups]);

  // Convert groups to dropdown options
  const groupOptions = useMemo(() => {
    return allGroups.map(group => ({
      value: group.id.toString(),
      label: group.name,
      metadata: `${group.count} address${group.count !== 1 ? 'es' : ''}`,
      isUserGroup: group.id >= 10000, // Add metadata to distinguish user groups
    }));
  }, [allGroups]);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'walletAddress' && walletAddressError) {
      setWalletAddressError('');
    }
    if (name === 'addressName' && addressNameError) {
      setAddressNameError('');
    }
    if (error) setError('');
  };

  // Handle groups selection change
  const handleGroupsChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setFormData(prev => ({
        ...prev,
        selectedGroups: value,
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;

    setWalletAddressError('');
    setAddressNameError('');
    setError('');

    if (!formData.walletAddress.trim()) {
      setWalletAddressError('Wallet address is required');
      isValid = false;
    } else if (!isValidWalletAddress(formData.walletAddress.trim())) {
      setWalletAddressError('Please enter a valid wallet address (Ethereum: 0x... or Solana: base58)');
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

  const isValidWalletAddress = (address: string): boolean => {
    const cleanAddress = address.trim();

    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    if (cleanAddress.startsWith('0x')) {
      return ethAddressRegex.test(cleanAddress) || cleanAddress.length === 42;
    } else {
      return solanaAddressRegex.test(cleanAddress) || cleanAddress.length >= 32;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert selected group IDs from strings to numbers
      const groupIds = formData.selectedGroups.map(id => parseInt(id, 10));

      console.log('Creating address with groups:', {
        walletHash: formData.walletAddress.trim(),
        name: formData.addressName.trim(),
        groupIds: groupIds.length > 0 ? groupIds : undefined,
      });

      // Create the address using the mock cache
      const newAddress = await createAddress({
        walletHash: formData.walletAddress.trim(),
        name: formData.addressName.trim(),
        groupIds: groupIds.length > 0 ? groupIds : undefined,
      });

      console.log('Address created successfully:', newAddress);
      console.log('Added to groups:', groupIds);

      // Reset form
      setFormData({
        walletAddress: '',
        addressName: '',
        selectedGroups: [],
      });

      // Close modal
      onClose();

      // Dispatch events
      window.dispatchEvent(new CustomEvent('addressesUpdated'));
      window.dispatchEvent(new CustomEvent('userAddressesUpdated'));
      window.dispatchEvent(new CustomEvent('groupsUpdated'));

      // Notify parent
      if (onAddressAdded) {
        onAddressAdded();
      }

    } catch (err) {
      console.error('Failed to add address:', err);
      setError(err instanceof Error ? err.message : 'Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeGroup = (groupId: string) => {
    const newGroups = formData.selectedGroups.filter(id => id !== groupId);
    setFormData(prev => ({
      ...prev,
      selectedGroups: newGroups,
    }));
  };

  const handleClose = () => {
    if (showEscTooltip) {
      onClose();
    } else if (escStage === 1 && isTopModal) {
      // The ESC tooltip will be shown by the context
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
      <div className="flex flex-col items-start gap-2.5 self-stretch">
        <div className="flex justify-between items-start self-stretch">
          <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
            <AddAddressIcon className="w-8 h-8 aspect-square" />
          </div>

          <IconButton
            icon={showEscTooltip ? <CloseCircleFilledIcon /> : <CloseIcon />}
            size="sm"
            status={showEscTooltip ? "danger" : "neutral"}
            onClick={handleClose}
            tooltipTitle={showEscTooltip ? "Esc again to confirm" : "Esc to exit"}
            showTooltip={showEscTooltip}
          />
        </div>
        <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
          <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
            Add address
          </span>
        </div>
      </div>

      <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
        <TextInput
          label="Wallet address"
          name="walletAddress"
          placeholder="Hash"
          leadingIcon={<HashIcon />}
          value={formData.walletAddress}
          onChange={handleInputChange}
          width="full"
          error={!!walletAddressError}
          helperText={walletAddressError || "Use 0xdadB0d80178819F2319190D340ce9A924f783711"}
          disabled={loading}
          required
        />

        <TextInput
          label="Name"
          name="addressName"
          placeholder="Alias for this address"
          value={formData.addressName}
          onChange={handleInputChange}
          width="full"
          error={!!addressNameError}
          helperText={addressNameError}
          disabled={loading}
          required
        />

        <Dropdown
          label="Groups"
          placeholder="Add to groups (optional)"
          leadingIcon={<AddToGroupIcon />}
          options={groupOptions}
          value={formData.selectedGroups}
          onChange={handleGroupsChange}
          width="full"
          disabled={loading}
          allowSearch={true}
          multiple={true}
          searchPlaceholder="Search groups..."
          emptyText="No groups found"
          allowCreate={false}
          maxHeight="300px"
        />

        {/* Display selected groups as chips */}
        {formData.selectedGroups.length > 0 && (
          <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
            {formData.selectedGroups.map((groupId) => {
              const group = allGroups.find(g => g.id.toString() === groupId);

              if (group) {
                return (
                  <div key={group.id} className="relative group flex pt-[2px] pr-[8px] pb-[2px] pl-[8px] items-start gap-1 rounded-[10px] border-[0.5px] border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/6">
                    {group.name}
                    <IconButton
                      className="opacity-50 group-hover:opacity-100 transition-opacity self-center group-hover:shadow-[0_0_10px_6px_#0E1011] rounded-full"
                      icon={<CloseCircleFilledIcon />}
                      size="sm"
                      status="neutral"
                      onClick={() => removeGroup(groupId)}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded w-full font-[Geist]">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-3 self-stretch">
        <PrimaryButton
          size="md"
          variant="brand"
          label={loading ? "Adding..." : "Add address"}
          type="submit"
          disabled={loading || !formData.walletAddress.trim() || !formData.addressName.trim()}
        />
      </div>
    </form>
  );
}