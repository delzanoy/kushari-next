# What we achieved — 23 Nov 2026

Three pull requests went into `main`, and `v2` (the deploy branch) was fast-forwarded to match each time. A deploy from `v2` now includes everything below.

| PR | What | Files |
|---|---|---|
| [#2](https://github.com/delzanoy/kushari-next/pull/2) | The remaining visible defects from the UI audit: U-21, U-18, U-22, U-09 | 27 |
| [#3](https://github.com/delzanoy/kushari-next/pull/3) | Shared helpers (U-19), consistent icons and labels, quieter scrollbars | 20 |
| [#4](https://github.com/delzanoy/kushari-next/pull/4) | Unclassified filter, no "Payroll" default, filter and Network alignment fixes | 5 |

At the end of the day only `main` and `v2` remain; the merged working branches were deleted locally and on GitHub.

---

## 1. Visible defects fixed (PR #2)

**Every visible defect in the audit is now fixed.**

- **U-21: Invite member dialog.**
  - Settings' Invite dialog now opens through the shared Modal, at the small width.
  - It uses the same surface colour as Settings. The Settings dialog shrinking and blurring behind it already shows it's on top.
  - Empty and invalid emails show proper field errors: "Enter the email address of the person you're inviting" and "Enter a full email address, like name@company.com".
- **U-18: Page position.**
  - The main column reserves scrollbar space on both sides.
  - The page title now sits at the same x (332px at 1440 wide) on short and long pages, matching the design.
- **U-22: Keyboard access.**
  - 30 clickable rows and cards can now be reached with Tab and opened with Enter or Space, with no layout change.
  - One cyan focus ring is used across the app.
  - Buttons that only appeared on hover now also appear on keyboard focus.
  - The Send Tokens CSV upload can be reached by keyboard.
- **U-09: Tooltips.**
  - Network icons no longer show two tooltips at once.
  - Row date tooltips use the shared Tooltip.
  - A redundant tooltip on Send Tokens' Remove button is gone.

## 2. Code hygiene and consistency (PR #3)

**U-19: shared helpers.** No visible change; checked with a render fingerprint.
- `walletIcon()` replaces 11 copies of the wallet-icon code.
- `presetForName()` replaces 5 copies of the avatar colour logic, the pattern behind the earlier Create Vault crash.
- One set of proposal tab labels replaces the two duplicates.

**Icons, one set everywhere:**
- **Transaction types:** sent ↗ `arrow-right-up-long-fill`, received ↙ `arrow-left-down-long-fill`, interacted ⤢ `expand-diagonal-fill`. Used in rows and in the Type filter.
- **Send buttons** keep the paper plane.
- **Filters:**
  - Gnosis Safes show the Gnosis Safe logo, as on the Wallets page.
  - The Proposals filter's first-level fields have icons, and its wallet and network options show their icons.
  - The Network field uses `network-line`, and each network shows its own chain logo.
  - The Classification field uses `shapes-line`. Classification names have no icon.
- **Send Tokens:** the price-tag icon is gone from the classification picker.

**Wording:** "Network" replaces "Blockchain" in every visible label and in the CSV export header.

**Scrollbars:** every scrollbar now uses the thin, subtle style from the dropdowns.

## 3. Classification and filter polish (PR #4)

- **Review proposal: Network row aligned.** It now lines up with Source wallet and Recipients. A hidden 24px text line inside the network icon was pushing it down.
- **Review proposal: no fake "Payroll".** A proposal with no classification used to show "Payroll". It now shows the same empty "⊕ Select" chip as the list row.
- **"Unclassified" filter option** on Transactions and Proposals:
  - It appears only when unclassified items exist.
  - It's pinned first, with a divider, a dashed icon matching the empty chip, and a count.
- **Filter first level is consistent:**
  - A field with selections uses the same teal background as a selected option.
  - It no longer gets its own grey background, and it stays reachable by keyboard.

---

## How changes were checked

- **In the browser:** every change was checked at 1440×900 with measurements, screenshots, or both.
- **Hygiene changes:** checked with a render fingerprint, which records every element's position and 25 computed styles before and after. A change only passed if every screen compared identical.
- **Not in the live data:** the API has no unclassified transactions or proposals right now. The empty-classification states were checked with temporarily blanked data, which was then reverted.

## Still open

From the audit ([docs/kushari-ui-consistency-audit.md](docs/kushari-ui-consistency-audit.md)):
- **Q-01 and Q-02 answered (24 Nov):**
  - **Q-01:** no thousands separators in table amounts. It's intended, so the dollar value pairs with the token amount under it.
  - **Q-02:** token prices stay as precise as possible; dollar amounts go to 2 decimals at most.
  - This unblocks **U-17**, a single money formatter that follows these rules.
- **Hygiene, no visible change:**
  - U-03 raw colours
  - U-08 raw buttons
  - U-11 raw inputs
  - U-12 radii
  - U-13 shadows
  - U-14 z-index
  - U-16 motion timings
  - U-20 two sidebar components

Smaller things noticed along the way:
- **Send Tokens avatars:** they use their own colour list instead of `presetForName`, so a person's avatar colour can differ from other screens.
- **CSV export wording:** it says "Outgoing / Incoming / Swap", where the app says "Sent / Received / Interacted".
- **Duplicate icon:** there are two `GnosisSafeIcon` components.
- **Add Address errors:** they still show raw error text.
- **Filter "×" clear icon:** it can't be reached by keyboard.
