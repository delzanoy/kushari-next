// src/components/forms/InputIcon.tsx
import React from "react";
import { InputSize, InputState } from "./types";
import { getIconSizeClass } from "../../utils/input-utils";

interface InputIconProps {
  icon: React.ReactNode;
  position: "leading" | "trailing";
  iconSize: InputSize;
  state: InputState;
  isTextArea?: boolean;
}

export const InputIcon: React.FC<InputIconProps> = ({
  icon,
  position,
  iconSize,
  state,
  isTextArea = false,
}) => {
  const iconSizeClass = getIconSizeClass(iconSize);
  
  const getIconColor = (): string => {
    if (state.error) return "text-[#52525B]";
    if (state.disabled) return "text-[#52525B]";
    
    // For trailing icon: change to #F8FCFF with 50% opacity on hover
    if (position === "trailing" && state.hovered) {
      return "text-[#F8FCFF]/50";
    }
    
    // Default color for both icons
    return "text-[#52525B]";
  };

  const iconColor = getIconColor();
  
  // If it's a valid React element, clone it with our classes
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: `${iconSizeClass} ${iconColor} ${((icon as any).props?.className ?? "").toString()}`.trim(),
      } as any)
    : icon;

  // Different container styles for textarea vs input
  const containerClasses = isTextArea 
    ? "flex items-start justify-center pt-[10px]" 
    : "flex items-center justify-center";

  return (
    <div className={containerClasses} aria-hidden="true">
      {renderedIcon}
    </div>
  );
};