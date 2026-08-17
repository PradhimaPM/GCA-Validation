/**
 * Clause Compliance data layer.
 * Manages clauses that must be included or excluded based on rules and templates.
 */

export interface Clause {
  id: number
  clauseNumber: string
  title: string
  recommendedBy: 'Rule' | 'Template' | 'Copied' | 'Previous set'
  sourceReference?: string
  usage: 'Required' | 'Not Required'
  type: 'inclusion' | 'exclusion'
  text: string
  action?: 'accept' | 'reject'
}

const clauses: Clause[] = [
  // Inclusions
  {
    id: 1,
    clauseNumber: '52.222-26',
    title: 'Equal Opportunity',
    recommendedBy: 'Rule',
    usage: 'Required',
    type: 'inclusion',
    text: 'As prescribed in 22.810(e), insert the following clause:\n\nEqual Opportunity (Sep 2016)\n\n(a) Definitions. As used in this clause—\n"Compensation" means any payments made to, or on behalf of, an employee or offered to an applicant as remuneration for employment, including but not limited to salary, wages, overtime pay, shift differentials, bonuses, commissions, vacation and holiday pay, allowances, insurance and other benefits, stock options and awards, profit sharing, and retirement.\n"Compensation information" means the amount and type of compensation provided to employees or offered to applicants, including, but not limited to, the desire of the employer to attract and retain a particular employee for the value the employee is perceived to add to the employer\'s profit or productivity; the availability of employees with like skills or the employer\'s need to accommodate contingent skill or availability issues, or business consideration factors such as marketplace astringencies, or the employer\'s reliance on prior compensation levels of a newly hired employee to set the employee\'s starting pay at the employer.\n"Employee" means any employee of the Contractor engaged in the performance of work under this contract.\n"Essential job functions" means the fundamental job duties of the employment position an individual holds. A job function may be considered essential if—\n(1) The access to compensation information is necessary in order to perform that function or another routinely assigned business task; or\n(2) The function or duties of the position include protecting and maintaining the privacy of employee personnel records, including compensation information.\n\n(b) Equal opportunity clause. If, during any 12-month period (including the 12 months preceding the award of this contract), the Contractor has been or is awarded nonexempt Federal contracts and/or subcontracts that have an aggregate value in excess of $10,000, the Contractor shall comply with paragraphs (c) through (k) of this clause, except as otherwise provided.\n\n(c) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, or national origin. However, it shall not be a violation of this clause for the Contractor to extend a publicly announced preference in employment to Indians living on or near an Indian reservation, in connection with employment opportunities on or near an Indian reservation, as permitted by 41 CFR 60-1.5.\n\n(d) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to their race, color, religion, sex, sexual orientation, gender identity, or national origin. This shall include, but not be limited to—\n(1) Employment;\n(2) Upgrading;\n(3) Demotion;\n(4) Transfer;\n(5) Recruitment or recruitment advertising;\n(6) Layoff or termination;\n(7) Rates of pay or other forms of compensation; and\n(8) Selection for training, including apprenticeship.\n\n(e) The Contractor agrees to post in conspicuous places, available to employees and applicants for employment, notices to be provided by the contracting officer that explain this clause.\n\n(f) The Contractor will, in all solicitations or advertisements for employees placed by or on behalf of the Contractor, state that all qualified applicants will receive consideration for employment without regard to race, color, religion, sex, sexual orientation, gender identity, or national origin.\n\n(g) The Contractor will send, to each labor union or representative of workers with which it has a collective bargaining agreement or other contract or understanding, the notice to be provided by the Contracting Officer advising the labor union or workers\' representative of the Contractor\'s commitments under this clause, and post copies of the notice in conspicuous places available to employees and applicants for employment.\n\n(h) The Contractor will comply with all provisions of Executive Order 11246 of September 24, 1965, and of the rules, regulations, and relevant orders of the Secretary of Labor.\n\n(i) The Contractor will furnish all information and reports required by Executive Order 11246 of September 24, 1965, and by the rules, regulations, and orders of the Secretary of Labor, or pursuant thereto, and will permit access to its books, records, and accounts by the administering agency and the Secretary of Labor for purposes of investigation to ascertain compliance with such rules, regulations, and orders.\n\n(j) In the event of the Contractor\'s noncompliance with the Equal Opportunity clause of this contract or with any of the said rules, regulations, or orders, this contract may be canceled, terminated, or suspended, in whole or in part, and the Contractor may be declared ineligible for further Government contracts. As prescribed in 22.810(e), insert the following clause: (a) If, during any 12-month period (including the 12 months preceding the award of this contract), the Contractor has been or is awarded nonexempt Federal contracts and/or subcontracts that have an aggregate value in excess of $10,000, the Contractor shall comply with paragraphs (b) through (k) of this clause. (b) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, or national origin. (c) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to their race, color, religion, sex, sexual orientation, gender identity, or national origin.',
  },
  {
    id: 2,
    clauseNumber: '52.225-5',
    title: 'Trade Agreements',
    recommendedBy: 'Template',
    usage: 'Not Required',
    type: 'inclusion',
    text: 'As prescribed in 25.1101(c)(1), insert the following clause:\n\n(a) Definitions. As used in this clause—"Caribbean Basin country end product," "Designated country," "Designated country end product," "Free Trade Agreement country," and other related terms have the meanings given in the Trade Agreements clause of this contract.\n\n(b) The Contractor shall deliver under this contract only U.S.-made or designated country end products except to the extent that, in its offer, it specified delivery of other end products in the Trade Agreements Certificate provision of the solicitation.',
  },
  {
    id: 3,
    clauseNumber: '52.216-25',
    title: 'Contract Definitization',
    recommendedBy: 'Template',
    usage: 'Required',
    type: 'inclusion',
    text: 'As prescribed in 16.603-4(c), insert the following clause:\n\n(a) A definitive contract is contemplated. The schedule for definitization consists of the following target date for definitization of the contract and dates for submission of the Contractor\'s price proposal, beginning of negotiations, and, if appropriate, submission of the make-or-buy and subcontracting plans and certified cost or pricing data.\n\n(b) The Contractor agrees to begin promptly negotiating with the Contracting Officer the terms of a definitive contract that will include (1) all clauses required by the Federal Acquisition Regulation (FAR) on the date of execution of the undefinitized contract action.',
  },
  // Exclusions
  {
    id: 4,
    clauseNumber: '52.227-14',
    title: 'Rights in Data—General',
    recommendedBy: 'Copied',
    sourceReference: 'SOC 12345',
    usage: 'Required',
    type: 'exclusion',
    text: 'As prescribed in 27.409(b)(1), insert the following clause:\n\n(a) Definitions. As used in this clause—"Computer database" or "database" means a collection of recorded information in a form capable of, and for the purpose of, being stored in, processed, and operated on by a computer.\n\n(b) Allocation of rights. (1) Except as provided in paragraph (c) of this clause regarding copyright, the Government shall have unlimited rights in—(i) Data first produced in the performance of this contract; (ii) Form, fit, and function data delivered under this contract.',
  },
  {
    id: 5,
    clauseNumber: '52.223-6',
    title: 'Drug-Free Workplace',
    recommendedBy: 'Previous set',
    sourceReference: 'SOC 10982',
    usage: 'Not Required',
    type: 'exclusion',
    text: 'As prescribed in 23.505, insert the following clause:\n\n(a) Definitions. As used in this clause—"Controlled substance" means a controlled substance in schedules I through V of section 202 of the Controlled Substances Act (21 U.S.C. 812).\n\n(b) The Contractor, if other than an individual, shall—within 30 days after award (unless a longer period is agreed to in writing for contracts of 30 days or more performance duration); or as soon as possible for contracts of less than 30 days performance duration—publish a statement notifying its employees that the unlawful manufacture, distribution, dispensing, possession, or use of a controlled substance is prohibited in the Contractor\'s workplace.',
  },
  {
    id: 6,
    clauseNumber: '52.215-10',
    title: 'Contract Definitization',
    recommendedBy: 'Copied',
    sourceReference: 'SOC 11455',
    usage: 'Required',
    type: 'exclusion',
    text: 'As prescribed in 15.408(b), insert the following clause:\n\n(a) If any price, including profit or fee, negotiated in connection with this contract, or any cost reimbursable under this contract, was increased by any significant amount because—(1) The Contractor or a subcontractor furnished certified cost or pricing data that were not complete, accurate, and current as certified in its Certificate of Current Cost or Pricing Data; (2) A subcontractor or prospective subcontractor furnished the Contractor certified cost or pricing data that were not complete, accurate, and current.',
  },
]

