/**
 * Rules data layer.
 * Conditional rules that include or exclude clauses based on clause set data.
 */

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
]

/** Total number of rules across all pages (for paging display). */
export const RULE_TOTAL_COUNT = 57

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
  rules.push(newRule)
  return newRule
}

export async function updateRule(id: number, data: Partial<Rule>): Promise<Rule | undefined> {
  const idx = rules.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  rules[idx] = { ...rules[idx], ...data }
  return rules[idx]
}

export async function deleteRule(id: number): Promise<boolean> {
  const idx = rules.findIndex(r => r.id === id)
  if (idx === -1) return false
  rules.splice(idx, 1)
  return true
}
