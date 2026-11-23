"use client";

import React from "react";
import {
    RiEditLine,
    RiQrCodeLine,
    RiSendPlaneLine,
    RiUserAddLine
} from "@remixicon/react";
import { format } from "date-fns";
import { AddressCardProps, AddressTrustLevel } from "./types";
import { IconButton } from "@/components/atoms/IconButton";
import { Button } from "@/components/atoms/Button";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Checkbox } from "@/components/atoms/Checkbox";

interface AddressCardComponentProps {
    address: AddressCardProps;
    onSelect: (addressId: number, selected: boolean) => void;
    selected: boolean;
}

export default function AddressCard({ address, onSelect, selected }: AddressCardComponentProps) {

    const getAddressStatus = (verified: boolean, lastInteracted?: Date) => {
        if (verified && lastInteracted) {
            return {
                trustLevel: "trusted" as AddressTrustLevel,
                interactionStatus: format(lastInteracted, 'MMM do yyyy')
            };
        } else if (verified) {
            return {
                trustLevel: "unfamiliar" as AddressTrustLevel,
                interactionStatus: "Never"
            };
        } else {
            return {
                trustLevel: "unknown" as AddressTrustLevel,
                interactionStatus: "No chain history"
            };
        }
    };

    const { trustLevel, interactionStatus } = getAddressStatus(address.verified, address.lastInteracted);

    const displayGroups = address.groups.slice(0, 1);
    const hiddenGroups = address.groups.slice(1);
    const remainingGroups = hiddenGroups.length;

    const handleCheckboxChange = (checked: boolean) => {
        onSelect(address.id, checked);
    };

    return (
        <div
            className={`group/address relative flex w-full min-w-[1040px] mx-auto px-4 py-[10px] items-center gap-4 self-stretch border-b transition-colors duration-200 cursor-pointer ${selected ? "bg-[rgba(255,255,255,0.04)] border-[var(--color-border-default)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] hover:bg-[rgba(255,255,255,0.02)]"}`}
            onClick={() => handleCheckboxChange(!selected)}
        >
            <div className="flex w-[187px] items-center gap-3 shrink-0">
                <div onClick={(e) => e.stopPropagation()} className="flex items-center shrink-0">
                    <Checkbox
                        checked={selected}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        size="md"
                        aria-label={`Select ${address.name}`}
                    />
                </div>
                <span className="truncate text-[var(--color-text-primary)] text-sm font-medium tracking-tight">
                    {address.name}
                </span>
            </div>
            <div className="flex w-[406px] items-center justify-between shrink-0">
                <span className="truncate pr-4 text-[var(--color-text-primary)] font-mono text-sm font-light tracking-tight">
                    {address.walletHash}
                </span>
                <div className="opacity-0 group-hover/address:opacity-100 group-focus-within/address:opacity-100 transition-opacity shrink-0">
                    <IconButton
                        icon={<RiQrCodeLine />}
                        variant="neutral"
                        appearance="ghost"
                        size="sm"
                        aria-label={`Show QR Code for ${address.name}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
            <div className={`flex w-[154px] shrink-0 ${trustLevel === "trusted" ? "opacity-100" : "opacity-50"}`}>
                <span className="truncate text-[var(--color-text-secondary)] text-sm font-light tracking-tight">
                    {interactionStatus}
                </span>
            </div>

            <div className="flex h-[30px] justify-start items-center flex-1 min-w-0 pr-24">
                <div className="flex items-baseline gap-2.5 min-w-0 max-w-full">
                    {displayGroups.map((group) => (
                        <span
                            key={group.groupId}
                            className="text-[var(--color-text-secondary)] text-sm font-light tracking-tight truncate"
                        >
                            {group.groupName}
                        </span>
                    ))}
                    {remainingGroups > 0 && (
                        <Tooltip content={hiddenGroups.map(g => g.groupName).join(", ")} placement="top">
                            <div>
                                <TertiaryButton
                                    size="md"
                                    variant="neutral"
                                    onClick={(e) => e.stopPropagation()}
                                    className="whitespace-nowrap"
                                >
                                    +{remainingGroups} more
                                </TertiaryButton>
                            </div>
                        </Tooltip>
                    )}
                    {address.groups.length === 0 && (
                        <TertiaryButton
                            variant="brand"
                            size="md"
                            onClick={(e) => e.stopPropagation()}
                            leadingIcon={<RiUserAddLine />}
                        >
                            Add to group
                        </TertiaryButton>
                    )}
                </div>
            </div>

            <div className="absolute right-4 flex justify-end items-center gap-2 opacity-0 group-hover/address:opacity-100 group-focus-within/address:opacity-100 transition-opacity bg-inherit pl-4">
                <IconButton
                    icon={<RiEditLine />}
                    variant="neutral"
                    appearance="ghost"
                    size="sm"
                    aria-label={`Edit ${address.name}`}
                    onClick={(e) => e.stopPropagation()}
                />
                <IconButton
                    icon={<RiSendPlaneLine />}
                    variant="brand"
                    appearance="tonal"
                    size="sm"
                    aria-label={`Send to ${address.name}`}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}
