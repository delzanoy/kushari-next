# Token v2 — Build Plan

## Philosophy
**Bottom-up, review-gated.** Every layer is reviewed and locked before the next begins. No feature code until the design system is bulletproof.

---

## Layer 0 — Project Scaffold ✅

**Goal:** Establish the foundation of the Next.js 16 application with Turbopack, Tailwind V4, and all necessary dependencies. 

- [x] **Initialize Next.js 15 app** using `npx create-next-app@latest` with Turbopack.
- [x] **Configure Tailwind CSS v4** via `@theme inline` in `globals.css` (no `tailwind.config` — pure CSS-based config).
- [x] **Define strict Typography tokens** via CSS custom properties in `globals.css`.
- [x] **Establish Color tokens** via CSS custom properties, defining semantic scales for backgrounds, borders, and interactive states.
- [x] **Create base `layout.tsx`** implementing the 100vh locked layout, `#0A0A0A` default background, and global font injections (Geist + General Sans).
- [x] **Setup folder architecture:** `/components` (atoms/molecules/organisms/ui), `/hooks`, `/lib`, `/types`, `/styles`.

### Review Gate 0: Foundation Check ✅
- [x] App loads blank `#0A0A0A` page, fonts loaded correctly.
- [x] `npm run dev` and `npm run build` execute without warnings or type errors.

---

## Layer 1 — Design Tokens (`globals.css` + `tokens.ts`) ✅

Single source of truth: `src/lib/tokens.ts` (JS) + `src/app/globals.css` (CSS variables).

**1a. Color Primitives**
- [x] Cyan (Brand) — 15-step scale (0–950 with 750/850/925)
- [x] Red (Danger) — 15 steps · aligned to Tailwind v4 defaults
- [x] Green (Success) — 15 steps
- [x] Amber (Warning) — 15 steps
- [x] Lime — 15 steps · Tailwind v4 defaults + interpolated extended steps
- [x] Emerald — 15 steps · Tailwind v4 defaults + interpolated extended steps
- [x] Teal — 15 steps · Tailwind v4 defaults + interpolated extended steps
- [x] Sky — 15 steps · Tailwind v4 defaults + interpolated extended steps
- [x] Blue — 15 steps · Tailwind v4 defaults + interpolated extended steps
- [x] Neutral — 15 steps (cool gray, blue-tinted)
- [x] Accent Colors: Ethereum, Bitcoin/Gold, Neon, Hot
- [x] All scales lightest → darkest, all mapped via `@theme inline`

**1b. Typography Primitives**
- [x] Font families: Geist (body), General Sans (display), Geist Mono (code)
- [x] Type scale: 10 steps — `text-2xs` (10px) → `text-4xl` (26px)
- [x] Font weights: 400, 500, 600, 700
- [x] Letter spacing: 5 steps (tightest → widest)
- [x] Line heights: 1 / 1.3

**1c. Spacing Primitives**
- [x] 15 steps on 4px grid: 0→2→4→6→8→10→12→16→20→24→28→32→40→48→64

**1d. Radius** — [x] Tailwind built-in scale

**1e. Shadow & Depth Primitives**
- [x] Elevation: `shadow-xs/sm/md/lg/xl/2xl` (6-level drop shadow)
- [x] Inset: `shadow-inset-xs/sm/md` (pressed/sunken states)
- [x] Brand glows: `glow-brand-xs/sm/md/lg/xl`
- [x] Status glows: `glow-danger-sm/md`, `glow-success-sm/md`, `glow-warning-sm`
- [x] White glow: `glow-white-sm/md`
- [x] Focus rings: `focus-ring-brand`, `focus-ring-danger`, `focus-ring-warning`, `focus-ring-success`, `focus-ring-neutral`

**1f. Duration & Easing Primitives**
- [x] Durations: 75 / 150 / 200 / 300 / 500 / 800ms
- [x] Easings: `ease-standard`, `ease-decelerate`, `ease-accelerate`, `ease-spring`
- [x] All available as CSS vars

**Review page** — [x] `/tokens` documents all primitives + semantic tokens visually

### Review Gate 1 ✅

---

> **RULE: Only use defined tokens. No new colors or sizes unless approved.**

---

## Layer 2 — Semantic Tokens — IN PROGRESS

Map primitives to intent. Dark mode only.

**2a. Surface** ✅
- [x] 6-level Z-stack: page → sunken → surface → elevated → overlay → scrim

