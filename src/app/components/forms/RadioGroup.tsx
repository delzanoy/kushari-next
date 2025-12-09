// // src/app/components/forms/RadioGroup.tsx
// "use client";
// import React, { useId } from "react";
// import { RadioGroupProps } from "./types";
// import { RadioButton } from "./RadioButton";
// import { getHelperTextClasses } from "../../utils/input-utils";

// export const RadioGroup: React.FC<RadioGroupProps> = ({
//   name,
//   label,
//   options,
//   value,
//   onChange,
//   orientation = "vertical",
//   error = false,
//   helperText,
//   disabled = false,
//   size = "md",
//   width,
//   className = "",
// }) => {
//   const groupId = useId();

//   const containerClasses = `flex flex-col items-start gap-1.5 self-stretch ${className}`;
//   const containerStyle = typeof width === "number" ? { width: `${width}px` } : {};
//   const widthClass = width === "full" ? "w-full" : "";

//   const optionsContainerClasses = `
//     flex py-[0] px-[12px] items-start gap-6
//     ${orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}
//   `;

//   const helperTextClass = getHelperTextClasses({ 
//     error, 
//     focused: false, 
//     hovered: false, 
//     disabled 
//   });

//   return (
//     <div
//       className={`${containerClasses} ${widthClass}`}
//       style={containerStyle}
//       role="radiogroup"
//       aria-labelledby={label ? `${groupId}-label` : undefined}
//       aria-describedby={helperText ? `${groupId}-helper` : undefined}
//     >
//       {/* Label */}
//       {label && (
//         <label
//           id={`${groupId}-label`}
//           className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${
//               disabled ? "opacity-50" : ""
//             }`}
//         >
//           {label}
//         </label>
//       )}

//       {/* Radio Options */}
//       <div className={optionsContainerClasses}>
//         {options.map((option) => (
//           <RadioButton
//             key={option.value}
//             name={name}
//             value={option.value}
//             label={option.label}
//             description={option.description}
//             icon={option.icon}
//             checked={value === option.value}
//             onChange={onChange}
//             disabled={disabled || option.disabled}
//             error={error}
//             size={size}
//           />
//         ))}
//       </div>

//       {/* Helper Text */}
//       {helperText && (
//         <span id={`${groupId}-helper`} className={helperTextClass}>
//           {helperText}
//         </span>
//       )}
//     </div>
//   );
// };



// src/app/components/forms/RadioGroup.tsx
"use client";
import React, { useId } from "react";
import { RadioGroupProps } from "./types";
import { RadioButton } from "./RadioButton";
import { getHelperTextClasses } from "../../utils/input-utils";

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  orientation = "vertical",
  align = "start", // New prop for horizontal alignment
  error = false,
  helperText,
  disabled = false,
  size = "md",
  width,
  className = "",
}) => {
  const groupId = useId();

  const containerClasses = `flex flex-col items-start gap-1.5 self-stretch ${className}`;
  const containerStyle = typeof width === "number" ? { width: `${width}px` } : {};
  const widthClass = width === "full" ? "w-full" : "";

  // Define alignment classes based on orientation
  const getAlignmentClasses = () => {
    if (orientation === "horizontal") {
      const alignMap = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      };
      return alignMap[align] || "justify-start";
    }
    return "";
  };

  const optionsContainerClasses = `
    flex py-[0] px-[12px] items-start gap-6
    ${orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}
    ${getAlignmentClasses()}
  `;

  const helperTextClass = getHelperTextClasses({ 
    error, 
    focused: false, 
    hovered: false, 
    disabled 
  });

  return (
    <div
      className={`${containerClasses} ${widthClass}`}
      style={containerStyle}
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={helperText ? `${groupId}-helper` : undefined}
    >
      {/* Label */}
      {label && (
        <label
          id={`${groupId}-label`}
          className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${
              disabled ? "opacity-50" : ""
            }`}
        >
          {label}
        </label>
      )}

      {/* Radio Options */}
      <div className={optionsContainerClasses}>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled || option.disabled}
            error={error}
            size={size}
          />
        ))}
      </div>

      {/* Helper Text */}
      {helperText && (
        <span id={`${groupId}-helper`} className={helperTextClass}>
          {helperText}
        </span>
      )}
    </div>
  );
};