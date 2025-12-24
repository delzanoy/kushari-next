"use client";
import React from "react";

export type ProfileMenuItem = {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    isDestructive?: boolean;
};

type ProfileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    items: ProfileMenuItem[];
    anchorRef: React.RefObject<HTMLButtonElement | null>;
};

export default function ProfileMenu({ isOpen, onClose, items, anchorRef }: ProfileMenuProps) {
    if (!isOpen) return null;

    // Calculate position relative to anchor element
    const getMenuPosition = () => {
        if (!anchorRef.current) return { top: 0, left: 0 };

        const rect = anchorRef.current.getBoundingClientRect();
        return {
            top: rect.top - 16, // Position above the anchor with 16px offset
            left: rect.left - 20, // Adjust left position
        };
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-10"
                onClick={onClose}
            />
            
            {/* Menu positioned above the anchor */}
            <div
                className="fixed z-20 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 shadow-lg"
                style={{
                    ...getMenuPosition(),
                    transform: 'translateY(-100%)', // Move up by 100% of its own height
                    width: '240px',
                    minWidth: '240px',
                }}
            >
                <div className="flex flex-col m-1 gap-0.5">
                    {items.map((item, index) => (
                        <button
                            key={item.label}
                            type="button"
                            className={`group/option flex flex-row items-center justify-between pt-[10px] pr-[16px] pb-[10px] pl-[16px] rounded-[10px] hover:bg-[#F8FCFF]/8 cursor-pointer transition-colors duration-150 w-full text-left ${
                                item.isDestructive 
                                    ? 'text-[#FF6B6B] hover:bg-[#FF6B6B]/10' 
                                    : 'text-[#F8FCFF]'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                                onClose();
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon && (
                                    <span className="opacity-70">
                                        {item.icon}
                                    </span>
                                )}
                                <span className="text-sm font-[Geist] not-italic font-light leading-[normal] tracking-[0.7px]">
                                    {item.label}
                                </span>
                            </div>
                            
                            {/* Trailing Icon with hover effect */}
                            {item.trailingIcon && (
                                <span className="opacity-30 group-hover/option:opacity-70 transition-opacity duration-150">
                                    {item.trailingIcon}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}