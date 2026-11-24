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
| **A. Visible defects** | U-01 ✅ fixed · U-02 ✅ fixed · U-10 ✅ fixed · U-21 ✅ fixed · U-18 ✅ fixed · U-22 ✅ fixed · U-09 ✅ fixed | Done |
| **B. Code hygiene** (no visible change) | U-03 · U-08 · U-11 · U-12 · U-13 · U-14 · U-16 · U-17 · U-19 · U-20 | Refactor without changing pixels |
| **C. Deliberate variation** | U-04 · U-05 · U-06 · U-07 · U-15 · title position · vault-page title | **Keep. Don't flag again.** |
| **D. Open questions** | Q-01 ✅ answered · Q-02 ✅ answered | Decided (24 Nov 2026), see section 6 |

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

#### U-09 🟢 ✅ Fixed — Native `title=` tooltips
- **Recount:** the first figure (24, with 14 in SettingsModal) counted component props that happen to be named `title`, such as Settings row headings and tab labels. A parser scan for real HTML `title` attributes found **5 in the app** and 6 in the design-system docs pages.
- **Fixed:**

  | Where | Was | Now |
  |---|---|---|
  | Network icons (`BlockchainIcon`), on every row and card | A native `title` *and* the `Tooltip` atom from `BlockchainIconStack`, so two tooltips showed on hover | Native `title` removed; the `Tooltip` atom only. `role="img"` added so its `aria-label` is read out |
  | Transactions: the date above each row | Native `title` with the full date and time | `Tooltip` atom, same text ("Jul 31, 2026, 1:50 AM") |
  | Proposals: the date above each card | Same | Same |
  | Send Tokens: the "Remove" button on a recipient | `title="Remove recipient"` on a button already labelled "Remove" | `title` removed. `aria-label="Remove recipient"` keeps the full meaning for screen readers |

- **Kept, as allowed:** Connect Safe's truncated safe address. `title` there just shows the full text of a cut-off label.
- **Not changed:** the 6 in the design-system docs pages (copy buttons and swatch names). They're internal documentation, not the app.
- **Verified in the browser:** the date tooltip appears in the app's style, and no `[title]` remains on the Transactions page.

#### U-18 🟢 ✅ Fixed — Content jumped 7px between short and long pages
- **Was:** `main` is the scroll area, but it had no `scrollbar-gutter`. Pages long enough to scroll (Assets, Transactions, Proposals, Addresses) showed a 15px scrollbar. That shifted the centred column 7.5px left of where it sat on short pages (Wallets, Groups): the title was at x=324.5 instead of 332.
- **Fix applied:** `[scrollbar-gutter:stable_both-edges]` on `main` in `app/(main)/layout.tsx`. It reserves the scrollbar's 15px on **both** sides, on every page, so the column centres where it would with no scrollbar at all.
  - **Why `both-edges` and not plain `stable` (decided with Delanoy):** plain `stable` also stops the jump, but it parks every page at 324.5. That's 7.5px left of the design, and of what Mac trackpad users see.
- **Verified at 1440×900:**
  - The title is at x=332 on all 6 list pages, both short and long ones.
  - Nothing on Transactions (the widest table) overflows sideways.
  - The cost is a blank 15px strip beside the sidebar, invisible on black, and 30px less width for the column.