**2b. Border** — Partial
- [x] subtle, default, strong, focus, brand, danger, success, warning
- [ ] 0.6px to 2px
- [ ] info

**2c. Text** — Partial
- [x] primary, secondary, muted, disabled, inverse, brand, danger, success, warning
- [ ] info

**2d. Icon** — Partial
- [x] primary, secondary, muted, brand, danger, warning, success
- [ ] disabled, info

**2e. Interactive**
- [x] brand:   default, hover, active, tonal-bg, tonal-bg-hover, tonal-bg-active, tonal-border
- [x] neutral: default, hover, active, tonal-bg, tonal-bg-hover, tonal-bg-active, tonal-border
- [x] danger:  default, hover, active, tonal-bg, tonal-bg-hover, tonal-bg-active, tonal-border
- [x] warning: default, hover, active, tonal-bg, tonal-bg-hover, tonal-bg-active, tonal-border
- [x] success: default, hover, active, tonal-bg, tonal-bg-hover, tonal-bg-active, tonal-border

**2f. Status**
- [o] success-*, danger-*, warning-*, info-*  (bg, border, text each)

**2g. Component Tokens**
- [x] button: brand-bg/hover/active, danger-bg/hover/active, warning-bg/hover/active, success-bg/hover/active
        Shadows are inline rgba in the component (intentional — user removed glow tokens).
        brand-border unused by any appearance; removed from scope.
- [x] input:  bg, bg-readonly, border, border-hover, border-focus, border-error, border-warning, border-success
- [o] card:   bg, border, border-hover, shadow, shadow-hover, glow-hover
- [o] modal:  bg, overlay, border, shadow
- [o] popover: bg, border, shadow
- [o] tooltip: bg, border, shadow
- [o] nav:    bg, border, item-bg-hover, active-bg, active-border, active-text

- **REVIEW GATE — PENDING**

---

## Layer 3 — Motion System (`lib/motion.ts`) ✅

Token's temporal DNA. Consolidated into `/tokens` documentation.

**3a. Transition Presets**
- [x] `fast`, `standard`, `smooth`, `gentle`, `slow` (duration-based)
- [x] `spring`, `springBouncy`, `springStiff` (physics-based)
- [x] `page` (route transitions)

**3b. Variant Presets**
- [x] `fadeIn`, `fadeInFast`
- [x] `slideUp`, `slideUpSm`, `slideDown`, `slideInLeft`, `slideInRight`
- [x] `scaleIn`, `scaleInFast`
- [x] `stagger`, `staggerFast`
- [x] `pageTransition`

**3c. Micro-interaction Presets**
- [x] hover: `lift`, `scale`, `glow`, `iconSlide`, `brighten`
- [x] tap: `press`, `pressLight`, `pressStrong`

**3d. Composed Motion Props** (bonus — not in original plan)
- [x] `motionProps.fadeIn`, `motionProps.slideUp`, `motionProps.slideUpSm`, `motionProps.stagger`

**Archive Representation** — [x] Consolidated into `/tokens` Sections 10–13.

### Review Gate 3 ✅

---

## Layer 4 — Base Components (Atoms) — IN PROGRESS

Fully animated, token-driven, no business logic.

**Documentation page** (`/atoms`):
- [x] Typography specimens (families, scale, weights, tracking, colors, strikethrough)
- [x] Iconography - we will be using Remix Icons for general purpose, Custom icons for Blockchain netwroks, & https://cryptofonts.com/ for crypto assets
- [ ] Particle system - a highly creative particle system that makes this product delight to the eye, open for suggestions
- [ ] Shaders - shaders that give elements unique look while functioning as parts/states of components.
- [x] Buttons section — Primary, Secondary (tonal + outline), Tertiary, Ghost, Inverted, Icon-only
        All sentiment variants (brand, brand-gradient, neutral, danger, warning, success) × 3 sizes × 2 shapes.
        All states: default, hover (w/ colored shadow + y-lift), active, disabled, loading (spinner swap).
        Leading + trailing icon support. hoverVariant cross-sentiment transitions.
        Micro-interactions: shimmer (brand), specular shader, ripple, blend-mode stroke overlay.
- [x] Text Input section — sizes × all icon variants matrix, core states, validation states, label variants,
        leading/trailing/prefix/suffix adornments, clear button, password toggle, character count,
        width (fullWidth + fixed via className), real-world examples
