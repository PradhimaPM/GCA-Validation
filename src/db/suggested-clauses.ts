/**
 * Suggested clauses data layer.
 * Clauses available to be added to a clause set from the "Add Suggested
 * Clauses" picker. Each row carries enough metadata to identify the clause
 * and where it comes from.
 */

export interface SuggestedClause {
  id: number
  clauseNumber: string
  title: string
  clauseType: string
  regulation: string
  effectiveDate: string
}

const suggestedClauses: SuggestedClause[] = [
  {
    id: 1,
    clauseNumber: '52.204-21',
    title: 'Basic Safeguarding of Covered Contractor Information Systems',
    clauseType: 'Clause',
    regulation: 'FAR',
    effectiveDate: 'Nov 2021',
  },
  {
    id: 2,
    clauseNumber: '252.204-7012',
    title: 'Safeguarding Covered Defense Information and Cyber Incident Reporting',
    clauseType: 'Clause',
    regulation: 'DFARS',
    effectiveDate: 'Dec 2019',
  },
  {
    id: 3,
    clauseNumber: '52.222-26',
    title: 'Equal Opportunity',
    clauseType: 'Clause',
    regulation: 'FAR',
    effectiveDate: 'Sep 2016',
  },
  {
    id: 4,
    clauseNumber: '52.232-33',
    title: 'Payment by Electronic Funds Transfer — SAM',
    clauseType: 'Clause',
    regulation: 'FAR',
    effectiveDate: 'Oct 2003',
  },
  {
    id: 5,
    clauseNumber: '52.215-2',
    title: 'Audit and Records — Negotiation',
    clauseType: 'Clause',
    regulation: 'FAR',
    effectiveDate: 'Jun 2010',
  },
  {
    id: 6,
    clauseNumber: '252.225-7001',
    title: 'Buy American and Balance of Payments Program',
    clauseType: 'Clause',
    regulation: 'DFARS',
    effectiveDate: 'Feb 2013',
  },
]

export async function getSuggestedClauses(): Promise<SuggestedClause[]> {
  return suggestedClauses
}

export async function getSuggestedClause(id: number): Promise<SuggestedClause | undefined> {
  return suggestedClauses.find(c => c.id === id)
}
