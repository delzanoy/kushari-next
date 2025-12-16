// import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from 'react';
// import { AddAddressIcon, CloseIcon, CloseCircleFilledIcon, HashIcon, AddToGroupIcon } from "@/app/components/icons"
// import IconButton from "@/app/components/buttons/IconButton";
// import { TextInput } from "@/app/components/forms";
// import Dropdown from "@/app/components/forms/Dropdown";
// import PrimaryButton from "@/app/components/buttons/PrimaryButton";
// import { useModalContext } from '@/app/components/modal/Modal';
// import { GroupCardProps } from '../groups/types';
// import { createAddress } from '@/app/api/mock-cache';

// interface AddAddressModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   groups?: GroupCardProps[];
//   onAddressAdded?: () => void;
// }

// interface AddressFormData {
//   walletAddress: string;
//   addressName: string;
//   selectedGroups: string[];
// }

// export default function AddAddressModal({ isOpen, onClose, groups = [], onAddressAdded }: AddAddressModalProps) {
//   const [formData, setFormData] = useState<AddressFormData>({
//     walletAddress: '',
//     addressName: '',
//     selectedGroups: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>('');
//   const [walletAddressError, setWalletAddressError] = useState<string>('');
//   const [addressNameError, setAddressNameError] = useState<string>('');

//   const { escStage, isTopModal } = useModalContext();
//   const [showEscTooltip, setShowEscTooltip] = useState(false);

//   useEffect(() => {
//     if (escStage === 1 && isTopModal) {
//       setShowEscTooltip(true);
//     } else {
//       setShowEscTooltip(false);
//     }
//   }, [escStage, isTopModal]);

//   // Convert groups to dropdown options
//   const groupOptions = useMemo(() => {
//     return groups.map(group => ({
//       value: group.id.toString(),
//       label: group.name,
//       metadata: `${group.count} address${group.count !== 1 ? 'es' : ''}`,
//     }));
//   }, [groups]);

//   // Handle form input changes
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
    
//     // Clear individual errors when user starts typing
//     if (name === 'walletAddress' && walletAddressError) {
//       setWalletAddressError('');
//     }
//     if (name === 'addressName' && addressNameError) {
//       setAddressNameError('');
//     }
//     if (error) setError('');
//   };

//   // Handle groups selection change (multi-select)
//   const handleGroupsChange = (value: string | string[]) => {
//     if (Array.isArray(value)) {
//       setFormData(prev => ({
//         ...prev,
//         selectedGroups: value,
//       }));
//     }
//   };

//   // Validate form
//   const validateForm = (): boolean => {
//     let isValid = true;
    
//     // Reset all errors
//     setWalletAddressError('');
//     setAddressNameError('');
//     setError('');
    
//     // Validate wallet address (basic validation - adjust based on your requirements)
//     if (!formData.walletAddress.trim()) {
//       setWalletAddressError('Wallet address is required');
//       isValid = false;
//     } else if (!isValidWalletAddress(formData.walletAddress.trim())) {
//       setWalletAddressError('Please enter a valid wallet address');
//       isValid = false;
//     }
    
//     // Validate address name
//     if (!formData.addressName.trim()) {
//       setAddressNameError('Address name is required');
//       isValid = false;
//     } else if (formData.addressName.trim().length < 2) {
//       setAddressNameError('Address name must be at least 2 characters');
//       isValid = false;
//     }
    
//     return isValid;
//   };

//   // Simple wallet address validation (adjust based on your blockchain requirements)
//   const isValidWalletAddress = (address: string): boolean => {
//     // Basic Ethereum address validation (0x followed by 40 hex characters)
//     const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    
//     // Solana address validation (base58, 32-44 chars)
//     const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    
//     return ethAddressRegex.test(address) || solanaAddressRegex.test(address);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setLoading(true);
//     setError('');
    
//     try {
//       // Convert selected group IDs from strings to numbers
//       const groupIds = formData.selectedGroups.map(id => parseInt(id, 10));
      
//       // Create the address using the mock cache
//       const newAddress = await createAddress({
//         walletHash: formData.walletAddress.trim(),
//         name: formData.addressName.trim(),
//         groupIds: groupIds.length > 0 ? groupIds : undefined,
//       });
      
//       console.log('Address created:', newAddress);
      
//       // Reset form
//       setFormData({
//         walletAddress: '',
//         addressName: '',
//         selectedGroups: [],
//       });
      
//       // Close modal
//       onClose();
      
//       // Notify parent to refresh the list
//       if (onAddressAdded) {
//         onAddressAdded();
//       }
      
//       // Dispatch event to notify other components
//       window.dispatchEvent(new CustomEvent('addressesUpdated'));
      
//     } catch (err) {
//       console.error('Failed to add address:', err);
//       setError(err instanceof Error ? err.message : 'Failed to add address. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove a specific group
//   const removeGroup = (groupId: string) => {
//     const newGroups = formData.selectedGroups.filter(id => id !== groupId);
//     setFormData(prev => ({
//       ...prev,
//       selectedGroups: newGroups,
//     }));
//   };

//   // Handle ESC key close
//   const handleClose = () => {
//     if (showEscTooltip) {
//       onClose();
//     } else if (escStage === 1 && isTopModal) {
//       // The ESC tooltip will be shown by the context
//     } else {
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <form onSubmit={handleSubmit} className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
//       <div className="flex flex-col items-start gap-2.5 self-stretch">
//         <div className="flex justify-between items-start self-stretch">
//           <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
//             <AddAddressIcon className="w-8 h-8 aspect-square" />
//           </div>

