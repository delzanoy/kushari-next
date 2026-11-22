"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Copy,
  Check,
  Info,
  Accessibility,
  Eye,
  Type,
  Layers,
  Zap,
  Move,
  LayoutGrid,
  Ruler,
  MousePointer2,
  Wind,
  MoveUp,
  Maximize2,
  Play,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DocNav } from "@/components/ui/DocNav";
import { DocsLayout } from "@/components/ui/DocsLayout";
import { PRIMITIVES } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import { transitions, variants, interactions } from "@/lib/motion";

/* ============================================================
   /tokens — Design Token Archive
   Token v2 — Layer 1 Visual Reference

   A gallery-grade documentation of every primitive token
   in the design system. Built to be a reference, a showcase,
   and a piece of art.
   ============================================================ */

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const COLOR_SCALES: {
  name: string;
  cssPrefix: string;
  description: string;
  steps: { step: string; hex: string; wcag?: string; note?: string }[];
}[] = [
    {
      name: "Cyan",
      cssPrefix: "cyan",
      description:
        "Brand primary. Interactive elements, active states, links, brand accents. High-vibrancy with architectural depth.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.cyan[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.cyan[50], wcag: "19.0:1" },
        { step: "100", hex: PRIMITIVES.colors.cyan[100], wcag: "18.2:1", note: "Light accents" },
        { step: "200", hex: PRIMITIVES.colors.cyan[200], wcag: "16.8:1", note: "Highlights" },
        { step: "300", hex: PRIMITIVES.colors.cyan[300], wcag: "14.5:1", note: "Interactive" },
        { step: "400", hex: PRIMITIVES.colors.cyan[400], wcag: "11.2:1", note: "Hover states" },
        { step: "500", hex: PRIMITIVES.colors.cyan[500], wcag: "10.4:1", note: "Primary brand" },
        { step: "600", hex: PRIMITIVES.colors.cyan[600], wcag: "8.6:1", note: "Pressed states" },
        { step: "700", hex: PRIMITIVES.colors.cyan[700], wcag: "5.4:1", note: "Strong" },
        { step: "750", hex: PRIMITIVES.colors.cyan[750], wcag: "4.1:1" },
        { step: "800", hex: PRIMITIVES.colors.cyan[800], wcag: "2.8:1", note: "Tonal bg" },
        { step: "850", hex: PRIMITIVES.colors.cyan[850], wcag: "2.1:1" },
        { step: "900", hex: PRIMITIVES.colors.cyan[900], wcag: "1.5:1", note: "Dark surface" },
        { step: "925", hex: PRIMITIVES.colors.cyan[925], wcag: "1.2:1" },
        { step: "950", hex: PRIMITIVES.colors.cyan[950], wcag: "1.1:1", note: "Deepest" },
      ],
    },
    {
      name: "Danger",
      cssPrefix: "danger",
      description: "Critical alerts and destructive actions. Ruby-toned for weighted urgency.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.red[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.red[50], wcag: "18.8:1" },
        { step: "100", hex: PRIMITIVES.colors.red[100], wcag: "17.4:1", note: "Light error bg" },
        { step: "200", hex: PRIMITIVES.colors.red[200], wcag: "14.1:1", note: "Error text" },
        { step: "300", hex: PRIMITIVES.colors.red[300], wcag: "10.6:1", note: "Error accents" },
        { step: "400", hex: PRIMITIVES.colors.red[400], wcag: "7.1:1", note: "Primary danger" },
        { step: "500", hex: PRIMITIVES.colors.red[500], wcag: "5.4:1", note: "Destructive" },
        { step: "600", hex: PRIMITIVES.colors.red[600], wcag: "4.5:1", note: "AA PASS" },
        { step: "700", hex: PRIMITIVES.colors.red[700], wcag: "3.2:1", note: "Strong" },
        { step: "750", hex: PRIMITIVES.colors.red[750], wcag: "2.5:1" },
        { step: "800", hex: PRIMITIVES.colors.red[800], wcag: "1.9:1" },
        { step: "850", hex: PRIMITIVES.colors.red[850], wcag: "1.5:1" },
        { step: "900", hex: PRIMITIVES.colors.red[900], wcag: "1.2:1" },
        { step: "925", hex: PRIMITIVES.colors.red[925], wcag: "1.1:1" },
        { step: "950", hex: PRIMITIVES.colors.red[950], wcag: "1.1:1" },
      ],
    },
    {
      name: "Success",
      cssPrefix: "success",
      description: "Confirmation and success states. Emerald-toned for clarity and growth.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.green[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.green[50], wcag: "19.5:1" },
        { step: "100", hex: PRIMITIVES.colors.green[100], wcag: "17.9:1" },
        { step: "200", hex: PRIMITIVES.colors.green[200], wcag: "15.2:1" },
        { step: "300", hex: PRIMITIVES.colors.green[300], wcag: "11.8:1" },
        { step: "400", hex: PRIMITIVES.colors.green[400], wcag: "8.4:1" },
        { step: "500", hex: PRIMITIVES.colors.green[500], wcag: "6.2:1" },
        { step: "600", hex: PRIMITIVES.colors.green[600], wcag: "4.8:1", note: "AA PASS" },
        { step: "700", hex: PRIMITIVES.colors.green[700], wcag: "3.2:1" },
        { step: "750", hex: PRIMITIVES.colors.green[750], wcag: "2.5:1" },
        { step: "800", hex: PRIMITIVES.colors.green[800], wcag: "2.1:1" },
        { step: "850", hex: PRIMITIVES.colors.green[850], wcag: "1.8:1" },
        { step: "900", hex: PRIMITIVES.colors.green[900], wcag: "1.6:1" },
        { step: "925", hex: PRIMITIVES.colors.green[925], wcag: "1.3:1" },
        { step: "950", hex: PRIMITIVES.colors.green[950], wcag: "1.1:1" },
      ],
    },
    {
      name: "Warning",
      cssPrefix: "warning",
      description: "Cautions and pending states. Amber-toned for professional alertness.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.amber[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.amber[50], wcag: "19.8:1" },
        { step: "100", hex: PRIMITIVES.colors.amber[100], wcag: "18.5:1" },
        { step: "200", hex: PRIMITIVES.colors.amber[200], wcag: "16.1:1" },
        { step: "300", hex: PRIMITIVES.colors.amber[300], wcag: "13.2:1" },
        { step: "400", hex: PRIMITIVES.colors.amber[400], wcag: "10.4:1" },
        { step: "500", hex: PRIMITIVES.colors.amber[500], wcag: "7.2:1" },
        { step: "600", hex: PRIMITIVES.colors.amber[600], wcag: "4.8:1", note: "AA PASS" },
        { step: "700", hex: PRIMITIVES.colors.amber[700], wcag: "3.1:1" },
        { step: "750", hex: PRIMITIVES.colors.amber[750], wcag: "2.5:1" },
        { step: "800", hex: PRIMITIVES.colors.amber[800], wcag: "2.2:1" },
        { step: "850", hex: PRIMITIVES.colors.amber[850], wcag: "1.8:1" },
        { step: "900", hex: PRIMITIVES.colors.amber[900], wcag: "1.6:1" },
        { step: "925", hex: PRIMITIVES.colors.amber[925], wcag: "1.3:1" },
        { step: "950", hex: PRIMITIVES.colors.amber[950], wcag: "1.2:1" },
      ],
    },
    {
      name: "Lime",
      cssPrefix: "lime",
      description: "Vivid, energetic green. Growth indicators, eco-aware signals, and high-vibrancy data viz.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.lime[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.lime[50], wcag: "19.8:1" },
        { step: "100", hex: PRIMITIVES.colors.lime[100], wcag: "18.8:1" },
        { step: "200", hex: PRIMITIVES.colors.lime[200], wcag: "17.0:1" },
        { step: "300", hex: PRIMITIVES.colors.lime[300], wcag: "15.2:1" },
        { step: "400", hex: PRIMITIVES.colors.lime[400], wcag: "13.4:1" },
        { step: "500", hex: PRIMITIVES.colors.lime[500], wcag: "10.2:1" },
        { step: "600", hex: PRIMITIVES.colors.lime[600], wcag: "7.0:1" },
        { step: "700", hex: PRIMITIVES.colors.lime[700], wcag: "4.8:1", note: "AA PASS" },
        { step: "750", hex: PRIMITIVES.colors.lime[750], wcag: "4.0:1" },
        { step: "800", hex: PRIMITIVES.colors.lime[800], wcag: "3.3:1" },
        { step: "850", hex: PRIMITIVES.colors.lime[850], wcag: "2.8:1" },
        { step: "900", hex: PRIMITIVES.colors.lime[900], wcag: "2.4:1" },
        { step: "925", hex: PRIMITIVES.colors.lime[925], wcag: "1.7:1" },
        { step: "950", hex: PRIMITIVES.colors.lime[950], wcag: "1.3:1" },
      ],
    },
    {
      name: "Emerald",
      cssPrefix: "emerald",
      description: "Rich jewel-tone green. Positive trends, verified states, and premium badges.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.emerald[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.emerald[50], wcag: "19.6:1" },
        { step: "100", hex: PRIMITIVES.colors.emerald[100], wcag: "18.2:1" },
        { step: "200", hex: PRIMITIVES.colors.emerald[200], wcag: "15.6:1" },
        { step: "300", hex: PRIMITIVES.colors.emerald[300], wcag: "12.4:1" },
        { step: "400", hex: PRIMITIVES.colors.emerald[400], wcag: "9.2:1" },
        { step: "500", hex: PRIMITIVES.colors.emerald[500], wcag: "6.8:1" },
        { step: "600", hex: PRIMITIVES.colors.emerald[600], wcag: "4.9:1", note: "AA PASS" },
        { step: "700", hex: PRIMITIVES.colors.emerald[700], wcag: "3.6:1" },
        { step: "750", hex: PRIMITIVES.colors.emerald[750], wcag: "3.1:1" },
        { step: "800", hex: PRIMITIVES.colors.emerald[800], wcag: "2.6:1" },
        { step: "850", hex: PRIMITIVES.colors.emerald[850], wcag: "2.3:1" },
        { step: "900", hex: PRIMITIVES.colors.emerald[900], wcag: "2.0:1" },
        { step: "925", hex: PRIMITIVES.colors.emerald[925], wcag: "1.5:1" },
        { step: "950", hex: PRIMITIVES.colors.emerald[950], wcag: "1.2:1" },
      ],
    },
    {
      name: "Teal",
      cssPrefix: "teal",
      description: "Cyan's cooler sibling. Secondary information, tooltips, and ambient depth in data-heavy UIs.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.teal[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.teal[50], wcag: "19.4:1" },
        { step: "100", hex: PRIMITIVES.colors.teal[100], wcag: "18.0:1" },
        { step: "200", hex: PRIMITIVES.colors.teal[200], wcag: "15.8:1" },
        { step: "300", hex: PRIMITIVES.colors.teal[300], wcag: "12.8:1" },
        { step: "400", hex: PRIMITIVES.colors.teal[400], wcag: "9.6:1" },
        { step: "500", hex: PRIMITIVES.colors.teal[500], wcag: "7.2:1" },
        { step: "600", hex: PRIMITIVES.colors.teal[600], wcag: "5.0:1", note: "AA PASS" },
        { step: "700", hex: PRIMITIVES.colors.teal[700], wcag: "3.6:1" },
        { step: "750", hex: PRIMITIVES.colors.teal[750], wcag: "3.1:1" },
        { step: "800", hex: PRIMITIVES.colors.teal[800], wcag: "2.6:1" },
        { step: "850", hex: PRIMITIVES.colors.teal[850], wcag: "2.3:1" },
        { step: "900", hex: PRIMITIVES.colors.teal[900], wcag: "2.0:1" },
        { step: "925", hex: PRIMITIVES.colors.teal[925], wcag: "1.5:1" },
        { step: "950", hex: PRIMITIVES.colors.teal[950], wcag: "1.2:1" },
      ],
    },
    {
      name: "Sky",
      cssPrefix: "sky",
      description: "Luminous light-blue. Informational callouts, links in data contexts, and atmospheric accents.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.sky[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.sky[50], wcag: "19.2:1" },
        { step: "100", hex: PRIMITIVES.colors.sky[100], wcag: "17.8:1" },
        { step: "200", hex: PRIMITIVES.colors.sky[200], wcag: "15.4:1" },
        { step: "300", hex: PRIMITIVES.colors.sky[300], wcag: "12.0:1" },
        { step: "400", hex: PRIMITIVES.colors.sky[400], wcag: "8.8:1" },
        { step: "500", hex: PRIMITIVES.colors.sky[500], wcag: "6.2:1" },
        { step: "600", hex: PRIMITIVES.colors.sky[600], wcag: "4.5:1", note: "AA PASS" },
        { step: "700", hex: PRIMITIVES.colors.sky[700], wcag: "3.2:1" },
        { step: "750", hex: PRIMITIVES.colors.sky[750], wcag: "2.8:1" },
        { step: "800", hex: PRIMITIVES.colors.sky[800], wcag: "2.4:1" },
        { step: "850", hex: PRIMITIVES.colors.sky[850], wcag: "2.1:1" },
        { step: "900", hex: PRIMITIVES.colors.sky[900], wcag: "1.8:1" },
        { step: "925", hex: PRIMITIVES.colors.sky[925], wcag: "1.4:1" },
        { step: "950", hex: PRIMITIVES.colors.sky[950], wcag: "1.2:1" },
      ],
    },
    {
      name: "Blue",
      cssPrefix: "blue",
      description: "Deep, anchoring indigo-blue. Navigation highlights, selected states, and trust signals.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.blue[0], wcag: "21.0:1" },
        { step: "50", hex: PRIMITIVES.colors.blue[50], wcag: "18.8:1" },
        { step: "100", hex: PRIMITIVES.colors.blue[100], wcag: "16.8:1" },
        { step: "200", hex: PRIMITIVES.colors.blue[200], wcag: "14.4:1" },
        { step: "300", hex: PRIMITIVES.colors.blue[300], wcag: "10.8:1" },
        { step: "400", hex: PRIMITIVES.colors.blue[400], wcag: "7.4:1" },
        { step: "500", hex: PRIMITIVES.colors.blue[500], wcag: "5.2:1" },
        { step: "600", hex: PRIMITIVES.colors.blue[600], wcag: "3.8:1" },
        { step: "700", hex: PRIMITIVES.colors.blue[700], wcag: "2.8:1" },
        { step: "750", hex: PRIMITIVES.colors.blue[750], wcag: "2.4:1" },
        { step: "800", hex: PRIMITIVES.colors.blue[800], wcag: "2.0:1" },
        { step: "850", hex: PRIMITIVES.colors.blue[850], wcag: "1.8:1" },
        { step: "900", hex: PRIMITIVES.colors.blue[900], wcag: "1.6:1" },
        { step: "925", hex: PRIMITIVES.colors.blue[925], wcag: "1.3:1" },
        { step: "950", hex: PRIMITIVES.colors.blue[950], wcag: "1.1:1" },
      ],
    },
    {
      name: "Neutral",
      cssPrefix: "neutral",
      description:
        "Archival ink scale. Optimized for OLED and high-contrast dark mode interfaces.",
      steps: [
        { step: "0", hex: PRIMITIVES.colors.neutral[0], wcag: "21.0:1", note: "Pure white" },
        { step: "50", hex: PRIMITIVES.colors.neutral[50], wcag: "18.5:1", note: "App Background" },
        { step: "100", hex: PRIMITIVES.colors.neutral[100], wcag: "17.2:1", note: "Secondary bg" },
        { step: "200", hex: PRIMITIVES.colors.neutral[200], wcag: "14.5:1", note: "Tertiary bg" },
        { step: "300", hex: PRIMITIVES.colors.neutral[300], wcag: "8.2:1", note: "Secondary text" },
        { step: "400", hex: PRIMITIVES.colors.neutral[400], wcag: "5.6:1", note: "Tertiary text" },
        { step: "500", hex: PRIMITIVES.colors.neutral[500], wcag: "4.1:1", note: "Muted text" },
        { step: "600", hex: PRIMITIVES.colors.neutral[600], wcag: "2.1:1", note: "Iconography" },
        { step: "700", hex: PRIMITIVES.colors.neutral[700], wcag: "1.6:1", note: "Separators" },
        { step: "750", hex: PRIMITIVES.colors.neutral[750], wcag: "1.3:1", note: "Borders" },
        { step: "800", hex: PRIMITIVES.colors.neutral[800], wcag: "1.2:1", note: "Surface" },
        { step: "850", hex: PRIMITIVES.colors.neutral[850], wcag: "1.1:1", note: "Sunken" },
        { step: "900", hex: PRIMITIVES.colors.neutral[900], wcag: "1.1:1", note: "OLED Deep" },
        { step: "925", hex: PRIMITIVES.colors.neutral[925], wcag: "1.1:1", note: "Deepest" },
        { step: "950", hex: PRIMITIVES.colors.neutral[950], wcag: "1.0:1", note: "Infinity Black" },
      ],
    },
  ];