- [x] TextArea section — sizes, core states, validation states, label variants (required/optional/no label),
        auto-resize (minRows/maxRows), fixed height, clearable, character count, width, real-world examples
- [x] Dropdowns section — sizes × states, default trigger, asChild trigger, DropdownMenu (portal, smart placement),
        DropdownItem (icon/description/shortcut/trailing), selected states (check + checkbox styles),
        DropdownLabel/Separator, DropdownSearch, DropdownCreateNew, keyboard nav, multi-select pattern
- [x] Checkbox section — sizes × states, indeterminate, label+description, CheckboxGroup (vertical/horizontal),
        group-level validation messages, ghost hover preview, animated check/dash paths, focus rings
- [x] Radio Buttons section — sizes × states, label+description, RadioGroup (vertical/horizontal),
        shared-layout flying dot, ghost dot preview, group-level validation messages, focus rings
- [x] Toggle section — sizes × variants (brand/danger/warning/success), label+description, labelSide,
        thumb stretch on hover, track colour spring animation, focus rings
- [x] Avatar — 7 sizes (xs 24px → 3xl 112px), mesh gradient background (Canvas 2D IDW renderer, cached PNG, no WebGL
        context limit), initials extracted from full name (first+last initial, single char at xs), overlay-blended
        initials + inset border ring. AvatarGroup: overlapping circles with ring separator + "+N" overflow badge.
        AvatarForge: interactive creator — preset picker (20 gradients), type-to-place name on live WebGL card,
        terminal cursor, Framer Motion layout morph (card → circle, spring physics on width/height/borderRadius),
        border grows in via boxShadow animation, reset back to forge. All label text token-compliant:
        text-2xs/xs/sm, text-[var(--color-text-primary/muted)], leading-[1.3], tracking-tight.
        Docs: sizes · with name · with metadata · group · presets · forge sections.
- [x] Tooltips — 4 variants (label · rich · action · tour), 12 placements (top/bottom/left/right × start/center/end),
        direction-aware slide-in/out animation, rotated-square arrow with correct border sides per direction.
        Label: compact with optional keyboard shortcut <kbd> badge. Rich: title + description, hover-triggered.
        Action: title + description + action slot, click-triggered, interactive (stays open on tooltip hover).
        Tour: paginated steps, animated pill step-dots, prev/next/done nav, close ×, fully controlled.
        5 accent variants (default/brand/danger/warning/success) on border + step dots.
        Portal-rendered via createPortal, useLayoutEffect positioning, viewport-clamped.
        Escape key + click-outside dismiss. Hover show delay (default 500ms). Controlled + uncontrolled.
        Docs: label · rich · with actions · tour · all placements · accent variants · no-arrow sections.
- [~] Sidebar Nav — moved to **Layer 5 (Molecules)**. Primitives (`SidebarNavList`, `SidebarNavItem`,
        `SidebarNavGroup`, `SidebarNavToggle`, `SidebarNavSeparator`) live in `components/molecules/SidebarNav.tsx`.
        Docs section 18 references molecules import.

**Reusable components** (`/components/atoms/`):
- [x] **Typography:** `<Heading>`, `<Text>`, `<Label>`, `<Mono>` — shared token-driven typography.
        `Label.color` optional so form components can control focus-state color via className.
        Polymorphic `as` prop on `Text` and `Mono`. Used internally by `<TextInput>` and `<TextArea>`
        (label, optional tag, prefix/suffix, char count). Docs page uses raw className (intentional — different density).
- [x] **Button System:** `<Button>` — 5 appearances (filled/tonal/outline/ghost/inverted) × 6 variants × 3 sizes × 2 shapes, loading, leading/trailing icons, hoverVariant cross-transitions
- [x] **IconButton:** `<IconButton>` — all appearances × variants × sizes, aria-label enforced, ripple from center
- [x] **TertiaryButton:** `<TertiaryButton>` — animated underline wipe, trailing icon slide, inline-safe
- [x] **TextInput:** `<TextInput>` — 3 sizes × 5 states (default/error/warning/success/loading) + disabled + read-only.
        Label (required/optional), helper text, error/warning messages with AnimatePresence swap.
        Leading icon, trailing icon, prefix text, suffix text. Clear button, password show/hide toggle.
        Character count with amber/red threshold colouring. fullWidth prop (default true).
        Framer Motion animated focus ring (state-aware colour). Controlled + uncontrolled.
        Fully token-compliant: all colours from `--color-input-*`, `--color-text-*`, `--color-icon-*`.
