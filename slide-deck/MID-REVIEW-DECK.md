# Mid-Review Deck — Pradhima PM

A ready-to-assemble slide deck covering onboarding, the GCA Validation project,
and every piece of work I shipped. Each section below is one slide: use the
**Title** as the slide heading, drop in the suggested **Visual** (from
`screenshots/` or a chart you add in Slides), and paste the **Content** underneath
or into speaker notes.

Live demo: <https://gca-validation-screen.vercel.app/>

> **How to use this file**
> 1. Open the `screenshots/` folder in Finder.
> 2. Create a new Google Slides deck (or Keynote / PowerPoint).
> 3. For each slide below, copy the Title → Content → attach the Visual.
> 4. Fill in the `[PLACEHOLDER]` fields with your personal details before presenting.

---

## Slide 1 — Title

**Visual:** Simple cover with Appian logo (optional) + role tagline

**Content**

- **Mid-Review**
- Pradhima PM
- Role: [PLACEHOLDER — e.g., Associate UX Designer / Product Designer]
- Review period: [PLACEHOLDER — e.g., August 2026 – October 2026]
- Team / Project: GCA Validation

---

## Slide 2 — About Me

**Visual:** Your photo + a short "at a glance" column

**Content**

- Joined Appian in [PLACEHOLDER — Month, Year]
- Background: [PLACEHOLDER — 1 line on prior education / internships]
- Core focus this cycle: designing and prototyping the clause-governance
  workflows for GCA Validation
- Tooling I ramped up on: Figma, Appian SAIL / Sailwind, Kiro IDE, React + TypeScript,
  Vercel, Git / GitHub

---

## Slide 3 — Agenda

**Visual:** 5-point numbered list (plain text slide)

**Content**

1. Onboarding — what I learned in my first weeks
2. The GCA Validation project — what we're solving
3. What I shipped — pages, features, polish
4. How I worked — skills, tools, collaboration
5. Reflections and what's next

---

## Slide 4 — Onboarding Overview

**Visual:** A simple timeline or icon row

**Content**
August :

- **Week 1–2 · Appian fundamentals**
  - Appian platform orientation, SAIL design language, record types,
    expression rules, process models
  - [PLACEHOLDER — any formal courses or certifications you took]

- **Week 3–4 · Design system & tooling**
  - Sailwind component library (SAIL-styled React components)
  - Kiro IDE and the AI-assisted design-to-prototype workflow
  - Git, pnpm, Vercel deployments

- **Week 4+ · Domain ramp-up**
  - FAR / DFARS clauses and prescriptions (the regulatory text the product
    governs)
  - How contracting officers assemble clause sets today, and the pain points
    the GCA Validation product targets

---

## Slide 5 — Onboarding Highlights

**Visual:** Three callout cards

**Content**

- **First meaningful contribution:** [PLACEHOLDER — e.g., first page shipped,
  first design review, first merged PR]
- **Biggest learning curve:** [PLACEHOLDER — e.g., SAIL enum conventions,
  working inside a design-system, giving/receiving design feedback]
- **What clicked fastest:** [PLACEHOLDER — e.g., Sailwind components,
  Figma-to-prototype flow, Kiro skills]

---

## Slide 6 — About the GCA Validation Project

**Visual:** Simple diagram — "Clauses → Rules → Clause Set → Review → Export"

**Content**

- **GCA = Government Contract Automation.** The platform helps contracting
  teams build and validate clause sets (FAR / DFARS and agency-specific
  regulations) that go into solicitations and contracts.
- **The validation problem:**
  - Thousands of regulatory clauses, many with conditional prescriptions
  - Rules decide which clauses go into which contract based on acquisition
    details (dollar value, product category, socioeconomic status, etc.)
  - Reviewers need to trust the clause set *before* it leaves the system
- **My team's remit:** design the UX for reviewing AI-generated rules,
  managing questions that drive those rules, and auditing clause changes
  over time.

---

## Slide 7 — My Scope at a Glance

**Visual:** Big-number stats row (make four large tiles in Slides)

**Content**

- **7 pages** designed and shipped end-to-end
- **50 commits** on `main` across the review period
- **4 feature areas:** Rules, Rules Review, Questions, Clause History
- **~10 weeks** of focused design and prototyping work

Design artefacts produced: Figma mocks, interactive React prototype on
Vercel, user-flow walkthroughs for stakeholders.

---

## Slide 8 — Timeline of Work

**Visual:** Horizontal timeline, one row per month

