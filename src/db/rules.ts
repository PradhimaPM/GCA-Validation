/**
 * Rules data layer.
 * Conditional rules that include or exclude clauses based on clause set data.
 */

export interface RuleCondition {
  clauseData: string
  operator: string
  value: string
  /** Optional context for Questionnaire Question conditions */
  questionnaire?: string
  question?: string
}

export interface RuleConditionGroup {
  match: 'AND' | 'OR'
  conditions: RuleCondition[]
}

export interface RuleClauseRef {
  number: string
  title: string
}

export interface Rule {
  id: number
  name: string
  status: 'Active' | 'Draft'
  source: 'Custom' | 'Standard'
  conditionCount: number
  groupCount: number
  includedClauses: number
  excludedClauses: number
  lastUpdated: string
  createdBy: string
  /** Review-specific fields (optional for brevity in seed data) */
  reviewStatus?: 'Pending' | 'Accepted'
  clauseNumber?: string
  prescriptionText?: string
  clauseText?: string
  includedClauseList?: RuleClauseRef[]
  excludedClauseList?: RuleClauseRef[]
  conditionGroups?: RuleConditionGroup[]
}

const rules: Rule[] = [
  {
    id: 1,
    name: 'pktestrule2',
    status: 'Active',
    source: 'Custom',
    conditionCount: 1,
    groupCount: 0,
    includedClauses: 1,
    excludedClauses: 1,
    lastUpdated: 'Oct 1, 2026 3:35 PM',
    createdBy: 'john.smith',
  },
  {
    id: 2,
    name: 'pktestrule1',
    status: 'Active',
    source: 'Standard',
    conditionCount: 1,
    groupCount: 0,
    includedClauses: 1,
    excludedClauses: 1,
    lastUpdated: 'Sep 29, 2026 3:40 PM',
    createdBy: 'john.smith',
  },
  {
    id: 3,
    name: 'Clause 19.24.2124 Inclusion',
    status: 'Draft',
    source: 'Custom',
    conditionCount: 2,
    groupCount: 1,
    includedClauses: 0,
    excludedClauses: 0,
    lastUpdated: 'Sep 29, 2026 2:29 PM',
    createdBy: 'alice.chen',
  },
  {
    id: 4,
    name: 'Clause 19.24.2124 Inclusion',
    status: 'Draft',
    source: 'Standard',
    conditionCount: 1,
    groupCount: 0,
    includedClauses: 0,
    excludedClauses: 0,
    lastUpdated: 'Sep 29, 2026 2:22 PM',
    createdBy: 'alice.chen',
  },
  {
    id: 5,
    name: 'Test Hitesh 1',
    status: 'Active',
    source: 'Custom',
    conditionCount: 1,
    groupCount: 0,
    includedClauses: 2,
    excludedClauses: 1,
    lastUpdated: 'Sep 24, 2026 12:18 AM',
    createdBy: 'bob.martinez',
  },
  {
    id: 6,
    name: 'Task Assignment to Contracting Officer',
    status: 'Active',
    source: 'Standard',
    conditionCount: 4,
    groupCount: 1,
    includedClauses: 16,
    excludedClauses: 3,
    lastUpdated: 'Sep 21, 2026 11:12 PM',
    createdBy: 'carol.white',
  },
  {
    id: 7,
    name: 'GCA Rule',
    status: 'Active',
    source: 'Custom',
    conditionCount: 4,
    groupCount: 3,
    includedClauses: 55,
    excludedClauses: 0,
    lastUpdated: 'Sep 18, 2026 10:31 PM',
    createdBy: 'david.kim',
  },
  {
    id: 8,
    name: 'Compliance Skip Check Rule',
    status: 'Active',
    source: 'Standard',
    conditionCount: 1,
    groupCount: 0,
    includedClauses: 0,
    excludedClauses: 0,
    lastUpdated: 'Sep 18, 2026 2:54 PM',
    createdBy: 'david.kim',
  },
  {
    id: 9,
    name: 'rock Val Test',
    status: 'Active',
    source: 'Custom',
    conditionCount: 1,
    groupCount: 0,
    includedClauses: 2,
    excludedClauses: 0,
    lastUpdated: 'Sep 17, 2026 10:00 PM',
    createdBy: 'bob.martinez',
  },
  {
    id: 10,
    name: 'Din Test',
    status: 'Active',
    source: 'Standard',
    conditionCount: 2,
    groupCount: 2,
    includedClauses: 2,
    excludedClauses: 0,
    lastUpdated: 'Sep 10, 2026 8:35 PM',
    createdBy: 'john.smith',
  },
  {
    id: 11,
    name: 'Subcontract Flow-Down Enforcement',
    status: 'Active',
    source: 'Standard',
    conditionCount: 3,
    groupCount: 1,
    includedClauses: 8,
    excludedClauses: 2,
    lastUpdated: 'Sep 8, 2026 4:12 PM',
    createdBy: 'alice.chen',
  },
  {
    id: 12,
    name: 'Cybersecurity Baseline for IT Services',
    status: 'Draft',
    source: 'Custom',
    conditionCount: 5,
    groupCount: 2,
    includedClauses: 12,
    excludedClauses: 4,
    lastUpdated: 'Sep 5, 2026 10:45 AM',
    createdBy: 'carol.white',
  },
]

