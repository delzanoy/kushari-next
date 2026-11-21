"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Pin {
  id: string;
  x: number;    // 0–1 normalized to card width
  y: number;    // 0–1 normalized to card height
  color: string; // "#rrggbb"
}

export type BlendMode =
  | "overlay"
  | "soft-light"
  | "screen"
  | "hard-light"
  | "color-dodge"
  | "color-burn"
  | "difference"
  | "exclusion"
  | "luminosity";

export interface MeshGradientCardProps {
  width?: number;
  height?: number;
  initialPins?: Pin[];
  animated?: boolean;
  textBlend?: BlendMode;
  textOpacity?: number;       // 0–1, default 1
  noiseOpacity?: number;      // 0–1, grain intensity in shader (default 0.35)
  label?: string;
  className?: string;
  onPinsChange?: (pins: Pin[]) => void;
  /** Hide the draggable pin handles — canvas-only, no overlay UI */
  hidePins?: boolean;
  /** Disable adding new pins via clicking the background */
  disableAdd?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_PINS = 16;
const MIN_PINS = 2;

const DEFAULT_PIN_DEFS: Omit<Pin, "id">[] = [
  { x: 0.05, y: 0.05, color: "#26c9c9" },
  { x: 0.95, y: 0.05, color: "#1d4ed8" },
  { x: 0.05, y: 0.95, color: "#0f172a" },
  { x: 0.95, y: 0.95, color: "#7c3aed" },
  { x: 0.50, y: 0.45, color: "#0ea5e9" },
];

// ─── GLSL ────────────────────────────────────────────────────────────────────

const VERT_SRC = /* glsl */`#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 vUV;
void main() {
  vUV = a_pos * 0.5 + 0.5;
  vUV.y = 1.0 - vUV.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_SRC = /* glsl */`#version 300 es
precision highp float;
#define MAX_PINS 16

uniform int   uPinCount;
uniform vec2  uPins[MAX_PINS];
uniform vec3  uColors[MAX_PINS];
uniform float uTime;
uniform int   uAnimated;
uniform float uGrain;   // 0–1 grain intensity

in  vec2 vUV;
out vec4 fragColor;

// Fast hash — gives pseudo-random float from a pixel coord seed
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv    = vUV;
  vec3 color = vec3(0.0);
  float total = 0.0;

  for (int i = 0; i < MAX_PINS; i++) {
    if (i >= uPinCount) break;

    vec2 p = uPins[i];
    if (uAnimated == 1) {
      float fi    = float(i);
      float speed = 0.4 + fi * 0.11;
      p.x += sin(uTime * speed        + fi * 1.37) * 0.018;
      p.y += cos(uTime * speed * 0.73 + fi * 2.09) * 0.018;
    }

    float d = distance(uv, p);
    float w = 1.0 / (d * d + 0.002);
    color  += uColors[i] * w;
    total  += w;
  }

  vec3 col = color / total;

