import IconButton from "@/app/components/buttons/IconButton";
import { CloseCircleFilledIcon } from "@/app/components/icons";
import Image from "next/image";

interface Member {
    id: number;
    name: string;
    email: string;
    colour?: string;
    role?: string | string[];
}

interface UserAvatarProps {
    member: Member;
    index: number;
    onRemove?: () => void;
}

export default function UserAvatar({ member, index, onRemove }: UserAvatarProps) {
    const getAvatarImage = () => {
        if (member.name === "Delanoy Kunil") {
            return "/avatar/pink.png";
        }

        const colors = ["red", "green", "yellow", "blue"];
        const colorIndex = index % colors.length;
        
        return `/avatar/${colors[colorIndex]}.png`;
    };

    const getInitials = () => {
        if (!member.name) return 'U';

        // Get the first name (first word)
        const firstName = member.name.trim().split(' ')[0];

        if (firstName.length >= 2) {
            // Use first two characters of first name
            return firstName.substring(0, 2);
        } else if (member.name.length >= 2) {
            // Fallback: use first two characters of full name if first name is too short
            return member.name.substring(0, 2);
        } else {
            // Single character name
            return member.name.charAt(0).toUpperCase();
        }
    };

    const avatarImage = getAvatarImage();
    const initials = getInitials();

    return (
        <div className="relative group flex pt-[2px] pr-[12px] pb-[2px] pl-[4px] items-center gap-1.5 rounded-full border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/6">
            <div className="relative w-8 h-8 aspect-square rounded-full border-[0.2px] border-solid border-[#FFF] flex items-center justify-center text-white font-[geist] font-semibold text-[16px] overflow-hidden">
                {/* Always use the generated avatar image */}
                <Image
                    src={avatarImage}
                    alt={`${member.name || member.email}'s avatar`}
                    width={32}
                    height={32}
                    className="absolute left-0 top-0 w-full h-full object-cover z-0"
                />
                <span className="z-1 relative">{initials}</span>
            </div>
            <div className="flex flex-col justify-center items-start gap-0.5">
                <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.7px]">
                    {member.name || member.email.split('@')[0]}
                </span>
                <span className="overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] max-w-[120px]">
                    {member.email}
                </span>
            </div>
            {onRemove && (
                <IconButton 
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-[6px] shadow-[0_0_10px_6px_#0E1011] rounded-full"
                    icon={<CloseCircleFilledIcon />} 
                    size="sm" 
                    status="neutral"
                    onClick={onRemove}
                />
            )}
        </div>
    );
}