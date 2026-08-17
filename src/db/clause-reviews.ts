/**
 * Clause Reviews data layer.
 * Manages paired clauses (existing vs new) that require user review
 * during clause set validation. User chooses either 'retain' (keep existing)
 * or 'update' (use new version) per pair.
 */

export interface ClauseReview {
  id: number
  clauseNumber: string
  title: string
  status: string
  existingEffectiveDate: string
  existingLastUpdated: string
  newEffectiveDate: string
  newLastUpdated: string
  existingText: string
  newText: string
  action?: 'retain' | 'update'
}

const clauseReviews: ClauseReview[] = [
  {
    id: 1,
    clauseNumber: '52.203-3',
    title: 'Gratuities',
    status: 'Pending Review',
    existingEffectiveDate: 'Jul 21, 2026',
    existingLastUpdated: 'Jul 17, 2026',
    newEffectiveDate: 'Jul 21, 2026',
    newLastUpdated: 'Aug 05, 2026',
    existingText:
      'As prescribed in 3.202, insert the following clause:\n\nGratuities (Apr 2024)\n\n(a) The right of the Contractor to proceed may be terminated by written notice if, after notice and hearing, the agency head or a designee determines that the Contractor, its agent, or another representative offered or gave a gratuity such as an entertainment or gift to an officer, official, or employee of the Government and intended, by the gratuity, to obtain a contract or favorable treatment under a contract.\n\n(b) The facts supporting this determination may be reviewed by any court having lawful jurisdiction.\n\n(c) If this contract is terminated as provided in paragraph (a) of this clause, the Government shall be entitled to pursue the same remedies against the Contractor as could be pursued in the event of a breach of the contract by the Contractor, and as a penalty, in addition to any other damages provided by law, exemplary damages of not less than 3, nor more than 10, times the cost incurred by the Contractor in providing any such gratuities to any such officer or employee.\n\n(d) The rights and remedies of the Government provided in this clause shall not be exclusive and are in addition to any other rights and remedies provided by law or under this contract.',
    newText:
      'As prescribed in 3.202, insert the following clause:\n\nGratuities (Aug 2026)\n\n(a) The right of the Contractor to proceed may be terminated by written notice if, after notice and hearing, the agency head or an authorized designee determines that the Contractor, its agent, or another representative offered, gave, or promised a gratuity, including entertainment, meals, travel, lodging, or gifts of any kind, to an officer, official, employee, or immediate family member of an employee of the Government and intended, by the gratuity, to obtain a contract, subcontract, or favorable treatment under a contract.\n\n(b) The facts supporting this determination may be reviewed by any Federal court having lawful jurisdiction.\n\n(c) If this contract is terminated as provided in paragraph (a) of this clause, the Government shall be entitled to pursue the same remedies against the Contractor as could be pursued in the event of a material breach of the contract by the Contractor, and as a penalty, in addition to any other damages provided by law or equity, exemplary damages of not less than 5, nor more than 15, times the cost incurred by the Contractor in providing any such gratuities to any such officer, employee, or family member.\n\n(d) The rights and remedies of the Government provided in this clause shall not be exclusive and are in addition to any other rights and remedies provided by law, regulation, or under this contract.\n\n(e) The Contractor shall report any known or suspected violation of this clause to the Contracting Officer within 5 business days of discovery.',
  },
  {
    id: 2,
    clauseNumber: '52.203-14',
    title: 'Display of Hotline Poster',
    status: 'Updated',
    existingEffectiveDate: 'Jun 10, 2026',
    existingLastUpdated: 'Jun 12, 2026',
    newEffectiveDate: 'Sep 01, 2026',
    newLastUpdated: 'Aug 20, 2026',
    existingText:
      'As prescribed in 3.1004, insert the following clause:\n\nDisplay of Hotline Poster (Dec 2007)\n\n(a) Display prominently in common work areas within business segments performing work under this contract and at contract work sites—\n(1) Any agency fraud hotline poster or Department of Homeland Security fraud hotline poster identified in paragraph (b) of this clause; and\n(2) Any DHS fraud hotline poster subsequently identified by the Contracting Officer.\n\n(b) Additionally, if the Contractor maintains a company website as a method of providing information to employees, the Contractor shall display an electronic version of the poster at the website.\n\n(c) If the agency has implemented a business ethics and conduct awareness program that includes a reporting mechanism, such as a hotline poster, then the Contractor need not display any additional agency fraud hotline poster.',
    newText:
      'As prescribed in 3.1004, insert the following clause:\n\nDisplay of Hotline Poster (Sep 2026)\n\n(a) Display prominently in all common work areas within business segments performing work under this contract, at contract work sites, and in Contractor-owned facilities—\n(1) Any agency fraud, waste, or abuse hotline poster or Department of Homeland Security fraud hotline poster identified in paragraph (b) of this clause;\n(2) Any DHS or Office of Inspector General fraud hotline poster subsequently identified by the Contracting Officer; and\n(3) The associated QR code or digital equivalent linking to the online reporting portal.\n\n(b) Additionally, if the Contractor maintains a company website or intranet as a method of providing information to employees, the Contractor shall display an electronic version of the poster on the primary landing page of that website.\n\n(c) If the Contractor has implemented a business ethics and conduct awareness program that includes an anonymous reporting mechanism, such as a confidential hotline or online portal, and the program is documented in writing and reviewed annually, then the Contractor need not display any additional agency fraud hotline poster.',
  },
]

export async function getClauseReviews(): Promise<ClauseReview[]> {
  return clauseReviews.map(r => ({ ...r }))
}

export async function updateClauseReviewAction(
  id: number,
  action: 'retain' | 'update'
): Promise<ClauseReview | undefined> {
  const idx = clauseReviews.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  clauseReviews[idx] = { ...clauseReviews[idx], action }
  return clauseReviews[idx]
}

export async function clearClauseReviewAction(id: number): Promise<ClauseReview | undefined> {
  const idx = clauseReviews.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  const { action: _action, ...rest } = clauseReviews[idx]
  clauseReviews[idx] = rest as ClauseReview
  return clauseReviews[idx]
}
