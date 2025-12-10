// src/utils/input-utils.ts
import { InputSize, InputState, Colors } from "../components/forms/types";

export const getIconSizeClass = (size: InputSize): string => {
  const sizeMap: Record<InputSize, string> = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  return sizeMap[size];
};

export const getInputClasses = (state: InputState): string => {
  const base = "font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.7px]";

  if (state.disabled) {
    return `${base} text-[${Colors.textDisabled}] cursor-not-allowed`;
  }

  if (state.error) {
    return `${base} text-[${Colors.error}]`;
  }

  return `${base} text-[${Colors.text}]`;
};

export const getPlaceholderClasses = (state: InputState, isDropdown = false): string => {
  if (isDropdown) {
    // For dropdown (div element), use regular text color classes
    if (state.disabled) return `text-[${Colors.textDisabled}]/50`;
  if (state.error) return `text-[${Colors.text}]/50`;
  return `text-[${Colors.placeholder}]`;
  }
  
  // For input elements, use placeholder:text-* classes
  if (state.disabled) return `placeholder:text-[${Colors.textDisabled}]/50`;
  if (state.error) return `placeholder:text-[${Colors.text}]/50`;
  return `placeholder:text-[${Colors.placeholder}]`;
};

export const getHelperTextClasses = (state: InputState): string => {
  const base = "font-[Geist] text-[10px] not-italic leading-[normal] tracking-[0.08px]";

  if (state.disabled) return `${base} text-[${Colors.textDisabled}]/70`;
  if (state.error) return `${base} text-[${Colors.error}] font-medium`;
  return `${base} text-[${Colors.text}]/70`;
};

export const getBorderColor = (state: InputState): string => {
  if (state.disabled) return `border-[${Colors.border}]/24`;
  if (state.error) return "border-[#EF4444]/70";
  if (state.focused) return `border-[${Colors.primary}]`;
  if (state.hovered) return "border-[#26C9C9]/70";
  return `border-[${Colors.border}]/24`;
};

export const getBackgroundColor = (state: InputState): string => {
  if (state.disabled) return "bg-[#F8FCFF]/3";

  // Error state backgrounds
  if (state.error) {
    if (state.focused) {
      return "bg-[#3A2526]/50"; // 50% opacity when focused in error state
    }
    return "bg-[#3A2526]/25"; // 25% opacity for error state
  }

  // Normal focused state
  if (state.focused) return "bg-[#26C9C9]/2";

  return "bg-[#F8FCFF]/6";
};

export const getOuterBorderStyle = (state: InputState): React.CSSProperties | null => {
  if (state.disabled) return null;

  if (state.error && state.focused) {
    return {
      border: "2px solid rgba(237, 9, 13, 0.12)", // ED090D at 12% opacity
    };
  }

  if (state.error && state.hovered) {
    return {
      border: "2px solid rgba(237, 9, 13, 0.12)", // Also apply on hover when in error state
    };
  }

  if (state.focused && !state.error) {
    return {
      border: `2px solid ${Colors.primaryLight}`,
    };
  }

  return null;
};