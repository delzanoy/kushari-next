// src/hooks/useInput.ts
import { useState, useEffect, useId } from "react";
import { InputState } from "../components/forms/types";

interface UseInputProps {
  error?: boolean;
  disabled?: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onChange?: (e: any) => void;
  id?: string;
}

export const useInput = ({
  error = false,
  disabled = false,
  onFocus,
  onBlur,
  onChange,
  id,
}: UseInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [localError, setLocalError] = useState<boolean>(error);
  
  // Generate ID for accessibility
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  // Sync local error when prop changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  // Create the state object
  const state: InputState = {
    error: localError,
    focused: isFocused,
    hovered: isHovered,
    disabled: disabled,
  };

  // Event handlers
  const handleFocus = (e: any) => {
    if (disabled) return;
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleChange = (e: any) => {
    // Clear local visual error when user types
    if (localError) setLocalError(false);
    // Forward original onChange if provided
    onChange?.(e);
  };

  return {
    state,
    inputId,
    isFocused,
    isHovered,
    localError,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handleChange,
  };
};