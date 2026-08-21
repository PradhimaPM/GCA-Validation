/**
 * Clause Update Reviews data layer.
 *
 * Richer model than `clause-reviews.ts`. It exists because a clause update can
 * arrive in more than one form, and those forms become usable at different times:
 *
 *  - "As published"    — synced verbatim from acquisition.gov. When the clause has
 *                        an alternate, the alternate instructions are still sitting
 *                        at the end of the text rather than applied to it.
 *  - "Alternate applied" — the clause text after those instructions have been worked
 *                        into it. This needs policy approval before anyone can use it.
 *
 * So a row can be in one of two shapes:
 *  1. Actionable  — there is a version the user is allowed to move to right now
 *                   (`available*` is populated). Retain vs Update applies.
 *  2. Informational — the set already holds the newest usable version, and the only
 *                   newer thing is still awaiting approval (`pending*` populated,
 *                   `available*` empty). Nothing to decide yet.
 *
 * Unapproved text is never offered as a choice — it is surfaced as status only.
 */

export type ClauseVersionKind = 'original' | 'as-published' | 'alternate-applied'

export interface ClauseVersion {
  label: string
  kind: ClauseVersionKind
  effectiveDate: string
  lastUpdated: string
  text: string
}

export interface ClauseUpdateReview {
  id: number
  clauseNumber: string
  title: string
  /** True when a FAR alternate applies, which is what creates the two-step flow. */
  hasAlternate: boolean
  /** Short plain-language summary of why this row looks the way it does. */
  situation: string
  /** The version currently sitting in the clause set. */
  current: ClauseVersion
  /** The newest approved version the user may move to. Absent when nothing is actionable. */
  available?: ClauseVersion
  /** An alternate cleanup that exists but has not been approved yet. */
  pending?: {
    label: string
    submittedOn: string
    submittedBy: string
    text: string
  }
  /** Set when an interim as-published version was superseded before anyone adopted it. */
  skippedNote?: string
  action?: 'retain' | 'update'
}

