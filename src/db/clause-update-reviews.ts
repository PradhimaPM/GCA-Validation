/**
 * Clause Update Reviews data layer.
 *
 * A clause update can arrive in two forms:
 *  - "As published"      — synced verbatim from acquisition.gov. When the clause
 *                          has an alternate, the alternate instructions are still
 *                          sitting at the end of the text rather than applied.
 *  - "Alternate applied" — the clause text after those instructions have been
 *                          worked into the body.
 *
 * An alternate-applied version may still be with policy for review. That does
 * not block the Contracting Officer from selecting it — the row carries a
 * Pending Review flag so they know the text has not been approved yet, and a
 * warning appears above the table.
 */

export type ClauseVersionKind = 'original' | 'as-published' | 'alternate-applied'

export interface ClauseVersion {
  label: string
  kind: ClauseVersionKind
  effectiveDate: string
  lastUpdated: string
  /** The clause name/title for this version. Falls back to the review title. */
  clauseName?: string
  text: string
}

export interface ClauseUpdateReview {
  id: number
  clauseNumber: string
  title: string
  /** True when a FAR alternate applies to this clause. */
  hasAlternate: boolean
  /** True when the offered version has not cleared policy review yet. */
  pendingReview: boolean
  /**
   * Overrides the default pending-review banner in the side panel. Used when the
   * reason is specific to the row — for example, AI could not apply the
   * alternate instructions, so the raw text came through untouched.
   */
  pendingNotice?: string
  /** Short plain-language summary of the situation for this row. */
  situation: string
  /** The version currently sitting in the clause set. */
  current: ClauseVersion
  /** The newer version on offer. */
  available: ClauseVersion
  /** Set when an interim version was superseded before anyone adopted it. */
  skippedNote?: string
  /**
   * True when the clause body is identical between the current and available
   * versions — the update is limited to metadata such as the effective date or
   * the version name. The side pane skips the redline and instead lists what
   * actually changed. Retain/Update still applies, since there is a new version
   * to adopt.
   */
  clauseTextUnchanged?: boolean
  /**
   * True when both the clause body and metadata (clause name, effective date)
   * changed. The side pane shows the "What changed" metadata summary above the
   * normal clause-text redline.
   */
  showMetadataSummary?: boolean
  action?: 'retain' | 'update'
}

