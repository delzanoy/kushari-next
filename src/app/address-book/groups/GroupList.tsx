"use client";
import { GroupCardProps } from './types';
import GroupCard from "./GroupCard";

interface GroupListProps {
    groups: GroupCardProps[];
    onUpdate?: (groupId: number, updates: Partial<GroupCardProps>) => void;
    onDelete?: (groupId: number) => void;
}

export default function GroupList({ groups, onUpdate, onDelete }: GroupListProps) {

    return <div className="flex flex-col">
        {groups.map((group) => (
            <GroupCard key={group.id} group={group} onUpdate={onUpdate}
                    onDelete={onDelete} />
        ))}
    </div>
}


// "use client";
// import { GroupCardProps } from './types';
// import GroupCard from "./GroupCard";

// interface GroupListProps {
//     groups: GroupCardProps[];
//     onUpdate?: (groupId: number, updates: Partial<GroupCardProps>) => void;
//     onDelete?: (groupId: number) => void;
// }

// export default function GroupList({ groups, onUpdate, onDelete }: GroupListProps) {
//     if (groups.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 text-center w-full">
//                 <div className="text-[#F8FCFF]/40 text-lg mb-2">No groups found</div>
//                 <div className="text-[#F8FCFF]/30 text-sm">
//                     Try adjusting your search or create a new demo group
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col">
//             {groups.map((group) => (
//                 <GroupCard 
//                     key={group.id} 
//                     group={group}
//                     onUpdate={onUpdate}
//                     onDelete={onDelete}
//                 />
//             ))}
//         </div>
//     );
// }