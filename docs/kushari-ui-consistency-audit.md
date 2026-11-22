# Kushari — UI Consistency Audit

**Audited:** 22 Nov 2026 · **Revision:** 2 (re-read for intent) · **Branch:** `main` (= `v2`, the deployed app) · **Companion to:** [kushari-design-review.md](kushari-design-review.md), [kushari-backend-brief.md](kushari-backend-brief.md)

> **For the Claude project picking this up:** read section 1 before acting on anything. Kushari's layout is deliberately unconventional: it's tuned so people can read and take in data quickly. Many differences between screens are **role-specific styling**, not drift. Findings keep their IDs (`U-01`…) across revisions.
>
> **Method:**
> - **Static scan:** a scan of the 90 app `.tsx` files (the 8 design-system docs pages aren't counted).
> - **Browser measurements:** computed styles on all 7 main screens at 1440×900.
> - **Re-check for intent:** each difference was re-examined for a reason before being called a problem.
>
> Counts are approximate.

---

## 1. How to read this audit

**The consistency rule is: same role → same style.** It is *not* "one style everywhere". A dense data product gives different jobs different treatments on purpose:
- A **balance** that stands alone and refreshes in place uses mono figures, so the digits don't shift.
- An **amount in a dense table** uses sans, so more fits and small sizes stay legible.
- A **section divider** ("VAULTS") uses wide letter-spacing to read as a quiet marker.
- A **key-value label** ("AVAILABLE") sits tight against its number.

Before calling any difference a finding, ask:
1. **Is it the same role?** If two things do different jobs, different styles are expected.
2. **Can a user see it?** If not, it's code hygiene: it matters for maintenance, never for the look.
3. **Does it help or hurt reading speed?** Only a difference that slows reading, or breaks a pattern the user has learned, is a design problem.

**Hygiene fixes must not change pixels.** When tokenising, map each token to the value that **already renders**. Don't round values toward a scale.

---

## 2. Summary

| Group | Findings | Action |
|---|---|---|
| **A. Visible defects** | U-01 ✅ fixed · U-02 ✅ fixed · U-10 ✅ fixed · U-09 · U-18 · U-21 · U-22 | Fix |
| **B. Code hygiene** (no visible change) | U-03 · U-08 · U-11 · U-12 · U-13 · U-14 · U-16 · U-17 · U-19 · U-20 | Refactor without changing pixels |
| **C. Deliberate variation** | U-04 · U-05 · U-06 · U-07 · U-15 · title position · vault-page title | **Keep. Don't flag again.** |
| **D. Open questions** | Q-01 · Q-02 | Delanoy to decide |

---

## 3. A — Visible defects (fix)

#### U-01 🔴 ✅ Fixed — Geist Sans wasn't the base font
- **Was:** `body` used `var(--font-sans)`. That variable sits in `@theme inline`, which isn't output as a real CSS variable, so most text fell back to the system font (San Francisco).
- **Fix applied:** `globals.css` now points `body` straight at `var(--font-geist-sans)`.
- **Verified:** no text on the 7 main screens renders in `ui-sans-serif` any more.

#### U-02 🔴 ✅ Fixed — tokens used but never defined
- **Was:** three undefined tokens, so their styles were silently dropped.
  - `--color-surface-danger` in `AddAddressModal.tsx`: the error banner had no background.
  - `--color-text-neutral` in `WalletDetails.tsx`: the vault-title icon fell back to the inherited `#EDEDED`.
  - `--color-success` in `designsystem/ButtonPlayground.tsx`: the "copied" check mark wasn't green.
- **Fix applied:**
  - **Add Address banner:** now uses `rgba(239,68,68,0.1)`, the same background as Create Group's error banner (same role, same style).
  - **Vault-title icon:** now `--color-icon-primary` (`#FFFFFF`), matching the white title beside it.
  - **Check mark:** now `--color-icon-success`.
- **Verified:** a scan of `src` finds 0 undefined `var(--…)` tokens.

#### U-10 🟡 ✅ Fixed — Browser `alert()` for validation and errors
- **Was:** 11 calls in 4 files. A native browser dialog over a designed modal breaks the flow, and it would interrupt automated capture.
- **Fix applied:** 0 `alert()` calls remain in `src`. Every error now edits away: it clears as soon as the user changes a field.
- **Field errors** use the design system's states (`TextInput` and `Dropdown` with `state="error"` + `errorMessage`):

  | Modal | Field | Message |
  |---|---|---|
  | Create Vault | Vault name | Give the vault a name |
  | Create Vault | Approvers | Choose at least one approver |
  | Create Vault | Threshold | Approvals required can't be more than the number of approvers |
  | Create Vault | Approvers, invalid invite | Enter a full email address to invite someone, like name@company.com. The typed text is kept |
  | Connect Safe | Wallet name | Give the safe a name |
  | Connect Safe | Owners (shown once, under the first owner) | Assign at least one owner to connect this safe |
  | Connect Safe | Safe missing | No message: the user goes back to the Locate step |

- **Save-failure banners** use the new `InlineAlert` atom (`components/atoms/InlineAlert.tsx`, documented as Atoms §17): a red-tinted strip above the submit button, with `role="alert"`:

  | Modal | Message |
  |---|---|
  | Create Vault | Couldn't create the vault. Your details are still here, so try again. |
  | Connect Safe | Couldn't connect the safe. Your owner assignments are still here, so try again. |
  | Track Wallet | Couldn't start tracking this wallet. Your details are still here, so try again. |

- **Export CSV (Transactions):** the alert is gone. The button downloads a real CSV of every transaction matching the current search and filters. While it works, it reads "Exporting CSV" and uses the Button atom's `loading` state.
- **Verified in the browser:** the invalid invite, and all three banners (forced by making the save throw). Typing in a field clears the banner.
- **`InlineAlert` atom (done):** all 5 form-level banners use it: Create Group, Add Address, Create Vault, Connect Safe and Track Wallet. It uses one radius (4px). Add Address changed from 8px to 4px and gained the `tracking-tight` letter-spacing the others already had.
- **Still open in Add Address:**
  - On failure it shows the raw error text (`err.message`) instead of written copy.
  - Its field errors are hand-built `<span>`s under the inputs, not the TextInput `state="error"` used elsewhere.

#### U-09 🟢 Native `title=` tooltips
- **Seen:** 24 uses, 14 of them in SettingsModal. Native tooltips appear after the OS delay in the OS style, next to the app's own `<Tooltip>` (30 uses).
- **Fix:** use `<Tooltip>`, except where `title=` is just the full text of a truncated label.

#### U-18 🟢 Content jumps 7px between short and long pages
- **Cause (measured):** `main` is the scroll area, but it has no `scrollbar-gutter`. Pages long enough to scroll (Assets, Transactions, Proposals, Addresses) show a 15px scrollbar, which shifts the centred column 7.5px left of where it sits on short pages (Wallets, Groups).
- **Fix:** add `scrollbar-gutter: stable` to `main` in `app/(main)/layout.tsx`. `body` already has it, but `body` isn't the element that scrolls.
- **Not a defect:** the title's vertical position (49 vs 53px). See section 5.

#### U-21 🟡 Settings' Invite dialog skips the shared modal
- **Seen:** it's a hand-built overlay, so Escape doesn't close it, focus isn't trapped, and its backdrop and corners differ from every other modal.
- **Fix:** open it through the shared `Modal` at `MODAL_WIDTH.small`.
- **The colour work in SettingsModal, SendTokens and ConnectSafe** (raw whites and hex) is hygiene; see U-03.

#### U-22 🟡 Keyboard access
- **Clickable non-buttons:** 38 `onClick`s on `div`/`span`/`li`, in 14 files. Most are in SendTokens (11) and PolicyContent (6). They can't be reached by keyboard.
- **Focus styles:** `outline-none` is used 41 times against 16 `focus-visible:` styles, so many focusable elements show no focus.
- **Fix:** use buttons for actions, and pair each `outline-none` with a `focus-visible:` ring from `--shadow-focus-ring-*`. This overlaps review K-08.

---

## 4. B — Code hygiene (no visible change)

These don't change what anyone sees today. They make future changes safe: one edit reaches every place, and a value can't drift unnoticed. **Every fix here must render identically before and after.**

| ID | What | Where it piles up | Pixel-safe fix |
|---|---|---|---|
| U-03 | ~240 raw white/black opacity classes (40 distinct), `text-white` ×147 beside `text-primary` ×186, ~110 hex values outside the Avatar presets | SettingsModal, SendTokens, ConnectSafe | Add tokens for the opacity layers actually in use (e.g. `--color-surface-hover`, `--color-border-faint`) at their current values |
| U-08 | 19 raw `<button>`s | SettingsModal (6), SendTokens (6) | Only move a button onto an atom where the atom renders the same. Settings and Send Tokens' tab pills may need a segmented-control atom first |
| U-11 | 11 raw `<input>`s inside dropdowns and filters | 6 files | A `TextInput size="sm"` matching the current look |
| U-12 | 17 border-radius values, including `[10.5px]` ×8 | spread | Name the values in use as tokens; don't merge them |
| U-13 | 24 shadow recipes; the shadow tokens are used 8 times; a focus ring copied inline | spread | Swap exact duplicates for tokens (the copied focus ring matches `--shadow-focus-ring-brand`) |
| U-14 | 12 z-index values (`z-[1]` to `z-[9999]`) | onboarding, dropdowns | A named z-scale with the current values, so layers stack predictably |
| U-16 | `lib/motion` imported by 6 of 41 animated files; 20 inline durations, 16 spring stiffnesses; `transition-all` ×46 | spread | Name the timings in use. Swap `transition-all` for the properties that actually change (a performance fix; it looks the same). Choosing the motion character is review section 6 |
| U-17 | Money formatted with `lib/formatters` in 10 files, and `toFixed`/`toLocaleString` in 11 | Transactions, Proposals, Assets, SendTokens | One formatter API. Which output each page shows is decided in Q-01 |
| U-19 | Helpers copied: `renderWalletIcon` ×11, `getPresetForUser` ×6, `AVATAR_PRESETS` ×5, proposal status labels ×2 | spread | Shared `WalletIcon`, avatar presets inside `Avatar`, one `proposalStatusLabel()`. The copied `getPresetForUser` is how the Create Vault crash happened |
| U-20 | Two sidebar components (`SideNav`, `SidebarNav`) | app vs Settings and docs | Shared item styling, or one component with an `items` prop |

---

## 5. C — Deliberate variation (keep; don't flag again)

Each of these looked like drift in a raw count. Each serves reading speed or marks a different role.

| ID | What differs | Why it's right |
|---|---|---|
| **U-04** | Figures are mono on Wallets, Assets and Addresses, and sans on Transactions and Proposals | **Confirmed by Delanoy.** Mono keeps standalone and refreshing balances steady in width; sans keeps dense table rows compact and legible at small sizes |
| **U-07** | Three uppercase label styles: "VAULTS" 10px / 2.2px spacing, "AVAILABLE" 11px / 0.96px, "VIEW ADDRESSES" 10px / 0.25px | Three roles: a page-section divider (wide spacing, quiet), a key-value label above a figure (tight, attached to its number), and a button label |
| **U-06** | 18 letter-spacing values | Spacing tuned to size and case: negative for large headings, positive for small uppercase. Optical tuning, not noise |
| **U-05** | Arbitrary font sizes (`text-[10px]`, `[26px]`, `[9px]`, `[28px]`…) | 10, 11, 13 and 26 equal scale steps, so they render the same (swapping in scale names is optional hygiene). 9px is for dense micro-labels and 28px for the vault-page hero; keep both |
| **U-15** | Icon sizes 12–24, with 14, 15 and 16 side by side | Icons are sized optically to the text next to them. Only collapse a size where the icon and text roles really match |
| — | Page title 4px lower on pages with a search field | One rule: the title is centred in its header row, and rows with a 40px search are taller |
| — | Vault page title is 28px General Sans; list titles are 26px Geist | A detail page names one entity, so its name is the hero. List pages share one title style |
| — | Send Tokens' table error ("Enter all values or remove address to continue") has 12px corners, a border and an icon, unlike `InlineAlert` | **Confirmed by Delanoy.** Different role: it validates a group of fields (the recipients table) and sits right under it. `InlineAlert` is for form-level failures above the submit row |

---

## 6. D — Open questions for Delanoy

- **Q-01 — Thousands separators in tables.** Transactions and Proposals show amounts like `$26869.61` and `$4598688.52`; Wallets shows `35,854,402`. Is the unseparated form intended, for example to keep table columns narrow? If not, separators make 6–7 digit amounts faster to read. (Review K-16 raised this; it's not listed as a defect until you confirm.)
- **Q-02 — Token precision.** Some prices show 6 decimals (`$1,690.382981`). Intended for precision, or should prices round to 2 and keep full precision for token quantities?

---

## 7. Order of work

1. **Defects:** U-21 (Invite dialog), U-18 (scrollbar jump), then U-22 (keyboard) and U-09 (tooltips).
2. **Answer Q-01 and Q-02**, then U-17 (one formatter that produces the chosen output).
3. **Hygiene, pixel-safe:** U-19 first (removes the crash pattern), then U-03, U-13, U-12, U-14, U-16, U-08, U-11 and U-20. Compare screenshots before and after each.
4. **Guardrails:** a CI check for undefined `var(--…)` tokens and `alert(`. Don't lint against style variation; section 5 shows why.
