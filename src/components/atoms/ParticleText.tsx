"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SPRING = 0.042;
const DAMPING = 0.80;
const PUSH_RADIUS = 72;
const PUSH_STRENGTH = 5.5;
const SAMPLE_STEP = 11;
const TEXT_PADDING = 8;

// Match ParticleCard HSL logic exactly
function hsl(nx: number, ny: number, extra: number): string {
  const hue = 178 + nx * 40;
  const sat = 72 + ny * 8;
  const lit = Math.min(90, 55 + extra * 28 + (1 - ny) * 8);
  return `hsl(${hue.toFixed(0)},${sat.toFixed(0)}%,${lit.toFixed(0)}%)`;
}

interface Particle {
  x: number; y: number;
  homeX: number; homeY: number;
  vx: number; vy: number;
  r: number;
  nx: number; ny: number;
}

/** Sample text via offscreen canvas on a global grid */
function sampleText(text: string, W: number, H: number) {
  const oc = document.createElement("canvas");
  oc.width = W; oc.height = H;
  const octx = oc.getContext("2d")!;

  const PROBE = 400;
  octx.font = `700 ${PROBE}px 'General Sans', system-ui, sans-serif`;
  const probe = octx.measureText(text);
  const probeW = probe.width;
  const probeH = probe.actualBoundingBoxAscent + probe.actualBoundingBoxDescent;

  const maxW = W - 2 * TEXT_PADDING;
  const maxH = H - 2 * TEXT_PADDING;

  const fontSizeByWidth = (PROBE * maxW) / probeW;
  const fontSizeByHeight = (PROBE * maxH) / probeH;
  let fontSize = Math.min(fontSizeByWidth, fontSizeByHeight);
  fontSize = Math.max(20, Math.round(fontSize));

  octx.font = `700 ${fontSize}px 'General Sans', system-ui, sans-serif`;
  const m = octx.measureText(text);
  const tw = m.width;
  const textY = H / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;

  octx.fillStyle = "#ffffff";
  octx.textBaseline = "alphabetic";
  octx.fillText(text, (W - tw) / 2, textY);

  const { data } = octx.getImageData(0, 0, W, H);
  const particles: Particle[] = [];

  for (let gy = SAMPLE_STEP * 0.5; gy < H; gy += SAMPLE_STEP) {
    for (let gx = SAMPLE_STEP * 0.5; gx < W; gx += SAMPLE_STEP) {
      const idx = (Math.floor(gy) * W + Math.floor(gx)) * 4 + 3;
      if (data[idx] > 128) {
        const angle = Math.random() * Math.PI * 2;
        const scatter = Math.min(W, H) * 0.7;
        particles.push({
          x: W / 2 + Math.cos(angle) * Math.random() * scatter,
          y: H / 2 + Math.sin(angle) * Math.random() * scatter,
          homeX: gx,
          homeY: gy,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          r: Math.random() * 0.9 + 0.4,
          nx: gx / W,
          ny: gy / H,
        });
      }
    }
  }

  return particles;
}

export interface ParticleTextProps {
  text: string;
  className?: string;
}

export function ParticleText({ text, className }: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let mx = -9999, my = -9999;
    let particles: Particle[] = [];
    let raf: number;
    let tick_n = 0;

    const rebuild = () => {
      W = el!.offsetWidth;
      H = el!.offsetHeight;
      if (W === 0 || H === 0) return;
      el!.width = W * devicePixelRatio;
      el!.height = H * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      particles = sampleText(textRef.current, W, H);
    };

    // Attach to ref so we can call it from outside the useEffect
    (el as any)._rebuild = rebuild;

    function frame() {
      tick_n++;
      ctx!.clearRect(0, 0, W, H);

      for (const p of particles) {
        // Mouse push
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PUSH_RADIUS && dist > 0) {
          const f = ((PUSH_RADIUS - dist) / PUSH_RADIUS) * PUSH_STRENGTH;
          p.vx += (dx / dist) * f * 0.12;
          p.vy += (dy / dist) * f * 0.12;
        }

        // Spring to home
        p.vx += (p.homeX - p.x) * SPRING;
        p.vy += (p.homeY - p.y) * SPRING;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        // Brightness: cursor proximity + shimmer wave + home proximity
        const cursorGlow = dist < PUSH_RADIUS ? (1 - dist / PUSH_RADIUS) * 0.9 : 0;
        const shimmer = 0.18 * Math.sin(tick_n * 0.018 + p.homeX * 0.045 - p.homeY * 0.02);
        const homeProx = Math.max(0, 1 - Math.hypot(p.x - p.homeX, p.y - p.homeY) / 35);
        const bright = Math.max(0, Math.min(1, homeProx * 0.55 + shimmer + cursorGlow * 0.6));

        const radius = p.r + cursorGlow * 1.8;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = hsl(p.nx, p.ny, bright);
        ctx!.globalAlpha = 0.55 + bright * 0.45;
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }
    function onMouseLeave() { mx = -9999; my = -9999; }

    // Ensure fonts are loaded before sampling
    document.fonts.ready.then(() => {
      rebuild();
      frame();
    });

    onMouseLeave();
    const ro = new ResizeObserver(() => (el as any)._rebuild?.());
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      ro.disconnect();
    };
  }, []);

  // Re-build on text change
  useEffect(() => {
    const id = setTimeout(() => {
      (canvasRef.current as any)?._rebuild?.();
    }, 80);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block w-full h-full cursor-none", className)}
    />
  );
}