const ACCENT_COLORS = [
  { name: "Ethereum", hex: PRIMITIVES.colors.accents.ethereum, css: "accent-ethereum", use: "ETH chain badge" },
  { name: "Gold", hex: PRIMITIVES.colors.accents.bitcoin, css: "accent-bitcoin", use: "BNB badges" },
  { name: "Neon", hex: PRIMITIVES.colors.accents.neon, css: "accent-neon", use: "Aurora accent" },
  { name: "Hot", hex: PRIMITIVES.colors.accents.hot, css: "accent-hot", use: "Urgent emphasis" },
];

const TYPE_SCALE = [
  { name: "text-2xs", size: PRIMITIVES.typography.scale["2xs"].size, rem: PRIMITIVES.typography.scale["2xs"].rem, lh: PRIMITIVES.typography.scale["2xs"].lh },
  { name: "text-xs", size: PRIMITIVES.typography.scale.xs.size, rem: PRIMITIVES.typography.scale.xs.rem, lh: PRIMITIVES.typography.scale.xs.lh },
  { name: "text-sm", size: PRIMITIVES.typography.scale.sm.size, rem: PRIMITIVES.typography.scale.sm.rem, lh: PRIMITIVES.typography.scale.sm.lh },
  { name: "text-base", size: PRIMITIVES.typography.scale.base.size, rem: PRIMITIVES.typography.scale.base.rem, lh: PRIMITIVES.typography.scale.base.lh },
  { name: "text-md", size: PRIMITIVES.typography.scale.md.size, rem: PRIMITIVES.typography.scale.md.rem, lh: PRIMITIVES.typography.scale.md.lh },
  { name: "text-lg", size: PRIMITIVES.typography.scale.lg.size, rem: PRIMITIVES.typography.scale.lg.rem, lh: PRIMITIVES.typography.scale.lg.lh },
  { name: "text-xl", size: PRIMITIVES.typography.scale.xl.size, rem: PRIMITIVES.typography.scale.xl.rem, lh: PRIMITIVES.typography.scale.xl.lh },
  { name: "text-2xl", size: PRIMITIVES.typography.scale["2xl"].size, rem: PRIMITIVES.typography.scale["2xl"].rem, lh: PRIMITIVES.typography.scale["2xl"].lh },
  { name: "text-3xl", size: PRIMITIVES.typography.scale["3xl"].size, rem: PRIMITIVES.typography.scale["3xl"].rem, lh: PRIMITIVES.typography.scale["3xl"].lh },
  { name: "text-4xl", size: PRIMITIVES.typography.scale["4xl"].size, rem: PRIMITIVES.typography.scale["4xl"].rem, lh: PRIMITIVES.typography.scale["4xl"].lh },
];

