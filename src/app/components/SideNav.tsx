"use client";
import React, { useState, useEffect, useRef } from "react";
import SideNavItem from "./SideNavItem";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import IconButton from "./buttons/IconButton";
import { Modal } from "@/app/components/modal/Modal";
import FeatureUnderDevelopment from "@/app/components/FeatureUnderDevlopment/FeatureUnderDevelopment";
import useModal from "@/app/hooks/useModal";
import ProfileMenu, { ProfileMenuItem } from "./ProfileMenu";

import {
    WalletIcon,
    CoinIcon,
    ListIcon,
    CheckIcon,
    AddressIcon,
    GroupIcon,
    SettingsIcon,
    SpaceIcon,
    ExpandIcon,
    ProfileIcon,
    LifebouyIcon,
    ExternalLinkIcon,
    GlobeWebIcon,
    MagicIcon,
    LogoutBoxIcon,
} from "@/app/components/icons";

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

function FrameAvatar() {
    return (
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
    const [externalHoverTarget, setExternalHoverTarget] = useState<string | null>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const { open, closeTop } = useModal();

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

    const profileMenuItems: ProfileMenuItem[] = [
        {
            label: "Profile",
            action: () => handleProfileMenuAction("profile"),
            icon: <ProfileIcon className="w-4 h-4" />
        },
        {
            label: "Help & support",
            action: () => handleProfileMenuAction("help"),
            icon: <LifebouyIcon className="w-4 h-4" />
        },
        {
            label: "Website",
            action: () => handleProfileMenuAction("website"),
            icon: <GlobeWebIcon className="w-4 h-4" />,
            trailingIcon: <ExternalLinkIcon className="w-4 h-4" />
        },
        {
            label: "Case study",
            action: () => handleProfileMenuAction("case-study"),
            // icon: <GlobeWebIcon className="w-4 h-4" />,
            trailingIcon: <div className="flex py-[6px] px-[10px] justify-center items-center gap-2.5 rounded-full bg-[#052e21]">
                <span className="text-[#069668] font-[Figtree] text-xs not-italic font-semibold leading-[normal]">
                    Coming soon
                </span>
            </div>,
            disabled: true
        },
        {
            label: "Delanoy's portfolio",
            action: () => handleProfileMenuAction("portfolio"),
            icon: <MagicIcon className="w-4 h-4" />,
            trailingIcon: <ExternalLinkIcon className="w-4 h-4" />
        },
        {
            label: "Logout",
            action: () => handleProfileMenuAction("logout"),
            icon: <LogoutBoxIcon className="w-4 h-4" />,
            // isDestructive: true
        },
    ];

    // Listen for group card hover events
    useEffect(() => {
        const handleGroupCardHover = (event: CustomEvent) => {
            const { isHovering, targetNav } = event.detail;
            setExternalHoverTarget(isHovering ? targetNav : null);
        };

        window.addEventListener('groupCardHover', handleGroupCardHover as EventListener);
        return () => {
            window.removeEventListener('groupCardHover', handleGroupCardHover as EventListener);
        };
    }, []);

    // Helper function to check if a nav item is active
    const isNavItemActive = (itemHref: string) => {
        if (itemHref === '/wallets') {
            return pathname.startsWith('/wallets');
        }
        if (itemHref === '/assets') {
            return pathname.startsWith('/assets');
        }
        if (itemHref === '/transactions/view-all') {
            return pathname === '/transactions/view-all' || pathname === '/transactions';
        }
        if (itemHref === '/transactions/proposals') {
            return pathname.startsWith('/transactions/proposals');
        }
        if (itemHref === '/address-book/addresses') {
            return pathname === '/address-book/addresses' || pathname === '/address-book';
        }
        if (itemHref === '/address-book/groups') {
            return pathname.startsWith('/address-book/groups');
        }
        return pathname === itemHref;
    };

    const handleProfileMenuAction = (action: string) => {
        setIsProfileMenuOpen(false);

        const showFeatureModal = () => {
            open(
                <Modal onRequestClose={() => {
                    closeTop();
                    return true;
                }}>
                    <FeatureUnderDevelopment onClose={closeTop} />
                </Modal>
            );
        };

        const openExternalLink = (url: string) => {
            try {
                window.open(url, "_blank", "noopener,noreferrer");
            } catch (error) {
                console.error("Failed to open external link:", error);
            }
        };

        switch (action) {
            case "profile":
                showFeatureModal();
                break;
            case "help":
                showFeatureModal();
                break;
            case "logout":
                showFeatureModal();
                break;
            case "website":
                openExternalLink("https://www.figma.com/proto/Nfz1oTeKS553bZuNAIi3zN/Kushari-2.0?page-id=5%3A35478&node-id=516-5964&viewport=309%2C-657%2C0.11&t=XQe9OJ9u9TGap2y9-1&scaling=scale-down-width&content-scaling=fixed");
                break;
            case "case-study":
                showFeatureModal();
                break;
            case "portfolio":
                openExternalLink("https://delanoy.fyi/");
                break;
            default:
                break;
        }
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
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
                        <IconButton
                            className="opacity-0 group-hover/sidebar:opacity-100 absolute left-0 top-0"
                            icon={<ExpandIcon />}
                            size="md"
                            status="neutral"
                            onClick={() => open(
                                <Modal onRequestClose={() => {
                                    closeTop();
                                    return true;
                                }}>
                                    <FeatureUnderDevelopment onClose={closeTop} />
                                </Modal>
                            )}
                        />
                    </div>
                    <span className="text-[#D7DCF3] font-[Figtree] text-sm not-italic font-semibold leading-[normal] tracking-[0.112px]">Acme Co.</span>
                </div>
                <IconButton
                    className="opacity-0 group-hover/sidebar:opacity-100"
                    icon={<SettingsIcon />}
                    size="md"
                    status="neutral"
                    onClick={() => open(
                        <Modal onRequestClose={() => {
                            closeTop();
                            return true;
                        }}>
                            <FeatureUnderDevelopment onClose={closeTop} />
                        </Modal>
                    )}
                />
            </div>

            <div className="flex py-[0] px-[20px] flex-col items-start gap-10 flex-[1_0_0] self-stretch">

                {navSections.map((section, index) => (
                    <SideNavSection key={index} title={section.title} pill={section.pill}>
                        {section.items && section.items.map((item) => {
                            const isActive = isNavItemActive(item.href);
                            const isExternallyHovered = externalHoverTarget === item.href;

                            return (
                                <Link href={item.href} key={item.label} className="w-full">
                                    <SideNavItem
                                        icon={item.icon}
                                        label={item.label}
                                        active={isActive}
                                        externalHover={isExternallyHovered}
                                    />
                                </Link>
                            );
                        })}
                    </SideNavSection>
                ))}

            </div>

            <div className="flex p-4 flex-col items-start gap-2.5 self-stretch relative">
                <div className="flex pt-[4px] pr-[16px] pb-[4px] pl-[4px] items-center self-stretch rounded-full border-[0.6px] border-transparent group-hover/sidebar:border-[0.6px] hover:bg-[#26C9C9]/5 group-hover/sidebar:border-[rgba(255,255,255,0.2)] cursor-pointer hover:shadow-[0_0_50px_4px_#26C9C9]/20">
                    <div className="relative flex justify-center items-center gap-2.5 flex-[1_0_0] rounded-full">
                        <FrameAvatar />
                        <div className="flex flex-col items-start gap-[1px] flex-[1_0_0]">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Delanoy Kunil</span>
                            <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.8px] opacity-70">Admin</span>
                        </div>
                    </div>
                    <IconButton
                        ref={menuButtonRef}
                        size="sm"
                        icon={<MenuIcon />}
                        className="opacity-0 group-hover/sidebar:opacity-100"
                        status="neutral"
                        onClick={toggleProfileMenu}
                    />
                </div>

                {/* Profile Menu - now opens upward */}
                <ProfileMenu
                    isOpen={isProfileMenuOpen}
                    onClose={() => setIsProfileMenuOpen(false)}
                    items={profileMenuItems}
                    anchorRef={menuButtonRef}
                />
            </div>
        </nav>
    );
}