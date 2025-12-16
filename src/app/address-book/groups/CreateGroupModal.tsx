// import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from 'react';
// import { AddToGroupIcon, CloseIcon, SearchIcon, CloseCircleFilledIcon } from '@/app/components/icons';
// import IconButton from '@/app/components/buttons/IconButton';
// import PrimaryButton from '@/app/components/buttons/PrimaryButton';
// import { TextInput, RadioGroup } from '@/app/components/forms';
// import Dropdown from '@/app/components/forms/Dropdown';
// import { AddressCardProps } from "../addresses/types";
// import { useModalContext } from '@/app/components/modal/Modal';

// import { createGroup } from '@/app/api/mock-cache';

// interface CreateGroupModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onCreate: (payload: { name: string; count: number }) => Promise<void>;
//     addresses?: AddressCardProps[];
//     onGroupCreated?: () => void; // Optional callback to refresh the list
// }

// export default function CreateGroupModal({ isOpen, onClose, onCreate, addresses = [], onGroupCreated }: CreateGroupModalProps) {
//     const [name, setName] = useState('');
//     const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [selectedMethodType, setSelectedMethodType] = useState("few");
//     const [searchQuery, setSearchQuery] = useState("");

//     const { escStage, isTopModal } = useModalContext();
//     const [showEscTooltip, setShowEscTooltip] = useState(false);

//     useEffect(() => {
//         if (escStage === 1 && isTopModal) {
//             setShowEscTooltip(true);
//         } else {
//             setShowEscTooltip(false);
//         }
//     }, [escStage, isTopModal]);

//     if (!isOpen) return null;

//     const options = [
//         { value: "few", label: "Add few" },
//         { value: "bulk", label: "Add in bulk(csv)" },
//     ];

//     // Convert addresses to dropdown options
//     const addressOptions = useMemo(() => {
//         return addresses.map(address => ({
//             value: address.id.toString(),
//             label: address.name || `Address ${address.id}`,
//             metadata: address.walletHash,
//         }));
//     }, [addresses]);

//     // Handle name input change
//     const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setName(e.target.value);
//     };

//     // Handle addresses selection change (multi-select)
//     const handleAddressesChange = (value: string | string[]) => {
//         if (Array.isArray(value)) {
//             setSelectedAddresses(value);
//         }
//     };

//     // Handle search in the dropdown
//     const handleSearchChange = (query: string) => {
//         setSearchQuery(query);
//     };

//     // Remove a specific address
//     const removeAddress = (addressId: string) => {
//         const newAddresses = selectedAddresses.filter(id => id !== addressId);
//         setSelectedAddresses(newAddresses);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setError('');

//         if (!name.trim()) {
//             setError('Group name is required');
//             return;
//         }

//         if (selectedAddresses.length === 0) {
//             setError('Please select at least one address');
//             return;
//         }

//         // Count will be the number of selected addresses
//         const count = selectedAddresses.length;

//         setLoading(true);
//         try {
//             // Create the demo group using mock cache
//             const newGroup = await createGroup({
//                 name: name.trim(),
//                 count: count,
//                 lastModifiedBy: 'Delanoy Kunil'
//             });

//             console.log('Demo group created:', newGroup);

//             // Reset form
//             setName('');
//             setSelectedAddresses([]);
//             setSelectedMethodType("few");
//             setSearchQuery("");

//             // Close modal
//             onClose();

//             // Notify parent to refresh the list
//             if (onGroupCreated) {
//                 onGroupCreated();
//             } else {
//                 // If no callback provided, refresh the page to show the new group
//                 window.location.reload();
//             }

//         } catch (err) {
//             console.error('Failed to create demo group:', err);
//             setError('Failed to create demo group. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
//             <div className="flex flex-col items-start gap-2.5 self-stretch">
//                 <div className="flex justify-between items-start self-stretch">
//                     <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
//                         <AddToGroupIcon className="w-8 h-8 aspect-square" />
//                     </div>

//                     <IconButton
//                         icon={<CloseIcon />}
//                         size="sm"
//                         status={showEscTooltip ? "danger" : "neutral"}
//                         onClick={onClose}
//                         tooltipTitle="Esc again to confirm"
//                         showTooltip={showEscTooltip}
//                     />
//                 </div>
//                 <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
//                     <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//                         Create demo group
//                     </span>
//                 </div>
//             </div>

//             <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
//                 <TextInput
//                     label="Group name"
//                     name="groupName"
//                     placeholder="Use an identifiable name"
//                     value={name}
//                     onChange={handleNameChange}
//                     width="full"
//                     error={!!error && !name.trim()}
//                     helperText={!!error && !name.trim() ? "Group name is required" : ""}
//                     disabled={loading}
//                     required
//                 />

