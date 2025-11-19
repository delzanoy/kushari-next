import { useState } from "react";
import TransactionDetails from "./TransactionDetails";
import TransactionHeader from "./TransactionHeader";
import { TransactionCardProps } from './types';

export default function TransactionCard({ transaction, uniqueClassifications, addresses }: TransactionCardProps) {
    const [expanded, setExpanded] = useState(transaction.expanded || false);
    const toggleExpanded = () => setExpanded(prev => !prev);

    const handleCardClick = (e: React.MouseEvent) => {
        // Check if the click came from the classification area
        const target = e.target as HTMLElement;
        const isClassificationClick = target.closest('[data-classification]');

        if (!isClassificationClick) {
            toggleExpanded();
        }
    };

    return (
        <div
            className="group flex flex-col w-full max-w-[1040px] mx-auto
            justify-end items-end
            bg-[#0E1011]
            border-[0.8px] border-transparent
            [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
            hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1]        
            hover:bg-[#1C2325]
            hover:shadow-[0_34px_10px_0_rgba(38,201,200,0.00),0_22px_9px_0_rgba(38,201,200,0.01),0_12px_7px_0_rgba(38,201,200,0.05),0_5px_5px_0_rgba(38,201,200,0.09),0_1px_3px_0_rgba(38,201,200,0.10)]
            group-hover:z-10
            cursor-pointer"
            onClick={handleCardClick}
        >
            <TransactionHeader
                transaction={transaction}
                uniqueClassifications={uniqueClassifications}
                addresses={addresses}
                 expanded={expanded}
            />

            {expanded && (
                <TransactionDetails
                    transaction={transaction}
                    addresses={addresses}
                />
            )}
        </div>
    );
}