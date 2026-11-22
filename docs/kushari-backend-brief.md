# Kushari — Backend & Demo Data Brief

**Written:** 21 Nov 2026 · **For:** the Kushari demo-data / API repo · **Companion to:** [kushari-design-review.md](kushari-design-review.md)

> **For the Claude project picking this up:** this brief covers the findings from the design review that the API and its demo data have to fix. Findings have IDs (`B-01`…), and each one names the review finding it serves (`K-xx`). Everything under "Verified" was checked against the live API on 21 Nov 2026; the rest comes from the review.

---

## 1. Context

**How the two repos fit together:**
- **Frontend:** `kushari-next` (Next.js). It reads one env var, `NEXT_PUBLIC_BASE_URL`, and calls the API with plain `GET`s through SWR (`src/app/hooks/useData.ts`) and server fetches (`src/app/api/server-data.ts`). It caches responses for 5 minutes.
- **Backend:** this repo. It serves all the demo data: people, wallets, policies, proposals, transactions, addresses and prices.
- **The API is read-only.** Nothing the user does (approving, creating a vault, adding an address) is sent back to it. The frontend keeps those changes in a client-side cache (`src/app/api/mock-cache.ts`), and user-created wallets get IDs from 30000 up.

**Which frontend branch matters:** the live app the review covered runs the **`v2`** branch, not `main`. The branches have diverged (21 commits only on `v2`, 66 only on `main`). Any change to the API contract has to be checked against `v2`.

**Why the data matters so much:** the portfolio case study will be a grid of short clips captured automatically from the running app (review section 7). Whatever the API returns ends up on screen in those clips, so the data must be **believable, consistent and identical on every load**.

---

## 2. What the API serves today

| Endpoint | Returns | Notes |
|---|---|---|
| `GET /wallets` | 6 wallets | `id, name, type, address, blockchain, balance, members, threshold, proposals, transactions` |
| `GET /wallet/:id` | 1 wallet | Adds the policy: `transactionLimit`, `blockedAssets`, and members with roles |
| `GET /proposals` | 56 proposals | No approvals, note, source address or fee (see B-04) |
| `GET /transactions` | `{ transactions, transactionsCount }`, 88 total | Has `initiator` and `executer` |
| `GET /assets` | 28 rows | One row per token **per wallet** (feeds K-09) |
| `GET /addresses` | 30 contacts | `name, walletHash, groups, verified, created, lastInteracted` |
| `GET /groups` | 5 groups | |
| `GET /members` | 19 people | `isCurrentUser` marks the admin |
| `GET /workspaces` | 6 workspaces | |
| `GET /cryptocurrencies` | 500 coins | A CoinMarketCap-style dump with live-looking quotes |

**Wallet types:** `1` = MPC vault, `2` = Gnosis Safe, `3` = tracked wallet.

**Two status vocabularies are in use.** `/proposals` uses `action_required, no_action, actioned, ready, executing, awaiting_nonce, failed, declined, failed_rejected`. The proposals inside `/wallet/:id` also use **`needs_approval`**, which the frontend doesn't recognise and quietly shows as "No action".

---

## 3. Findings

### 3.1 People

#### B-01 🔴 Real public figures throughout the data → K-02
- **Verified:** `/members` lists 16 named people, and nearly all are real: Vitalik Buterin, Elon Musk, Donald Trump, Robert Kiyosaki, Brian Armstrong, John McAfee, Tim Draper, Anthony Pompliano and others. `/addresses` also has "Vladmir Putin", twice. Transactions name John McAfee as executor.
- **Fix:** replace them with an invented cast that has believable roles (section 4). Keep **Delanoy Kunil (You)** as member `1`, the admin.
- **Done when:** no real public figure appears in any endpoint.

### 3.2 Address book

#### B-02 🔴 Contacts share two addresses, and no recipient is saved → K-03, K-04
- **Verified:**
  - The 30 contacts have only **2 distinct** `walletHash` values between them.
  - "Delanoy Kunil" and "Vladmir Putin" each appear twice.
  - **0 of 33** single-recipient proposals send to an address in the address book. That's why hex fills the Proposals and Transactions tables.
- **Fix:**
  - Give every contact its own valid address for its chain.
  - Make about 80% of proposal and transaction counterparties saved contacts. Leave a few unknown on purpose, for the "Unknown address — add to address book?" moment (M10).
- **Done when:** addresses are unique per contact, and most counterparties resolve to a name.

### 3.3 Proposals

#### B-03 🔴 Proposals ignore their vault's policy → K-26
- **Verified** for vault `1` (Advertising), whose policy is a 3-approval threshold, a $5,000 limit and 3 blocked assets:
  - **12 of 30** proposals are over the $5,000 limit; the largest is about **$6.9M**.
  - Approvals come from member IDs **1–8**. The vault's approvers are only **1, 2, 4 and 6**. Members 5 and 7 are *viewers*, and 3 and 8 aren't vault members at all.
  - The vault has 4 approvers, but the review saw the UI say "3 of 6 approvers", so the UI seems to count every member.
