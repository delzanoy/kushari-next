import { ReactNode } from 'react';

export type NotificationIslandProps = {
  // Content
  title: string;
  subtitle?: string;
  
  // Icons
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  
  // Actions
  titleAction?: ReactNode;
  mainActions?: ReactNode;
  
  // Styling
  className?: string;
  contentClassName?: string;
  actionsClassName?: string;
};

export default function NotificationIsland({
  title,
  subtitle,
  leadingIcon,
  trailingIcon,
  titleAction,
  mainActions,
  className = '',
  contentClassName = '',
  actionsClassName = '',
}: NotificationIslandProps) {
  return (
    <div className={`flex pt-[4px] pr-[4px] pb-[4px] pl-[20px] justify-between items-center gap-6 rounded-[14px] border-[0.5px] border-solid border-[#454545] shadow-[0_0_75px_25px_#0E1011] absolute left-1/2 -translate-x-1/2 bottom-6 bg-[#1C1E1F] ${className}`}>
      {/* Left Section */}
      <div className={`flex items-center gap-4 flex-1 ${contentClassName}`}>
        {leadingIcon && (
          <div className="flex items-center justify-center">
            {leadingIcon}
          </div>
        )}
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[#FDFDFD] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[1.12px]">
              {title}
            </span>
            {trailingIcon && (
              <div className="flex items-center justify-center">
                {trailingIcon}
              </div>
            )}
          </div>
          
          {subtitle && (
            <span className="text-[#FDFDFD]/60 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] mt-1">
              {subtitle}
            </span>
          )}
        </div>
        
        {titleAction && (
          <div className="ml-auto">
            {titleAction}
          </div>
        )}
      </div>
      
      {/* Right Section */}
      {mainActions && (
        <div className={`flex items-center gap-2 ${actionsClassName}`}>
          {mainActions}
        </div>
      )}
    </div>
  );
}