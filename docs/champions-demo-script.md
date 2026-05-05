# Copilot Champions Demo — Custom Instructions & Custom Skills

**Audience:** Copilot champions (already comfortable with chat, autocomplete, agent mode)
**Focus:** Two mechanisms only — **custom instructions** and **custom skills**
**Repo:** PayFlow Network (this workspace)
**Length:** ~15 minutes + Q&A

---

## One-line thesis

> *"Custom instructions teach Copilot your rules. Custom skills teach Copilot your workflows. Both turn a generic assistant into a teammate that knows your codebase."*

---

## Pre-flight (do 5 min before)

- [ ] `npm run dev` running — API on :3000, frontend on :5137
- [ ] VS Code zoom up 2–3 steps for the back row
- [ ] Chat panel docked right, in **Agent mode**
- [ ] Browser tabs: <http://localhost:5137>, <http://localhost:3000/api-docs>
- [ ] `git status` clean (you'll be making throwaway changes)
- [ ] One warm-up prompt sent so the first live response isn't cold
- [ ] Notifications muted

---

## Demo arc

| # | Beat | Time |
|---|---|---|
| 1 | The problem — generic Copilot | 2 min |
| 2 | Custom instructions — always-on guardrails | 8 min |
| 3 | Custom skills — model-invoked workflows | 6 min |
| 4 | When to use which | 2 min |

---

## 1. The problem (2 min)

**Talking point:** *"Out of the box, Copilot writes generic code. In a payments system, generic is a liability."*

### Move
1. Open [api/src/routes/transaction.ts](../api/src/routes/transaction.ts).
2. In chat (**Ask** mode, no instructions loaded), type:
   > *Add a POST endpoint that creates a transaction.*
3. Read the response and call out what's wrong:
   - Spreads `req.body` directly → mass-assignment risk
   - Trusts a client-supplied `riskScore`
   - Treats `amount` as a float instead of integer minor units
   - No test, no `resetTransactions()` pattern

> *"Reasonable Express. Also a security incident."*

---

## 2. Custom instructions (5 min)

**Talking point:** *"Instructions are dial-tone. Always on, no slash command, no `@`-mention. Copilot reads them on every turn."*

### 2a. Repo-wide lore — `copilot-instructions.md`

Open [.github/copilot-instructions.md](../.github/copilot-instructions.md). Scroll the **Architecture**, **Domain concepts**, and **Known Pitfalls** sections.

> *"Every chat in this repo gets this injected. Architecture, glossary, the gotcha that amounts are integers in cents. The model now speaks PayFlow."*

### 2b. Path-scoped instructions — `.github/instructions/`

Open the folder. Show the table:

| File | `applyTo` glob | What it adds |
|---|---|---|
| `api.instructions.md` | `api/src/**/*.{ts,js}` | Route, test, naming patterns |
| `reactjs.instructions.md` | `frontend/src/**/*.{tsx,jsx,ts,js}` | react-query, theming |
| `security-and-owasp.instructions.md` | `api/src/**`, `frontend/src/**` | OWASP Top 10 2025 |
| `a11y.instructions.md` | `frontend/src/**` | WCAG 2.2 AA |
| `performance-optimization.instructions.md` | `frontend/src/**` | Core Web Vitals |

> *"These auto-fire based on which file is open. Editing a route? You silently get OWASP and our route conventions. Editing a component? You get a11y and perf instead. No tokens wasted on irrelevant rules."*

### 2c. The payoff — same prompt, different answer

1. Keep [api/src/routes/transaction.ts](../api/src/routes/transaction.ts) open.
2. Switch chat to **Agent** mode.
3. Re-ask the **exact same prompt**:
   > *Add a POST endpoint that creates a transaction.*
4. Highlight the diff vs. Act 1:
   - Allowlist destructuring (no `...req.body`)
   - Server-computed `riskScore`
   - `amount` validated as positive integer
   - vitest spec added with `resetTransactions()` in `beforeEach`

> *"Same prompt. Different answer. The instructions did that — I didn't change a single word."*

### 2d. Switch files, watch the rules swap (90 sec)

**Talking point:** *"Path scoping isn't just about scoping cost — it's about swapping personas."*

1. Close the API tab. Open [frontend/src/components/entity/transaction/Transactions.tsx](../frontend/src/components/entity/transaction/Transactions.tsx).
2. In Agent chat:
   > *Add a "high-risk only" filter toggle to this page.*
3. Call out what shows up that **wasn't** in the API answer:
   - **react-query v3** + `axios` (not `fetch` / `useEffect`+`useState`) → `reactjs.instructions.md`
   - `queryClient.invalidateQueries('transactions')` after mutations → `reactjs.instructions.md`
   - `Intl.NumberFormat` for any amount it touches → `reactjs.instructions.md`
   - `aria-pressed` on the toggle, visible focus ring → `a11y.instructions.md`

> *"Different file. Three different instruction files just swapped in — react conventions, accessibility, security — without me typing a single guideline."*

### 2e. Performance — a standalone prompt (90 sec)

**Talking point:** *"Perf rules are their own discipline. Worth showing on their own prompt so the audience sees Core Web Vitals language come out of nowhere."*

1. Stay in [frontend/src/components/entity/transaction/Transactions.tsx](../frontend/src/components/entity/transaction/Transactions.tsx).
2. Fresh chat. New prompt — **not** a follow-up:
   > *This page will render 10,000 transactions. Make it fast.*
3. Watch the response pull directly from `performance-optimization.instructions.md`:
   - **Virtualize the list** (react-window / react-virtual) — anti-pattern: long DOM, kills LCP
   - **Stable `key={tx.id}`**, never `key={index}` — reconciliation cost, hurts INP
   - **Hoist `Intl.NumberFormat`** out of the row — don't reconstruct per render
   - **Memoize handlers** — no inline arrows in each row, allocation churn → INP
   - **`content-visibility: auto`** on row containers — skip off-screen layout
   - Cite **LCP < 2.5s, INP < 200ms, CLS < 0.1** thresholds explicitly

> *"I never said 'Core Web Vitals.' I never said 'virtualize.' The instruction file did. Same chat, same model — the rules came from the file the moment I opened a `.tsx`."*

### 2f. Tradecraft callouts (30 sec)

- Keep `applyTo` globs **narrow** — every file you match is context cost.
- Write rules as **imperatives**, not prose: *"Always destructure inputs"*, not *"It's a good idea to…"*.
- Repo-wide file = lore. Path-scoped files = standards.

---

## 3. Custom skills (6 min) — the centerpiece

**Talking point:** *"Instructions are passive — they're always there. **Skills** are active — the model picks them up when your intent matches."*

### 3a. Mental model

> *"A prompt file is a slash command **you** type. A skill is a behavior the **model** invokes because your plain-English request matches its description."*

Open [.github/skills/](../.github/skills). Show the three skills installed:

| Skill | Triggers on |
|---|---|
| `payments-security-review` | "review for security", "audit for vulnerabilities", "check for payment risks" |
| `add-entity` | "add a new entity", "create a new resource" |
| `web-design-reviewer` | "review website design", "check the UI", "find layout issues" |

Open [.github/skills/payments-security-review/SKILL.md](../.github/skills/payments-security-review/SKILL.md). Read the front-matter `description` aloud and point at the trigger phrases.

> *"Anyone using natural language hits these. Nothing to memorize."*

### 3b. The `references/` pattern — lazy-loaded depth

Open [.github/skills/payments-security-review/references/](../.github/skills/payments-security-review/references). Walk the four files:

| File | Loaded when |
|---|---|
| `payflow-domain-risks.md` | Always — domain language (D1–D8) |
| `api-threat-catalog.md` | Reviewing `api/src/**` (A1–A10) |
| `frontend-threat-catalog.md` | Reviewing `frontend/src/**` (F1–F8) |
| `review-checklist.md` | Final pass |

> *"`SKILL.md` is the cheap entry point. The big content lives in `references/` and only loads when relevant. The skill itself decides which to pull. That's the modern pattern — keep the trigger lean, fetch depth on demand."*

### 3c. The money shot — API security review

1. Open [api/src/routes/transaction.ts](../api/src/routes/transaction.ts).
2. In Agent chat:
   > *Do a security review of this route.*
3. Narrate what shows up in the tool stream:
   - "It picked **`payments-security-review`** — see the SKILL.md read."
   - "Now it's pulling **`api-threat-catalog.md`** because we're in `api/src/routes/`."
   - "And **`payflow-domain-risks.md`** for our domain language."
4. Findings should call out PayFlow-specific issues, not generic OWASP boilerplate:
   - Missing **idempotency key** on create
   - **`riskScore` must be server-computed**, never client-trusted
   - **Mass assignment** via `req.body` spread
   - **IDOR** on `GET /:id` — no ownership check
   - **`amount` overflow** — integer minor units not validated

> *"This is a senior security engineer who knows your domain language and was triggered by plain English."*

### 3d. The parallel — frontend skill swap (90 sec)

1. Open [frontend/src/components/entity/transaction/Transactions.tsx](../frontend/src/components/entity/transaction/Transactions.tsx).
2. Same prompt:
   > *Do a security review.*
3. Watch it load **`frontend-threat-catalog.md`** instead of the API one. Findings shift to XSS, localStorage tokens, color-only risk indicators.

> *"Same skill. Same trigger phrase. Different references — because the model knows where you are."*

### 3e. (Optional, if time) — second skill

Open the dashboard at <http://localhost:5137>. In chat:
> *Review the website design.*

The **`web-design-reviewer`** skill kicks in, opens the page in Playwright, screenshots desktop + mobile, and returns a prioritized list of layout/responsiveness/a11y issues. Different domain, same pattern — `SKILL.md` + `references/`.

---

## 4. When to use which (2 min)

Pull this on screen:

| Use… | When you need… | Trigger |
|---|---|---|
| **`copilot-instructions.md`** | Project lore everyone needs every turn | Always-on |
| **`.github/instructions/*.instructions.md`** | Standards scoped to a folder (OWASP, a11y) | Auto on `applyTo` glob |
| **`.github/skills/*/SKILL.md`** | A multi-step workflow with bundled knowledge | Model picks based on `description` |

Decision rule:

> *"If it's a **rule** → instruction. If it's a **workflow** → skill. Pick the lowest tier that does the job. Don't write a skill when an instruction file would do."*

---

## Closing line

> *"Copilot ships generic. Your repo ships specific. Custom instructions teach it your rules. Custom skills teach it your workflows. Together — once, committed — and forever."*

---

## Q&A bank

**Q: Won't this blow up our context window?**
A: Instructions yes — that's why path scoping matters. Skills no — only `SKILL.md` loads until the model decides it needs a `references/` file.

**Q: How do I see what fired?**
A: Watch the tool calls in Agent mode — file reads on `instructions/*.md` or `skills/*/SKILL.md` are the receipts. Or ask: *"which instructions are active right now?"*

**Q: Where do skills come from?**
A: Three sources: (1) write your own, (2) `github/awesome-copilot` repo for community ones, (3) workspace-level vs. user-level — commit per-repo for project-specific, drop in your user prompts folder for personal cross-repo.

**Q: How is this different from `.cursorrules` / Claude project instructions?**
A: Same idea, multiple tiers. The win here is **path scoping** for instructions and **lazy `references/`** for skills — both keep token cost down.

**Q: Can a skill call another skill?**
A: Yes — the model chains them based on intent. Useful for "review then fix" flows.

---

## Backup moves (if something breaks)

| If… | Do… |
|---|---|
| Skill doesn't auto-trigger | Manually attach `SKILL.md` as context and re-ask — content still demonstrates the value |
| API down | Show the instruction/skill files in the editor; the artifact itself is the demo |
| Cold model | Send a warm-up prompt; mention this is normal in live demos |
| Audience wants code | Open the `references/*.md` files — they're the real intellectual property |