/** Total number of rules across all pages (for paging display). */
export const RULE_TOTAL_COUNT = 57

// ---- Sample content pools (used to generate review details) ----------------

const CLAUSE_NUMBERS = [
  '52.200.204',
  '52.203-6',
  '52.219-14',
  '52.222-50',
  '52.204-21',
  '52.212-5',
  '52.223-18',
  '52.225-13',
]

const PRESCRIPTION_PARAGRAPHS = [
  `As prescribed in 22.810(e), insert the following clause in solicitations and contracts when the clause set type is Solicitation or Award and the contract exceeds the simplified acquisition threshold. The contracting officer must verify that the conditions in paragraph (b) are met before including this clause.`,
  `Use this clause only when the acquisition is for commercial items as defined in FAR 2.101, when the place of performance is within the United States or an outlying area, and when the requirements described in subpart 22.8 apply to the Contractor or any subcontractors at any tier.`,
  `The clause must also be included in any subcontract (other than a subcontract for commercial items) in excess of $10,000, unless specifically exempted by the Deputy Assistant Secretary for Federal Contract Compliance Programs under the authority of 41 CFR 60-1.5(b).`,
  `Insert the clause as modified where the contract is for construction work (whether or not subject to the Davis-Bacon Act). Where the contract is subject to section 503 of the Rehabilitation Act of 1973, the Contractor shall take affirmative action to employ and advance in employment qualified individuals with disabilities.`,
  `Flow-down of this clause is required to subcontractors and vendors at every tier whose work directly supports performance of this contract. The Contractor shall remain responsible for compliance by its subcontractors, and failure of a subcontractor to comply does not relieve the Contractor of its own obligations.`,
  `Finally, this clause must be read in conjunction with the applicable Executive Orders, implementing regulations issued by the Secretary of Labor, and any supplemental agency guidance that is in effect at the time of contract award. The contracting officer should document the file to show that each condition in paragraphs (a) through (d) has been considered before incorporating the clause.`,
]

const CLAUSE_TEXT_PARAGRAPHS = [
  `Equal Opportunity (Sep 2016)`,
  `(a) Definitions. As used in this clause—"Compensation" means any payments made to, or on behalf of, an employee or offered to an applicant as remuneration for employment, including but not limited to salary, wages, overtime pay, shift differentials, bonuses, commissions, vacation and holiday pay, allowances, insurance and other benefits, stock options and awards, profit sharing, and retirement.`,
  `(b) The Contractor agrees that it will not discriminate against any employee or applicant for employment because of race, color, religion, sex, sexual orientation, gender identity, or national origin. However, it shall not be a violation of this clause for the Contractor to extend a publicly announced preference in employment to Indians living on or near an Indian reservation, in connection with employment opportunities on or near an Indian reservation, as permitted by 41 CFR 60-1.5.`,
  `(c) The Contractor will take affirmative action to ensure that applicants are employed, and that employees are treated during employment, without regard to their race, color, religion, sex, sexual orientation, gender identity, or national origin. This shall include, but not be limited to employment, upgrading, demotion, transfer, recruitment or recruitment advertising, layoff or termination, rates of pay or other forms of compensation, and selection for training, including apprenticeship.`,
  `(d) The Contractor agrees to post in conspicuous places, available to employees and applicants for employment, notices to be provided by the Contracting Officer that explain this clause.`,
  `(e) The Contractor will, in all solicitations or advertisements for employees placed by or on behalf of the Contractor, state that all qualified applicants will receive consideration for employment without regard to race, color, religion, sex, sexual orientation, gender identity, or national origin.`,
  `(f) The Contractor will send, to each labor union or representative of workers with which it has a collective bargaining agreement or other contract or understanding, the notice to be provided by the Contracting Officer advising the labor union or workers' representative of the Contractor's commitments under this clause, and post copies of the notice in conspicuous places available to employees and applicants for employment.`,
  `(g) The Contractor will comply with all provisions of Executive Order 11246 of September 24, 1965, and of the rules, regulations, and relevant orders of the Secretary of Labor.`,
  `(h) The Contractor will furnish all information and reports required by Executive Order 11246 of September 24, 1965, and by the rules, regulations, and orders of the Secretary of Labor, or pursuant thereto, and will permit access to its books, records, and accounts by the administering agency and the Secretary of Labor for purposes of investigation to ascertain compliance with such rules, regulations, and orders.`,
  `(i) In the event of the Contractor's noncompliance with the Equal Opportunity clause of this contract or with any of the said rules, regulations, or orders, this contract may be canceled, terminated, or suspended, in whole or in part, and the Contractor may be declared ineligible for further Government contracts in accordance with procedures authorized in Executive Order 11246 of September 24, 1965, and such other sanctions may be imposed and remedies invoked as provided in that order or by rule, regulation, or order of the Secretary of Labor, or as otherwise provided by law.`,
  `(j) The Contractor will include the terms and conditions of paragraphs (b) through (i) of this clause in every subcontract or purchase order unless exempted by rules, regulations, or orders of the Secretary of Labor issued pursuant to section 204 of Executive Order 11246 of September 24, 1965, so that such provisions will be binding upon each subcontractor or vendor.`,
]

