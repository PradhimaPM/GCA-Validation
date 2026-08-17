/**
 * Incomplete Clauses data layer.
 * Clauses that have missing information and need to be marked complete
 * from the clause set summary.
 */

export interface IncompleteClause {
  id: number
  clauseNumber: string
  title: string
  error: string
}

const incompleteClauses: IncompleteClause[] = [
  {
    id: 1,
    clauseNumber: '52.203-14',
    title: 'Display of Hotline Poster',
    error: 'Incomplete Clause',
  },
]

export async function getIncompleteClauses(): Promise<IncompleteClause[]> {
  return incompleteClauses
}