const clauseUpdateReviews: ClauseUpdateReview[] = [
  // ── 1. No alternate. Plain one-step update, nothing pending. ───────────────
  {
    id: 1,
    clauseNumber: '52.203-13',
    title: 'Contractor Code of Business Ethics and Conduct.',
    hasAlternate: false,
    pendingReview: false,
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

  // ── 2. Alternate applied, still with policy. Selectable with a warning. ────
  {
    id: 2,
    clauseNumber: '52.203-6',
    title: 'Restrictions on Subcontractor Sales to the Government.',
    hasAlternate: true,
    pendingReview: true,
    situation: 'The version with Alternate I applied is still with policy for approval.',
    current: {
      label: 'Sep 2016',
      kind: 'original',
      effectiveDate: 'Jul 21, 2026',
      lastUpdated: 'Jul 17, 2026',
      text: 'Equal Opportunity (Sep 2016)\n\n(a) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, or national origin.\n\n(b) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to their race, color, religion, sex, sexual orientation, gender identity, or national origin.',
    },
    available: {
      label: 'Aug 2026, Alternate I applied',
      kind: 'alternate-applied',
      effectiveDate: 'Aug 15, 2026',
      lastUpdated: 'Aug 08, 2026',
      text: 'Equal Opportunity (Aug 2026) — Alternate I applied\n\n(a) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, national origin, or protected veteran status.\n\n(b) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to the characteristics listed in paragraph (a) of this clause.\n\n(c) The Contractor shall post the notice described in 22.805(b) in a conspicuous place accessible to all employees and applicants, and shall provide an electronic copy on request.\n\n(d) The Contractor shall report any known or suspected violation of this clause to the Contracting Officer within 5 business days of discovery.',
    },
  },

  // ── 3. Set holds as-published. Alternate cleanup with policy, selectable. ──
  {
    id: 3,
    clauseNumber: '52.203-14',
    title: 'Display of Hotline Poster(s).',
    hasAlternate: true,
    pendingReview: true,
    situation: 'The version with Alternate II applied is still with policy for approval.',
    pendingNotice:
      'AI could not process this clause. It contains the full clause text. Review and make changes from the clause set summary accordingly.',
    current: {
      label: 'Aug 2026, as published',
      kind: 'as-published',
      effectiveDate: 'Aug 15, 2026',
      lastUpdated: 'Aug 05, 2026',
      text: 'Rights in Data—General (Aug 2026)\n\n(a) Definitions. As used in this clause—"Computer database" or "database" means a collection of recorded information in a form capable of, and for the purpose of, being stored in, processed, and operated on by a computer.\n\n(b) Allocation of rights. Except as provided in paragraph (c) of this clause regarding copyright, the Government shall have unlimited rights in data first produced in the performance of this contract and form, fit, and function data delivered under this contract.\n\n— — —\nAlternate II (Aug 2026). As prescribed in 27.409(b)(2), add the following paragraph (g) to the basic clause.',
    },
    available: {
      label: 'Aug 2026, Alternate II applied',
      kind: 'alternate-applied',
      effectiveDate: 'Aug 15, 2026',
      lastUpdated: 'Aug 12, 2026',
      text: 'Rights in Data—General (Aug 2026) — Alternate II applied\n\n(a) Definitions. As used in this clause—"Computer database" or "database" means a collection of recorded information in a form capable of, and for the purpose of, being stored in, processed, and operated on by a computer.\n\n(b) Allocation of rights. Except as provided in paragraph (c) of this clause regarding copyright, the Government shall have unlimited rights in data first produced in the performance of this contract and form, fit, and function data delivered under this contract.\n\n(g) Limited rights data. The Contractor may withhold limited rights data from delivery, provided it identifies the withheld data to the Contracting Officer within 30 days of award.',
    },
  },

  // ── 4. Set holds as-published. Alternate cleanup approved. ─────────────────
  {
    id: 4,
    clauseNumber: '52.203-15',
    title: 'Whistleblower Protections Under the American Recovery and Reinvestment Act of 2009.',
    hasAlternate: false,
    pendingReview: false,
    showMetadataSummary: true,
    situation: 'A newer version was published. The clause text, the clause name, and the effective date all changed.',
    current: {
      label: 'Jun 2010',
      kind: 'original',
      effectiveDate: 'Jun 10, 2026',
      lastUpdated: 'Jun 08, 2026',
      clauseName: 'Whistleblower Protections Under the American Recovery and Reinvestment Act of 2009.',
      text: 'Whistleblower Protections Under the American Recovery and Reinvestment Act of 2009 (Jun 2010)\n\n(a) The Contractor shall inform its employees in writing, in the predominant language of the workforce, of employee whistleblower rights and protections under section 1553 of the American Recovery and Reinvestment Act of 2009 (Recovery Act).\n\n(b) The Contractor shall not discharge, demote, or otherwise discriminate against an employee as a reprisal for disclosing information to a Member of Congress, an Inspector General, the Government Accountability Office, or a Federal agency, that the employee reasonably believes is evidence of gross mismanagement of an agency contract relating to Recovery Act funds.\n\n(c) The Contractor shall include the substance of this clause, including this paragraph (c), in all subcontracts that are funded in whole or in part with Recovery Act funds.',
    },
    available: {
      label: 'Sep 2026',
      kind: 'as-published',
      effectiveDate: 'Sep 01, 2026',
      lastUpdated: 'Aug 22, 2026',
      clauseName: 'Whistleblower Protections for Contractor Employees.',
      text: 'Whistleblower Protections for Contractor Employees (Sep 2026)\n\n(a) The Contractor shall inform its employees in writing, in the predominant native language of the workforce, of employee whistleblower rights and protections under 41 U.S.C. 4712.\n\n(b) The Contractor shall not discharge, demote, or otherwise discriminate against an employee as a reprisal for disclosing information to a Member of Congress, an Inspector General, the Government Accountability Office, a Federal employee responsible for contract oversight, or a management official of the Contractor, that the employee reasonably believes is evidence of gross mismanagement of a Federal contract, a substantial and specific danger to public health or safety, or a violation of law related to a Federal contract.\n\n(c) The Contractor shall include the substance of this clause, including this paragraph (c), in all subcontracts over the simplified acquisition threshold.',
    },
  },

  // ── 5. Set holds the original. Interim published text never adopted. ──────
  {
    id: 5,
    clauseNumber: '52.203-11',
    title: 'Certification and Disclosure Regarding Payments to Influence Certain Federal Transactions.',
    hasAlternate: false,
    pendingReview: false,
    clauseTextUnchanged: true,
    situation: 'A newer version was published, but the clause text is unchanged. Only the effective date and version name changed.',
    current: {
      label: 'Jun 2020',
      kind: 'original',
      effectiveDate: 'Jun 15, 2026',
      lastUpdated: 'Jun 10, 2026',
      clauseName: 'Certification and Disclosure Regarding Payments to Influence Certain Federal Transactions.',
      text: 'Certification and Disclosure Regarding Payments to Influence Certain Federal Transactions (Jun 2020)\n\n(a) The definitions and prohibitions contained in the clause, at FAR 52.203-12, Limitation on Payments to Influence Certain Federal Transactions, included in this solicitation, are hereby incorporated by reference in paragraph (b) of this certification.\n\n(b) The offeror, by signing its offer, hereby certifies to the best of its knowledge and belief that on or after December 23, 1989—\n(1) No Federal appropriated funds have been paid or will be paid to any person for influencing or attempting to influence an officer or employee of any agency, a Member of Congress, an officer or employee of Congress, or an employee of a Member of Congress on his or her behalf in connection with the awarding of this contract;\n(2) If any funds other than Federal appropriated funds have been paid or will be paid to any person for influencing or attempting to influence an officer or employee of any agency, a Member of Congress, an officer or employee of Congress, or an employee of a Member of Congress on his or her behalf in connection with this contract, the offeror shall complete and submit Standard Form-LLL, Disclosure of Lobbying Activities.',
    },
    available: {
      label: 'Sep 2026',
      kind: 'as-published',
      effectiveDate: 'Sep 01, 2026',
      lastUpdated: 'Aug 25, 2026',
      clauseName: 'Certification and Disclosure Regarding Payments to Influence Certain Federal Transactions—Updated.',
      text: 'Certification and Disclosure Regarding Payments to Influence Certain Federal Transactions (Jun 2020)\n\n(a) The definitions and prohibitions contained in the clause, at FAR 52.203-12, Limitation on Payments to Influence Certain Federal Transactions, included in this solicitation, are hereby incorporated by reference in paragraph (b) of this certification.\n\n(b) The offeror, by signing its offer, hereby certifies to the best of its knowledge and belief that on or after December 23, 1989—\n(1) No Federal appropriated funds have been paid or will be paid to any person for influencing or attempting to influence an officer or employee of any agency, a Member of Congress, an officer or employee of Congress, or an employee of a Member of Congress on his or her behalf in connection with the awarding of this contract;\n(2) If any funds other than Federal appropriated funds have been paid or will be paid to any person for influencing or attempting to influence an officer or employee of any agency, a Member of Congress, an officer or employee of Congress, or an employee of a Member of Congress on his or her behalf in connection with this contract, the offeror shall complete and submit Standard Form-LLL, Disclosure of Lobbying Activities.',
    },
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