- [x] **TextArea:** `<TextArea>` — 3 sizes × 5 states (default/error/warning/success/loading) + disabled + read-only.
        Label (required/optional), helper text, error/warning messages with AnimatePresence swap.
        Auto-resize with minRows/maxRows (scrolls at cap). Fixed height + native resize handle option.
        Clearable with animated corner slot. Character count with amber/red threshold colouring.
        fullWidth prop (default true). Framer Motion animated focus ring (state-aware colour).
        System Spinner for loading state. Controlled + uncontrolled. Fully token-compliant.
- [x] **Checkbox:** `<Checkbox>` + `<CheckboxIndicator>` + `<CheckboxGroup>` — 3 sizes × 4 states × indeterminate.
        Animated SVG check/dash paths, ghost hover preview, hover-tint bloom, focus rings.
        CheckboxIndicator is a pure visual element for composition (used in DropdownItem multi-select).
        CheckboxGroup with group-level label/validation/direction. Fully token-compliant.
- [x] **RadioButton:** `<RadioButton>` + `<RadioGroup>` — 3 sizes × 4 states, context-driven group.
        Shared-layout flying dot (LayoutGroup scoped per group), ghost dot on hover, focus rings.
        Controlled + uncontrolled, standalone + group modes. Fully token-compliant.
- [x] **Dropdown:** `<Dropdown>` + `<DropdownTrigger>` + `<DropdownMenu>` + `<DropdownItem>` + `<DropdownLabel>` +
        `<DropdownSeparator>` + `<DropdownSearch>` + `<DropdownCreateNew>` — 3 sizes × 4 states.
        Portal-based menu with smart top/bottom placement and alignment (start/end/center).
        asChild trigger pattern for Button/IconButton triggers. Keyboard navigation (Arrow/Home/End/Esc/Tab).
        DropdownItem: icon, description, shortcut, trailing icon, selected (check or checkbox style).
        Controlled + uncontrolled open state. Fully token-compliant.
- [x] **Toggle:** `<Toggle>` — 3 sizes × 5 variants (brand/brand-gradient/danger/warning/success).
        Spring-animated thumb with stretch effect on hover, track colour cross-fade, focus rings.
        labelSide (left/right), description, controlled + uncontrolled. Fully token-compliant.
- [x] **Avatar:** `<Avatar>` + `<AvatarGroup>` + `<AvatarForge>` — mesh gradient circles via Canvas 2D IDW renderer
        (same math as GLSL shader: `1/(d²+ε)`, renders once per preset×size, cached as PNG data URL — zero ongoing
        GPU cost, no WebGL context limit). `<Avatar>`: name prop → auto initials, 7 sizes, 20 gradient presets,
        optional displayName + metadata label. `<AvatarGroup>`: stacked overlap (28% shift), separator ring,
        +N overflow badge. `<AvatarForge>`: single persistent WebGL canvas morphs via Framer Motion layout animation
        (card → circle spring), boxShadow border draw-in, preset picker, terminal-cursor name input. Token-compliant.
- [x] **Tooltip:** `<Tooltip>` — single component, variant auto-detected from props. Label (compact, shortcut badge),
        Rich (title + description), Action (+ interactive action slot, click-triggered), Tour (paginated steps,
        prev/next/done, step-dot indicator, close ×). 12 placements, rotated-square arrow with per-direction border
        sides, 5 accent variants. Portal + useLayoutEffect positioning, viewport clamp, Escape/click-outside dismiss,
        hover delay, interactive stay-open grace period. Controlled + uncontrolled. Fully token-compliant.


### Review Gate 4 — PENDING

---

## Layer 4b — Shader System — PENDING

A creative subsystem of interactive WebGL-powered gradient cards. Lives in `/components/atoms/shaders/`.

---

### Mesh Gradient Card (`<MeshGradientCard>`)

A card that renders a smooth mesh gradient driven by a set of user-controlled color pins. Each pin is a point in 2D space with an associated color; the fragment shader interpolates between all pins using inverse-distance weighting to produce an organic, painterly gradient.

