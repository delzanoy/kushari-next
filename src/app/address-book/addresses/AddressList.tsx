import { useState, useEffect } from 'react';
import AddressCard from "./AddressCard";
import { AddressCardProps } from "./types";

interface AddressListProps {
    addresses: AddressCardProps[];
    selectedIds?: number[]; // External control
    onSelectionChange?: (selectedIds: number[]) => void; // External control
}

export default function AddressList({ 
    addresses, 
    selectedIds = [], // Default empty array
    onSelectionChange 
}: AddressListProps) {
    
    // Use external selectedIds if provided, otherwise use internal state
    const [internalSelected, setInternalSelected] = useState<number[]>([]);
    
    // Determine which selection state to use
    const isControlled = onSelectionChange !== undefined;
    const selectedAddresses = isControlled ? selectedIds : internalSelected;
    
    // Handle CMD+A to select all
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                e.preventDefault();
                
                // Get all address IDs from filtered addresses
                const allAddressIds = addresses.map(addr => addr.id);
                
                // Check if all addresses are currently selected
                const allSelected = allAddressIds.length > 0 && 
                    allAddressIds.every(id => selectedAddresses.includes(id));
                
                let newSelection: number[];
                
                if (allSelected) {
                    // If all are selected, deselect all
                    newSelection = [];
                } else {
                    // Otherwise, select all
                    newSelection = allAddressIds;
                }
                
                // Update selection based on control mode
                if (isControlled && onSelectionChange) {
                    onSelectionChange(newSelection);
                } else {
                    setInternalSelected(newSelection);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [addresses, selectedAddresses, isControlled, onSelectionChange]);

    const handleAddressSelect = (addressId: number, selected: boolean) => {
        let newSelection: number[];
        
        if (selected) {
            // Add to selected array
            newSelection = [...selectedAddresses, addressId];
        } else {
            // Remove from selected array
            newSelection = selectedAddresses.filter(id => id !== addressId);
        }
        
        // Update selection based on control mode
        if (isControlled && onSelectionChange) {
            onSelectionChange(newSelection);
        } else {
            setInternalSelected(newSelection);
        }
    };

    return (
        <div className="flex flex-col-reverse">
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    selected={selectedAddresses.includes(address.id)}
                    onSelect={handleAddressSelect}
                />
            ))}
        </div>
    );
}