//           <IconButton
//             icon={showEscTooltip ? <CloseCircleFilledIcon /> : <CloseIcon />}
//             size="sm"
//             status={showEscTooltip ? "danger" : "neutral"}
//             onClick={handleClose}
//             tooltipTitle="Esc again to confirm"
//             showTooltip={showEscTooltip}
//           />
//         </div>
//         <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
//           <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//             Add address
//           </span>
//         </div>
//       </div>

//       <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
//         <TextInput
//           label="Wallet address"
//           name="walletAddress"
//           placeholder="Hash"
//           leadingIcon={<HashIcon />}
//           value={formData.walletAddress}
//           onChange={handleInputChange}
//           width="full"
//           error={!!walletAddressError}
//           helperText={walletAddressError}
//           disabled={loading}
//           required
//         />

//         <TextInput
//           label="Name"
//           name="addressName"
//           placeholder="Alias"
//           value={formData.addressName}
//           onChange={handleInputChange}
//           width="full"
//           error={!!addressNameError}
//           helperText={addressNameError}
//           disabled={loading}
//           required
//         />
        
//         <Dropdown
//           label="Groups"
//           placeholder="Add to group(s)"
//           leadingIcon={<AddToGroupIcon />}
//           options={groupOptions}
//           value={formData.selectedGroups}
//           onChange={handleGroupsChange}
//           width="full"
//           disabled={loading}
//           allowSearch={true}
//           multiple={true}
//           searchPlaceholder="Search groups..."
//           emptyText="No groups found"
//           allowCreate={false}
//           maxHeight="300px"
//         />
        
//         {/* Display selected groups as chips */}
//         {formData.selectedGroups.length > 0 && (
//           <div className="flex items-start content-start gap-2 self-stretch flex-wrap mt-2">
//             {formData.selectedGroups.map((groupId) => {
//               const group = groups.find(g => g.id.toString() === groupId);
              
//               if (group) {
//                 return (
//                   <div
//                     key={group.id}
//                     className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#F8FCFF]/10 border border-[#F8FCFF]/20"
//                   >
//                     <div className="flex flex-col">
//                       <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal]">
//                         {group.name}
//                       </span>
//                       <span className="text-[#F8FCFF]/60 font-[Geist] text-xs not-italic font-normal leading-[normal]">
//                         {group.count} address{group.count !== 1 ? 'es' : ''}
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeGroup(groupId)}
//                       className="ml-2 text-[#F8FCFF]/40 hover:text-[#F8FCFF]"
//                       disabled={loading}
//                     >
//                       <CloseCircleFilledIcon className="h-4 w-4" />
//                     </button>
//                   </div>
//                 );
//               }
//               return null;
//             })}
//           </div>
//         )}
        
//         {formData.selectedGroups.length > 0 && (
//           <div className="text-[#F8FCFF]/60 font-[Geist] text-sm not-italic font-normal leading-[normal] mt-1">
//             Added to {formData.selectedGroups.length} group{formData.selectedGroups.length !== 1 ? 's' : ''}
//           </div>
//         )}

//         {/* Display general error */}
//         {error && (
//           <div className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded w-full font-[Geist]">
//             {error}
//           </div>
//         )}
//       </div>

//       <div className="flex flex-col items-end gap-3 self-stretch">
//         <PrimaryButton
//           size="md"
//           variant="brand"
//           label={loading ? "Adding..." : "Add address"}
//           type="submit"
//           disabled={loading || !formData.walletAddress.trim() || !formData.addressName.trim()}
//         />
//       </div>
//     </form>
//   );
// }



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
            tooltipTitle="Esc again to confirm"
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
          placeholder="Enter wallet hash (0x... for Ethereum or base58 for Solana)"
          leadingIcon={<HashIcon />}
          value={formData.walletAddress}
          onChange={handleInputChange}
          width="full"
          error={!!walletAddressError}
          helperText={walletAddressError || "For testing: 0x followed by 40 hex characters"}
          disabled={loading}
          required
        />

        <TextInput
          label="Name"
          name="addressName"
          placeholder="Enter an alias for this address"
          value={formData.addressName}
          onChange={handleInputChange}
          width="full"
          error={!!addressNameError}
          helperText={addressNameError}
          disabled={loading}
          required
        />
        
        <Dropdown
          label="Add to groups (optional)"
          placeholder="Select groups"
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
          <div className="flex items-start content-start gap-2 self-stretch flex-wrap mt-2">
            {formData.selectedGroups.map((groupId) => {
              const group = allGroups.find(g => g.id.toString() === groupId);
              
              if (group) {
                const isUserGroup = group.id >= 10000;
                
                return (
                  <div
                    key={group.id}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border ${isUserGroup ? 'bg-[#F8FCFF]/10 border-[#F8FCFF]/20' : 'bg-blue-500/10 border-blue-500/20'}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal]">
                        {group.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[#F8FCFF]/60 font-[Geist] text-xs not-italic font-normal leading-[normal]">
                          {group.count} address{group.count !== 1 ? 'es' : ''}
                        </span>
                        {isUserGroup ? (
                          <span className="text-xs px-1 py-0.5 bg-green-500/20 text-green-400 rounded">
                            User
                          </span>
                        ) : (
                          <span className="text-xs px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                            API
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGroup(groupId)}
                      className="ml-2 text-[#F8FCFF]/40 hover:text-[#F8FCFF]"
                      disabled={loading}
                    >
                      <CloseCircleFilledIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        
        {formData.selectedGroups.length > 0 && (
          <div className="text-[#F8FCFF]/60 font-[Geist] text-sm not-italic font-normal leading-[normal] mt-1">
            Will add to {formData.selectedGroups.length} group{formData.selectedGroups.length !== 1 ? 's' : ''}
            {formData.selectedGroups.some(g => {
              const groupId = parseInt(g, 10);
              return groupId >= 10000;
            }) && " (User group counts will update)"}
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