**Content**

- **Aug 2026 — Ramp-up**
  - Onboarding, Appian training, pairing with Arun on the first *Validate
    Clause Set* popup variants
- **Sep 2026 — Context + first mocks**
  - Explored validate-clause-set option variants, learned SAIL / Sailwind
    patterns, began Figma work on Rules
- **Oct 5 — First page shipped**
  - *Rules* grid: searchable, sortable list of conditional rules
- **Oct 9–12 — Rules Review workflow**
  - Full approval lifecycle, inline edit, Change Decision, Export Package
- **Oct 12–13 — Questions tab**
  - Landing page with 3 import options, Questions grid, Review flow
- **Oct 14–16 — AI Generation Summary + polish**
  - Full-page AI summary dialog, inline Edit/Preview, final polish round

---

## Slide 9 — Validate Clause Set (collaboration with Arun)

**Visual:** `screenshots/[NEW] validate-clause-set.png` *(capture from
`/#/validate-clause-set` or any of the option variants)*

**Content**

- My first exposure to the product: paired with Arun on the five
  *Validate Clause Set* popup variants
- Variants explored: Option 1 (compliance / updates / errors stacked),
  Option 2 (tabbed), Options 3–4 (clause alternates + tooltips),
  Option 5 (column-per-action layout), and the Empty States variant
- Role: review, feedback, and support on the SAIL layout work; this is
  where I learned the Sailwind component vocabulary that powered the
  rest of my work

---

## Slide 10 — Rules Page (my first solo shipment)

**Visual:** `screenshots/[NEW] rules-page.png` *(capture from `/#/rules`)*

**URL:** `/#/rules`

**What it is**

The entry point into the rules library. Shows every conditional rule the
system knows about, independent of review status.

**What it does**

- Searchable, sortable grid of rules
- Columns: Rule Name, Conditions, Included Clauses, Excluded Clauses,
  Status (Active / Draft), Last Updated
- Site navigation shell matching the Clause Sets / Clauses / Templates /
  Questionnaires / Rules IA that engineering was building toward
- Loads data from `src/db/rules.ts` using the project's typed async
  data-layer convention — so the prototype is "transition-ready" for
  real Appian web APIs

**Why it mattered:** this was my first fully-owned page, and it set the
visual pattern (grid + search + status tag) that the Rules Review flow
later built on.

---

## Slide 10.5 — Rules Review Workflow (feature spotlight)

**Visual:** Flow diagram:

> `Rules Review list → Rule detail (Preview) → Edit Conditions (inline) → AI Generation Summary → Save & Approve → Export Package`

**Content**

The flagship feature of my mid-review cycle. Lets a reviewer triage every
AI-generated rule before it ships into a clause set — read, edit,
cross-check against the source regulation, approve, and export.

The next five slides walk through each stage.

---

## Slide 11 — Rules Review (list)

**Visual:** `screenshots/01-rules-list.png`

**URL:** `/#/rules-review`

**What it is**

The landing page for the Rules Review workflow. Reviewers see every rule
the AI Rule Builder has generated and can triage them from here.

**What it does**

- Grid lists every rule with its Name, Review Status (Pending / Approved),
  Status (Active / Inactive), Conditions, Included / Excluded Clauses
  counts, and Last Updated timestamp
- Review Status renders as a colored tag; Status is plain text so it reads
  cleanly next to the tag
- Toolbar: **Search Rules**, **REVIEW STATUS** filter, **STATUS** filter
- **Export Package** button opens a confirmation dialog reminding the user
  only Approved rules go into the exported package
- **Edit** icon in the last column opens a rule's detail page

---

## Slide 12 — Rule detail · Preview mode (default)

**Visual:** `screenshots/02-rule-detail-preview.png`

**URL:** `/#/rules-review/1`

**What it is**

The detail page for a single rule. Opens in **Preview** so the reviewer
can read the rule before touching anything.

**What it does**

- **Rule header row:** editable Name field + Active / Inactive radio
  (always editable, independent of the Preview / Edit toggle below)
- **Conditions block** with an EDIT / PREVIEW segmented toggle — Preview
  renders conditions read-only, grouped with AND / OR joins
- **AI Rule Builder banner** with a *View AI Generation Summary* link
- **Included / Excluded Clauses** cards — click a clause number to open
  its full text in a dialog
- **Right pane** shows the selected clause's prescription text
- **Footer:** Cancel · Save · Save and Approve

---

