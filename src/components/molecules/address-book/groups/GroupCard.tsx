"use client";

import React from "react";
import {
    RiGroupLine,
    RiSendPlaneLine,
    RiEditLine,
    RiHistoryLine,
    RiUserAddLine,
    RiArrowLeftUpBoxFill
} from "@remixicon/react";
import { format } from "date-fns";
import { GroupCardProps } from "./types";
import { IconButton } from "@/components/atoms/IconButton";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { useRouter } from 'next/navigation';

interface GroupProps {
    group: GroupCardProps;
    onUpdate?: (groupId: number, updates: Partial<GroupCardProps>) => void;
    onDelete?: (groupId: number) => void;
}

const formatDate = (date?: Date | number | string) => {
    if (!date) return 'Never';

    let dateObj: Date;

    if (typeof date === 'number') {
        dateObj = new Date(date);
    } else if (typeof date === 'string') {
        dateObj = new Date(date);
    } else {
        dateObj = date;
    }

    if (isNaN(dateObj.getTime())) {
        return 'Never';
    }

    return format(dateObj, 'MMM do yyyy');
};

const dispatchNavHover = (isHovering: boolean) => {
    window.dispatchEvent(new CustomEvent('groupCardHover', {
        detail: { isHovering, targetNav: '/address-book/addresses' }
    }));
};

export default function GroupCard({ group }: GroupProps) {
    const router = useRouter();
    const isSpecialGroup = group.id === 0;

    const handleCardClick = () => {
        if (!isSpecialGroup) {
            dispatchNavHover(false);
            router.push(`/address-book/addresses?search=${encodeURIComponent(group.name)}`);
        }
    };

    const handleViewUngrouped = () => {
        dispatchNavHover(false);
        router.push('/address-book/addresses?ungrouped=true');
    };

    const handleMouseEnter = () => {
        if (!isSpecialGroup) dispatchNavHover(true);
    };

    const handleMouseLeave = () => {
        if (!isSpecialGroup) dispatchNavHover(false);
    };

    if (isSpecialGroup) {
        return (
            <div className="group/group relative flex w-full min-w-[1040px] mx-auto px-0 py-4 items-center gap-4 self-stretch border-b border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.01)] transition-colors duration-200">
                <span className="w-80 shrink-0 text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate pl-4">
                    {group.name}
                </span>
                <div className="flex w-60 shrink-0 items-center gap-2 text-[var(--color-text-secondary)]">
                    <RiGroupLine size={16} className="opacity-70" />
                    <span className="text-sm font-light tracking-tight">{group.count}</span>
                </div>
                <div className="flex flex-1 items-center justify-end pr-4">
                    <TertiaryButton
                        size="sm"
                        variant="neutral"
                        onClick={handleViewUngrouped}
                    >
                        View ungrouped
                    </TertiaryButton>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group/group relative flex w-full min-w-[1040px] mx-auto px-0 py-4 items-center gap-4 self-stretch border-b transition-colors duration-200 cursor-pointer border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] hover:bg-[rgba(255,255,255,0.02)]"
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className="w-80 shrink-0 text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate pl-4">
                {group.name}
            </span>
            <div className="flex w-60 shrink-0 items-center gap-2 text-[var(--color-text-secondary)]">
                <RiGroupLine size={16} className="opacity-70" />
                <span className="text-sm font-light tracking-tight">{group.count}</span>
            </div>

            <div className="flex flex-1 items-center justify-between min-w-0">
                <div className={`flex items-center gap-2 text-[var(--color-text-secondary)] ${group.lastModifiedBy ? "opacity-100" : "opacity-0"}`}>
                    <RiHistoryLine size={16} className="opacity-70" />
                    <span className="text-sm font-medium tracking-tight truncate">{group.lastModifiedBy}</span>
                    <span className="text-sm font-light tracking-tight shrink-0">on {formatDate(group.lastModified || group.createdAt)}</span>
                </div>

                <div className="absolute right-4 flex justify-end items-center gap-2 opacity-0 group-hover/group:opacity-100 transition-opacity bg-inherit pl-4">
                    <IconButton
                        icon={<RiUserAddLine />}
                        variant="neutral"
                        appearance="ghost"
                        size="sm"
                        aria-label="Add to group"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <IconButton
                        icon={<RiEditLine />}
                        variant="neutral"
                        appearance="ghost"
                        size="sm"
                        aria-label="Edit group"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <IconButton
                        icon={<RiSendPlaneLine />}
                        variant="brand"
                        appearance="tonal"
                        size="sm"
                        aria-label="Send to group"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>

            <div className="absolute left-0 top-1 flex items-center gap-1 opacity-0 group-hover/group:opacity-60 transition-opacity pointer-events-none">
                <RiArrowLeftUpBoxFill size={10} className="text-[var(--color-text-primary)]" />
                <span className="text-[var(--color-text-primary)] text-[10px] font-medium leading-none uppercase tracking-wide">View addresses</span>
            </div>
        </div>
    );
}