- **Overlay scrollbars:** macOS's default (trackpad) setting uses overlay scrollbars, which take no space. For those users nothing is reserved and nothing changes; they were already at 332.
- **Scrollbar style (Delanoy's call):** the default 15px light-grey scrollbar looked out of place on the black UI. Every scrollbar in the app now uses the style the Dropdown menus already had: `scrollbar-width: thin` and a `--color-border-default` thumb on a transparent track. It's set once in `globals.css` (`@layer base`, on `*`). The reserved space drops from 2×15px to 2×11px and the title stays at x=332. Mac users with floating scrollbars see no change.
- **Not a defect:** the title's vertical position (49 vs 53px). See section 5.

#### U-21 🟡 ✅ Fixed — Settings' Invite dialog skipped the shared modal
- **Was:** a hand-built overlay. Escape didn't close it, focus wasn't kept inside it, and its backdrop and corners differed from every other modal.
- **Fix applied:** the dialog is now `components/molecules/settings/InviteMemberModal.tsx`. It opens through the shared `Modal` at `MODAL_WIDTH.small` and stacks above Settings.
  - **Layout:** it copies Create Group: an icon tile, a ghost close button, the title, then labelled fields. It uses tokens (`--color-surface-sunken`, `--color-border-subtle`, `--shadow-2xl`) instead of `#161618` and `white/10`. The Role dropdown is full width.
  - **Stacked-modal rule (Delanoy):** a dialog opened on top of another uses the **same surface** as the one underneath (here Settings' `--color-surface-sunken`). Don't separate it with a lighter surface. The shared `Modal` already shows the order: the modal underneath scales down, blurs and dims, and the top one gets the `--shadow-2xl` edge.
  - **Errors** use the `TextInput` error state and clear as you type. Before, an empty email silently did nothing.

    | Case | Message |
    |---|---|
    | Empty | Enter the email address of the person you're inviting |
    | Not an email | Enter a full email address, like name@company.com |

- **Verified in the browser:**
  - Both errors show.
  - A valid invite adds an "Invited" row and closes the dialog. Focus returns to "Invite member".
  - Tab stays inside the dialog.
  - Escape (pressed twice, the shared modal's rule) closes only the invite and leaves Settings open.
  - No console errors.
- **Still a raw button:** "Invite member" itself. That's U-08 hygiene.
- **The colour work in SettingsModal, SendTokens and ConnectSafe** (raw whites and hex) is hygiene; see U-03.

#### U-22 🟡 ✅ Fixed — Keyboard access
- **Was:**
  - Clickable `div`/`span`/`motion.div` elements couldn't be reached with Tab, including the app's main rows and cards.
  - `outline-none` hid focus on buttons that had no focus style of their own.
  - Buttons that appear on hover stayed invisible when tabbed to.
- **Re-scan:** done with the TypeScript parser. The first count (38) came from a regex that missed `motion.div`s, which are the transaction rows, proposal cards, asset rows and wallet cards. The parser found 51 clickable non-buttons.

**1. `pressable()` helper (`lib/pressable.ts`).** It gives an element `role="button"`, puts it in the Tab order, and makes Enter or Space trigger its existing click. It can also set `aria-pressed` (selected cards) and `aria-expanded` (rows that open). Applied to 30 elements:

| Where | What |
|---|---|
| Transactions | Rows (expand), Classification pill and its options |
| Proposals | Cards (open review) |
| Assets | Rows (expand) |
| Wallets | Vault, Safe and tracked-wallet cards |
| Groups | Rows (open the group's addresses) |
| Connect Safe | Wallet and safe choice cards |
| Send Tokens | Recipient-type and mass-option cards, group picker items, token/USD amount switches |
| Vault policy | The 4 policy blocks (enter edit mode) |
| Filters | Field options in the complex filter |

  - **Why not `<button>`:** a `<button>` sizes to its content where a `div` fills its row, and several of these hold inputs or buttons, which a `<button>` can't contain. `pressable()` changes no pixels.
  - **Disabled:** when a click does nothing (an option already chosen, the review step, another policy block being edited), the element leaves the Tab order.

**2. One focus ring for the whole app (`globals.css`).**
  - A `:focus-visible` outline: 2px in `--color-focus-ring` (the cyan of `--shadow-focus-ring-brand`), 2px out from the element. It follows rounded corners.
  - It shows only for keyboard focus, never on mouse click.
  - It sits in `@layer base`, so atoms with their own ring (Button, IconButton, TertiaryButton, Toggle, text fields) keep theirs.
  - Text fields, dialogs and `tabindex="-1"` targets are excluded.
  - `outline-color` is set on every element ahead of time. Without that, rows with `transition-colors` faded the ring in from white.
  - `--color-focus-ring` lives in `:root`, not `@theme inline`, which isn't output (the same trap as U-01).

**3. Focus no longer hidden.** `outline-none` was removed where nothing replaced it:
  - Filter pills (FilterDropdown, ComplexFilter)
  - Sidebar items (SideNav, SidebarNav: the ring is drawn flush, offset 0)
  - Onboarding footer
  - The clear and show-password icons in TextInput and TextArea

  Mouse users see no change.

**4. Hover-only buttons now appear on keyboard focus.**
  - **Wallet cards:** their hover state also turns on while focus is inside, so Deposit and Send show and the border lights up.
  - **Group, Address and Proposal rows:** the action buttons get `group-focus-within:opacity-100`.

**5. Send Tokens CSV upload:** its file input was `hidden` (display:none), so the keyboard couldn't reach it. It's now `sr-only`, and the "Upload" link shows the ring.

- **Verified in the browser at 1440×900:**
  - **Groups:** Tab order is search → Create group → View ungrouped → each row and its buttons. Enter on a row opens its addresses.
  - **Transactions:** Enter on a row expands it (`aria-expanded` true). Enter on its Classification pill opens the menu without collapsing the row.
  - **Wallets:** vault cards show the ring around their rounded corners. Tabbing to Deposit reveals it.
  - **Mouse:** a mouse click shows no ring.
  - **Console:** no new errors.
- **Left as is, with a keyboard route already:**
  - **Address rows** (via the checkbox) and **Settings rows** (via the toggle or checkbox).
  - **Click blockers:** 12 `onClick`s that only stop a click from reaching the row behind them. They aren't actions.
  - **Inputs:** the wrappers that click through to an input.
  - **Pointer-only:** the avatar-forge canvas.
- **Still open:**
  - **The FilterDropdown "×" clear icon** sits inside the pill's button, and a button can't hold another one. Keyboard users clear a filter by unticking it in the menu.
  - **Hygiene (U-08):** turning the remaining raw `<button>`s into atoms.

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
| U-17 (dropped) | Money formatted with `lib/formatters` in 10 files, and `toFixed`/`toLocaleString` in 11 | Transactions, Proposals, Assets, SendTokens | One formatter API that keeps each page's current output: no thousands separators in table amounts (Q-01), token prices at full precision, dollar amounts to 2 decimals (Q-02) |
| U-19 ✅ | Helpers copied: `renderWalletIcon` ×11, `getPresetForUser` ×6, `AVATAR_PRESETS` ×5, proposal status labels ×2 | spread | **Done**, see "U-19 — done" below |
| U-20 | Two sidebar components (`SideNav`, `SidebarNav`) | app vs Settings and docs | Shared item styling, or one component with an `items` prop |

### How hygiene changes are verified (render fingerprint)

There are no image tools on this machine, so screens are checked by fingerprint instead of pixels.
- **What's recorded:** for every element on a screen, its position and size plus 25 computed styles (colours, borders, radii, shadows, fonts and so on). The script runs in the browser and stores the result in IndexedDB.
- **How it's used:** record before a refactor, compare after. Any element added, removed or restyled is listed.
- **Screens covered** at 1440×900:
  - **Pages:** Wallets, vault detail, Assets, Transactions, Proposals, Addresses, Groups.
  - **Dialogs:** Send Tokens, Make Deposit, Review Proposal.
  - Any screen a step touches is added as needed.
- **Noise it ignores:**
  - Live API numbers, which change on every load: numeric text, the widths and sideways shifts they cause, and the red/green trend colours.
  - Looping animations: transform, opacity, and the geometry of anything inside an animating element.
- **Proof it's reliable:** with no code changed, all 10 screens compare "identical".

### U-19 — done
- **`walletIcon(type, { size, muted, fallback })`** in `components/atoms/WalletIcon.tsx` replaces 9 copies of `renderWalletIcon`. Each call passes the options that reproduce its old copy: 16, 18 or 24px; muted or inherited colour; which icon to show for an unknown type.
- **`presetForName(name, chosen?)` and `NAME_AVATAR_PRESETS`** live in `Avatar.tsx`. They replace 5 copies of `getPresetForUser` and `AVATAR_PRESETS`, so there's one place to change.
  - Order matters: the list is the same 13 presets in the same order, so everyone keeps their avatar.
  - The Policy tab's "use the member's chosen preset" behaviour is the `chosen` argument.
- **`PROPOSAL_CATEGORY_LABEL`** in `proposals/types.ts` is used by the Proposals tabs and the vault's proposal tabs.
- **Unused imports removed** from the old copies. The result is 187 fewer lines.
- **Verified:**
  - **Fingerprint:** 9 of the 10 screens are identical. Create Vault and the vault Policy tab were also checked, old code against new (via `git stash`): identical.
  - **The one difference (Assets):** the Safe icons on its rows now carry the muted text class, like the other muted wallet icons. That changes their CSS `color` value only. The icon's fill was already the muted colour and is unchanged, so it can't be seen.
  - **Not covered:** Connect Safe's later steps use random demo data, so they can't be fingerprinted. Its helper change is the same function.
- **Inconsistencies it uncovered:**
  1. ✅ **Transactions' Wallet filter** showed Safes with a generic safe icon (`RiSafe2Line`). It now uses `walletIcon()`, so Safes show the Gnosis Safe logo, the same as the Wallets page (Delanoy's call).
  2. **Proposals' filter:**
     - ✅ **The 5 fields now have icons**, matching Transactions where the idea is the same: Wallet (wallet), Network (network icon, see below), Address (person, as the sidebar's Addresses), Classification (shapes, see below), Status (progress ring) (Delanoy's call).
     - ✅ **The wallets listed under Wallet now have icons** via `walletIcon()`: the vault icon for vaults and the Gnosis Safe logo for Safes, as in Transactions. The last two local `renderWalletIcon` copies are now gone (Delanoy's call).
  3. **Send Tokens' approver avatars** use a fixed name→preset list (`USER_PRESETS`), not `presetForName`, so the same person can get a different gradient there than on the Policy tab. Left as is for now.
- ✅ **Transaction type icons, one set for the whole app (Delanoy's call):**

  | Type | Icon | Was in rows | Was in the Type filter |
  |---|---|---|---|
  | Sent | `RiArrowRightUpLongFill` | `RiArrowRightUpLine` | `RiArrowRightUpLine` |
  | Received | `RiArrowLeftDownLongFill` | `RiArrowLeftDownLine` | `RiArrowLeftDownLine` |
  | Interacted | `RiExpandDiagonalFill` | `RiExpandDiagonalLine` | `RiExchangeLine` (didn't match the rows) |

  They come from one function, `transactionTypeIcon()` in `components/atoms/TransactionTypeIcon.tsx`. Transaction rows and the Transactions Type filter both use it. Those are the only two places a transaction type is shown.
- **Not changed:**
  - **Send buttons** keep the paper plane (`RiSendPlaneLine` / `RiSendPlaneFill`): on wallet cards, the vault page, Groups and Addresses rows, and the Send Tokens dialog. **Confirmed by Delanoy:** sending is an action, and the arrows mark a transaction's type.
  - **The design-system docs demos** (a "Send / Receive / Swap" dropdown).
- ✅ **Classification filter field icon (Delanoy's call):** the "Classification" field in both the Transactions and Proposals filters uses `RiShapesLine`. It replaced the price tag on the field. The classification names under it have no icon in either filter. The price tag was removed from Transactions' names to match Proposals, and from Send Tokens' Classification picker, which now has no leading icon (Delanoy's call). `RiPriceTag3Line` is no longer used in the app.
- ✅ **"Network" everywhere, not "Blockchain" (Delanoy's call).** Renamed 6 visible labels:
  - Transactions filter field: Blockchain → Network (matches Proposals).
  - Assets filter: Blockchain → Network.
  - Send Tokens field: "Blockchain network" → "Network".
  - Review Proposal: "Blockchain network" → "Network".
  - The Policy tab's Network limits description: "…for blockchain network here" → "…for networks here".
  - The Transactions CSV export column header: Blockchain → Network.

  Code names (`blockchain` keys and props) are unchanged. "On-chain" wording and the "Gnosis Chain" name are standard terms and stay.
- ✅ **Network filter icons (Delanoy's call):**
  - The Network field uses `RiNetworkLine` in all three filters (Transactions, Proposals, Assets). It replaced the globe.
  - Each network in the list shows its own logo via `BlockchainIconStack`. Transactions and Assets already did; Proposals now does too.
  - The globe stays only for the "website" link in the account menu.
- **Also seen (hygiene, for later):** there are two `GnosisSafeIcon` components. `media/icons/` is used by 12 files; `components/ui/` is used only by Connect Safe.

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

- **Q-01 — Thousands separators in tables. ✅ Answered: intended, keep.**
  - **The question:** Transactions and Proposals show amounts like `$26869.61` and `$4598688.52`, while Wallets shows `35,854,402`. Was the unseparated form intended?
  - **Answer:** yes. It isn't only to keep columns narrow: it pairs the dollar value with the token amount under it (e.g. `$1245.35` over `GRAM 1258.5` in a Transactions row), so the two read as one unit.
  - **Status:** not a defect. Review K-16 is closed by this answer.
- **Q-02 — Precision. ✅ Answered.**
  - **Token prices:** keep them as precise as possible, e.g. `$1,690.382981` stays as is.
  - **Dollar amounts:** always 2 decimals at most (values, totals, balances).
  - **Fee too small for 2 decimals:** shows `<$0.01`, not `$0.00`.
  - **Done:** an audit of every money format found one break of the rule: the gas fee's dollar value in Transaction details showed 6 decimals (`($0.000037)`). It now shows `(<$0.01)`, or 2 decimals when it's a cent or more.
  - **U-17 dropped:** every other amount already follows these rules, so one shared formatter would only tidy code without changing anything visible.

---

## 7. Order of work

1. **Defects:** all fixed.
2. **Q-01 and Q-02 answered** (24 Nov 2026). U-17 dropped; the one break of the rule (gas fee dollars) is fixed.
3. **Hygiene, pixel-safe:** U-19 first (removes the crash pattern), then U-03, U-13, U-12, U-14, U-16, U-08, U-11 and U-20. Compare screenshots before and after each.
4. **Guardrails:** a CI check for undefined `var(--…)` tokens, `alert(`, and clickable non-buttons without `pressable()` (the parser scan from U-22). Don't lint against style variation; section 5 shows why.