## Slide 13 — Rule detail · Edit mode

**Visual:** `screenshots/03-rule-detail-edit.png`

**URL:** `/#/rules-review/1` → click **EDIT**

**What it is**

Same page, same rule — the Conditions block flips to an inline editor.
No dialog, no new tab: everything else stays in place.

**What it does**

- **Match** radio (All / Any) at the top for top-level conditions
- **Condition Groups** as cards, each with its own Match + rows of
  Clause Data / Operator / Value dropdowns
- Add Condition / Add Condition Group buttons
- Clicking **PREVIEW** flips the same section back to read-only using
  the edited values — no save round-trip required
- Design choice: moving from a modal dialog to inline editing was the
  single biggest UX win in this flow — reviewers never lose context

---

## Slide 14 — AI Generation Summary · Input

**Visual:** `screenshots/04-ai-summary-dialog-top.png`

**URL:** `/#/rules-review/1` → click **View AI Generation Summary**

**What it is**

Full-page overlay that explains how the AI drafted the rule, so the
reviewer can judge whether the rule reflects the source regulation.

**What it does — Input section**

- Shows the prescription text from every clause the rule includes
- One card per clause, with the clause number as the header
- Scrollable: longer rules show more prescription cards without pushing
  the Output section off-screen
- Reviewers use this to compare what the AI was told against the rule it
  produced

---

## Slide 15 — AI Generation Summary · Output

**Visual:** `screenshots/05-ai-summary-dialog-output.png`

**URL:** same dialog, scrolled down

**What it does — Output section**

- **Rule Preview** — generated conditions in the same read-only shape as
  the Preview mode, with condition groups and AND / OR joins
- **Warning banner** (amber) appears automatically if any condition uses
  a clause data type outside the predefined list, flagging it for the
  reviewer to fix before approving
- **Included / Excluded Clauses** sections with count badges; empty lists
  show an info banner
- Closes back to the rule detail

---

## Slide 16 — Questions Landing (3-tab exploration)

**Visual:** `screenshots/[NEW] questions-landing.png` *(capture from
`/#/questions-landing`)*

**URL:** `/#/questions-landing`

**What it is**

First-time landing for the Questions tab. Shows design-exploration
tabs for three ways to onboard a user who has no questions yet.

**What it does**

- **Tab 1 — Current:** import directly from the system question library
  or upload a spreadsheet (manual)
- **Tab 2 — Primary + link:** a bolder primary CTA with a secondary
  manual-import link underneath
- **Tab 3 — Benefits:** three benefit cards reinforcing *why* a user
  should pick system questions (save setup hours · built on best
  practices · fully editable)
- All three tabs widen the container so option boxes fill the content
  area evenly, with equal vertical height for system and manual cards
- The actual production path is Tab 1; Tabs 2 and 3 were exploratory
  variants the team could pick up later

---

## Slide 17 — Questions Grid

**Visual:** `screenshots/[NEW] questions-grid.png` *(capture from
`/#/questions`)*

**URL:** `/#/questions`

**What it is**

The approved-questions tab after import, with two display variants.

**What it does**

- **Option 1 view** — compact columns: Question · Response Type ·
  Last Modified · Status
- **Option 2 view** — richer rows with a Source subtext, keeping
  Response Type in the right rail
- Toolbar: search, response-type filter, add / import controls
- Approved status rendered as a tag; last-modified timestamps consistent
  with the Rules grid pattern

---

## Slide 18 — Review System Questions

**Visual:** `screenshots/[NEW] questions-review.png` *(capture from
`/#/questions-review`)*

**URL:** `/#/questions-review`

**What it is**

Approval surface for the imported system questions before they land in
the Questions tab.

**What it does**

- Streamlined review grid: shows each incoming question with its
  response type and source
- Approve / Reject actions per row, aligned with the Rules Review icon
  conventions
- Removed the top banners that cluttered the original design — reviewers
  go straight to the grid

---

## Slide 19 — Clause History

**Visual:** `screenshots/[NEW] clause-history.png` *(capture from
`/#/clause-history`)*

**URL:** `/#/clause-history`

**What it is**

Audit log for a single clause — who changed it, when, and what the diff
was.

**What it does**

- Grid of change entries with user, modification summary, and timestamp
- **Three display options** reviewers can switch between:
  - *Option 1 (pop-up):* Show Changes opens a dialog comparing original
    and edited clause text
  - *Option 2 (side pane):* side pane next to the list; the open row is
    shaded for context
  - *Option 3 (inline diff):* same side pane with a single marked-up
    view and a switch for *updated only* vs *original only*
