import Image from "next/image";

interface Member {
    id: number;
    name: string;
    email: string;
    colour?: string;
    role?: string | string[];
}

interface UserAvatarProps {
    member: Member | string; // Can be a Member object or just a string name
    index?: number; // Make index optional
    size?: 16 | 32;
}

export function UserAvatarIcon({
    member,
    index,
    size = 32
}: UserAvatarProps) {
    // Normalize member to always be an object with a name property
    const normalizedMember = typeof member === 'string'
        ? { id: 0, name: member, email: '' }
        : member;

    const getRandomIndexFromName = (name: string): number => {
        if (!name) return 0;
        // Simple hash function to convert name to a number
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash) + name.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 4; // Mod 4 for our 4 colors
    };

    // Generate a random index based on the name if not provided
    const memberIndex = index !== undefined
        ? index
        : getRandomIndexFromName(normalizedMember.name);

    const getAvatarImage = () => {
        if (normalizedMember.name === "Delanoy Kunil") {
            return "/avatar/pink.png";
        }

        const colors = ["red", "green", "yellow", "blue"];
        const colorIndex = memberIndex % colors.length;

        return `/avatar/${colors[colorIndex]}.png`;
    };

    const getInitials = () => {
        if (!normalizedMember.name) return 'U';

        if (size === 16) {
            return normalizedMember.name.trim().charAt(0).toUpperCase();
        }

        const firstName = normalizedMember.name.trim().split(' ')[0];

        if (firstName.length >= 2) {
            return firstName.substring(0, 2);
        } else if (normalizedMember.name.length >= 2) {
            return normalizedMember.name.substring(0, 2);
        } else {
            return normalizedMember.name.charAt(0).toUpperCase();
        }
    };

    const avatarImage = getAvatarImage();
    const initials = getInitials();

    // Size-based configurations
    const sizeConfig = {
        16: {
            container: "gap-0.5",
            avatar: "w-4 h-4 border-[0.2px]",
            text: "text-[8px]",
            imageSize: 16,
            outerBorder: "border-[0.25px]"
        },
        32: {
            container: "gap-1.5",
            avatar: "w-8 h-8 border-[0.2px]",
            text: "text-[16px]",
            imageSize: 32,
            outerBorder: "border-[0.5px]"
        }
    };

    const config = sizeConfig[size];

    return (
        <div className={`relative group flex items-center rounded-full border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/6 ${config.container} ${config.outerBorder}`}>
            <div className={`relative aspect-square rounded-full border-solid border-[#FFF] flex items-center justify-center text-white font-[geist] font-semibold overflow-hidden ${config.avatar} ${config.text}`}>
                {/* Always use the generated avatar image */}
                <Image
                    src={avatarImage}
                    alt={`${normalizedMember.name}'s avatar`}
                    width={config.imageSize}
                    height={config.imageSize}
                    className="absolute left-0 top-0 w-full h-full object-cover z-0"
                />
                <span className="z-1 relative">{initials}</span>
            </div>
        </div>
    );
}