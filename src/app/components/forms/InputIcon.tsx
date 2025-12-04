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
    // Leading icon: always #52525B
    if (position === "leading") {
      return "text-[#52525B]";
    }
    
    // Trailing icon: #52525B by default, #F8FCFF at 50% opacity on hover
    if (position === "trailing") {
      if (state.hovered) {
        return "text-[#F8FCFF]/50";
      }
      return "text-[#52525B]";
    }
    
    // Fallback
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
  const getContainerClasses = () => {
    if (isTextArea) {
      // For textareas: leading icon at top, trailing icon at bottom
      return position === "leading" 
        ? "flex items-start justify-center pt-[2px]"
        : "flex items-end justify-center pt-[2px] self-stretch";
    }
    
    // For regular inputs: both icons centered
    return "flex items-center justify-center";
  };

  const containerClasses = getContainerClasses();

  return (
    <div className={containerClasses} aria-hidden="true">
      {renderedIcon}
    </div>
  );
};