const TRACKING = [
  { name: "tightest", value: PRIMITIVES.typography.tracking.tightest },
  { name: "tight", value: PRIMITIVES.typography.tracking.tight },
  { name: "normal", value: PRIMITIVES.typography.tracking.normal },
  { name: "wide", value: PRIMITIVES.typography.tracking.wide },
  { name: "widest", value: PRIMITIVES.typography.tracking.widest },
];

const SPACING = [
  { name: "0", px: PRIMITIVES.spacing[0] },
  { name: "0.5", px: PRIMITIVES.spacing[0.5] },
  { name: "1", px: PRIMITIVES.spacing[1] },
  { name: "1.5", px: PRIMITIVES.spacing[1.5] },
  { name: "2", px: PRIMITIVES.spacing[2] },
  { name: "2.5", px: PRIMITIVES.spacing[2.5] },
  { name: "3", px: PRIMITIVES.spacing[3] },
  { name: "4", px: PRIMITIVES.spacing[4] },
  { name: "5", px: PRIMITIVES.spacing[5] },
  { name: "6", px: PRIMITIVES.spacing[6] },
  { name: "7", px: PRIMITIVES.spacing[7] },
  { name: "8", px: PRIMITIVES.spacing[8] },
  { name: "10", px: PRIMITIVES.spacing[10] },
  { name: "12", px: PRIMITIVES.spacing[12] },
  { name: "16", px: PRIMITIVES.spacing[16] },
];

const SHADOWS = [
  { name: "xs", description: "Small elements", css: "shadow-xs", value: PRIMITIVES.shadows.elevated.xs },
  { name: "sm", description: "Buttons, chips", css: "shadow-sm", value: PRIMITIVES.shadows.elevated.sm },
  { name: "md", description: "Cards, dropdowns", css: "shadow-md", value: PRIMITIVES.shadows.elevated.md },
  { name: "lg", description: "Modals, popovers", css: "shadow-lg", value: PRIMITIVES.shadows.elevated.lg },
  { name: "xl", description: "Floating panels", css: "shadow-xl", value: PRIMITIVES.shadows.elevated.xl },
  { name: "2xl", description: "Maximum depth", css: "shadow-2xl", value: PRIMITIVES.shadows.elevated["2xl"] },
];

const GLOWS = [
  // Brand
  { name: "brand-xs", scale: "brand", level: "xs", color: PRIMITIVES.colors.cyan[500], description: "Micro feedback" },
  { name: "brand-sm", scale: "brand", level: "sm", color: PRIMITIVES.colors.cyan[500], description: "Interactive lift" },
  { name: "brand-md", scale: "brand", level: "md", color: PRIMITIVES.colors.cyan[500], description: "Active states" },
  { name: "brand-lg", scale: "brand", level: "lg", color: PRIMITIVES.colors.cyan[500], description: "Primary emphasis" },
  { name: "brand-xl", scale: "brand", level: "xl", color: PRIMITIVES.colors.cyan[500], description: "Focal specimen" },

  // Danger
  { name: "danger-xs", scale: "danger", level: "xs", color: PRIMITIVES.colors.red[500], description: "Subtle warning" },
  { name: "danger-sm", scale: "danger", level: "sm", color: PRIMITIVES.colors.red[500], description: "Alert context" },
  { name: "danger-md", scale: "danger", level: "md", color: PRIMITIVES.colors.red[500], description: "Critical error" },
  { name: "danger-lg", scale: "danger", level: "lg", color: PRIMITIVES.colors.red[500], description: "Destructive" },
  { name: "danger-xl", scale: "danger", level: "xl", color: PRIMITIVES.colors.red[500], description: "System failure" },

  // Success
  { name: "success-xs", scale: "success", level: "xs", color: PRIMITIVES.colors.green[500], description: "Micro confirm" },
  { name: "success-sm", scale: "success", level: "sm", color: PRIMITIVES.colors.green[500], description: "Growth state" },
  { name: "success-md", scale: "success", level: "md", color: PRIMITIVES.colors.green[500], description: "Task complete" },
  { name: "success-lg", scale: "success", level: "lg", color: PRIMITIVES.colors.green[500], description: "Positive bias" },
  { name: "success-xl", scale: "success", level: "xl", color: PRIMITIVES.colors.green[500], description: "Milestone" },

  // Warning
  { name: "warning-xs", scale: "warning", level: "xs", color: PRIMITIVES.colors.amber[500], description: "Pre-alert" },
  { name: "warning-sm", scale: "warning", level: "sm", color: PRIMITIVES.colors.amber[500], description: "Low balance" },
  { name: "warning-md", scale: "warning", level: "md", color: PRIMITIVES.colors.amber[500], description: "Action required" },
  { name: "warning-lg", scale: "warning", level: "lg", color: PRIMITIVES.colors.amber[500], description: "High risk" },
  { name: "warning-xl", scale: "warning", level: "xl", color: PRIMITIVES.colors.amber[500], description: "Imminent alert" },

  // White
  { name: "white-xs", scale: "white", level: "xs", color: PRIMITIVES.colors.neutral[50], description: "Reverse micro" },
  { name: "white-sm", scale: "white", level: "sm", color: PRIMITIVES.colors.neutral[50], description: "Inverted lift" },
  { name: "white-md", scale: "white", level: "md", color: PRIMITIVES.colors.neutral[50], description: "Light focus" },
  { name: "white-lg", scale: "white", level: "lg", color: PRIMITIVES.colors.neutral[50], description: "High contrast" },
  { name: "white-xl", scale: "white", level: "xl", color: PRIMITIVES.colors.neutral[50], description: "Pure emission" },
];