- "Added N Fill-in(s) / Removed N Fill-in(s)" summary line uses
  POSITIVE / NEGATIVE semantic colors from the SAIL palette

---

## Slide 20 — Design decisions I'm proud of

**Visual:** Three stacked callout boxes

**Content**

1. **Inline edit beat the dialog**
   - Original rule-review design opened conditions in a modal
   - Switched to an inline EDIT / PREVIEW toggle; reviewers keep header,
     footer, and right pane visible the whole time
   - Removed ~150 lines of dialog code in the process

2. **Approve-only workflow (then revised back to Accept / Reject)**
   - Simplified footer to Save vs Save-and-Approve
   - Added Change Decision affordance so previously-approved rules can
     be reverted without re-opening the whole page

3. **Export Package as a trust gate**
   - Confirmation dialog explicitly says *only Approved rules go into the
     export* — removes the "did I miss anything?" anxiety reviewers had

---

## Slide 21 — How I worked

**Visual:** Three columns — Design · Prototype · Collaborate

**Content**

- **Design** — Figma for high-fidelity mocks; iterated with [PLACEHOLDER —
  teammate / design lead name] in weekly critiques
- **Prototype** — React + TypeScript + Sailwind in the Kiro IDE; every
  design shipped as an interactive page on Vercel for stakeholder review
- **Collaborate** — Paired with Arun on the Validate Clause Set
  variants; aligned with engineering on data shape via the `src/db/`
  contract so pages stay transition-ready for real Appian APIs

---

## Slide 22 — Tools & skills I levelled up on

**Visual:** Two columns — Tools / Skills

**Content**

**Tools**

- Figma · Sailwind component library · Appian SAIL
- React · TypeScript · Tailwind CSS
- Kiro IDE (skills, hooks, steering)
- Git / GitHub · pnpm · Vercel

**Skills**

- Translating regulatory domain language into clear UI patterns
- Working inside a design system (component names, exact prop values,
  no inline hex)
- Writing and refactoring my own React code — not just handoff
- Running my own prototype deployments and sharing live links

---

## Slide 23 — Feedback I acted on

**Visual:** Simple two-column "Feedback → Change" table

**Content**

| Feedback | What I changed |
|---|---|
| "Preview and Edit shouldn't be two separate pages" | Collapsed into one page with an EDIT / PREVIEW toggle on the conditions block |
| "The AI summary dialog feels cramped" | Rebuilt it as a full-page overlay, scrollable input, pinned output |
| "Approved rules should still be editable" | Added revert-to-pending via a Change Decision confirmation dialog |
| "Status wording is inconsistent across pages" | Renamed *Approved* to *Accepted* everywhere so it matches the Accept button |
| "Headings are too noisy with counts" | Dropped the count from *Included Clauses (N)* / *Excluded Clauses (N)* headings — tag badges carry that signal already |

---

## Slide 24 — Challenges & learnings

**Visual:** Two columns

**Content**

**Challenges**

- Learning the regulatory domain (FAR / DFARS) deeply enough to design
  for it, not just around it
- Keeping prototype data (`src/db/`) in sync with the Figma mocks so
  reviewers see realistic clause content, not Lorem Ipsum
- Resisting the urge to add more variants once a direction was chosen

**Learnings**

- A design shipped in prototype form gets 10x more useful feedback than
  a static mock
- Small polish passes (status wording, header counts, button placement)
  are a huge share of what makes a design feel finished
- Convention beats cleverness — matching the existing Sailwind patterns
  made every page faster to build than inventing a new one

---

## Slide 25 — What's next

**Visual:** Three forward-looking tiles

**Content**

- **Short-term (next cycle)**
  - [PLACEHOLDER — e.g., Rules Review handoff to engineering, usability
    test with contracting officers]
- **Medium-term**
  - [PLACEHOLDER — e.g., AI Clause Selection flow, Add Suggested Clauses
    integration]
- **Growth goals**
  - [PLACEHOLDER — e.g., lead a feature area end-to-end, mentor the next
    rotation]

---

## Slide 26 — Thank you / Q&A

**Visual:** Clean closing slide with the live demo link

**Content**

- **Live demo:** <https://gca-validation-screen.vercel.app/>
- **Repo:** `github.com/PradhimaPM/GCA-Validation-screen`
- **Highlights to try:**
  - `/#/rules-review` — the full approval flow
  - `/#/rules-review/1` — rule detail + AI summary
  - `/#/questions-landing` — three-tab onboarding exploration
