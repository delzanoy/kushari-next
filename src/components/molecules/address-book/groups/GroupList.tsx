"use client";

import { GroupCardProps } from './types';
import GroupCard from "./GroupCard";

interface GroupListProps {
    groups: GroupCardProps[];
    onUpdate?: (groupId: number, updates: Partial<GroupCardProps>) => void;
    onDelete?: (groupId: number) => void;
}

export default function GroupList({ groups, onUpdate, onDelete }: GroupListProps) {
    return (
        <div className="flex flex-col w-full">
            {groups.map((group) => (
                <GroupCard 
                    key={group.id} 
                    group={group} 
                    onUpdate={onUpdate}
                    onDelete={onDelete} 
                />
            ))}
            {groups.length === 0 && (
                <div className="py-12 text-center text-[var(--color-text-muted)] text-sm">
                    No groups found.
                </div>
            )}
        </div>
    );
}
