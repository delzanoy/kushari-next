// src/types/input.ts
export type InputSize = "sm" | "md" | "lg";
export type InputWidth = number | "full";

// Instead of a union type, we'll track states separately
export interface InputState {
  error: boolean;
  focused: boolean;
  hovered: boolean;
  disabled: boolean;
}

export interface BaseInputProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  width?: InputWidth;
  error?: boolean;
  disabled?: boolean;
  iconSize?: InputSize;
  className?: string;
}

// Color tokens for consistent theming
export const Colors = {
  primary: "#26C9C9",
  primaryLight: "rgba(38, 201, 201, 0.12)",
  error: "#FF5356",
  errorLight: "rgba(237, 9, 13, 0.12)",
  errorBackground: "#3A2526",
  text: "#F8FCFF",
  textDisabled: "#A3A7A8",
  textMuted: "#52525B",
  background: "#F8FCFF",
  border: "#F8FCFF",
  placeholder: "rgba(248, 252, 255, 0.5)",
} as const;