- Questions welcome. Thank you for the review!

---

## Appendix A — Full commit log (50 commits)

Use this as backup material if someone wants to see the week-by-week work.

**Oct 16, 2026**

- Rule review: drop count from Included / Excluded Clauses headings
- Rule review: use "Prescription Text" as the right-pane heading
- Rules: cap each rule at one included or one excluded clause
- Rule review: either included or excluded clauses, drop Clauses Involved

**Oct 15, 2026**

- AI Generation Summary: show prescription text from included clauses as Input
- AI Generation Summary: clear Input section pending content
- AI Generation Summary dialog: full-page layout

**Oct 14, 2026**

- Rule review: add AI generation banner, trim conditions subtitle
- Rule review: make Name field always editable
- Rules review: inline edit / preview, approve-only workflow
- Reject rule dialog: separator and Cancel on the left
- Rules review: swap status styling, split filter, widen headings

**Oct 13, 2026**

- Add Active / Inactive status to rules
- Streamline questions review and align rule edit icons
- Reorder Option 1 columns, swap Option 2 subtext to Source, bring back Response Type
- Add Option 1 and Option 2 view tabs to Questions grid
- Increase vertical height and icon size of system / manual cards across options
- Remove max-w constraints so option boxes fill the content area
- Widen all three option containers (max-w-5xl → max-w-6xl)
- Skip questions review flow: import directly, remove top banners, reorder columns
- Use the subtle dashed manual row in Option 2, drop unused solid variant

**Oct 12, 2026**

- Delete stale edit-conditions-dialog.tsx that leaked APPLY into bundle
- Replace Change Decision with always-visible Accept / Reject using disabled logic
- Rename edit dialog Apply button to Save
- Move Edit button to Conditions row as Edit Conditions, open in dialog
- Make Export Package button smaller outline, trim dialog copy
- Add Export Package button and confirmation dialog on rules review grid
- Shrink Edit Rule button, add Edit column header with pencil icon
- Change Edit Rule button to outline style
- Make rule name plain text, add icon column with navigate action
- Replace Preview / Edit toggle with single Edit Rule blue button, remove Back strip
- Move Back to Rules to its own strip, replace Save Draft with Cancel
- Make clause number the clickable link in included / excluded lists, drop View button
- Apply light grey background to Questions shell so white cards stand out
- Polish Option 2 manual row and Option 3 benefit cards
- Add three-tab layout to Questions landing: current, primary + link, benefits

**Oct 9, 2026**

- Right-align sortable column headers so sort buttons honor align=END
- Rename rule status "Approved" to "Accepted" for consistency with Accept button
- Add separator between text and buttons, Cancel on left, no icons
- Restyle Change Decision dialog: icons on buttons, both aligned right
- Add separator lines to Change Decision dialog and move Cancel left
- Replace Revert with Change Decision button and confirmation dialog
- Allow editing and revert-to-pending for approved and rejected rules
- Remove locked-rule banner and row actions column
- Remove Custom rule prefix from Review Rule subtitle
- Make Edit Conditions inline instead of a popup, with editable Name field
- Remove FAR 1.102-3 title line from 52.202-1 prescription
- Show clause number and title in rule-review right pane heading
- Add rules review flow, questions pages, and clause-view dialog with scrollable content

**Oct 5, 2026**

- Add Rules page with searchable, sortable clause rule grid

---

## Appendix B — Screenshot checklist

Rules Review flow (already captured):

- [x] `screenshots/01-rules-list.png`
- [x] `screenshots/02-rule-detail-preview.png`
- [x] `screenshots/03-rule-detail-edit.png`
- [x] `screenshots/04-ai-summary-dialog-top.png`
- [x] `screenshots/05-ai-summary-dialog-output.png`

Still to capture (open each URL on the live site, take a screenshot, drop into `screenshots/`):

- [ ] `validate-clause-set.png` from `/#/validate-clause-set`
- [ ] `rules-page.png` from `/#/rules`
- [ ] `questions-landing.png` from `/#/questions-landing`
- [ ] `questions-grid.png` from `/#/questions`
- [ ] `questions-review.png` from `/#/questions-review`
- [ ] `clause-history.png` from `/#/clause-history`

Tip: Chrome DevTools → three-dot menu → *Run command* → "Capture full size
screenshot" gives you clean PNGs with no browser chrome.
