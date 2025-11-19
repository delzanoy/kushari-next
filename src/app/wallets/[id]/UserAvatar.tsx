import Image from "next/image";


interface Member {
    id: number;
    name: string;
    email: string;
    colour: string;
    role: string | string[]; // Updated to accept both string and array
}


interface UserAvatarProps {
    member: Member;
    index: number; // Make index required
}

export default function UserAvatar({ member, index }: UserAvatarProps) {
    // Normalize roles to always be an array
    const roles = typeof member.role === 'string'
        ? [member.role]
        : Array.isArray(member.role)
            ? member.role
            : [];

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

                {/* <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
                    {roles.map((role: string, index: number) => (
                        <span
                            key={index}
                            className="text-[10px] px-1 py-0.5 rounded bg-gray-700 text-gray-300 capitalize"
                        >
                            {role}
                        </span>
                    ))}
                </div> */}
            </div>



            {/* <div className="overflow-clip relative rounded-[120px] w-[40px] h-[40px] z-10">
            
            <div
                className="absolute border-[0.5px] border-solid border-white inset-0 pointer-events-none rounded-[70px]"
                aria-hidden="true"
            />
            <div
                className="absolute font-bold leading-[0] text-[16px] text-nowrap text-white tracking-[1.28px]"
                style={{ top: "calc(50% - 9px)", left: "calc(50% - 11px)" }}
            >
                <p className="leading-[normal] whitespace-pre">De</p>
            </div>
        </div> */}




        </div>
    );
}