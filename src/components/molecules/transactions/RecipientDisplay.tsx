"use client";

import React from "react";
import { RiUserLine, RiGroupLine, RiHashtag } from "@remixicon/react";
import { determineMultirecipients } from "./view-all/calculations";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";

interface RecipientDisplayProps {
    multiRecipient: boolean;
    recipients: any;
    addresses: AddressCardProps[];
    userGroups?: any[];
    addressGroups?: Record<number, number[]>;
}

export function RecipientDisplay({
    multiRecipient,
    recipients,
    addresses,
    userGroups,
    addressGroups
}: RecipientDisplayProps) {
    const determineRecipientIcon = () => {
        if (multiRecipient) {
            return <RiGroupLine size={16} className="text-[var(--color-icon-muted)] shrink-0" />;
        }
        
        let hasAddressId = false;
        if (Array.isArray(recipients)) {
            if (recipients.length > 0 && recipients[0].addressId) {
                hasAddressId = true;
            }
        } else if (recipients && typeof recipients === "object") {
            if (recipients.addressId) {
                hasAddressId = true;
            }
        }

        if (hasAddressId) {
            return <RiUserLine size={16} className="text-[var(--color-icon-muted)] shrink-0" />;
        }
        
        return <RiHashtag size={16} className="text-[var(--color-icon-muted)] shrink-0" />;
    };

    const getRecipientsText = () => {
        if (multiRecipient) {
            const recipientIds = Array.isArray(recipients)
                ? (recipients.map(r => r.addressId).filter(Boolean) as number[])
                : [];
            
            if (userGroups && addressGroups && recipientIds.length > 0) {
                const groupMembers: Record<number, number[]> = {};
                Object.entries(addressGroups).forEach(([addressIdStr, groupIds]) => {
                    const addressId = parseInt(addressIdStr, 10);
                    groupIds.forEach(groupId => {
                        if (!groupMembers[groupId]) {
                            groupMembers[groupId] = [];
                        }
                        groupMembers[groupId].push(addressId);
                    });
                });

                const sortedRecipients = [...recipientIds].sort((a, b) => a - b).join(",");

                const matchingGroup = userGroups.find(group => {
                    const members = groupMembers[group.id] || [];
                    const sortedMembers = [...members].sort((a, b) => a - b).join(",");
                    return sortedMembers === sortedRecipients;
                });

                if (matchingGroup) {
                    return matchingGroup.name;
                }
            }

            const count = Array.isArray(recipients) ? recipients.length : 0;
            return `${count} recipients`;
        }

        const text = determineMultirecipients(multiRecipient, recipients, addresses);
        return text || "Contract Interaction";
    };

    return (
        <div className="flex items-center gap-2 min-w-0">
            {determineRecipientIcon()}
            <span className="text-[var(--color-text-primary)] text-sm font-light tracking-tight truncate">
                {getRecipientsText()}
            </span>
        </div>
    );
}