//                 <RadioGroup
//                     name="method-type"
//                     label="Add address to group"
//                     options={options}
//                     value={selectedMethodType}
//                     onChange={setSelectedMethodType}
//                     orientation="horizontal"
//                 />

//                 <div className="w-full flex flex-col gap-2">
//                     <Dropdown
//                         placeholder="Search address to add..."
//                         label="Addresses"
//                         leadingIcon={<SearchIcon />}
//                         options={addressOptions}
//                         value={selectedAddresses}
//                         onChange={handleAddressesChange}
//                         onSearchChange={handleSearchChange}
//                         width="full"
//                         disabled={loading}
//                         allowSearch={true}
//                         multiple={true}
//                         searchPlaceholder="Search address to add..."
//                         emptyText="No address found"
//                         allowCreate={false}
//                         maxHeight="300px"
//                     />

//                     {/* Selected addresses display as chips */}
//                     {selectedAddresses.length > 0 && (
//                         <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
//                             {selectedAddresses.map((addressId, index) => {
//                                 const address = addresses.find(a => a.id.toString() === addressId);

//                                 if (address) {
//                                     return (
//                                         <div
//                                             key={address.id}
//                                             className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#F8FCFF]/10 border border-[#F8FCFF]/20"
//                                         >
//                                             <div className="flex flex-col">
//                                                 <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal]">
//                                                     {address.name || `Address ${address.id}`}
//                                                 </span>
//                                                 <span className="text-[#F8FCFF]/60 font-[Geist] text-xs not-italic font-normal leading-[normal]">
//                                                     {address.walletHash?.substring(0, 10)}...
//                                                 </span>
//                                             </div>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeAddress(addressId)}
//                                                 className="ml-2 text-[#F8FCFF]/40 hover:text-[#F8FCFF]"
//                                             >
//                                                 <CloseCircleFilledIcon className="h-4 w-4" />
//                                             </button>
//                                         </div>
//                                     );
//                                 }

//                                 return null;
//                             })}
//                         </div>
//                     )}

//                     {selectedAddresses.length === 0 && !!error && (
//                         <span className="text-[#F25C54] font-[Geist] text-xs not-italic font-normal leading-[normal] mt-1 block">
//                             {error}
//                         </span>
//                     )}

//                     {selectedAddresses.length > 0 && (
//                         <div className="text-[#F8FCFF]/60 font-[Geist] text-sm not-italic font-normal leading-[normal] mt-1">
//                             Selected {selectedAddresses.length} address{selectedAddresses.length !== 1 ? 'es' : ''}
//                         </div>
//                     )}
//                 </div>

//                 {error && !error.includes('name') && !error.includes('address') && (
//                     <div className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded w-full font-[Geist]">
//                         {error}
//                     </div>
//                 )}

//                 <div className="text-xs text-[#F8FCFF]/40 mt-2 font-[Geist]">
//                     Demo groups are stored in your browser session and will be combined with API data.
//                 </div>
//             </div>

//             <div className="flex flex-col items-end gap-3 self-stretch">
//                 <PrimaryButton
//                     size="md"
//                     variant="brand"
//                     label={loading ? "Creating..." : "Create demo group"}
//                     type="submit"
//                     disabled={loading || !name.trim() || selectedAddresses.length === 0}
//                 />
//             </div>
//         </form>
//     );
// }



import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from 'react';
import { AddToGroupIcon, CloseIcon, SearchIcon, CloseCircleFilledIcon } from '@/app/components/icons';
import IconButton from '@/app/components/buttons/IconButton';
import PrimaryButton from '@/app/components/buttons/PrimaryButton';
import { TextInput, RadioGroup } from '@/app/components/forms';
import Dropdown from '@/app/components/forms/Dropdown';
import { AddressCardProps } from "../addresses/types";
import { useModalContext } from '@/app/components/modal/Modal';

import { createGroup } from '@/app/api/mock-cache';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (payload: { name: string; count: number }) => Promise<void>;
    addresses?: AddressCardProps[];
    onGroupCreated?: () => void; // Optional callback to refresh the list
}

