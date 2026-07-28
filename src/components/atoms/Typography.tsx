"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Shared types ────────────────────────────────────────────────────────────

export type TypographySize =
  | "2xs" | "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export type TypographyColor =
  | "primary" | "secondary" | "muted" | "disabled" | "inverse"
  | "brand" | "danger" | "warning" | "success";

export type TypographyWeight = "normal" | "medium" | "semibold" | "bold";

const SIZE_CLASS: Record<TypographySize, string> = {
  "2xs":  "text-2xs",
  "xs":   "text-xs",
  "sm":   "text-sm",
  "base": "text-base",
  "md":   "text-md",
  "lg":   "text-lg",
  "xl":   "text-xl",
  "2xl":  "text-2xl",
  "3xl":  "text-3xl",
  "4xl":  "text-4xl",
};

const COLOR_CLASS: Record<TypographyColor, string> = {
  primary:   "text-[var(--color-text-primary)]",
  secondary: "text-[var(--color-text-secondary)]",
  muted:     "text-[var(--color-text-muted)]",
  disabled:  "text-[var(--color-text-disabled)]",
  inverse:   "text-[var(--color-text-inverse)]",
  brand:     "text-[var(--color-text-brand)]",
  danger:    "text-[var(--color-text-danger)]",
  warning:   "text-[var(--color-text-warning)]",
  success:   "text-[var(--color-text-success)]",
};

const WEIGHT_CLASS: Record<TypographyWeight, string> = {
  normal:   "font-normal",
  medium:   "font-medium",
  semibold: "font-semibold",
  bold:     "font-bold",
};

// ─── Heading ─────────────────────────────────────────────────────────────────

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingFont  = "display" | "sans";

const HEADING_DEFAULTS: Record<HeadingLevel, { size: TypographySize; weight: TypographyWeight; tracking: string }> = {
  h1: { size: "4xl", weight: "bold",     tracking: "tracking-tightest" },
  h2: { size: "3xl", weight: "semibold", tracking: "tracking-tight"    },
  h3: { size: "2xl", weight: "semibold", tracking: "tracking-tight"    },
  h4: { size: "xl",  weight: "medium",   tracking: "tracking-normal"   },
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level — controls the rendered tag */
  level?: HeadingLevel;
  /** Visual size override — defaults to level's natural size */
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  /** Font family — "display" uses General Sans, "sans" uses Geist */
  font?: HeadingFont;
  truncate?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = "h2",
      size,
      weight,
      color = "primary",
      font = "display",
      truncate = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const defaults = HEADING_DEFAULTS[level];
    const Tag = level;

    return (
      <Tag
        ref={ref}
        className={cn(
          SIZE_CLASS[size ?? defaults.size],
          WEIGHT_CLASS[weight ?? defaults.weight],
          COLOR_CLASS[color],
          defaults.tracking,
          font === "display"
            ? "font-[family-name:var(--font-display)]"
            : "font-[family-name:var(--font-sans)]",
          truncate && "truncate",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
Heading.displayName = "Heading";

// ─── Text ─────────────────────────────────────────────────────────────────────

type TextTag = "p" | "span" | "div" | "li" | "strong" | "em" | "small";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Rendered HTML tag — defaults to "p" */
  as?: TextTag;
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  truncate?: boolean;
  /** Clamp text to N lines with ellipsis */
  clamp?: 1 | 2 | 3 | 4;
  /** Render as inline element (removes default block margin) */
  inline?: boolean;
}

const CLAMP_CLASS: Record<NonNullable<TextProps["clamp"]>, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Tag = "p",
      size = "base",
      weight = "normal",
      color = "primary",
      truncate = false,
      clamp,
      inline = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref as React.Ref<never>}
        className={cn(
          SIZE_CLASS[size],
          WEIGHT_CLASS[weight],
          COLOR_CLASS[color],
          "leading-[1.3]",
          inline && "inline",
          truncate && "truncate",
          clamp && CLAMP_CLASS[clamp],
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
Text.displayName = "Text";

// ─── Label ────────────────────────────────────────────────────────────────────

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: TypographySize;
  weight?: TypographyWeight;
  /**
   * Token-based text color. Omit to control color entirely via className
   * (useful for dynamic focus-state colors in form components).
   */
  color?: TypographyColor;
  /** Appends a red asterisk */
  required?: boolean;
  /** Appends a muted "(optional)" tag */
  optional?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      size = "sm",
      weight = "medium",
      color = "secondary",
      required = false,
      optional = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <label
        ref={ref}
        className={cn(
          SIZE_CLASS[size],
          WEIGHT_CLASS[weight],
          color && COLOR_CLASS[color],
          "leading-none select-none",
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-0.5 text-[var(--color-label-required)]" aria-hidden="true">
            *
          </span>
        )}
        {optional && !required && (
          <span className="ml-1 text-[var(--color-label-optional)] font-normal">
            (optional)
          </span>
        )}
      </label>
    );
  },
);
Label.displayName = "Label";

// ─── Mono ─────────────────────────────────────────────────────────────────────

type MonoTag = "span" | "p" | "div" | "code" | "pre";

export interface MonoProps extends React.HTMLAttributes<HTMLElement> {
  /** Rendered HTML tag — defaults to "span" */
  as?: MonoTag;
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor;
  truncate?: boolean;
  /** Tight letter-spacing for address/hash display (default true) */
  tight?: boolean;
}

export const Mono = React.forwardRef<HTMLElement, MonoProps>(
  (
    {
      as: Tag = "span",
      size = "sm",
      weight = "normal",
      color = "secondary",
      truncate = false,
      tight = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref as React.Ref<never>}
        className={cn(
          SIZE_CLASS[size],
          WEIGHT_CLASS[weight],
          COLOR_CLASS[color],
          "font-[family-name:var(--font-mono)]",
          tight ? "tracking-tight" : "tracking-normal",
          truncate && "truncate",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
Mono.displayName = "Mono";
