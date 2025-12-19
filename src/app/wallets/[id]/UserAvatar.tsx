import Image from "next/image";


interface Member {
    id: number;
    name: string;
    email: string;
    colour?: string;
    role?: string | string[]; // Updated to accept both string and array
}


interface UserAvatarProps {
    member: Member;
    index: number; // Make index required
}

export default function UserAvatar({ member, index }: UserAvatarProps) {

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
        <div className="flex items-start gap-[12px]">
            <div
                className="relative w-[33px] h-[33px] rounded-full flex items-center justify-center text-white font-[geist] font-semibold text-[16px] bg-red-500">
                <Image
                    src={avatarImage}
                    alt="Avatar"
                    width={33}
                    height={33}
                    className="absolute left-0 top-0 rounded-full w-[33px] h-[33px] object-cover border-solid border-[0.2px] border-white z-0"
                />
                <span className="z-1">{initials}</span>
            </div>
            <div className="flex flex-col items-start gap-[1px]">
                <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">{member.name}</span>
                <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.8px] opacity-70">{Math.floor(Math.random() * 10) + 1} days ago</span>
            </div>
        </div>
    );
}