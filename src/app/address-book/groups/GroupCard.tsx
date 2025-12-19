// src/app/address-book/groups/GroupCard.tsx
"use client";

import { GroupIcon, SendIcon, EditIcon, HistoryIcon, AddToGroupIcon, ArrowLeftUpBoxFill } from "@/app/components/icons";
import { GroupCardProps } from "./types"
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import IconButton from "@/app/components/buttons/IconButton";
import { useRouter } from 'next/navigation';

interface GroupProps {
    group: GroupCardProps;
        onUpdate?: (groupId: number, updates: Partial<GroupCardProps>) => void;
    onDelete?: (groupId: number) => void;
}

const formatDate = (date?: Date | number) => {
    if (!date) return 'Never';

    let dateObj: Date;

    if (typeof date === 'number') {
        dateObj = new Date(date);
    } else {
        dateObj = date;
    }

    if (isNaN(dateObj.getTime())) {
        return 'Never';
    }

    return ` on ${dateObj.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })}`;
};

// Create a custom event for navigation hover
const dispatchNavHover = (isHovering: boolean) => {
    window.dispatchEvent(new CustomEvent('groupCardHover', { 
        detail: { isHovering, targetNav: '/address-book/addresses' } 
    }));
};

export default function GroupCard({ group }: GroupProps) {
    const router = useRouter();

    const handleCardClick = () => {
        if (!isSpecialGroup) {
            dispatchNavHover(false);
            router.push(`/address-book/addresses?search=${encodeURIComponent(group.name)}`);
        }
    };

    const handleViewUngroupped = () => {
        dispatchNavHover(false);
        router.push('/address-book/addresses?ungrouped=true');
    };

    const handleMouseEnter = () => {
        if (!isSpecialGroup) {
            dispatchNavHover(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isSpecialGroup) {
            dispatchNavHover(false);
        }
    };

    const isSpecialGroup = group.id === 0;
    
    if (isSpecialGroup) {
        return (
            <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
                <span className="w-[291px] text-[#F8FCFF] font-[Geist] text-xs not-italic font-medium leading-[normal] tracking-[0.96px]">{group.name}</span>
                <div className="flex w-[301px] items-center gap-2">
                    <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
                    <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">{group.count}</span>
                </div>
                <div className="flex flex-grow justify-end items-center gap-4 h-4">
                    <TertiaryButton 
                        label="View ungroupped" 
                        status="neutral-brand"
                        size="sm"
                        onClick={handleViewUngroupped}
                    />
                </div>
            </div>
        );
    }
    
    return (
        <div 
            className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[14px] pr-[16px] pb-[14px] pl-[8px] items-center gap-4 self-stretch bg-[#0E1011]
                border-[0.8px] border-transparent
                [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
                hover:[border-image:linear-gradient(to_bottom,#26C9C91A_91%,#26C9C91A_100%)_1]
                hover:bg-[#1C2325]
                hover:shadow-[0_17px_20px_0_rgba(38,201,200,0.00),0_11px_18px_0_rgba(38,201,200,0.01),0_6px_14px_0_rgba(38,201,200,0.05)]
                group-hover:z-10
                cursor-pointer
                relative"
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className="w-[293px] text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px]">{group.name}</span>
            <div className="flex w-[301px] items-center gap-2">
                <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
                <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{group.count}</span>
            </div>
            <div className={`flex w-[300px] items-center gap-2 `}>
                <div className={`flex items-center gap-2 ${group.lastModifiedBy ? "block" : "hidden"}`}>
                    <HistoryIcon className="h-4 w-4 opacity-70" />
                    <div className="gap-1">
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[1.12px]">{group.lastModifiedBy}</span>
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{formatDate(group.lastModified)}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center gap-4 group-hover/group:opacity-100 opacity-0">
                <IconButton icon={<AddToGroupIcon />} size="sm" status="neutral" className="group-hover/group:scale-100 scale-0" />
                <IconButton icon={<EditIcon />} size="sm" status="neutral" className="group-hover/group:scale-100 scale-0" />
                <IconButton icon={<SendIcon />} size="sm" status="brand" className="group-hover/group:scale-100 scale-0" />
            </div>
            <div className="absolute left-0 top-0 flex items-center opacity-0 group-hover/group:opacity-80">
                <ArrowLeftUpBoxFill className="h-[10px] w-[10px]" />
                <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-bold leading-[normal]">View addresses</span>
            </div>
        </div>
    )
}




// "use client";

// import { 
//     GroupIcon, 
//     SendIcon, 
//     EditIcon, 
//     HistoryIcon, 
//     AddToGroupIcon, 
//     ArrowLeftUpBoxFill,
//     // TrashIcon,
//     // DemoBadge 
// } from "@/app/components/icons";
// import { GroupCardProps } from "./types";
// import TertiaryButton from "@/app/components/buttons/TertiaryButton";
// import IconButton from "@/app/components/buttons/IconButton";
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// interface GroupProps {
//     group: GroupCardProps;
//     onUpdate?: (groupId: number, updates: Partial<GroupCardProps>) => void;
//     onDelete?: (groupId: number) => void;
// }

// const formatDate = (date?: Date | number) => {
//     if (!date) return 'Never';

//     let dateObj: Date;

//     if (typeof date === 'number') {
//         dateObj = new Date(date);
//     } else {
//         dateObj = date;
//     }

//     if (isNaN(dateObj.getTime())) {
//         return 'Never';
//     }

//     return ` on ${dateObj.toLocaleDateString('en-US', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//     })}`;
// };

// // Create a custom event for navigation hover
// const dispatchNavHover = (isHovering: boolean) => {
//     window.dispatchEvent(new CustomEvent('groupCardHover', { 
//         detail: { isHovering, targetNav: '/address-book/addresses' } 
//     }));
// };

// export default function GroupCard({ group, onUpdate, onDelete }: GroupProps) {
//     const router = useRouter();
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedName, setEditedName] = useState(group.name);
//     const [editedCount, setEditedCount] = useState(group.count);

//     const handleCardClick = () => {
//         if (!isSpecialGroup) {
//             router.push(`/address-book/addresses?search=${encodeURIComponent(group.name)}`);
//         }
//     };

//     const handleViewUngroupped = () => {
//         router.push('/address-book/addresses?ungrouped=true');
//     };

//     const handleMouseEnter = () => {
//         if (!isSpecialGroup) {
//             dispatchNavHover(true);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (!isSpecialGroup) {
//             dispatchNavHover(false);
//         }
//     };

//     const handleEditClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (group.source === 'user' && onUpdate) {
//             setIsEditing(true);
//         }
//     };

//     const handleDeleteClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (group.source === 'user' && onDelete) {
//             if (confirm('Are you sure you want to delete this demo group?')) {
//                 onDelete(group.id);
//             }
//         }
//     };

//     const handleSaveEdit = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (onUpdate && group.source === 'user') {
//             onUpdate(group.id, {
//                 name: editedName,
//                 count: editedCount,
//                 lastModifiedBy: 'You'
//             });
//             setIsEditing(false);
//         }
//     };

//     const handleCancelEdit = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setEditedName(group.name);
//         setEditedCount(group.count);
//         setIsEditing(false);
//     };

//     const isSpecialGroup = group.id === 0;
//     const isDemoGroup = group.demo || group.source === 'user';
    
//     if (isSpecialGroup) {
//         return (
//             <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
//                 <span className="w-[291px] text-[#F8FCFF] font-[Geist] text-xs not-italic font-medium leading-[normal] tracking-[0.96px]">{group.name}</span>
//                 <div className="flex w-[301px] items-center gap-2">
//                     <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
//                     <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">{group.count}</span>
//                 </div>
//                 <div className="flex flex-grow justify-end items-center gap-4 h-4">
//                     <TertiaryButton 
//                         label="View ungroupped" 
//                         status="neutral-brand"
//                         size="sm"
//                         onClick={handleViewUngroupped}
//                     />
//                 </div>
//             </div>
//         );
//     }

//     if (isEditing) {
//         return (
//             <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[14px] pr-[16px] pb-[14px] pl-[8px] items-center gap-4 self-stretch bg-[#0E1011]
//                 border-[0.8px] border-[#26C9C9]/30
//                 cursor-default"
//             >
//                 {/* Demo badge for demo groups */}
//                 {isDemoGroup && (
//                     <div className="absolute -top-1 -left-1">
//                         {/* <DemoBadge className="h-5 w-5 text-[#26C9C9]" /> */}
//                         Demo
//                     </div>
//                 )}

//                 {/* Edit mode: Group name input */}
//                 <div className="w-[293px]">
//                     <input
//                         type="text"
//                         value={editedName}
//                         onChange={(e) => setEditedName(e.target.value)}
//                         className="w-full bg-transparent text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px] border-b border-[#26C9C9]/50 outline-none"
//                         autoFocus
//                     />
//                 </div>

//                 {/* Edit mode: Count input */}
//                 <div className="flex w-[301px] items-center gap-2">
//                     <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
//                     <input
//                         type="number"
//                         min="1"
//                         value={editedCount}
//                         onChange={(e) => setEditedCount(parseInt(e.target.value) || 0)}
//                         className="w-20 bg-transparent text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px] border-b border-[#26C9C9]/50 outline-none text-right"
//                     />
//                 </div>

//                 {/* Edit mode: Last modified info */}
//                 <div className="flex w-[300px] items-center gap-2">
//                     <div className="flex items-center gap-2">
//                         <HistoryIcon className="h-4 w-4 opacity-70" />
//                         <div className="gap-1">
//                             <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[1.12px]">You</span>
//                             <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]"> (editing)</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Edit mode buttons */}
//                 <div className="flex justify-end items-center gap-4">
//                     <button
//                         onClick={handleSaveEdit}
//                         className="px-3 py-1 text-sm bg-[#26C9C9] text-[#0A1A1F] rounded hover:bg-[#1FB8B8] transition-colors"
//                     >
//                         Save
//                     </button>
//                     <button
//                         onClick={handleCancelEdit}
//                         className="px-3 py-1 text-sm text-[#F8FCFF]/60 hover:text-[#F8FCFF] transition-colors"
//                     >
//                         Cancel
//                     </button>
//                 </div>

//                 {/* Demo group indicator */}
//                 {isDemoGroup && (
//                     <div className="absolute right-4 -bottom-1">
//                         <span className="text-[10px] text-[#26C9C9] font-medium">Demo Group</span>
//                     </div>
//                 )}
//             </div>
//         );
//     }
    
//     return (
//         <div 
//             className={`group/group flex w-full max-w-[1040px] mx-auto flex pt-[14px] pr-[16px] pb-[14px] pl-[8px] items-center gap-4 self-stretch 
//                 border-[0.8px] border-transparent
//                 [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
//                 hover:[border-image:linear-gradient(to_bottom,#26C9C91A_91%,#26C9C91A_100%)_1]
//                 hover:bg-[#1C2325]
//                 hover:shadow-[0_17px_20px_0_rgba(38,201,200,0.00),0_11px_18px_0_rgba(38,201,200,0.01),0_6px_14px_0_rgba(38,201,200,0.05)]
//                 group-hover:z-10
//                 relative
//                 ${isDemoGroup ? 'bg-[#0E1011]/80' : 'bg-[#0E1011]'}
//                 ${isDemoGroup ? 'cursor-pointer' : 'cursor-default'}`}
//             onClick={isDemoGroup ? handleCardClick : undefined}
//             onMouseEnter={isDemoGroup ? handleMouseEnter : undefined}
//             onMouseLeave={isDemoGroup ? handleMouseLeave : undefined}
//         >
//             {/* Demo badge for demo groups */}
//             {isDemoGroup && (
//                 <div className="absolute -top-1 -left-1">
//                     {/* <DemoBadge className="h-5 w-5 text-[#26C9C9]" /> */}
//                     Demo
//                 </div>
//             )}

//             <div className="w-[293px] flex items-center gap-2">
//                 <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px]">
//                     {group.name}
//                 </span>
//                 {isDemoGroup && (
//                     <span className="text-[10px] text-[#26C9C9] font-medium px-1.5 py-0.5 bg-[#26C9C9]/10 rounded">
//                         DEMO
//                     </span>
//                 )}
//             </div>
            
//             <div className="flex w-[301px] items-center gap-2">
//                 <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
//                 <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{group.count}</span>
//             </div>
            
//             <div className={`flex w-[300px] items-center gap-2 `}>
//                 <div className={`flex items-center gap-2 ${group.lastModifiedBy ? "block" : "hidden"}`}>
//                     <HistoryIcon className="h-4 w-4 opacity-70" />
//                     <div className="gap-1">
//                         <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[1.12px]">{group.lastModifiedBy}</span>
//                         <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{formatDate(group.lastModified)}</span>
//                     </div>
//                 </div>
//             </div>
            
//             <div className="flex justify-end items-center gap-4 group-hover/group:opacity-100 opacity-0">
//                 {isDemoGroup ? (
//                     // Demo groups: Show delete and edit buttons
//                     <>
//                         {/* <IconButton 
//                             icon={<TrashIcon />} 
//                             size="sm" 
//                             status="neutral" 
//                             className="group-hover/group:scale-100 scale-0" 
//                             onClick={handleDeleteClick}
//                         /> */}
//                         <IconButton 
//                             icon={<EditIcon />} 
//                             size="sm" 
//                             status="neutral" 
//                             className="group-hover/group:scale-100 scale-0" 
//                             onClick={handleEditClick}
//                         />
//                         <IconButton 
//                             icon={<SendIcon />} 
//                             size="sm" 
//                             status="brand" 
//                             className="group-hover/group:scale-100 scale-0" 
//                         />
//                     </>
//                 ) : (
//                     // API groups: Show original buttons (no edit/delete)
//                     <>
//                         <IconButton icon={<AddToGroupIcon />} size="sm" status="neutral" className="group-hover/group:scale-100 scale-0" />
//                         <IconButton icon={<EditIcon />} size="sm" status="neutral" className="group-hover/group:scale-100 scale-0" disabled />
//                         <IconButton icon={<SendIcon />} size="sm" status="brand" className="group-hover/group:scale-100 scale-0" />
//                     </>
//                 )}
//             </div>
            
//             {/* "View addresses" indicator (only for demo groups) */}
//             {isDemoGroup && (
//                 <div className="absolute left-0 top-0 flex items-center opacity-0 group-hover/group:opacity-80">
//                     <ArrowLeftUpBoxFill className="h-[10px] w-[10px]" />
//                     <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-bold leading-[normal]">View addresses</span>
//                 </div>
//             )}
//         </div>
//     );
// }