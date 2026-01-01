"use client";
import { useState, useRef, useEffect } from "react";
import { PlusCircleFilled, CheckBoxCircleFilledIcon, SpaceIcon, ExpandIcon } from "@/app/components/icons";
import PrimaryButton from "./buttons/PrimaryButton";

// Simple type definition only for this component
type Workspace = {
    id: number;
    name: string;
    members: any[];
    active: boolean;
    wallets?: any[];
};

type WorkspaceDropdownProps = {
    workspaces: Workspace[];
    value?: number; // workspace ID
    placeholder?: string;
    onChange: (workspaceId: number) => void;
    disabled?: boolean;
    onCreateWorkspace?: () => void; // Changed to just trigger create without name input
    isLoading?: boolean;
};

export default function WorkspaceDropdown({
    workspaces,
    value,
    placeholder = "Select workspace",
    onChange,
    disabled = false,
    onCreateWorkspace,
    isLoading = false,
}: WorkspaceDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get selected workspace
    const selectedWorkspace = workspaces?.find(w => w.id === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleOptionClick = (workspaceId: number) => {
        onChange(workspaceId);
        setOpen(false);
    };

    // Sort workspaces alphabetically by name (case-insensitive)
    const sortedWorkspaces = [...(workspaces || [])].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center">
                <div
                    className={`group/workspace flex py-[4px] px-[6px] justify-center items-center gap-2 absolute left-[-6px] top-[-1px] rounded-md transition-all ease-in-out relative cursor-pointer
                        ${open
                            ? "bg-[#26C9C9]/24 border-[0.5px] border-solid border-[#26C9C9] scale-[1.025]"
                            : "group-hover/sidebar:bg-[#EDEEEE]/16 hover:bg-[#26C9C9]/24 hover:scale-[1.025]"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !disabled && setOpen(!open)}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[#D7DCF3] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[#D7DCF3] font-[Figtree] text-sm not-italic font-semibold leading-[normal] tracking-[0.112px]">
                                Loading...
                            </span>
                        </div>
                    ) : (
                        <>
                            {open ? (
                                <ExpandIcon className="w-4 h-4 text-[#26C9C9]" />
                            ) : (
                                <>
                                    <SpaceIcon className="w-4 h-4 text-[#D7DCF3] block group-hover/sidebar:hidden" />
                                    <ExpandIcon className="w-4 h-4 text-[#D7DCF3] hidden group-hover/sidebar:block" />
                                </>
                            )}
                            <span className="text-[#D7DCF3] font-[Figtree] text-sm not-italic font-semibold leading-[normal] tracking-[0.112px]">
                                {selectedWorkspace?.name || placeholder}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Dropdown Menu */}
            {open && (
                <div
                    className="absolute top-full left-[-6px] mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 max-h-80 overflow-y-auto z-50 shadow-lg"
                    style={{ width: '260px', minWidth: '260px' }}
                >
                    {/* Options List */}
                    <div className="flex flex-col m-1 gap-0.5 max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="px-3 py-4 text-sm text-[#F8FCFF]/50 text-center">
                                Loading workspaces...
                            </div>
                        ) : sortedWorkspaces.length > 0 ? (
                            <>
                                {sortedWorkspaces.map((workspace) => (
                                    <div
                                        key={workspace.id}
                                        className={`group/option flex items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] gap-2.5 rounded-[10px] hover:cursor-pointer ${workspace.id === value
                                            ? 'bg-[#1C2325]'
                                            : 'hover:bg-[#F8FCFF]/8'
                                            }`}
                                        onClick={() => handleOptionClick(workspace.id)}
                                    >
                                        <span className={
                                            workspace.id === value
                                                ? 'text-[#A6FCFC] font-medium'
                                                : 'text-[#F8FCFF]'
                                        }>
                                            {workspace.name}
                                        </span>
                                        {workspace.id === value && (
                                            <CheckBoxCircleFilledIcon className="h-4 w-4 text-[#26C9C9]" />
                                        )}
                                    </div>
                                ))}
                                {onCreateWorkspace && (

                                    <PrimaryButton
                                        label="Create workspace"
                                        onClick={() => {
                                            onCreateWorkspace();
                                            setOpen(false);
                                        }}
                                        leadingIcon={<PlusCircleFilled />}
                                        size="lg"
                                        variant="neutral"
                                    />

                                )}
                            </>
                        ) : (
                            <div className="px-3 py-4 text-sm text-[#F8FCFF]/50 text-center">
                                No workspaces available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}