const INCLUDED_POOL: RuleClauseRef[] = [
  { number: '52.203-6', title: 'Restrictions on Subcontractor Sales to the Government' },
  { number: '52.203-7', title: 'Anti-Kickback Procedures' },
  { number: '52.203-13', title: 'Contractor Code of Business Ethics and Conduct' },
  { number: '52.204-10', title: 'Reporting Executive Compensation and First-Tier Subcontract Awards' },
  { number: '52.204-21', title: 'Basic Safeguarding of Covered Contractor Information Systems' },
  { number: '52.209-6', title: 'Protecting the Government\'s Interest When Subcontracting with Contractors Debarred, Suspended, or Proposed for Debarment' },
  { number: '52.219-8', title: 'Utilization of Small Business Concerns' },
  { number: '52.219-9', title: 'Small Business Subcontracting Plan' },
  { number: '52.219-14', title: 'Limitations on Subcontracting' },
  { number: '52.222-3', title: 'Convict Labor' },
  { number: '52.222-21', title: 'Prohibition of Segregated Facilities' },
  { number: '52.222-26', title: 'Equal Opportunity' },
  { number: '52.222-35', title: 'Equal Opportunity for Veterans' },
  { number: '52.222-36', title: 'Equal Opportunity for Workers with Disabilities' },
  { number: '52.222-37', title: 'Employment Reports on Veterans' },
  { number: '52.222-50', title: 'Combating Trafficking in Persons' },
  { number: '52.223-18', title: 'Encouraging Contractor Policies to Ban Text Messaging While Driving' },
  { number: '52.225-13', title: 'Restrictions on Certain Foreign Purchases' },
  { number: '52.232-33', title: 'Payment by Electronic Funds Transfer—System for Award Management' },
  { number: '52.233-3', title: 'Protest After Award' },
  { number: '52.233-4', title: 'Applicable Law for Breach of Contract Claim' },
  { number: '52.247-64', title: 'Preference for Privately Owned U.S.-Flag Commercial Vessels' },
]

const EXCLUDED_POOL: RuleClauseRef[] = [
  { number: '52.203-10', title: 'Price or Fee Adjustment for Illegal or Improper Activity' },
  { number: '52.203-11', title: 'Certification and Disclosure Regarding Payments to Influence Certain Federal Transactions' },
  { number: '52.203-12', title: 'Limitation on Payments to Influence Certain Federal Transactions' },
  { number: '52.204-9', title: 'Personal Identity Verification of Contractor Personnel' },
  { number: '52.209-10', title: 'Prohibition on Contracting with Inverted Domestic Corporations' },
  { number: '52.215-2', title: 'Audit and Records—Negotiation' },
  { number: '52.219-28', title: 'Post-Award Small Business Program Rerepresentation' },
  { number: '52.222-19', title: 'Child Labor—Cooperation with Authorities and Remedies' },
  { number: '52.222-40', title: 'Notification of Employee Rights Under the National Labor Relations Act' },
  { number: '52.222-41', title: 'Service Contract Labor Standards' },
  { number: '52.223-15', title: 'Energy Efficiency in Energy-Consuming Products' },
  { number: '52.225-25', title: 'Prohibition on Contracting with Entities Engaging in Certain Activities' },
  { number: '52.232-39', title: 'Unenforceability of Unauthorized Obligations' },
  { number: '52.244-6', title: 'Subcontracts for Commercial Items' },
]

