"use client";
import React, { useState } from "react";
import SideNavItem from "./SideNavItem";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { WalletIcon, CoinIcon, ListIcon, CheckIcon, AddressIcon, GroupIcon, SettingsIcon, SpaceIcon, ExpandIcon } from "@/app/components/icons";

function SideNavSection({ title, children, pill }: { title: string; children?: React.ReactNode; pill?: React.ReactNode }) {
    return (
        <div className={`flex flex-col items-start gap-1 w-full self-stretch ${pill ? "opacity-100" : ""}`}>
            <div className="flex pl-1 items-center gap-2.5 self-stretch">
                <span className={`text-[#C8CACB] font-[Geist Mono] text-[10px] not-italic font-medium leading-[normal] tracking-[1.4px] uppercase pl-1 ${pill ? "opacity-50" : "opacity-100"}`}>
                    {title}
                </span>
                {pill}
            </div>
            {children && (
                <div className="flex flex-col items-start gap-[10px] w-full self-stretch">
                    {children}
                </div>
            )}
        </div>
    );
}

function MenuIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            className={`block w-[18px] h-[18px] ${className}`}
            fill="none"
            viewBox="0 0 18 18"
            aria-hidden="true"
        >
            <path d="M2.25 3H15.75V4.5H2.25V3ZM6.75 8.25H15.75V9.75H6.75V8.25ZM2.25 13.5H15.75V15H2.25V13.5Z" fill="white" />
        </svg>
    );
}

import Image from "next/image";
import IconButton from "./buttons/IconButton";
import TertiaryButton from "./buttons/TertiaryButton";

function FrameAvatar() {
    return (
        // <div className="overflow-clip relative rounded-[120px] w-[40px] h-[40px] z-10 group-hover/sidebar:hidden">
        //     <Image
        //         src="/avatar/Rectangle.png"
        //         alt="Avatar"
        //         width={40}
        //         height={40}
        //         className="absolute left-0 top-0 rounded-[70px] w-[40px] h-[40px] object-cover"
        //     />
        //     <div
        //         className="absolute border-[0.5px] border-solid border-white inset-0 pointer-events-none rounded-[70px]"
        //         aria-hidden="true"
        //     />
        //     <div
        //         className="absolute font-bold leading-[0] text-[16px] text-nowrap text-white tracking-[1.28px]"
        //         style={{ top: "calc(50% - 9px)", left: "calc(50% - 11px)" }}
        //     >
        //         <p className="leading-[normal] whitespace-pre">De</p>
        //     </div>
        // </div>

        <div className="overflow-clip relative rounded-full w-[33px] h-[33px] z-10 ">
            <div
                className="relative w-[33px] h-[33px] rounded-full flex items-center justify-center text-white font-[geist] font-semibold text-[16px] bg-red-500">
                <Image
                    src="/avatar/pink.png"
                    alt="Avatar"
                    width={33}
                    height={33}
                    className="absolute left-0 top-0 rounded-full w-[33px] h-[33px] object-cover border-solid border-[0.2px] border-white z-0"
                />
                <span className="z-1">De</span>
            </div>
        </div>
    );
}

export default function SideNav() {
    const pathname = usePathname();

    const navSections = [
        {
            title: "View and manage",
            items: [
                { label: "Wallets", icon: WalletIcon, href: "/wallets" },
                { label: "Assets", icon: CoinIcon, href: "/assets" },
            ],
        },
        {
            title: "Transactions",
            items: [
                { label: "View all", icon: ListIcon, href: "/transactions/view-all" },
                { label: "Proposals", icon: CheckIcon, href: "/transactions/proposals" },
            ],
        },
        {
            title: "Accounting",
            pill: (
                <div className="flex py-[6px] px-[10px] justify-center items-center gap-2.5 rounded-full bg-[#052e21]">
                    <span className="text-[#069668] font-[Figtree] text-xs not-italic font-semibold leading-[normal]">
                        Coming soon
                    </span>
                </div>
            ),
            items: [],
        },
        {
            title: "Address book",
            items: [
                { label: "Addresses", icon: AddressIcon, href: "/address-book/addresses" },
                { label: "Groups", icon: GroupIcon, href: "/address-book/groups" },
            ],
        },
    ];

    const allNavItems = navSections.flatMap(section => section.items);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Helper function to check if a nav item is active
    const isNavItemActive = (itemHref: string, currentPathname: string) => {
        if (itemHref === '/wallets') {
            // For wallets, check if current path starts with /wallets
            return currentPathname.startsWith('/wallets');
        }
        // For other items, use exact match or check if it's the root path
        return currentPathname === itemHref || (currentPathname === '/' && itemHref === '/wallets');
    };

    return (
        <nav
            className="group/sidebar w-[270px] h-[100vh] flex flex-col items-start gap-11 shrink-0 self-stretch border-r border-black"
            style={{
                background: "linear-gradient(180deg, #0D1F26 0%, #070F13 67.51%, #000 100%)"
            }}
        >

            <div className="flex pt-[20px] pr-[20px] pb-[20px] pl-[28px] justify-between items-center self-stretch border-b-[0.5px] border-b-[#2D3436]">
                <div className="flex items-center gap-2 flex-[1_0_0]">
                    <div className="relative w-6 h-6">
                        <SpaceIcon className="w-6 h-6 text-[#D7DCF3] opacity-100 group-hover/sidebar:opacity-0 absolute left-0 top-0" />
                        <IconButton className="opacity-0 group-hover/sidebar:opacity-100 absolute left-0 top-0" icon={<ExpandIcon />} size="md" status="neutral" />
                    </div>
                    <span className="text-[#D7DCF3] font-[Figtree] text-sm not-italic font-semibold leading-[normal] tracking-[0.112px]">Acme Co.</span>
                </div>
                <IconButton className="opacity-0 group-hover/sidebar:opacity-100" icon={<SettingsIcon />} size="md" status="neutral" />
            </div>

            <div className="flex py-[0] px-[20px] flex-col items-start gap-10 flex-[1_0_0] self-stretch">

                {navSections.map((section, index) => (
                    <SideNavSection key={index} title={section.title} pill={section.pill}>
                        {section.items && section.items.map((item) => {
                            const isActive = isNavItemActive(item.href, pathname);
                            return (
                                <Link href={item.href} key={item.label} className="w-full">
                                    <SideNavItem
                                        icon={item.icon}
                                        label={item.label}
                                        active={isActive}
                                    />
                                </Link>
                            );
                        })}
                    </SideNavSection>
                ))}

            </div>

            <div className="flex p-4 flex-col items-start gap-2.5 self-stretch">
                <div className="flex pt-[4px] pr-[16px] pb-[4px] pl-[4px] items-center self-stretch rounded-full border-[0.6px] border-transparent group-hover/sidebar:border-[0.6px] hover:bg-[#052e21] group-hover/sidebar:border-[rgba(255,255,255,0.2)] cursor-pointer">
                    <div className="relative flex justify-center items-center gap-2.5 flex-[1_0_0] rounded-full">
                        <FrameAvatar />
                        <div className="flex flex-col items-start gap-[1px] flex-[1_0_0]">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Delanoy Kunil</span>
                            <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.8px] opacity-70">Admin</span>
                        </div>
                    </div>
                    <IconButton size="sm" icon={<MenuIcon />} className="opacity-0 group-hover/sidebar:opacity-100" status="neutral" />
                </div>
            </div>
        </nav>
    );
}