export default function CreateGroupModal({ isOpen, onClose, onCreate, addresses = [], onGroupCreated }: CreateGroupModalProps) {
    const [name, setName] = useState('');
    const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMethodType, setSelectedMethodType] = useState<string>(""); // Empty by default
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

    if (!isOpen) return null;

    const options = [
        { value: "few", label: "Add few" },
        { value: "bulk", label: "Add in bulk(csv)" },
    ];

    // Convert addresses to dropdown options
    const addressOptions = useMemo(() => {
        return addresses.map(address => ({
            value: address.id.toString(),
            label: address.name || `Address ${address.id}`,
            metadata: address.walletHash,
        }));
    }, [addresses]);

    // Handle name input change
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    // Handle addresses selection change (multi-select)
    const handleAddressesChange = (value: string | string[]) => {
        if (Array.isArray(value)) {
            setSelectedAddresses(value);
        }
    };

    // Handle search in the dropdown
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    // Remove a specific address
    const removeAddress = (addressId: string) => {
        const newAddresses = selectedAddresses.filter(id => id !== addressId);
        setSelectedAddresses(newAddresses);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Group name is required');
            return;
        }

        // Only group name is required, addresses are optional
        // Count will be the number of selected addresses
        const count = selectedAddresses.length;

        setLoading(true);
        try {
            // Create the demo group using mock cache
            const newGroup = await createGroup({
                name: name.trim(),
                count: count,
                lastModifiedBy: 'Delanoy Kunil'
            });

            console.log('Demo group created:', newGroup);

            // Reset form
            setName('');
            setSelectedAddresses([]);
            setSelectedMethodType(""); // Reset to empty
            setSearchQuery("");

            // Close modal
            onClose();

            // Notify parent to refresh the list
            if (onGroupCreated) {
                onGroupCreated();
            } else {
                // If no callback provided, refresh the page to show the new group
                window.location.reload();
            }

        } catch (err) {
            console.error('Failed to create demo group:', err);
            setError('Failed to create demo group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        <AddToGroupIcon className="w-8 h-8 aspect-square" />
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
                        Create demo group
                    </span>
                </div>
            </div>

            <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                <TextInput
                    label="Group name"
                    name="groupName"
                    placeholder="Use an identifiable name"
                    value={name}
                    onChange={handleNameChange}
                    width="full"
                    error={!!error && !name.trim()}
                    helperText={!!error && !name.trim() ? "Group name is required" : ""}
                    disabled={loading}
                    required
                />

                <RadioGroup
                    name="method-type"
                    label="Add address to group"
                    options={options}
                    value={selectedMethodType}
                    onChange={setSelectedMethodType}
                    orientation="horizontal"
                />

                {/* Show dropdown only when "Add few" is selected */}
                {selectedMethodType === "few" && (
                    <div className="w-full flex flex-col gap-2">
                        <Dropdown
                            placeholder="Search address to add..."
                            label="Addresses"
                            leadingIcon={<SearchIcon />}
                            options={addressOptions}
                            value={selectedAddresses}
                            onChange={handleAddressesChange}
                            onSearchChange={handleSearchChange}
                            width="full"
                            disabled={loading}
                            allowSearch={true}
                            multiple={true}
                            searchPlaceholder="Search address to add..."
                            emptyText="No address found"
                            allowCreate={false}
                            maxHeight="300px"
                        />

                        {/* Selected addresses display as chips */}
                        {selectedAddresses.length > 0 && (
                            <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
                                {selectedAddresses.map((addressId, index) => {
                                    const address = addresses.find(a => a.id.toString() === addressId);

                                    if (address) {
                                        return (
                                            <div
                                                key={address.id}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#F8FCFF]/10 border border-[#F8FCFF]/20"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal]">
                                                        {address.name || `Address ${address.id}`}
                                                    </span>
                                                    <span className="text-[#F8FCFF]/60 font-[Geist] text-xs not-italic font-normal leading-[normal]">
                                                        {address.walletHash?.substring(0, 10)}...
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAddress(addressId)}
                                                    className="ml-2 text-[#F8FCFF]/40 hover:text-[#F8FCFF]"
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

                        {selectedAddresses.length > 0 && (
                            <div className="text-[#F8FCFF]/60 font-[Geist] text-sm not-italic font-normal leading-[normal] mt-1">
                                Selected {selectedAddresses.length} address{selectedAddresses.length !== 1 ? 'es' : ''}
                            </div>
                        )}
                    </div>
                )}

                {/* Show bulk upload content when "Add in bulk" is selected */}
                {selectedMethodType === "bulk" && (
                    <div className="w-full">
                        <label className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] mb-2 block">
                            Add in bulk (CSV)
                        </label>
                        {/* Empty div for your content - customize as needed */}
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#F8FCFF]/20 rounded-lg bg-[#151819]">
                            <p className="text-[#F8FCFF]/60 font-[Geist] text-sm mb-4">
                                Add your CSV upload component here
                            </p>
                            {/* Add your CSV upload component inside this div */}
                            <div className="text-[#F8FCFF]/40 font-[Geist] text-xs text-center">
                                You can implement your CSV file upload functionality here.
                                <br />
                                This is a placeholder for your custom content.
                            </div>
                        </div>
                    </div>
                )}

                {error && !error.includes('name') && (
                    <div className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded w-full font-[Geist]">
                        {error}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end gap-3 self-stretch">
                <PrimaryButton
                    size="md"
                    variant="brand"
                    label={loading ? "Creating..." : "Create demo group"}
                    type="submit"
                    disabled={loading || !name.trim()} // Only disabled if loading or no group name
                />
            </div>
        </form>
    );
}