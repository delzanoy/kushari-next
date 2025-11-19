// import { GroupIcon, SendIcon, EditIcon, HistoryIcon, AddToGroupIcon, ArrowLeftUpBoxFill } from "@/app/components/icons";
// import { GroupCardProps } from "./types"
// import TertiaryButton from "@/app/components/buttons/TertiaryButton";
// import IconButton from "@/app/components/buttons/IconButton";
// import { useRouter } from 'next/navigation';

// interface GroupProps {
//     group: GroupCardProps;
// }

// const formatDate = (date?: Date | number) => {
//     if (!date) return 'Never';

//     let dateObj: Date;

//     // If it's a number (timestamp), convert to Date object
//     if (typeof date === 'number') {
//         dateObj = new Date(date);
//     } else {
//         dateObj = date;
//     }

//     // Check if the date is valid
//     if (isNaN(dateObj.getTime())) {
//         return 'Never';
//     }

//     return ` on ${dateObj.toLocaleDateString('en-US', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//     })}`;
// };

// export default function GroupCard({ group }: GroupProps) {
//     const router = useRouter();

//     const handleCardClick = () => {
//         if (!isSpecialGroup) {
//             // Navigate to addresses page with group name as search parameter
//             router.push(`/address-book/addresses?search=${encodeURIComponent(group.name)}`);
//         }
//     };



//     const isSpecialGroup = group.id === 0;
//     if (isSpecialGroup) {
//         return (
//             <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
//                 <span className="w-[291px] text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px]">{group.name}</span>
//                 <div className="flex w-[301px] items-center gap-2">
//                     <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
//                     <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{group.count}</span>
//                 </div>
//                 <div className="flex flex-grow justify-end items-center gap-4 h-4">
//                     <TertiaryButton label="View ungroupped" status="neutral-brand" />
//                 </div>
//             </div>
//         );
//     }
//     return (<div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[14px] pr-[16px] pb-[14px] pl-[8px] items-center gap-4 self-stretch bg-[#0E1011]
//                 border-[0.8px] border-transparent
//                 [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
//                 hover:[border-image:linear-gradient(to_bottom,#26C9C91A_91%,#26C9C91A_100%)_1]
//                 hover:bg-[#1C2325]
//                 hover:shadow-[0_17px_20px_0_rgba(38,201,200,0.00),0_11px_18px_0_rgba(38,201,200,0.01),0_6px_14px_0_rgba(38,201,200,0.05)]
//                 group-hover:z-10
//                 cursor-pointer
//                 relative"
//         onClick={handleCardClick}>
//         <span className="w-[293px] text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px]">{group.name}</span>
//         <div className="flex w-[301px] items-center gap-2">
//             <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
//             <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{group.count}</span>
//         </div>
//         <div className={`flex w-[300px] items-center gap-2 `}>
//             <div className={`flex items-center gap-2 ${group.lastModifiedBy ? "block" : "hidden"}`}>
//                 <HistoryIcon className="h-4 w-4 opacity-70" />
//                 <div className="gap-1">
//                     <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[1.12px]">{group.lastModifiedBy}</span>
//                     <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{formatDate(group.lastModified)}</span>
//                 </div>
//             </div>
//         </div>
//         <div className="flex justify-end items-center gap-4 group-hover/group:opacity-100 opacity-0">
//             <IconButton icon={<AddToGroupIcon />} size="sm" status="neutral" className="group-hover/group:scale-100 scale-0" />
//             <IconButton icon={<EditIcon />} size="sm" status="neutral" className="group-hover/group:scale-100 scale-0" />
//             <IconButton icon={<SendIcon />} size="sm" status="brand" className="group-hover/group:scale-100 scale-0" />
//         </div>
//         <div className="absolute left-0 top-0 flex items-center opacity-0 group-hover/group:opacity-80">
//             <ArrowLeftUpBoxFill className="h-[10px] w-[10px]" />
//             <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-bold leading-[normal]">View addresses</span>
//         </div>
//     </div>
//     )
// }



import { GroupIcon, SendIcon, EditIcon, HistoryIcon, AddToGroupIcon, ArrowLeftUpBoxFill } from "@/app/components/icons";
import { GroupCardProps } from "./types"
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import IconButton from "@/app/components/buttons/IconButton";
import { useRouter } from 'next/navigation';

interface GroupProps {
    group: GroupCardProps;
}

const formatDate = (date?: Date | number) => {
    if (!date) return 'Never';

    let dateObj: Date;

    // If it's a number (timestamp), convert to Date object
    if (typeof date === 'number') {
        dateObj = new Date(date);
    } else {
        dateObj = date;
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Never';
    }

    return ` on ${dateObj.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })}`;
};

export default function GroupCard({ group }: GroupProps) {
    const router = useRouter();

    const handleCardClick = () => {
        if (!isSpecialGroup) {
            // Navigate to addresses page with group name as search parameter
            router.push(`/address-book/addresses?search=${encodeURIComponent(group.name)}`);
        }
    };

    const handleViewUngroupped = () => {
        // Navigate to addresses page with ungrouped filter
        router.push('/address-book/addresses?ungrouped=true');
    };

    const isSpecialGroup = group.id === 0;
    if (isSpecialGroup) {
        return (
            <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
                <span className="w-[291px] text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px]">{group.name}</span>
                <div className="flex w-[301px] items-center gap-2">
                    <GroupIcon className="h-4 w-4 p-[1px] opacity-70" />
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[1.12px]">{group.count}</span>
                </div>
                <div className="flex flex-grow justify-end items-center gap-4 h-4">
                    <TertiaryButton 
                        label="View ungroupped" 
                        status="neutral-brand" 
                        onClick={handleViewUngroupped}
                    />
                </div>
            </div>
        );
    }
    return (<div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[14px] pr-[16px] pb-[14px] pl-[8px] items-center gap-4 self-stretch bg-[#0E1011]
                border-[0.8px] border-transparent
                [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
                hover:[border-image:linear-gradient(to_bottom,#26C9C91A_91%,#26C9C91A_100%)_1]
                hover:bg-[#1C2325]
                hover:shadow-[0_17px_20px_0_rgba(38,201,200,0.00),0_11px_18px_0_rgba(38,201,200,0.01),0_6px_14px_0_rgba(38,201,200,0.05)]
                group-hover:z-10
                cursor-pointer
                relative"
        onClick={handleCardClick}>
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