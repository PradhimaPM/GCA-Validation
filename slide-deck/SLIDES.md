# Rules Review Workflow — Slide Deck

Everything needed to assemble a Google Slides deck. Each section below is one
slide: use the **Title** as the slide heading, drop in the **Screenshot** (from
`screenshots/`), and paste the **Description** underneath (or into speaker
notes).

Live demo: <https://gca-validation-screen.vercel.app/#/rules-review>

---

## Slide 1 — Rules Review (list)

**Screenshot:** `screenshots/01-rules-list.png`

**URL:** `/#/rules-review`

**What it is**

The landing page for the Rules Review workflow. Reviewers see every rule the
AI Rule Builder has generated and can triage them from here.

**What it does**

- Grid lists every rule with its **Name**, **Review Status**
  (Pending / Approved), **Status** (Active / Inactive), **Conditions**,
  **Included / Excluded Clauses** counts, and **Last Updated** timestamp.
- Review Status renders as a colored tag (blue = Pending, green = Approved);
  Status is plain text so it reads cleanly next to the tag.
- Toolbar supports **Search Rules**, **REVIEW STATUS** filter (Pending or
  Approved), and **STATUS** filter (Active or Inactive).
- Export, Filter and Refresh icon buttons on the right; **Export Package**
  button at top opens a confirmation dialog that reminds the user only Approved
  rules go into the exported package.
- **Edit** icon in the last column opens a rule's detail page.

---

## Slide 2 — Rule detail · Preview mode (default)

**Screenshot:** `screenshots/02-rule-detail-preview.png`

**URL:** `/#/rules-review/1`

**What it is**

The detail page for a single rule. Opens in **Preview** mode so the reviewer
can read the rule before touching anything.

**What it does**

- **Rule header row** on the top of the left card:
  - **Name** — editable text field, pre-filled with the rule name.
  - **Status** — editable Active / Inactive radio.
  - Both fields are always editable regardless of the Preview/Edit toggle
    below; edits are persisted on Save or Save and Approve.
- **Conditions** block with an **EDIT / PREVIEW** segmented toggle on the
  right. In Preview mode the conditions render read-only, grouped by
  Condition Group with AND / OR joins between them.
- **AI Rule Builder** banner directly under the Conditions header, with a
  **View AI Generation Summary** link that opens a full-screen dialog.
- **Included Clauses** and **Excluded Clauses** cards below the Conditions,
  each listing clause numbers and titles. Clicking a clause number opens a
  dialog with its full text.
- **Right pane** shows the currently-selected clause's prescription text and
  a collapsible list of other clauses the rule involves.
- **Footer** on every rule: **Cancel** (discards edits, returns to the list)
  and **Save** / **Save and Approve**. Save persists edits without changing
  status; Save and Approve persists edits and sets the rule to Approved. Both
  buttons are enabled regardless of current status.

---

## Slide 3 — Rule detail · Edit mode

**Screenshot:** `screenshots/03-rule-detail-edit.png`

**URL:** `/#/rules-review/1` → click **EDIT**

**What it is**

Same page, same rule — only the Conditions block flips to an inline editor.
No dialog, no new tab, no multi-step wizard: the surrounding header, right
pane, and footer all stay in place.

**What it does**

- **Match** radio at the top of the conditions block picks All (AND) vs
  Any (OR) for top-level conditions.
- Each **Condition Group** is a card with its own Match radio, then rows of
  **Clause Data / Operator / Value** dropdowns. The ✕ at the end of each row
  removes that condition.
- **Add Condition** adds another row inside a group; **Add Condition Group**
  adds another group.
- The Conditions subtitle switches to a reminder: *"Ensure multiple conditions
  of the same clause data type aren't pointing to multiple different values."*
- Edits write straight into the rule state; the dirty flag is set so Save /
  Save and Approve picks them up.
- Clicking **PREVIEW** flips the same section back to the read-only view
  (Slide 2) using the latest edited values.

---

## Slide 4 — AI Generation Summary · Input

**Screenshot:** `screenshots/04-ai-summary-dialog-top.png`

**URL:** `/#/rules-review/1` → click **View AI Generation Summary**

**What it is**

Full-page overlay that explains how the AI drafted the rule. Opens over the
rule detail; **Back To Edit** or **CLOSE** dismisses it.

**What it does — Input section**

- Prescription text from every clause the rule includes, rendered one card
  per clause with the clause number as its header.
- Reviewers use this to compare what the AI was told (the source regulation
  text) against the rule it produced.
- Scrollable: longer rules show more prescription cards without pushing the
  Output section off-screen.

---

## Slide 5 — AI Generation Summary · Output

**Screenshot:** `screenshots/05-ai-summary-dialog-output.png`

**URL:** same dialog, scrolled down

**What it is**

The AI's output next to its input, so the reviewer can judge whether the
rule reflects the source document.

**What it does — Output section**

- **Rule Preview** — the generated conditions in the same read-only shape as
  the main Preview mode, including condition groups with their own AND / OR
  join.
- **Warning banner** (amber) appears automatically if any condition uses a
  clause data type that isn't in the system's predefined list, flagging it
  for the reviewer to fix before approving.
- **Included Clauses** and **Excluded Clauses** sections with count badges
  and clause number + title for each. Empty lists show a blue info banner
  ("No clauses included." / "No clauses excluded.").
- **CLOSE** button bottom-left returns the reviewer to the rule detail.

---

## Deployment & links

- **Repo:** `github.com/PradhimaPM/GCA-Validation-screen`
- **Live Vercel deployment (list):**
  <https://gca-validation-screen.vercel.app/#/rules-review>
- **Live Vercel deployment (rule detail):**
  <https://gca-validation-screen.vercel.app/#/rules-review/1>

Changes land on Vercel automatically on push to `main`.

---

## Instructions for building the Google Slides deck

1. Open the `screenshots/` folder in Finder.
2. Create a new Google Slides deck.
3. For each slide in this doc:
   - Add a new slide with the **Title** as the headline.
   - Drag the matching screenshot in from Finder — Slides will scale it to fit.
   - Paste the Description text underneath (or into speaker notes).
4. Add a title slide at the front (e.g., "Rules Review Workflow — October 2026")
   and a closing slide pointing at the Vercel link.