const DURATIONS = [
  { ms: PRIMITIVES.motion.duration[75], use: "Micro interactions" },
  { ms: PRIMITIVES.motion.duration[150], use: "Hover, focus" },
  { ms: PRIMITIVES.motion.duration[200], use: "Standard" },
  { ms: PRIMITIVES.motion.duration[300], use: "Slide, expand" },
  { ms: PRIMITIVES.motion.duration[500], use: "Page transitions" },
  { ms: PRIMITIVES.motion.duration[800], use: "Dramatic reveals" },
];

const EASINGS = [
  { name: "standard", value: PRIMITIVES.motion.easing.standard, use: "Default", path: "M 0 100 C 40 100, 20 0, 100 0" },
  { name: "decelerate", value: PRIMITIVES.motion.easing.decelerate, use: "Enter view", path: "M 0 100 C 0 100, 20 0, 100 0" },
  { name: "accelerate", value: PRIMITIVES.motion.easing.accelerate, use: "Leave view", path: "M 0 100 C 40 100, 100 0, 100 0" },
  { name: "spring", value: PRIMITIVES.motion.easing.spring, use: "Bouncy, playful", path: "M 0 100 C 17.5 11.5, 32 127.5, 100 0" },
];

const PRESETS = [
  { name: "fadeIn", desc: "Clean opacity reveal", variant: variants.fadeIn, icon: Wind },
  { name: "slideUp", desc: "Vertical entrance with lift", variant: variants.slideUp, icon: MoveUp },
  { name: "scaleIn", desc: "Growing presence from 95%", variant: variants.scaleIn, icon: Maximize2 },
  { name: "pageTransition", desc: "Lateral shift for routes", variant: variants.pageTransition, icon: LayoutGrid },
];

const NAV_ITEMS = [
  { id: "grid", label: "Grid", num: "01" },
  { id: "colors", label: "Colors", num: "02" },
  { id: "accents", label: "Accents", num: "03" },
  { id: "atmosphere", label: "Atmosphere", num: "04" },
  { id: "typography", label: "Typography", num: "05" },
  { id: "spacing", label: "Spacing", num: "06" },
  { id: "radii", label: "Radii", num: "07" },
  { id: "shadows", label: "Shadows", num: "08" },
  { id: "glows", label: "Glows", num: "09" },
  { id: "motion", label: "Motion", num: "10" },
  { id: "wcag", label: "WCAG", num: "11" },
];

const SURFACES = [
  { id: "page", name: "Page", level: "Base", hex: PRIMITIVES.colors.neutral[950], role: "Root canvas background." },
  { id: "sunken", name: "Sunken", level: "-1", hex: PRIMITIVES.colors.neutral[925], role: "Inset containers, backgrounds." },
  { id: "surface", name: "Surface", level: "0", hex: PRIMITIVES.colors.neutral[800], role: "Default component canvas." },
  { id: "elevated", name: "Elevated", level: "+1", hex: PRIMITIVES.colors.neutral[750], role: "Cards, floating elements." },
  { id: "overlay", name: "Overlay", level: "+2", hex: PRIMITIVES.colors.neutral[700], role: "Dropdowns, modals, popovers." },
  { id: "scrim", name: "Scrim", level: "Top", hex: "rgba(0,0,0,0.6)", role: "Dimming layer for hierarchy." },
];

// ---------------------------------------------------------------------------
// Grid Components
// ---------------------------------------------------------------------------