**Structure:**
```
<MeshGradientCard>
 ├── <canvas>           ← WebGL mesh gradient renderer
 ├── <PinLayer>         ← SVG/HTML overlay — draggable pin handles
 └── <TextLayer>        ← Text with gradient-blend filter
```

---

### Pin System

A pin is `{ id: string, x: number, y: number, color: string }` where `x/y` are normalized `[0, 1]` coordinates relative to the card.

**Defaults:** 5 pins — one per corner + one center. Each gets a distinct token color from the active palette.

**Interactions:**
- **Drag** pin handle → reposition (constrained to card bounds)
- **Click empty area** → add new pin at cursor position with a sampled or random color
- **Right-click / long-press pin** → delete (minimum 2 pins enforced)
- **Click pin** → open compact color picker (`<HexColorPicker>` from `react-colorful`)
- **Hover pin** → expand handle, show color tooltip

**State:** Pin config is `useState<Pin[]>` in the card. Export via `onPinsChange` callback so parent can persist/restore preset configs.

---

### Fragment Shader (GLSL)

**Algorithm:** For each fragment, compute the weighted color sum across all pins using inverse square distance as the weight. Softened with a small epsilon to avoid division by zero at the pin center.

```glsl
// Core interpolation — pseudocode
vec3 color = vec3(0.0);
float totalWeight = 0.0;

for (int i = 0; i < MAX_PINS; i++) {
  float dist = distance(uv, u_pins[i].xy);
  float weight = 1.0 / (dist * dist + 0.001);
  color += u_pins[i].color * weight;
  totalWeight += weight;
}

gl_FragColor = vec4(color / totalWeight, 1.0);
```

**Uniforms passed per frame:**
- `u_pins[MAX_PINS]` — vec3 position+color packed or separate arrays
- `u_pinCount` — int, active pin count
- `u_resolution` — vec2 canvas size
- `u_time` — float, for optional idle animation

**Idle animation (optional):** Each pin drifts subtly via a low-frequency sine offset on `u_time`. Togglable via `animated` prop (default `false`).

**Implementation:** Raw WebGL2 via `useRef<HTMLCanvasElement>` + manual shader compilation. No Three.js dependency to keep bundle lean. Shader compiled once on mount; uniforms updated on every pin state change via `requestAnimationFrame`.

---

### Text Layer

Text renders on top of the canvas with a filter that makes it feel embedded in — rather than overlaid on — the gradient.

**Strategy: `mix-blend-mode`**
- Default: `mix-blend-mode: overlay` on a `<div>` containing the text
- Alternatives to expose via `textBlend` prop: `screen`, `hard-light`, `color-dodge`, `luminosity`
- Text itself is white (`--text-inverse`) at full opacity — the blend mode does the work
- For legibility on very light gradients: wrap in a `backdrop-filter: blur(1px) brightness(0.85)` scrim with `mix-blend-mode: multiply`

**Typography:** Uses `font-display` (General Sans), weight 600–700, large size. Letter-spacing `tracking-tight`. Text content passed via `children` or `label` prop.

---

### Component API

```ts
interface MeshGradientCardProps {
  width?: number                    // default: 480
  height?: number                   // default: 320
  initialPins?: Pin[]               // seed a preset config
  animated?: boolean                // idle pin drift (default: false)
  textBlend?: BlendMode             // overlay | screen | hard-light | color-dodge | luminosity
  label?: string                    // text rendered on card
  className?: string
  onPinsChange?: (pins: Pin[]) => void
}

interface Pin {
  id: string
  x: number    // 0–1 normalized
  y: number    // 0–1 normalized
  color: string // hex
}
```

---

### Documentation Page (`/atoms` — Shaders section)

- Live interactive `<MeshGradientCard>` — user can drag pins, add/remove, change colors
- Preset gallery: 4–5 curated pin configs (e.g. "Cyan Dusk", "Fire", "Emerald Tide", "Neutral Void")
- Blend mode toggle — cycle through text blend modes live
- Pin JSON export — shows raw pin array in a `<Mono>` block, copyable

---

### Dependencies

- `react-colorful` — lightweight color picker (no new heavy deps)
- `@use-gesture/react` — drag handling for pins (already considered for motion system)
- Raw WebGL2 — no Three.js

### Review Gate 4b — PENDING
- [ ] Card renders mesh gradient correctly across pin count 2–16
- [ ] Pin drag, add, delete all functional
- [ ] Text blend visually reads well across light/dark gradient regions
- [ ] Shader compiles without errors; no WebGL warnings in console
- [ ] Resize observer keeps canvas resolution correct (no blur on resize)
- [ ] `animated` mode runs at 60fps, no jank

