import { AddToGroupIcon, CheckBoxOutlineIcon, CheckBoxFilledIcon, EditIcon, QRCodeIcon, SendIcon } from "@/app/components/icons";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import { format } from "date-fns";
import { AddressCardProps, AddressTrustLevel } from "./types";
import IconButton from "@/app/components/buttons/IconButton";

interface AddressCardComponentProps {
    address: AddressCardProps;
    onSelect: (addressId: number, selected: boolean) => void;
    selected: boolean;
}

export default function AddressCard({ address, onSelect, selected }: AddressCardComponentProps) {

    const getAddressStatus = (verified: boolean, lastInteracted?: Date) => {
        if (verified && lastInteracted) {
            return {
                trustLevel: "trusted" as AddressTrustLevel,
                interactionStatus: format(lastInteracted, 'MMM do yyyy')
            };
        } else if (verified) {
            return {
                trustLevel: "unfamiliar" as AddressTrustLevel,
                interactionStatus: "Never"
            };
        } else {
            return {
                trustLevel: "unknown" as AddressTrustLevel,
                interactionStatus: "No chain history"
            };
        }
    };

    const { trustLevel, interactionStatus } = getAddressStatus(address.verified, address.lastInteracted);

    const displayGroups = address.groups.slice(0, 1);
    const hiddenGroups = address.groups.slice(1);
    const remainingGroups = hiddenGroups.length;

    const handleCheckboxClick = () => {
        onSelect(address.id, !selected);
    };

    // Format hidden groups for tooltip
    const hiddenGroupNames = hiddenGroups.map(group => group.groupName).join(', ');

    return <div className={`group/address flex w-full min-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch
    border-[0.8px] border-transparent
                [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
                hover:[border-image:linear-gradient(to_bottom,#26C9C91A_91%,#26C9C91A_100%)_1]
                hover:bg-[#232323]
                hover:shadow-[0_17px_20px_0_rgba(38,201,200,0.00),0_11px_18px_0_rgba(38,201,200,0.01),0_6px_14px_0_rgba(38,201,200,0.05)]
                ${selected ? "bg-[#1C1E1F]" : "bg-[#0E1011]"}
                group-hover:z-10`}
                >
        <div className="flex w-[187px] items-center gap-2">
            <IconButton
                icon={selected ? <CheckBoxFilledIcon /> : <CheckBoxOutlineIcon />}
                status={selected ? "brand" : "neutral"}
                size="sm"
                className={`${selected ? "opacity-100" : "opacity-30"} group-hover/address:opacity-100`}
                onClick={handleCheckboxClick}
            />
            <span className="w-[293px] text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px] line-clamp-1 flex-[1_0_0]">{address.name}</span>
        </div>
        <div className="flex w-[406px] items-center gap-4 min-w-0">
            <span className="truncate flex-1 overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[0.7px] font-mono">
                {address.walletHash}
            </span>
            <IconButton icon={<QRCodeIcon />} status="neutral" size="sm" className="scale-0 group-hover/address:scale-100 mt-1.5" tooltipTitle={address.name} qrCode={address.walletHash} />
        </div>
        <div className={`${trustLevel === "trusted" ? "opacity-100" : "opacity-50"} w-[154px]`}>
            <span className="overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[0.7px]">{interactionStatus}</span>
        </div>

        <div className="flex h-[30px] justify-start items-center gap-2.5 flex-[1_0_0]">
            {displayGroups.map((group, index) => (
                <span
                    key={group.groupId}
                    className="text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-extralight leading-[normal] tracking-[0.7px] truncate"
                >
                    {group.groupName}
                </span>
            ))}
            {remainingGroups > 0 && (
                <TertiaryButton 
                    label={`+${remainingGroups} more`} 
                    size="md" 
                    tooltipTitle={hiddenGroupNames}
                />
            )}
            {address.groups.length === 0 && (
                <TertiaryButton label="Add to group" leadingIcon={<AddToGroupIcon />} size="md" />
            )}
        </div>

        <div className="flex justify-end items-center gap-4 opacity-0 group-hover/address:opacity-100 group-hover/address:flex-[1_0_0]">
            <IconButton icon={<EditIcon />} status="neutral" size="sm" className="scale-0 group-hover/address:scale-100" />
            <IconButton icon={<SendIcon />} status="neutral" size="sm" className="scale-0 group-hover/address:scale-100" />
        </div>
    </div>
}