function GridVisualizer() {
  return (
    <div className="space-y-8">
      <div className="relative h-[500px] rounded-3xl border border-white/[0.04] bg-neutral-900/20 overflow-hidden group/grid flex flex-col">
        <div className="flex-1 flex relative">
          <div className="flex-1 relative overflow-hidden bg-[#0A0A0A]">
            {/* 8px Baseline Dot Grid (Creative localized effect) */}
            <div
              className="absolute inset-0 opacity-[0.03] group-hover/grid:opacity-[0.08] transition-opacity duration-700 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #26C9C9 1px, transparent 0)`,
                backgroundSize: "8px 8px"
              }}
            />

            {/* Column Visualization (Blueprint always visible) */}
            <div className="absolute inset-0 grid grid-cols-12 gap-4 px-4 h-full pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-full border-x border-cyan-500/[0.08] bg-cyan-500/[0.01] relative transition-colors duration-500 group-hover/grid:border-cyan-500/20 group-hover/grid:bg-cyan-500/[0.03]">
                  {/* Subtle Blueprint Markers */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 group-hover/grid:opacity-100 transition-opacity duration-500">
                    <span className="font-mono text-[7px] text-cyan-500/60 uppercase tracking-tighter">Col {i + 1}</span>
                    <span className="font-mono text-[6px] text-neutral-800">72.0</span>
                  </div>

                  {/* Baseline Indicators (Creative measure) */}
                  <div className="absolute top-1/2 left-0 w-full flex items-center justify-between opacity-0 group-hover/grid:opacity-20 transition-opacity">
                    <div className="w-1 h-px bg-cyan-500" />
                    <div className="w-1 h-px bg-cyan-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Content Mock */}
            <div className="absolute inset-0 px-4 py-12 flex flex-col justify-center transition-all duration-700 group-hover/grid:opacity-10 group-hover/grid:blur-[2px]">
              <motion.div
                layout
                className="grid grid-cols-12 gap-4 w-full h-full"
              >
                <div className="col-span-8 space-y-4 flex flex-col justify-center">
                  <div className="h-8 bg-white/10 rounded-lg w-3/4 border border-white/[0.05]" />
                  <div className="h-32 bg-white/[0.04] rounded-xl border border-white/[0.05] p-6 flex flex-col justify-center gap-4">
                    <div className="w-full h-2 bg-white/20 rounded-full" />
                    <div className="w-5/6 h-2 bg-white/10 rounded-full" />
                    <div className="w-4/6 h-2 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="col-span-4 flex items-center">
                  <div className="w-full h-44 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-cyan-500/40 bg-cyan-500/10 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Spec Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 p-8 rounded-3xl border border-white/[0.04] bg-neutral-900/40 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col gap-2">
            <h4 className="font-display text-xl font-bold text-white tracking-tight">The 1040 layout math</h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm">
              Optimized for high-density information display while maintaining clear optical rhythm through consistent 8-pixel increments.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-12">
            {[
              { val: "1040", label: "Max Width", unit: "px" },
              { val: "12", label: "Columns", unit: "count" },
              { val: "16", label: "Gutters", unit: "px" },
              { val: "8", label: "Baseline", unit: "px" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-white">{stat.val}</span>
                  <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-tighter">{stat.unit}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl border border-cyan-500/10 bg-cyan-500/[0.02] flex flex-col justify-center items-center text-center gap-2 group hover:bg-cyan-500/[0.04] transition-colors">
          <span className="font-mono text-[10px] text-neutral-700 uppercase tracking-widest">Formula</span>
          <div className="font-mono text-xs text-cyan-500/80 leading-relaxed">
            (12 × 72) + (11 × 16) <br />
            = <span className="text-white font-bold">1040px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-white/10 transition-colors group/copy"
      title="Copy to clipboard"
    >
      {copied ? (
        <div className="flex items-center gap-1.5 px-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest">
            Copied
          </span>
        </div>
      ) : (
        <Copy className="w-3.5 h-3.5 text-neutral-600 group-hover/copy:text-neutral-400" />
      )}
    </button>
  );
}

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Using relative luminance formula L = 0.2126R + 0.7152G + 0.0722B
  const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return l > 0.5; // Adjusted threshold for studio-grade clarity
}

// ---------------------------------------------------------------------------
// Color components
// ---------------------------------------------------------------------------

function ColorScale({ scale }: { scale: (typeof COLOR_SCALES)[number] }) {
  return (
    <div className="mb-24 last:mb-0">
      {/* Scale metadata */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex items-baseline gap-4">
          <h3 className="font-display text-2xl font-semibold text-white tracking-tight">
            {scale.name}
          </h3>
          <div className="px-2 py-0.5 rounded bg-neutral-900 border border-white/[0.03]">
            <span className="font-mono text-[10px] text-cyan-500/70 lowercase tracking-wider">
              --{scale.cssPrefix}-*
            </span>
          </div>
        </div>
        <p className="text-sm text-neutral-500 max-w-md md:text-right font-light leading-relaxed">
          {scale.description}
        </p>
      </div>

      {/* Swatch grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${scale.steps.length}, minmax(0, 1fr))`,
        }}
      >
        {scale.steps.map((s, idx) => (
          <motion.div
            key={s.step}
            className="group flex flex-col gap-2.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.02 }}
          >
            {/* Color Surface */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.04] bg-neutral-900 shadow-xl group/swatch">
              <button
                onClick={() => navigator.clipboard.writeText(s.hex)}
                className="absolute inset-0 w-full h-full cursor-pointer transition-transform duration-500 group-hover/swatch:scale-110"
                style={{ backgroundColor: s.hex }}
                title={s.hex}
              >
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-300 ${isLight(s.hex) ? "text-neutral-950" : "text-white"}`}>
                  <Copy className="w-4 h-4" />
                </div>
              </button>

              {/* Surface metadata (Adaptive contrast only) */}
              <div className={`absolute inset-0 p-2 flex flex-col justify-end pointer-events-none transition-opacity duration-300 ${isLight(s.hex) ? "text-neutral-950" : "text-white"}`}>
                {s.wcag && (
                  <span className="font-mono text-[9px] font-bold opacity-60 tracking-tight">
                    {s.wcag.split(":")[0]}
                  </span>
                )}
              </div>

              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* External Metadata */}
            <div className="flex flex-col gap-0.5 px-1">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] font-bold text-neutral-300 group-hover:text-cyan-400 transition-colors">
                  {s.step}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="w-2.5 h-2.5 text-cyan-500" />
                </div>
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-tighter group-hover:text-neutral-300 transition-colors">
                {s.hex.replace("#", "")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WCAG Badge
// ---------------------------------------------------------------------------

function WcagBadge({ ratio, size }: { ratio: string; size: "sm" | "lg" }) {
  const val = parseFloat(ratio);
  const passes = size === "sm" ? val >= 4.5 : val >= 3;
  return (
    <span
      className={`inline-flex items-center text-2xs font-mono px-2 py-0.5 rounded-full ${passes
        ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
        : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
        }`}
    >
      {passes ? "AA" : "Fail"} {ratio}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TokensPage() {
  const [hoveredGlow, setHoveredGlow] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <DocsLayout currentLayer="/designsystem/tokens" items={NAV_ITEMS}>

      {/* ================================================================
          HERO
          ================================================================ */}
      <header className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden border-b border-white/[0.03]">
        {/* Ambient background effects */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at center, rgba(38,201,201,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1040px] mx-auto px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-interactive-brand-default" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-interactive-brand-default animate-ping opacity-40" />
              </div>
              <span className="font-mono text-2xs tracking-[0.2em] text-interactive-brand-default/80 uppercase">
                Foundation — Layer 1
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="font-display text-5xl md:text-[5rem] font-bold tracking-tightest leading-[0.95] text-text-primary">
                Tokens <br />
                <span className="text-text-disabled italic">
                  Archive
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mt-4">
              <p className="text-lg text-text-secondary leading-relaxed font-light">
                A meticulously curated collection of design primitives that define the
                functional aesthetics and interaction patterns of the Token ecosystem.
                Built for performance, precision, and visual depth.
              </p>

              <div className="flex flex-wrap gap-8 md:justify-end">
                {[
                  { num: "01", label: "Grid", icon: Move },
                  { num: "02", label: "Colors", icon: Zap },
                  { num: "05", label: "Type", icon: Type },
                  { num: "09", label: "Atmosphere", icon: Layers },
                ].map(({ num, label, icon: Icon }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3 text-interactive-brand-default/40" />
                      <span className="font-display text-xl font-medium text-text-primary">{num}</span>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>


      {/* ================================================================
          CONTENT
          ================================================================ */}
      <div className="py-32 space-y-48">
        {/* ==============================================================
            01. GRID SYSTEM
            ============================================================== */}
        <Section
          id="grid"
          num="01"
          title="Architectural Grid"
          subtitle="A 1040px 12-column system. The skeletal structure of every Token interface, ensuring mathematical balance and spatial harmony."
        >
          <div className="space-y-12">
            <GridVisualizer />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Systems Thinking", desc: "Every element is a node in a larger architectural system, not just a floating pixel.", icon: LayoutGrid },
                { label: "Predictable rhythm", desc: "Optical balance is enforced through the 8px baseline and consistent increments.", icon: Ruler },
                { label: "Binary precision", desc: "Spacing is not felt—it is calculated. Elements either align or they fail.", icon: MousePointer2 },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl border border-white/[0.04] bg-neutral-900/10 hover:border-white/[0.08] transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5 text-cyan-500/60" />
                    </div>
                    <span className="font-display text-base font-semibold text-white tracking-tight">{item.label}</span>
                  </div>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ==============================================================
            02. COLORS
            ============================================================== */}
        <Section
          id="colors"
          num="02"
          title="Color Primitives"
          subtitle="14-step scales with extended dark-end granularity (750/850/925). Optimized for dark mode on #0A0A0A. Click any swatch to copy."
        >
          {COLOR_SCALES.map((scale) => (
            <ColorScale key={scale.name} scale={scale} />
          ))}
        </Section>

        {/* ==============================================================
            03. ACCENTS
            ============================================================== */}
        <Section
          id="accents"
          num="03"
          title="Accent Palette"
          subtitle="A refined set of brand and blockchain-specific colors. Used for high-intent actions, token badges, and strategic highlights."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACCENT_COLORS.map((c, idx) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-neutral-900 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <button
                  onClick={() => navigator.clipboard.writeText(c.hex)}
                  className="relative w-full text-left rounded-2xl overflow-hidden cursor-pointer border border-white/[0.04] bg-neutral-950/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                  {/* Color field */}
                  <div className="relative h-40 overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-lg font-semibold text-white">
                        {c.name}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500 px-1.5 py-0.5 rounded border border-white/[0.03] bg-white/[0.02]">
                        {c.hex}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="w-3 h-3 text-neutral-700 mt-0.5" />
                      <span className="text-xs text-neutral-500 font-light leading-snug">
                        {c.use}
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ==============================================================
            04. ATMOSPHERE (BLUR)
            ============================================================== */}
        <Section
          id="atmosphere"
          num="04"
          title="Atmosphere & Blur"
          subtitle="Tokens for depth perception and focus. Progressive blurs create a sophisticated sense of distance."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">Static Blurs</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "blur-sm", val: "4px", desc: "Surface depth" },
                  { name: "blur-md", val: "12px", desc: "Overlay depth" },
                  { name: "blur-lg", val: "24px", desc: "Dialog depth" },
                  { name: "blur-xl", val: "64px", desc: "Contextual distance" },
                ].map((b) => (
                  <div key={b.name} className="p-6 rounded-2xl border border-white/[0.04] bg-zinc-950 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col gap-2">
                      <span className="font-display text-lg font-bold text-white">{b.val}</span>
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] text-cyan-500 uppercase tracking-widest">{b.name}</span>
                        <span className="text-[10px] text-neutral-600 italic">{b.desc}</span>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">Progressive Blur</h4>
              <div className="relative aspect-square rounded-3xl border border-white/[0.04] overflow-hidden group">
                <div className="absolute inset-0 bg-neutral-900" />
                <div className="absolute inset-0 p-8 flex flex-col justify-center gap-4">
                  <div className="w-full h-12 bg-cyan-500/80 rounded-full blur-[2px]" />
                  <div className="w-full h-12 bg-cyan-500/80 rounded-full blur-[8px]" />
                  <div className="w-full h-12 bg-cyan-500/80 rounded-full blur-[24px]" />
                  <div className="w-full h-12 bg-cyan-500/80 rounded-full blur-[64px]" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ==============================================================
            06. TYPOGRAPHY
            ============================================================== */}
        <Section
          id="typography"
          num="06"
          title="Typography"
          subtitle="Three distinct families tuned for precise hierarchy and technical clarity across the Token platform."
        >
          {/* Font families */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
            {[
              {
                name: "Geist Sans",
                css: "font-sans",
                role: "Primary Interface",
                sample: "Design is not just what it looks like and feels like. Design is how it works.",
                desc: "The workhorse of the system. Clean, readable, and perfectly balanced at scale.",
              },
              {
                name: "General Sans",
                css: "font-display",
                role: "Editorial & Display",
                sample: "The shape of things to come.",
                desc: "High character and distinct personality for headings and hero statements.",
              },
              {
                name: "Geist Mono",
                css: "font-mono",
                role: "Technical Data",
                sample: "0x7a25...b4e1",
                desc: "Built for addresses, hashes, and quantitative data. Highly legible vertical rhythm.",
              },
            ].map((f, idx) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col rounded-3xl border border-white/[0.04] bg-neutral-900/20 overflow-hidden hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="p-8 pb-10 flex-1">
                  <div className="flex items-center justify-between mb-10">
                    <span className="font-mono text-[10px] text-cyan-500/50 uppercase tracking-[0.2em]">
                      {f.role}
                    </span>
                  </div>
                  <div className={`text-4xl ${f.css} text-white leading-[1.1] mb-8 tracking-tightest`}>
                    {f.sample}
                  </div>
                </div>
                <div className="px-8 py-5 bg-white/[0.01] border-t border-white/[0.03]">
                  <h4 className="font-display text-sm font-medium text-white mb-1">{f.name}</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Type scale */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                Anatomical Scale
              </h3>
              <div className="flex-1 h-px bg-neutral-900" />
            </div>

            <div className="rounded-3xl border border-white/[0.03] bg-neutral-950/50 divide-y divide-white/[0.03] overflow-hidden">
              {TYPE_SCALE.map((t, idx) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                  className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 px-8 py-6 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-24 shrink-0 flex flex-col">
                    <span className="font-mono text-[10px] text-cyan-500 hover:text-cyan-400 transition-colors cursor-default">
                      {t.name}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-700">
                      {t.size} / {t.rem}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="text-white font-display truncate transition-all duration-300 group-hover:pl-2"
                      style={{ fontSize: t.rem, lineHeight: t.lh }}
                    >
                      Building the future of decentralized motion.
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Letter spacing + weights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                  Letter Spacing
                </h3>
                <div className="flex-1 h-px bg-neutral-900" />
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-neutral-950/50 divide-y divide-white/[0.03] overflow-hidden">
                {TRACKING.map((t, idx) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                    className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 px-8 py-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-24 shrink-0 flex flex-col">
                      <span className="font-mono text-[10px] text-cyan-500 hover:text-cyan-400 transition-colors cursor-default">
                        {t.name}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-700">
                        {t.value}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className="text-2xl text-white font-display truncate transition-all duration-300 group-hover:pl-2 block"
                        style={{ letterSpacing: t.value }}
                      >
                        TOKEN
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                  Font Weights
                </h3>
                <div className="flex-1 h-px bg-neutral-900" />
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-neutral-950/50 divide-y divide-white/[0.03] overflow-hidden">
                {[
                  { weight: 400, name: "Regular" },
                  { weight: 500, name: "Medium" },
                  { weight: 600, name: "Semibold" },
                  { weight: 700, name: "Bold" },
                ].map((w, idx) => (
                  <motion.div
                    key={w.weight}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                    className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 px-8 py-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-24 shrink-0 flex flex-col">
                      <span className="font-mono text-[10px] text-cyan-500 hover:text-cyan-400 transition-colors cursor-default">
                        weight-{w.weight}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-700">
                        {w.weight}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className="text-2xl text-white font-display truncate transition-all duration-300 group-hover:pl-2 block"
                        style={{ fontWeight: w.weight }}
                      >
                        {w.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ==============================================================
            07. SPACING
            ============================================================== */}
        <Section
          id="spacing"
          num="07"
          title="Spacing & Rhythm"
          subtitle="Fixed density units based on a 4px increment. Mathematical consistency applied to every gap and margin."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-3xl border border-white/[0.03] bg-neutral-950/50 p-8 flex flex-col gap-1 shadow-2xl">
              {SPACING.map((s, idx) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                  className="group flex items-center gap-6 py-2 origin-left"
                >
                  <div className="w-12 shrink-0 flex flex-col items-end">
                    <span className="font-mono text-[10px] text-cyan-500/60 leading-none">{s.name}</span>
                    <span className="font-mono text-[9px] text-neutral-700 leading-none mt-1">{s.px}px</span>
                  </div>
                  <div className="flex-1 flex items-center h-5">
                    <div
                      className="h-full rounded-sm bg-cyan-500/20 border border-cyan-500/10 transition-all duration-300 group-hover:bg-cyan-500/40 group-hover:border-cyan-500/30"
                      style={{ width: s.px === 0 ? 2 : Math.max(s.px, 4) }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8 flex flex-col">
              <div className="flex-1 rounded-3xl border border-white/[0.03] bg-neutral-900/10 p-10 relative overflow-hidden group/grid">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 blur-[100px]" />
                <h4 className="font-display text-xl font-semibold text-white mb-6">The 4px Standard</h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed mb-10 max-w-md">
                  Token operates on a fixed-density grid. This ensures that every element,
                  regardless of its complexity, shares a common mathematical foundation.
                </p>
                <div className="relative h-32 w-full flex items-end gap-[2px] px-2">
                  {/* Architectural Visualization of the Grid */}
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: i % 4 === 0 ? "100%" : i % 2 === 0 ? "60%" : "30%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.01, ease: "easeOut" }}
                      className={`flex-1 transition-colors duration-500 ${i % 4 === 0 ? "bg-cyan-500/30" : "bg-white/5"} rounded-t-full`}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-6 py-2 rounded-full bg-neutral-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                      <span className="font-mono text-[10px] text-cyan-400 tracking-[0.3em] uppercase">0.25rem Increments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ==============================================================
            08. RADII
            ============================================================== */}
        <Section
          id="radii"
          num="08"
          title="Radii & Curvature"
          subtitle="G2 superellipse curvature for every corner. Smooth, organic transitions tailored for high-density layouts."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                We use the Lamé Curve equation (n=4) to generate our corner geometry.
                This ensures 'G2 continuity' where the rate of curvature change is smooth,
                eliminating the visual 'bump' seen in standard circular corners.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "None", val: "0" },
                  { name: "Subtle", val: "8px" },
                  { name: "Default", val: "16px" },
                  { name: "Hero", val: "32px" },
                  { name: "Squircle", val: "48px" },
                  { name: "Full", val: "999px" },
                ].map((r) => (
                  <div key={r.name} className="flex flex-col gap-2 italic">
                    <div
                      className="aspect-square bg-zinc-950 border border-white/10 flex items-center justify-center relative overflow-hidden"
                      style={{ borderRadius: r.val, clipPath: r.name === "Squircle" ? "url(#squircle-path)" : "none" }}
                    >
                      {r.name === "Squircle" && (
                        <div className="absolute inset-0 bg-cyan-500/10" />
                      )}
                      <span className="font-mono text-[9px] text-neutral-700">{r.val}</span>
                    </div>
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-tighter">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square rounded-[3rem] border border-white/[0.04] bg-neutral-900/10 flex items-center justify-center group overflow-hidden">
              {/* Visualizing the tangent of the curve */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-full h-px bg-white/10 rotate-45" />
                <div className="w-full h-px bg-white/10 -rotate-45" />
              </div>
              <div className="w-48 h-48 bg-cyan-500/20 shadow-[0_0_80px_rgba(38,201,201,0.2)] relative">
                {/* True Superellipse via SVG mask or ClipPath */}
                <div className="absolute inset-0 bg-cyan-500/40" style={{ clipPath: "polygon(50% 0%, 90% 10%, 100% 50%, 90% 90%, 50% 100%, 100% 100%, 0% 100%, 0% 0%)", borderRadius: "48px" }} />
                <div className="absolute inset-0 border-2 border-cyan-400 flex items-center justify-center" style={{ borderRadius: "48px" }}>
                  <span className="font-display font-bold text-white text-xl">Superellipse</span>
                </div>
              </div>
            </div>
          </div>
          {/* SVG Definitions for true superellipse if needed */}
          <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
              <clipPath id="squircle-path" clipPathUnits="objectBoundingBox">
                <path d="M .5,0 C .1,0 0,.1 0,.5 C 0,.9 .1,1 .5,1 C .9,1 1,.9 1,.5 C 1,.1 .9,0 .5,0" />
              </clipPath>
            </defs>
          </svg>
        </Section>

        {/* ==============================================================
            09. SHADOWS
            ============================================================== */}
        <Section
          id="shadows"
          num="09"
          title="Depth & Shadow"
          subtitle="Light-physics based elevation. Layered shadows that simulate physical distance from the canvas."
        >
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-16">
            {SHADOWS.map((s, idx) => {
              const shadowValues: Record<string, string> = {
                xs: "0 1px 2px 0 rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.03)",
                sm: "0 2px 6px -1px rgba(0,0,0,0.7), 0 1px 0 0 rgba(255,255,255,0.04)",
                md: "0 4px 12px -2px rgba(0,0,0,0.8), 0 2px 4px -1px rgba(0,0,0,0.6), 0 1px 0 0 rgba(255,255,255,0.05)",
                lg: "0 8px 24px -4px rgba(0,0,0,0.85), 0 4px 8px -2px rgba(0,0,0,0.6), 0 1px 0 0 rgba(255,255,255,0.06)",
                xl: "0 16px 40px -8px rgba(0,0,0,0.9), 0 8px 16px -4px rgba(0,0,0,0.7), 0 1px 0 0 rgba(255,255,255,0.07)",
                "2xl": "0 24px 56px -12px rgba(0,0,0,0.95), 0 12px 24px -6px rgba(0,0,0,0.8), 0 1px 0 0 rgba(255,255,255,0.08)",
              };
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="flex flex-col gap-4"
                >
                  <div
                    className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/[0.04]"
                    style={{
                      backgroundColor: "oklch(14.1% 0.005 285.823)",
                      boxShadow: shadowValues[s.name],
                    }}
                  >

                    <span className="font-display text-lg font-bold text-white">
                      {s.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] text-neutral-700 font-light italic">
                      {s.description}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/[0.03] bg-neutral-950/50 divide-y divide-white/[0.03] overflow-hidden">
            {[
              { label: "Highlight", val: "Top-edge highlight (0.5px white @ 4%)", desc: "Simulates light source from top-center to separate surface from background absorption." },
              { label: "Surface Lume", val: "Progressive hex spectrum", desc: "Surface brightness increases with elevation to simulate proximity to light." },
              { label: "Absorption", val: "Double-layered shadows", desc: "Combining a sharp core shadow for object definition with a wide ambient layer for diffusion." },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col md:flex-row md:items-center gap-6 px-8 py-6"
              >
                <div className="w-32 shrink-0">
                  <span className="font-mono text-[10px] text-cyan-500 uppercase tracking-widest block mb-0.5">{item.label}</span>
                  <span className="font-mono text-[9px] text-neutral-700 uppercase tracking-tighter whitespace-nowrap">{item.val}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ==============================================================
            10. ATMOSPHERIC GLOW
            ============================================================== */}
        <Section
          id="glows"
          num="10"
          title="Atmospheric Glow"
          subtitle="Emission based lighting system. Primitives for simulated light sources and specular highlights."
        >
          <div className="space-y-24">
            {["brand", "danger", "success", "warning", "white"].map((scale) => (
              <div key={scale} className="space-y-12">
                <div className="flex items-baseline gap-4">
                  <h3 className="font-display text-xl font-bold text-white tracking-tight capitalize">
                    {scale} Glows
                  </h3>
                  <div className="flex-1 h-px bg-neutral-900/50" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {GLOWS.filter(g => g.scale === scale).map((g, idx) => {
                    const isAnyHovered = hoveredGlow !== null;
                    const isThisHovered = hoveredGlow === g.name;
                    const isActive = !isAnyHovered || isThisHovered;

                    const levelParams: Record<string, { b: number, s: number, o: number }> = {
                      xs: { b: 10, s: 0, o: 0.15 },
                      sm: { b: 15, s: 1, o: 0.25 },
                      md: { b: 25, s: 2, o: 0.35 },
                      lg: { b: 40, s: 4, o: 0.45 },
                      xl: { b: 80, s: 10, o: 0.55 },
                    };

                    const p = levelParams[g.level];
                    const glowStyle = {
                      backgroundColor: g.color,
                      boxShadow: isActive
                        ? `0 0 ${p.b}px ${p.s}px ${g.color}${Math.round(p.o * 255).toString(16).padStart(2, '0')}`
                        : "none"
                    };

                    return (
                      <motion.div
                        key={g.name}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        onMouseEnter={() => setHoveredGlow(g.name)}
                        onMouseLeave={() => setHoveredGlow(null)}
                        className="group relative"
                        animate={{
                          opacity: isActive ? 1 : 0.3,
                        }}
                      >
                        <div className="relative aspect-[3/4] rounded-2xl border border-white/[0.04] bg-zinc-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-700 hover:border-white/10">
                          <div className="absolute inset-0 bg-neutral-950 z-0 opacity-40 group-hover:opacity-0 transition-opacity" />

                          {/* The Glow Specimen */}
                          <motion.div
                            className="w-4 h-4 rounded-full relative z-10"
                            style={glowStyle}
                          />

                          <div className="mt-12 flex flex-col items-center text-center relative z-10">
                            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-2 transition-colors duration-500 group-hover:text-cyan-400">
                              {g.level}
                            </span>
                          </div>

                          {/* Technical metadata */}
                          <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <span className="font-mono text-[8px] text-neutral-800 font-bold uppercase tracking-tighter">
                              {g.name}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-3xl border border-white/[0.03] bg-neutral-950/50">
            <h4 className="font-display text-xl font-bold text-white mb-8">Anatomy of Glow</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: "Emission", val: "Inner Core", desc: "The source point of the light, always at 100% opacity of the scale." },
                { label: "Diffusion", val: "Shadow Blur", desc: "Progressive blur values (10px to 80px) simulate light spreading in atmosphere." },
                { label: "Density", val: "Spread Logic", desc: "A combination of spread and blur ensures the glow feels physically grounded." },
                { label: "Leakage", val: "Opacity Spectrum", desc: "Alpha values (0.15 to 0.55) prevent visual clutter in information-dense views." }
              ].map((item, idx) => (
                <div key={item.label} className="space-y-2">
                  <span className="font-mono text-[9px] text-cyan-500/60 uppercase tracking-widest block">{item.label}</span>
                  <h5 className="font-display text-lg font-bold text-white">{item.val}</h5>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ==============================================================
            11. MOTION PRIMITIVES
            ============================================================== */}
        <Section
          id="motion"
          num="11"
          title="Motion Primitives"
          subtitle="The temporal foundation of Token. Calibrated durations and mathematical easing curves."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Durations */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                  Time Specimens
                </h3>
                <div className="flex-1 h-px bg-neutral-900" />
              </div>
              <div className="space-y-6">
                {DURATIONS.map((d, idx) => (
                  <motion.div
                    key={d.ms}
                    className="group flex flex-col gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[13px] font-bold text-white tracking-tighter">{d.ms}ms</span>
                        <span className="font-mono text-[8px] text-cyan-500/40 uppercase tracking-widest leading-none">
                          REF.{d.ms.toString().padStart(3, '0')}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-600 italic uppercase tracking-wider">{d.use}</span>
                    </div>
                    <div className="h-1 w-full bg-neutral-900/50 rounded-full overflow-hidden relative border border-white/[0.02]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-600/20 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 transition-colors duration-500 shadow-[0_0_10px_rgba(38,201,201,0.2)]"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                        style={{ maxWidth: `${(d.ms / 800) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shimmer" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Calibrated Curves (Easings) */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
                  Calibrated Curves
                </h3>
                <div className="flex-1 h-px bg-neutral-900" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                {EASINGS.map((e, idx) => (
                  <motion.div
                    key={e.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group rounded-2xl border border-white/[0.04] bg-neutral-900/10 p-6 flex flex-col gap-6 hover:border-cyan-500/20 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-display text-base font-bold text-white tracking-tight">{e.name}</span>
                        <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mt-1">{e.use}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center border border-white/[0.03]">
                        <Eye className="w-3.5 h-3.5 text-neutral-700 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>

                    <div className="aspect-[4/3] relative rounded-xl bg-neutral-950/80 border border-white/[0.03] overflow-hidden flex items-center justify-center p-8 group-hover:bg-neutral-900/30 transition-colors duration-700">
                      {/* Diagnostic Grid */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="absolute inset-y-0 left-1/2 w-px bg-white" />
                        <div className="absolute inset-x-0 top-1/2 h-px bg-white" />
                      </div>

                      {/* Coordinate Axes */}
                      <div className="absolute inset-x-6 bottom-6 h-px bg-white/[0.05]" />
                      <div className="absolute inset-y-6 left-6 w-px bg-white/[0.05]" />
                      <span className="absolute bottom-2 left-6 font-mono text-[7px] text-neutral-800 uppercase tracking-tighter">time</span>
                      <span className="absolute top-6 left-2 font-mono text-[7px] text-neutral-800 uppercase rotate-[-90deg] tracking-tighter">prog</span>

                      <svg className="absolute inset-0 w-full h-full p-6 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Ghost Path */}
                        <path
                          d={e.path}
                          fill="none"
                          stroke="rgba(38,201,201,0.05)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        {/* Active Path */}
                        <motion.path
                          d={e.path}
                          fill="none"
                          stroke="url(#easing-gradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
                        />
                        <defs>
                          <linearGradient id="easing-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Motion Specimen */}
                      <motion.div
                        className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(38,201,201,0.6)] z-10 relative flex items-center justify-center"
                        animate={{
                          x: [-40, 40],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: e.value.includes("bezier")
                            ? (e.value.match(/cubic-bezier\((.*?)\)/)?.[1].split(",").map(Number) as [number, number, number, number])
                            : "easeOut",
                          delay: 0.5
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                      </motion.div>
                    </div>

                    <div className="px-3 py-2 rounded-lg bg-black/50 border border-white/[0.05] flex items-center justify-between">
                      <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">Parameters</span>
                      <span className="font-mono text-[10px] text-cyan-400 font-bold truncate max-w-[140px]">
                        {e.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 p-12 rounded-3xl border border-white/[0.03] bg-neutral-950/50">
            <h4 className="font-display text-xl font-bold text-white mb-8">Anatomy of Motion</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: "Impulse", val: "Initial Velocity", desc: "Standard curves begin with a calculated surge to feel immediate and reactive." },
                { label: "Inertia", val: "Momentum", desc: "Token curves preserve object weight, ensuring transitions feel physically grounded." },
                { label: "Friction", val: "Smooth Decel", desc: "Standard easing values ensure components settle with high precision and zero oscillation." },
                { label: "Elasticity", val: "Spring Physics", desc: "Non-linear curves use bouncy cubic beziers for more expressive feedback." }
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="w-8 h-1 bg-cyan-500/20 rounded-full" />
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-cyan-500/60 uppercase tracking-widest block">{item.label}</span>
                    <h5 className="font-display text-lg font-bold text-white tracking-tight">{item.val}</h5>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ==============================================================
            14. WCAG ACCESSIBILITY
            ============================================================== */}
        <Section
          id="wcag"
          num="12"
          title="WCAG Contrast Reference"
          subtitle="Automated accessibility validation. Ensuring clarity and legibility remains constant across every token."
        >
          <div className="rounded-3xl border border-white/[0.03] bg-cyan-500/5 p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Accessibility className="w-6 h-6 text-cyan-500" />
                <h4 className="font-display text-2xl font-bold text-white">Universal Clarity</h4>
              </div>
              <p className="text-md text-neutral-400 font-light leading-relaxed mb-8 max-w-xl">
                The Token Design System follows a rigorous accessibility protocol. We ensure that
                interfaces remain usable for everyone, regardless of visual ability or environment.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Contrast Ratio", val: "4.5:1 (AA)", sub: "Primary Text" },
                  { label: "Target Area", val: "44px min", sub: "Interactive Elements" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-2xl border border-white/[0.04] bg-neutral-900/40">
                    <div className="text-xs text-neutral-500 mb-1">{item.label}</div>
                    <div className="text-lg font-display font-semibold text-white leading-tight">{item.val}</div>
                    <div className="text-[10px] text-cyan-500/60 font-mono uppercase tracking-widest mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 border border-white/[0.04] rounded-3xl p-8 bg-neutral-950 shadow-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Small Text</span>
                    <WcagBadge ratio="18.9:1" size="sm" />
                  </div>
                  <p className="text-xs text-neutral-400">Sample text on neutral-950 background.</p>
                </div>
                <div className="w-full h-px bg-white/[0.03]" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Large Text</span>
                    <WcagBadge ratio="4.2:1" size="lg" />
                  </div>
                  <h5 className="font-display text-xl font-bold text-white">Heading Contrast</h5>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <div className="max-w-[1040px] mx-auto w-full pt-32 border-t border-white/[0.04]">
          <DocNav current="/designsystem/tokens" />
        </div>
      </div>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="border-t border-white/[0.03] py-24 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-cyan-500/[0.02] transform translate-x-1/2 -skew-x-12" />
        <div className="max-w-[1040px] mx-auto px-8 relative z-10 flex flex-col items-center justify-between gap-12 sm:flex-row">
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-500 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </div>
              <span className="font-display text-xl font-bold text-white">Token Motion</span>
            </div>
            <p className="text-sm text-neutral-600 font-light">Layer 1 Design Tokens Documentation</p>
          </div>

          <div className="flex items-center gap-8">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">&copy; 2026 Token Systems</span>
            <div className="w-[1px] h-4 bg-white/10 hidden sm:block" />
            <button className="text-[10px] font-mono text-neutral-600 hover:text-cyan-500 transition-colors uppercase tracking-[0.2em]">Build — v2.4.0</button>
          </div>
        </div>
      </footer>
    </DocsLayout>
  );
}