const CONDITION_BUILDERS: (() => RuleCondition)[] = [
  () => ({ clauseData: 'Clause Set Type', operator: 'Equals', value: 'Solicitation' }),
  () => ({ clauseData: 'Clause Set Type', operator: 'Equals', value: 'Award' }),
  () => ({ clauseData: 'Clause Set Type', operator: 'Equals', value: 'Modification' }),
  () => ({ clauseData: 'Contract Category', operator: 'Equals', value: 'Commercial Items' }),
  () => ({ clauseData: 'Contract Category', operator: 'Not Equals', value: 'Construction' }),
  () => ({ clauseData: 'Contract Value', operator: 'Greater Than', value: '$250,000' }),
  () => ({ clauseData: 'Contract Value', operator: 'Less Than', value: '$5,000,000' }),
  () => ({ clauseData: 'Place of Performance', operator: 'Equals', value: 'United States' }),
  () => ({ clauseData: 'Set-Aside Type', operator: 'Equals', value: 'Small Business' }),
  () => ({ clauseData: 'Set-Aside Type', operator: 'Equals', value: 'HUBZone' }),
  () => ({
    clauseData: 'Questionnaire Question',
    operator: 'Not Equals',
    value: 'Less than one hour',
    questionnaire: 'QNM 200 - 16',
    question: 'What is the response time for critical incidents at the engineer level?',
  }),
  () => ({ clauseData: 'Agency', operator: 'Equals', value: 'Department of Defense' }),
  () => ({ clauseData: 'Period of Performance', operator: 'Greater Than', value: '12 months' }),
]

function pick<T>(arr: T[], count: number, offset = 0): T[] {
  const out: T[] = []
  for (let i = 0; i < count && i < arr.length; i++) {
    out.push(arr[(offset + i) % arr.length])
  }
  return out
}

// Attach review-specific details to each rule. Numbers are intentionally
// generous so the review screen can be stress-tested with long content.
rules.forEach((r, i) => {
  r.reviewStatus = r.reviewStatus ?? 'Pending'
  r.clauseNumber = r.clauseNumber ?? CLAUSE_NUMBERS[i % CLAUSE_NUMBERS.length]

  // Long multi-paragraph prescription text.
  r.prescriptionText = r.prescriptionText ?? PRESCRIPTION_PARAGRAPHS.join('\n\n')

  // Long clause text with structured paragraphs.
  r.clauseText = r.clauseText ?? CLAUSE_TEXT_PARAGRAPHS.join('\n\n')

  // Pump up included/excluded counts and lists.
  const includedCount = Math.max(r.includedClauses, 6) + (i % 4) * 2
  const excludedCount = Math.max(r.excludedClauses, 4) + (i % 3)
  r.includedClauses = includedCount
  r.excludedClauses = excludedCount
  r.includedClauseList = r.includedClauseList ?? pick(INCLUDED_POOL, includedCount, i)
  r.excludedClauseList = r.excludedClauseList ?? pick(EXCLUDED_POOL, excludedCount, i * 2)

  // Multiple condition groups, each with several conditions.
  const groupCount = Math.max(r.groupCount, 2) + (i % 2)
  const groups: RuleConditionGroup[] = []
  for (let g = 0; g < groupCount; g++) {
    const conditionCount = 3 + ((g + i) % 3) // 3–5 per group
    const conditions: RuleCondition[] = []
    for (let c = 0; c < conditionCount; c++) {
      conditions.push(CONDITION_BUILDERS[(g * 3 + c + i) % CONDITION_BUILDERS.length]())
    }
    groups.push({ match: g % 2 === 0 ? 'AND' : 'OR', conditions })
  }
  r.conditionCount = groups.reduce((n, g) => n + g.conditions.length, 0)
  r.groupCount = groupCount
  r.conditionGroups = r.conditionGroups ?? groups
})

export async function getRules(): Promise<Rule[]> {
  return [...rules]
}

export async function getRulesBySource(source: 'Custom' | 'Standard'): Promise<Rule[]> {
  return rules.filter(r => r.source === source).map(r => ({ ...r }))
}

export async function getRule(id: number): Promise<Rule | undefined> {
  return rules.find(r => r.id === id)
}

export async function createRule(data: Omit<Rule, 'id'>): Promise<Rule> {
  const newRule = { ...data, id: Math.max(0, ...rules.map(r => r.id)) + 1 }
  // Prepend so newly created rules appear at the top of the grid.
  rules.unshift(newRule)
  return newRule
}

export async function updateRule(id: number, data: Partial<Rule>): Promise<Rule | undefined> {
  const idx = rules.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  rules[idx] = { ...rules[idx], ...data }
  return rules[idx]
}

export async function acceptRuleReview(id: number): Promise<Rule | undefined> {
  const idx = rules.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  rules[idx] = { ...rules[idx], reviewStatus: 'Accepted' }
  return rules[idx]
}

export async function deleteRule(id: number): Promise<boolean> {
  const idx = rules.findIndex(r => r.id === id)
  if (idx === -1) return false
  rules.splice(idx, 1)
  return true
}
