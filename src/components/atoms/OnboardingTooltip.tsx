"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useOnboarding } from "@/lib/onboarding";
import { Tooltip } from "@/components/atoms/Tooltip";
import type { TooltipPlacement } from "@/components/atoms/Tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingTooltipProps {
  /** Step id — must match an entry in ONBOARDING_STEPS */
  stepId: string;
  /** Ref to the DOM element the tooltip should anchor to */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Where to place the tooltip relative to the target. Default "right" */
  placement?: TooltipPlacement;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingTooltip({
  stepId,
  targetRef,
  placement = "right",
}: OnboardingTooltipProps) {
  const { phase, currentStep, steps, next, prev, close } = useOnboarding();

  const stepIndex = steps.findIndex((s) => s.id === stepId);
  const isOpen    = phase === "tour" && currentStep === stepIndex;

  // Track target element's viewport rect so we can overlay the invisible anchor
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const updateRect = useCallback(() => {
    if (!targetRef.current) return;
    const r = targetRef.current.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [targetRef]);

  useLayoutEffect(() => {
    if (isOpen) updateRect();
  }, [isOpen, updateRect]);

  useEffect(() => {
    if (!isOpen) return;
    let rafId: number;
    const handleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateRect);
    };
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);
    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
      cancelAnimationFrame(rafId);
    };
  }, [isOpen, updateRect]);

  if (stepIndex === -1 || !mounted) return null;

  const tooltipSteps = steps.map((s) => ({ title: s.title, description: s.description }));

  return createPortal(
    // Invisible proxy positioned over the target element — Tooltip's internal
    // triggerRef picks up this rect for its FloatingPanel positioning.
    <div
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    >
      <Tooltip
        open={isOpen}
        steps={tooltipSteps}
        currentStep={currentStep}
        onNext={next}
        onPrev={prev}
        onClose={close}
        placement={placement}
        variant="brand"
        trigger="click"
        showArrow
      >
        {/* Fills the proxy so Tooltip's triggerRef inherits the target's bounding rect */}
        <span style={{ display: "block", width: rect.width, height: rect.height }} />
      </Tooltip>
    </div>,
    document.body,
  );
}
