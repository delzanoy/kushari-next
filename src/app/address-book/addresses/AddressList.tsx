import { useState } from 'react';
import AddressCard from "./AddressCard";
import { AddressCardProps } from "./types";

export default function AddressList({ addresses }: { addresses: AddressCardProps[] }) {

    const [selectedAddresses, setSelectedAddresses] = useState<number[]>([]);

    const handleAddressSelect = (addressId: number, selected: boolean) => {
        if (selected) {
            // Add to selected array
            setSelectedAddresses(prev => [...prev, addressId]);
        } else {
            // Remove from selected array
            setSelectedAddresses(prev => prev.filter(id => id !== addressId));
        }
    };

    console.log(selectedAddresses);

    return <div className="flex flex-col-reverse">
        {addresses.map((address) => (
            <AddressCard
                key={address.id}
                address={address}
                selected={selectedAddresses.includes(address.id)}
                onSelect={handleAddressSelect}
            />
        ))}
    </div>
}