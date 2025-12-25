// src/app/components/ProfileMenu.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ProfileMenuItem = {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    isDestructive?: boolean;
    disabled?: boolean;
};

type ProfileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    items: ProfileMenuItem[];
    anchorRef: React.RefObject<HTMLButtonElement | null>;
};

export default function ProfileMenu({ isOpen, onClose, items, anchorRef }: ProfileMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuHeight, setMenuHeight] = useState(200); // Default approximate height

    // Update menu height after render
    useEffect(() => {
        if (isOpen && menuRef.current) {
            setMenuHeight(menuRef.current.scrollHeight);
        }
    }, [isOpen]);

    // Close menu when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Calculate position relative to anchor element - positioned directly above the icon button
    const getMenuPosition = () => {
        if (!anchorRef.current) return { top: 0, left: 0 };

        const rect = anchorRef.current.getBoundingClientRect();
        const menuWidth = 240; // Fixed menu width
        const gap = 8; // 8px gap between menu and anchor
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        
        // Calculate left position
        let left = rect.left;
        
        // Check if menu would overflow on the right side
        if (left + menuWidth > viewportWidth) {
            // Move left to fit within viewport
            left = viewportWidth - menuWidth - 16; // 16px margin from right edge
        }
        
        // Position directly above the anchor button with a small gap
        return {
            top: `${rect.top - menuHeight - gap}px`, // Position above with gap
            left: `${left}px`,
        };
    };

    if (!isOpen) return null;

    const menuContent = (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9998] bg-transparent"
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Menu */}
            <div
                ref={menuRef}
                // className="fixed z-[9999] rounded-[14px] bg-[#0E1011]/1 backdrop-blur-lg border-[1px] border-solid border-[#F8FCFF]/16 shadow-[0_0_100px_64px_#0E1011]"
                className="fixed z-[9999] rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 shadow-[0_0_100px_64px_#0E1011]"
                style={{
                    ...getMenuPosition(),
                    width: '240px',
                    minWidth: '240px',
                }}
                role="menu"
                aria-orientation="vertical"
            >
                <div className="flex flex-col m-1 gap-0.5">
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            role="menuitem"
                            disabled={item.disabled}
                            className={`group/option flex flex-row items-center justify-between pt-[10px] pr-[16px] pb-[10px] pl-[16px] rounded-[10px] w-full text-left transition-colors duration-150 ${
                                item.disabled
                                    ? 'opacity-50 cursor-not-allowed' // Disabled styling
                                    : item.isDestructive 
                                        ? 'text-[#FF6B6B] hover:bg-[#FF6B6B]/10 cursor-pointer' 
                                        : 'text-[#F8FCFF] hover:bg-[#F8FCFF]/8 cursor-pointer'
                            }`}
                            onClick={(e) => {
                                if (item.disabled) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return;
                                }
                                
                                onClose();
                                item.action();
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon && (
                                    <span className={`${item.disabled ? 'opacity-50' : 'opacity-70'} flex-shrink-0`}>
                                        {item.icon}
                                    </span>
                                )}
                                <span className="text-sm font-[Geist] not-italic font-light leading-[normal] tracking-[0.7px]">
                                    {item.label}
                                </span>
                            </div>
                            
                            {item.trailingIcon && (
                                <span className={`${item.disabled ? 'opacity-100' : 'opacity-30 group-hover/option:opacity-70'} transition-opacity duration-150 flex-shrink-0`}>
                                    {item.trailingIcon}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );

    if (typeof window !== 'undefined') {
        return createPortal(menuContent, document.body);
    }

    return null;
}