- **Fix:**
  - Only a vault's approvers can approve its proposals.
  - Keep normal proposals within the limit. Make 1 or 2 over-limit proposals on purpose, and mark them (see B-04's `policyCheck`) so the UI can show the policy check (M9).
  - No proposal should send a blocked asset.
- **Done when:** every proposal is valid under its vault's policy, except the deliberate over-limit cases, which are flagged.

#### B-04 🔴 Proposals are missing the fields the review screen needs → K-22, K-25
- **Verified:** the union of all proposal fields is `approvals, blockchain, classification, id, initiator, initiatorColour, moreThan3, multiRecipient, outTokenSymbol, outTokens, outUSDPrice, recipients, status, timestamp, titleTransaction, wallet, walletId, walletType`. There's **no note, source address, network fee or required-approval count**, and `/proposals` doesn't include `approvals` at all.
- **That's why the modal is hardcoded:** on `v2`, `ReviewProposalModal.tsx` fills the gaps with fixed values ("Payroll for the month of Feb.", "Gas 0.0000000041 Eth", a fixed recipient and source address).
- **Fix:** add the fields to every proposal, in both `/proposals` and `/wallet/:id` (section 5). The frontend then binds the modal to them (K-22, a frontend task).
- **Done when:** the review modal can be built entirely from a proposal's own data.

#### B-05 🟡 Statuses mix states, and "ready" isn't ready → K-23, K-24, K-25
- **Verified:** across `/proposals`, 30 of 56 are in a ready-to-execute state (`awaiting_nonce` 14, `executing` 10, `ready` 3, `failed` 3), and only 3 of those are actually `ready`.
- **The review saw:** ready items with 0 approvals; "failed" with no reason; counts that disagree (a tab badge of 6 against a list of 30).
- **Fix:**
  - Use **one status vocabulary** in every endpoint, and drop `needs_approval` or map it.
  - Derive the status from the approvals: a proposal is ready only when its approvals reach its `requiredApprovals`.
  - Give every `failed` proposal a `failureReason` (e.g. "Insufficient gas").
  - Rebalance the set so it tells the story: mostly proposals waiting on approvals, a few ready to send, one or two failed with a reason, a few discarded.
- **Done when:** every status agrees with its approval count, and every count the UI shows can be computed from the data.

### 3.4 Assets, chains and prices

#### B-06 🔴 Assets don't match their chains, and some values are $0 → K-03
- **Verified:**
  - Proposals send **DOT, FIL and SOL on Polygon**, **GRAM on Ethereum** and **ZEC on BSC**.
  - **6 proposals have no `outTokenSymbol`.**
  - **8 proposals have no USD value** (no price), and the largest proposal is worth about **$7.2M**.
- **From the review:** ETH 1,562.83 is shown as worth $1,537.98 (ETH at about $1). The Funding tracked wallet ($224M) dwarfs all the vaults.
- **Fix:**
  - Only use assets that exist on the chain: native tokens plus major stablecoins (ETH, USDC, USDT, DAI on Ethereum; MATIC/POL, USDC on Polygon; BNB, USDT on BSC; SOL, USDC on Solana).
  - Give every movement a symbol and a price.
  - Size balances for a mid-size team treasury, for example $50k–$2M per vault, with the tracked wallets in the same range.
- **Done when:** every asset is valid on its chain, every amount has a value, and values add up.

#### B-07 🟡 Prices are live, so the data changes between loads → section 7 of the review
- **Verified:** `/cryptocurrencies` returns a 500-coin market dump with `last_updated` quotes.
- **Fix:** freeze prices in the seed. Only the 15–20 assets the demo uses are needed, each with a fixed price and a fixed 24h change.
- **Done when:** two loads a day apart return identical responses.

### 3.5 Content

#### B-08 🟡 Notes and classifications don't match → K-03, K-05
- **From the review:** the note "Payroll for Feb" sits on proposals classified as Customer Refund, Travel Expenses and Community Grants.
- **Fix:** give each proposal its own short `note` that fits its classification and amount, e.g. "Q4 contractor payout — design" under Payroll.

#### B-09 🟢 "Interacted" is unexplained → review open question
- **Fix:** decide what this transaction type means, likely a contract interaction, and give it a clearer label in the data, e.g. `contract_call` with the contract's name.

#### B-10 🟢 Small data hygiene
- **Verified:** a wallet is named `marketing` in lower case.
- **Fix:** title-case the wallet names.

---

## 4. The seed dataset

Write the demo data as **one seed file** that every endpoint is generated from, so it can't contradict itself.

**Cast (invented):** about 8 people with roles.
- **Delanoy Kunil** (You) — admin and approver
- A finance lead, an ops manager, two more approvers, a viewer from accounting, and an external contractor.
- Keep the masked-email invitees (`d•••@kushari.com`) for the Members tab if the UI needs them.

**Wallets:**
- **3 MPC vaults:** Operations, Payroll and Grants, each with its own policy. Make at least one policy "2 of 3" and one "3 of 5", so policies visibly differ.
- **1 Gnosis Safe** and **2 tracked wallets**.
- **1 deliberately empty vault**, for the empty state (K-10).

**Address book:** about 20 contacts with unique addresses, sorted into groups (Contractors, Vendors, Exchanges, Grantees).

**Proposals:** about 25–30, spread across the statuses as in B-05.
- Each one's approvals come from its vault's approvers.
- 1–2 are deliberately over the limit, for M9.
- 1–2 go to unknown addresses, for M10.
- At least one is **one approval short of its threshold and waiting on Delanoy**, for the hero tile M1 ("Signature lands").

**Transactions:** about 40–60 completed ones that are consistent with the proposals. Executed proposals should appear here, with the same IDs and hashes.

**Validation:** include a script in this repo that checks the seed against the rules in this brief (assets valid per chain, approvers belong to the vault, statuses match approvals, addresses unique, no zero-value amounts, every counterparty resolves or is flagged unknown). Run it in CI.

---

## 5. Proposed contract changes

Additive changes, so the current frontend keeps working while it's updated.

**Proposal** — added fields:
```jsonc
{
  "note": "Q4 contractor payout — design",
  "sourceAddress": "0x…",                // the vault's address
  "recipientName": "Northwind Studio",   // null when unknown
  "fee": { "amount": 0.00042, "symbol": "ETH", "usd": 1.12 },  // native token of the chain
  "requiredApprovals": 3,
  "approvals": [                          // in /proposals too, not only /wallet/:id
    { "approverId": 1, "state": "approved", "at": 1785433221000, "method": "2fa" },
    { "approverId": 2, "state": "pending" },
    { "approverId": 4, "state": "rejected", "reason": "Wrong invoice" }
  ],
  "policyCheck": { "withinLimit": false, "limitUSD": 5000, "action": "needs_admin_override" },
  "failureReason": null,                 // set when status is failed
  "txHash": null                          // set once executed
}
```

**Wallet** — make the policy explicit, so the UI doesn't have to infer it:
```jsonc
"policy": {
  "approverIds": [1, 2, 4, 6],
  "requiredApprovals": 3,
  "transactionLimitUSD": 5000,
  "allowedChains": ["Ethereum", "Polygon"],
  "blockedAssetIds": [3897, 2280, 6535]
}
```

**Counts:** either add `GET /proposals/summary` (counts per tab and "waiting on you"), or guarantee the counts can be derived from `/proposals`. One source either way (K-25).

**Assets:** optionally add `GET /assets?groupBy=token` that returns one row per token with its wallets nested, for K-09.

**Status vocabulary:** one list across all endpoints. The review suggests user-facing labels ("Waiting on you", "Ready to send", "Sending…"); those are frontend copy, but the data should carry the state that drives them.

---

## 6. Determinism for automated capture

- **Fixed "now":** store timestamps relative to a fixed demo date, or serve a `demoNow` value the frontend uses. Either way, "2 hours ago" must read the same in every capture.
- **Frozen prices:** see B-07.
- **Stable IDs and hashes:** generated once and committed, never random at request time.
- **No cold-start surprises:** the review recommends running the frontend locally for capture. The API should also run locally (or be warm) so captures aren't timed against a cold start.
- **Version the seed:** a `seedVersion` field in responses makes it obvious which dataset a capture used.

---

## 7. Order of work

1. **Cast and address book:** B-01, B-02, B-10.
2. **Assets and prices:** B-06, B-07.
3. **Policies and proposals:** B-03, B-05, B-08.
4. **Contract additions:** B-04 and section 5, coordinated with the `v2` frontend (K-22, K-23, K-25).
5. **Determinism:** section 6, then the validation script.

---

## 8. Open questions for Delanoy

- **Over-limit transfers:** blocked, routed to more approvers, or need an admin override? This sets the `policyCheck.action` values and M9.
- **Writes:** keep the API read-only with the frontend holding user actions in its client cache, or add demo write endpoints (approve, reject, execute) with a reset? Read-only is simpler and keeps every load identical, which suits capture.
- **"Interacted":** what does this transaction type mean (B-09)?
- **Frontend branch:** is `v2` the branch going forward? If so, contract changes should be tested against it, and `main` may need retiring.