  // Grain — flips frame at 24 fps for a cinematic film feel
  if (uGrain > 0.0) {
    float frame = floor(uTime * 24.0);
    float grain = hash(gl_FragCoord.xy + vec2(frame * 13.7, frame * 7.3));
    col += (grain - 0.5) * uGrain * 0.28;
  }

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _seq = 0;
const newId = () => `pin-${++_seq}`;

function makeDefaultPins(): Pin[] {
  return DEFAULT_PIN_DEFS.map((d) => ({ ...d, id: newId() }));
}

function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function buildProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  function compile(type: number, src: string): WebGLShader | null {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("[MeshGradientCard] shader error:", gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const v = compile(gl.VERTEX_SHADER, VERT_SRC);
  const f = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!v || !f) return null;

  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);

  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("[MeshGradientCard] link error:", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MeshGradientCard({
  width,
  height = 320,
  initialPins,
  animated = false,
  textBlend = "overlay",
  textOpacity = 1,
  noiseOpacity = 0.35,
  label,
  className,
  onPinsChange,
  hidePins = false,
  disableAdd = false,
}: MeshGradientCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [pins, setPins] = useState<Pin[]>(() => initialPins ?? makeDefaultPins());

  // Keep refs in sync so the RAF loop always reads current values
  const pinsRef = useRef(pins);
  const animRef = useRef(animated);
  const grainRef = useRef(noiseOpacity);
  useEffect(() => { pinsRef.current = pins; onPinsChange?.(pins); }, [pins]);
  useEffect(() => { animRef.current = animated; }, [animated]);
  useEffect(() => { grainRef.current = noiseOpacity; }, [noiseOpacity]);
  // Reset pins when the caller supplies a new initialPins reference (e.g. preset switch)
  useEffect(() => { if (initialPins) setPins(initialPins); }, [initialPins]);

  // ── WebGL render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvasMaybe = canvasRef.current;
    if (!canvasMaybe) return;
    const canvas: HTMLCanvasElement = canvasMaybe;

    const glMaybe = canvas.getContext("webgl2");
    if (!glMaybe) { console.warn("[MeshGradientCard] WebGL2 not available"); return; }
    const gl: WebGL2RenderingContext = glMaybe;

    // Guard: context may be in a lost state (e.g. after Strict Mode cleanup cycle)
    if (gl.isContextLost()) return;

    const program = buildProgram(gl);
    if (!program) return;

    // Fullscreen quad — two triangles via TRIANGLE_STRIP
    const buf = gl.createBuffer();
    if (!buf) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_pos");
    const uPinCount = gl.getUniformLocation(program, "uPinCount");
    const uPins = gl.getUniformLocation(program, "uPins");
    const uColors = gl.getUniformLocation(program, "uColors");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uAnimated = gl.getUniformLocation(program, "uAnimated");
    const uGrain = gl.getUniformLocation(program, "uGrain");

    gl.useProgram(program);
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Pre-allocate typed arrays to avoid GC pressure in the loop
    const pinPos = new Float32Array(MAX_PINS * 2);
    const pinColors = new Float32Array(MAX_PINS * 3);
    const start = performance.now();
    let raf = 0;

    function frame() {
      const ps = pinsRef.current;
      const count = Math.min(ps.length, MAX_PINS);

      for (let i = 0; i < count; i++) {
        pinPos[i * 2] = ps[i].x;
        pinPos[i * 2 + 1] = ps[i].y;
        const [r, g, b] = hexToRgb01(ps[i].color);
        pinColors[i * 3] = r;
        pinColors[i * 3 + 1] = g;
        pinColors[i * 3 + 2] = b;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1i(uPinCount, count);
      gl.uniform2fv(uPins, pinPos);
      gl.uniform3fv(uColors, pinColors);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform1i(uAnimated, animRef.current ? 1 : 0);
      gl.uniform1f(uGrain, grainRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(frame);
    }

    frame();

    // Keep canvas pixel dimensions in sync with layout size
    const ro = new ResizeObserver(() => {
      const dpr = devicePixelRatio;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    });
    ro.observe(canvas);
    const dpr = devicePixelRatio;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
      // Do NOT call loseContext() — it permanently kills the context object,
      // which breaks React Strict Mode's mount→unmount→remount cycle.
      // The browser reclaims the context when the canvas leaves the DOM.
    };
  }, []);

  // ── Drag — window-level so fast moves don't escape the card ───────────────
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const didDrag = useRef(false);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!drag.current || !overlayRef.current) return;
      const rect = overlayRef.current.getBoundingClientRect();
      const dx = (e.clientX - drag.current.sx) / rect.width;
      const dy = (e.clientY - drag.current.sy) / rect.height;
      if (Math.abs(dx) + Math.abs(dy) > 0.004) didDrag.current = true;
      const x = Math.max(0, Math.min(1, drag.current.ox + dx));
      const y = Math.max(0, Math.min(1, drag.current.oy + dy));
      setPins((prev) =>
        prev.map((p) => (p.id === drag.current!.id ? { ...p, x, y } : p))
      );
    }

    function onUp() {
      drag.current = null;
      // Defer reset so onClick handlers can read it before it clears
      setTimeout(() => { didDrag.current = false; }, 0);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // ── Event handlers ────────────────────────────────────────────────────────

  const handlePinDown = useCallback((e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const pin = pinsRef.current.find((p) => p.id === id)!;
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox: pin.x, oy: pin.y };
    didDrag.current = false;
  }, []);

  // Click on the overlay background → add a new pin at cursor
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (didDrag.current || disableAdd) return;
    if (pinsRef.current.length >= MAX_PINS) return;
    const rect = overlayRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPins((prev) => [...prev, { id: newId(), x, y, color: "#26c9c9" }]);
  }, [disableAdd]);

  const handleColorChange = useCallback((id: string, color: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, color } : p)));
  }, []);

  const handlePinDelete = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setPins((prev) => (prev.length <= MIN_PINS ? prev : prev.filter((p) => p.id !== id)));
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn("relative overflow-hidden rounded-4xl select-none", className)}
      style={{ width: width ?? "100%", height }}
    >
      {/* WebGL canvas — fills the container */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />


      {/* Pin overlay — captures clicks/drags; hidden when hidePins=true */}
      {!hidePins && (
        <div
          ref={overlayRef}
          className={cn(
            "absolute inset-0",
            disableAdd ? "cursor-default" : "cursor-crosshair"
          )}
          onClick={handleOverlayClick}
        >
          {pins.map((pin) => (
            <PinHandle
              key={pin.id}
              pin={pin}
              canDelete={pins.length > MIN_PINS}
              onPointerDown={handlePinDown}
              onColorChange={handleColorChange}
              onDelete={handlePinDelete}
            />
          ))}
        </div>
      )}

      {/* Text layer — blends into the gradient */}
      {label && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ mixBlendMode: textBlend, opacity: textOpacity }}
        >
          <span
            className="font-display font-bold text-white tracking-tightest"
            style={{ fontSize: "clamp(1.75rem, 6cqi, 3.5rem)" }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Pin handle ───────────────────────────────────────────────────────────────

interface PinHandleProps {
  pin: Pin;
  canDelete: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

function PinHandle({ pin, canDelete, onPointerDown, onColorChange, onDelete }: PinHandleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
      onPointerDown={(e) => onPointerDown(e, pin.id)}
      onContextMenu={(e) => onDelete(e, pin.id)}
      onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
    >
      {/* Outer glow ring — visible on hover */}
      <div
        className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `radial-gradient(circle, ${pin.color}33 0%, transparent 70%)` }}
      />

      {/* Delete button — floats above the dot on hover */}
      {canDelete && (
        <button
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(e, pin.id); }}
          aria-label="Remove pin"
        >
          <div className="w-4 h-4 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:bg-red-500/80 hover:border-red-400/40 transition-colors">
            <span className="text-white/80 text-[9px] leading-none select-none">×</span>
          </div>
        </button>
      )}

      {/* Pin dot */}
      <div
        className="relative w-3.5 h-3.5 rounded-full border-2 border-white/70 shadow-lg cursor-grab active:cursor-grabbing transition-transform duration-150 group-hover:scale-150"
        style={{ backgroundColor: pin.color }}
      />
      {/* Native color picker — hidden, opened by clicking the dot */}
      <input
        ref={inputRef}
        type="color"
        value={pin.color}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        onChange={(e) => onColorChange(pin.id, e.target.value)}
      />
    </div>
  );
}