const clauseUpdateReviews: ClauseUpdateReview[] = [
  // ── 1. No alternate. Plain one-step update. ────────────────────────────────
  {
    id: 1,
    clauseNumber: '52.203-14',
    title: 'Display of Hotline Poster',
    hasAlternate: false,
    situation: 'A newer version was published. Nothing else is pending.',
    current: {
      label: 'Dec 2007',
      kind: 'original',
      effectiveDate: 'Jun 10, 2026',
      lastUpdated: 'Jun 12, 2026',
      text: 'Display of Hotline Poster (Dec 2007)\n\n(a) Display prominently in common work areas within business segments performing work under this contract and at contract work sites—\n(1) Any agency fraud hotline poster or Department of Homeland Security fraud hotline poster identified in paragraph (b) of this clause; and\n(2) Any DHS fraud hotline poster subsequently identified by the Contracting Officer.\n\n(b) Additionally, if the Contractor maintains a company website as a method of providing information to employees, the Contractor shall display an electronic version of the poster at the website.',
    },
    available: {
      label: 'Sep 2026',
      kind: 'as-published',
      effectiveDate: 'Sep 01, 2026',
      lastUpdated: 'Aug 20, 2026',
      text: 'Display of Hotline Poster (Sep 2026)\n\n(a) Display prominently in all common work areas within business segments performing work under this contract, at contract work sites, and in Contractor-owned facilities—\n(1) Any agency fraud, waste, or abuse hotline poster or Department of Homeland Security fraud hotline poster identified in paragraph (b) of this clause;\n(2) Any DHS or Office of Inspector General fraud hotline poster subsequently identified by the Contracting Officer; and\n(3) The associated QR code or digital equivalent linking to the online reporting portal.\n\n(b) Additionally, if the Contractor maintains a company website or intranet as a method of providing information to employees, the Contractor shall display an electronic version of the poster on the primary landing page of that website.',
    },
  },

  // ── 2. Alternate applies. As-published is usable now; cleanup still in review. ──
  {
    id: 2,
    clauseNumber: '52.222-26',
    title: 'Equal Opportunity',
    hasAlternate: true,
    situation:
      'You can move to the published text now. A version with Alternate I applied is with policy for approval.',
    current: {
      label: 'Sep 2016',
      kind: 'original',
      effectiveDate: 'Jul 21, 2026',
      lastUpdated: 'Jul 17, 2026',
      text: 'Equal Opportunity (Sep 2016)\n\n(a) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, or national origin.\n\n(b) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to their race, color, religion, sex, sexual orientation, gender identity, or national origin.',
    },
    available: {
      label: 'Aug 2026, as published',
      kind: 'as-published',
      effectiveDate: 'Aug 15, 2026',
      lastUpdated: 'Aug 05, 2026',
      text: 'Equal Opportunity (Aug 2026)\n\n(a) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, national origin, or protected veteran status.\n\n(b) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to the characteristics listed in paragraph (a) of this clause.\n\n(c) The Contractor shall post the notice described in 22.805(b) in a conspicuous place.\n\n— — —\nAlternate I (Aug 2026). As prescribed in 22.810(f), substitute the following for paragraph (c) of the basic clause and add paragraph (d).',
    },
    pending: {
      label: 'Aug 2026, Alternate I applied',
      submittedOn: 'Aug 08, 2026',
      submittedBy: 'sarah.chen',
      text: 'Equal Opportunity (Aug 2026) — Alternate I applied\n\n(a) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, national origin, or protected veteran status.\n\n(b) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to the characteristics listed in paragraph (a) of this clause.\n\n(c) The Contractor shall post the notice described in 22.805(b) in a conspicuous place accessible to all employees and applicants, and shall provide an electronic copy on request.\n\n(d) The Contractor shall report any known or suspected violation of this clause to the Contracting Officer within 5 business days of discovery.',
    },
  },

  // ── 3. Set already holds as-published. Cleanup still in review. No action. ──
  {
    id: 3,
    clauseNumber: '52.227-14',
    title: 'Rights in Data—General',
    hasAlternate: true,
    situation:
      'Your set already has the newest usable text. A version with Alternate II applied is with policy for approval.',
    current: {
      label: 'Aug 2026, as published',
      kind: 'as-published',
      effectiveDate: 'Aug 15, 2026',
      lastUpdated: 'Aug 05, 2026',
      text: 'Rights in Data—General (Aug 2026)\n\n(a) Definitions. As used in this clause—"Computer database" or "database" means a collection of recorded information in a form capable of, and for the purpose of, being stored in, processed, and operated on by a computer.\n\n(b) Allocation of rights. Except as provided in paragraph (c) of this clause regarding copyright, the Government shall have unlimited rights in data first produced in the performance of this contract and form, fit, and function data delivered under this contract.\n\n— — —\nAlternate II (Aug 2026). As prescribed in 27.409(b)(2), add the following paragraph (g) to the basic clause.',
    },
    pending: {
      label: 'Aug 2026, Alternate II applied',
      submittedOn: 'Aug 12, 2026',
      submittedBy: 'sarah.chen',
      text: 'Rights in Data—General (Aug 2026) — Alternate II applied\n\n(a) Definitions. As used in this clause—"Computer database" or "database" means a collection of recorded information in a form capable of, and for the purpose of, being stored in, processed, and operated on by a computer.\n\n(b) Allocation of rights. Except as provided in paragraph (c) of this clause regarding copyright, the Government shall have unlimited rights in data first produced in the performance of this contract and form, fit, and function data delivered under this contract.\n\n(g) Limited rights data. The Contractor may withhold limited rights data from delivery, provided it identifies the withheld data to the Contracting Officer within 30 days of award.',
    },
  },

  // ── 4. Set holds as-published. Cleanup now approved. Actionable. ───────────
  {
    id: 4,
    clauseNumber: '52.216-25',
    title: 'Contract Definitization',
    hasAlternate: true,
    situation: 'The version with Alternate I applied is approved and ready to use.',
    current: {
      label: 'Aug 2026, as published',
      kind: 'as-published',
      effectiveDate: 'Aug 01, 2026',
      lastUpdated: 'Jul 28, 2026',
      text: 'Contract Definitization (Aug 2026)\n\n(a) A definitive contract is contemplated. The schedule for definitization consists of the target date for definitization and dates for submission of the Contractor\'s price proposal and beginning of negotiations.\n\n(b) The Contractor agrees to begin promptly negotiating with the Contracting Officer the terms of a definitive contract.\n\n— — —\nAlternate I (Aug 2026). As prescribed in 16.603-4(c)(1), add paragraph (e) to the basic clause.',
    },
    available: {
      label: 'Sep 2026, Alternate I applied',
      kind: 'alternate-applied',
      effectiveDate: 'Sep 01, 2026',
      lastUpdated: 'Aug 22, 2026',
      text: 'Contract Definitization (Sep 2026) — Alternate I applied\n\n(a) A definitive contract is contemplated. The schedule for definitization consists of the target date for definitization and dates for submission of the Contractor\'s price proposal and beginning of negotiations.\n\n(b) The Contractor agrees to begin promptly negotiating with the Contracting Officer the terms of a definitive contract.\n\n(e) If agreement on a definitive contract is not reached by the target date, the Contracting Officer may determine a reasonable price or fee in accordance with subpart 15.4 and part 31, subject to Contractor appeal as provided in the Disputes clause.',
    },
  },

  // ── 5. Set holds the original. Cleanup approved; interim text never adopted. ──
  {
    id: 5,
    clauseNumber: '52.223-6',
    title: 'Drug-Free Workplace',
    hasAlternate: true,
    situation: 'The version with Alternate I applied is approved and ready to use.',
    current: {
      label: 'May 2001',
      kind: 'original',
      effectiveDate: 'May 15, 2026',
      lastUpdated: 'May 10, 2026',
      text: 'Drug-Free Workplace (May 2001)\n\n(a) Definitions. As used in this clause—"Controlled substance" means a controlled substance in schedules I through V of section 202 of the Controlled Substances Act (21 U.S.C. 812).\n\n(b) The Contractor, if other than an individual, shall within 30 days after award publish a statement notifying its employees that the unlawful manufacture, distribution, dispensing, possession, or use of a controlled substance is prohibited in the Contractor\'s workplace.',
    },
    available: {
      label: 'Sep 2026, Alternate I applied',
      kind: 'alternate-applied',
      effectiveDate: 'Sep 01, 2026',
      lastUpdated: 'Aug 25, 2026',
      text: 'Drug-Free Workplace (Sep 2026) — Alternate I applied\n\n(a) Definitions. As used in this clause—"Controlled substance" means a controlled substance in schedules I through V of section 202 of the Controlled Substances Act (21 U.S.C. 812).\n\n(b) The Contractor, if other than an individual, shall within 15 days after award publish a statement notifying its employees that the unlawful manufacture, distribution, dispensing, possession, or use of a controlled substance is prohibited in the Contractor\'s workplace, and shall provide a copy of that statement to each employee engaged in performance of this contract.\n\n(c) The Contractor shall establish an ongoing drug-free awareness program and notify the Contracting Officer of any conviction under a criminal drug statute within 10 days of receiving notice.',
    },
    skippedNote:
      'The Aug 2026 published text was superseded before it was adopted, so it is not offered here.',
  },
]

export async function getClauseUpdateReviews(): Promise<ClauseUpdateReview[]> {
  return clauseUpdateReviews.map(r => ({ ...r }))
}

export async function updateClauseUpdateReviewAction(
  id: number,
  action: 'retain' | 'update'
): Promise<ClauseUpdateReview | undefined> {
  const idx = clauseUpdateReviews.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  clauseUpdateReviews[idx] = { ...clauseUpdateReviews[idx], action }
  return clauseUpdateReviews[idx]
}

export async function clearClauseUpdateReviewAction(
  id: number
): Promise<ClauseUpdateReview | undefined> {
  const idx = clauseUpdateReviews.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  const { action: _action, ...rest } = clauseUpdateReviews[idx]
  clauseUpdateReviews[idx] = rest as ClauseUpdateReview
  return clauseUpdateReviews[idx]
}
