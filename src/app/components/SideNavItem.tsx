import clsx from "clsx";

type SideNavItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  state?: "default" | "disabled";
  onClick?: () => void;
};

export default function SideNavItem({
  icon: Icon,
  label,
  active = false,
  state = "default",
  onClick,
}: SideNavItemProps) {
  const isDisabled = state === "disabled";

  const wrapperClass = clsx(
    "flex self-stretch p-[0.5px] rounded-[10.5px] transition-all duration-150 ease-in-out group/icon",
    {
      "opacity-50": isDisabled,
      "bg-gradient-to-b from-[rgba(38,201,201,0.4)] to-transparent": active,
      "group": !isDisabled,
      "hover:bg-gradient-to-b from-[rgba(38,201,201)] to-transparent": !active
    }
  );

  const linkClass = clsx(
    "flex w-full items-center pt-[8px] pr-[12px] pb-[8px] pl-[8px] gap-[10px] font-[Figtree] text-sm not-italic font-medium leading-[normal] tracking-[0.112px] rounded-[10px] transition-all duration-300 ease-in-out",
    active
      ? "text-[#D7DCF3] bg-[#232323] group-hover:bg-[#192E2E]"
      : "text-[#C8CACB] bg-black group-hover:bg-[#155656] hover:text-[#D7DCF3]"
  );

  return (
    <div className={wrapperClass}>
      <button
        className={linkClass}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        onClick={onClick}
      >        
          <Icon 
                    className={clsx(
            "h-4.5 w-4.5 transition-colors duration-150",
            active ? "text-[#C8CACB]" : "text-[#C8CACB]/70",
            !active && !isDisabled && "group-hover/icon:text-[#C8CACB]"
          )}
          />
        
        {label}
      </button>
    </div>
  );
}
