"use client";

import { useState, useEffect } from 'react';
import AddressCard from "./AddressCard";
import { AddressCardProps } from "./types";

interface AddressListProps {
    addresses: AddressCardProps[];
    selectedIds?: number[];
    onSelectionChange?: (selectedIds: number[]) => void;
}

export default function AddressList({ 
    addresses, 
    selectedIds = [],
    onSelectionChange 
}: AddressListProps) {
    const [internalSelected, setInternalSelected] = useState<number[]>([]);
    
    const isControlled = onSelectionChange !== undefined;
    const selectedAddresses = isControlled ? selectedIds : internalSelected;
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
                if (isInput) return;
                
                e.preventDefault();
                
                const allAddressIds = addresses.map(addr => addr.id);
                const allSelected = allAddressIds.length > 0 && 
                    allAddressIds.every(id => selectedAddresses.includes(id));
                
                let newSelection: number[];
                if (allSelected) {
                    newSelection = [];
                } else {
                    newSelection = allAddressIds;
                }
                
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
            newSelection = [...selectedAddresses, addressId];
        } else {
            newSelection = selectedAddresses.filter(id => id !== addressId);
        }
        
        if (isControlled && onSelectionChange) {
            onSelectionChange(newSelection);
        } else {
            setInternalSelected(newSelection);
        }
    };

    return (
        <div className="flex flex-col w-full">
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    selected={selectedAddresses.includes(address.id)}
                    onSelect={handleAddressSelect}
                />
            ))}
            {addresses.length === 0 && (
              <div className="py-12 text-center text-[var(--color-text-muted)] text-sm">
                No addresses found.
              </div>
            )}
        </div>
    );
}