export async function getClauses(): Promise<Clause[]> {
  return [...clauses]
}

export async function getClausesByType(type: 'inclusion' | 'exclusion'): Promise<Clause[]> {
  return clauses.filter(c => c.type === type).map(c => ({ ...c }))
}

export async function updateClauseAction(id: number, action: 'accept' | 'reject' | undefined): Promise<Clause | undefined> {
  const idx = clauses.findIndex(c => c.id === id)
  if (idx === -1) return undefined
  clauses[idx] = { ...clauses[idx], action }
  return clauses[idx]
}

export async function clearClauseAction(id: number): Promise<Clause | undefined> {
  const idx = clauses.findIndex(c => c.id === id)
  if (idx === -1) return undefined
  const { action: _action, ...rest } = clauses[idx]
  clauses[idx] = rest as Clause
  return clauses[idx]
}

export async function bulkUpdateClauseActions(
  type: 'inclusion' | 'exclusion',
  action: 'accept' | 'reject'
): Promise<Clause[]> {
  clauses.forEach(c => {
    if (c.type === type) {
      c.action = action
    }
  })
  return clauses.filter(c => c.type === type).map(c => ({ ...c }))
}

export async function bulkClearClauseActions(
  type: 'inclusion' | 'exclusion'
): Promise<Clause[]> {
  clauses.forEach(c => {
    if (c.type === type) {
      delete c.action
    }
  })
  return clauses.filter(c => c.type === type).map(c => ({ ...c }))
}