---

## Layer 5 — Composite Components (Molecules) — PENDING

Business-aware but not route-specific. `components/molecules/` — empty.

- [x] **Sidebar Nav primitives** — `SidebarNavList`, `SidebarNavItem`, `SidebarNavGroup`, `SidebarNavToggle`, `SidebarNavSeparator` (`components/molecules/SidebarNav.tsx`)
        Item states: active (#1B1B1B bg + brand ring), hover (tonal-bg-hover + brand ring), resting hairline.
        Group: collapsible with spring height + chevron rotate. Toggle: full-row click, checked-state layers,
        brand-tinted icon, stopPropagation to prevent double-fire. Controlled + uncontrolled throughout.
- [ ] **SideNav** — full app shell sidebar built on SidebarNav primitives (workspace header, nav sections, demo-data toggle, user footer)
- [ ] **Modal System:** `<ModalProvider>`, `<Modal>`, `<ModalHeader/Body/Footer>`, `<DrawerModal>`
- [ ] **Data Display:** `<DataRow>`, `<StatCard>`, `<ChangeIndicator>`, `<AddressDisplay>`, `<TokenAmount>`, `<BlockchainBadge>`
- [ ] **Filters & Search:** `<FilterBar>`, `<SearchInput>`, `<FilterDropdown>`
- [ ] **Empty & Loading States:** `<EmptyState>`, `<LoadingOverlay>`, `<ErrorState>`

### Review Gate 5 — PENDING

---

## Layer 6 — Feature Modules (Organisms) — PENDING

Fully functional, all features implemented. `components/organisms/` — empty.

- [ ] **Wallet Cards:** `<MPCVaultCard>`, `<GnosisSafeCard>`, `<TrackedWalletCard>`, `<WalletCardSkeleton>`, deposit QR, send tokens
- [ ] **Transaction Components:** `<TransactionRow>`, `<TransactionList>`, `<ProposalCard>`, `<ProposalList>`
- [ ] **Asset Components:** `<AssetRow>`, `<AssetBreakdownRow>`, `<PortfolioHeader>`
- [ ] **Address Components:** `<AddressRow>`, `<GroupCard>`, `<AddressSelector>`
- [ ] **All Modals:** CreateVault, TrackWallet, SendTokens, Deposit, AddAddress, AddGroup, CreateProposal

### Review Gate 6 — PENDING

---

## Layer 7 — Pages — PENDING

Server components + client islands. All routes fully built.

| Route | Features | Status |
|---|---|---|
| `/wallets` | All wallet types, create vault, track wallet | ❌ |
| `/wallets/[id]` | Policy, members, transactions, settings | ❌ |
| `/assets` | Portfolio total, asset list, expandable breakdown | ❌ |
| `/transactions/view-all` | Filter by type/wallet/token, URL state | ❌ |
| `/transactions/proposals` | Status tabs, approve/reject, execute | ❌ |
| `/address-book/addresses` | CRUD, search, group filter | ❌ |
| `/address-book/groups` | CRUD, member management | ❌ |

Page-level animations: staggered list entry, shared element transitions (View Transitions API), smooth tab switching.

### Review Gate 7 — PENDING

- [ ] Performance audit: reduce layout shifts, optimize animations

### Final Review — PENDING

---

## Improvement Summary vs Reference

| Area | Reference | v2 |
|---|---|---|
| Colors | 40+ ad-hoc hex values | 10 structured token scales (150+ colors) |
| Typography | Inconsistent sizes/tracking | 10-step scale, consistent spacing |
| Spacing | Mixed arbitrary values | Strict 4px grid |
| Motion | Some Framer Motion, mostly CSS transitions | Comprehensive motion system (9 transitions, 14 variants, 6 interactions) |
| Features | Several placeholders | 100% implemented (target) |
| Loading states | Missing in most places | Skeletons everywhere (target) |
| Error states | Minimal | Proper error handling + UI (target) |
| Mobile | Basic `MobileView` | Responsive at every layer (target) |

---

## Design Constraints
- Dark mode only
- Same mock data + CoinGecko API as reference
- Base design direction: reference + improvements in typography, size, spacing, motion
- Reference brand: Paper MPC
