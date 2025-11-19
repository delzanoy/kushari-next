"use client";
import { GroupCardProps } from './types';
import GroupCard from "./GroupCard";


export default function GroupList({ groups }: { groups: GroupCardProps[] }) {

    return <div className="flex flex-col">
        {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
        ))}
    </div>
}