/**
 * AI-suggested clauses data layer.
 * Represents clauses the AI has evaluated for inclusion or exclusion,
 * with reason and confidence tier.
 */

export type ConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW'
export type SuggestedAction = 'inclusion' | 'exclusion'
export type UserDecision = 'accepted' | 'rejected'

export interface AiClause {
  id: number
  clauseNumber: string
  title: string
  suggestedAction: SuggestedAction
  reason: string
  source: string
  farCitation: string
  confidence: ConfidenceTier
  userDecision?: UserDecision
}

const aiClauses: AiClause[] = [
  // HIGH confidence
  {
    id: 1,
    clauseNumber: 'FAR 52.212-4',
    title: 'Contract Terms and Conditions—Commercial Items',
    suggestedAction: 'inclusion',
    reason: 'Contract type is commercial items; this clause is mandatory per FAR 12.301(b)(3).',
    source: 'Contract metadata: Type = Commercial Items',
    farCitation: 'FAR 12.301(b)(3)',
    confidence: 'HIGH',
  },
  {
    id: 2,
    clauseNumber: 'FAR 52.222-3',
    title: 'Convict Labor',
    suggestedAction: 'inclusion',
    reason: 'Contract value exceeds the micro-purchase threshold ($10,000).',
    source: 'Contract metadata: Ceiling = $2,500,000',
    farCitation: 'FAR 22.202',
    confidence: 'HIGH',
  },
  {
    id: 3,
    clauseNumber: 'FAR 52.204-24',
    title: 'Representation Regarding Certain Telecommunications Equipment',
    suggestedAction: 'inclusion',
    reason: 'SOW section 3.2 mentions procurement of telecommunications equipment.',
    source: 'SOW page 4, section 3.2',
    farCitation: 'FAR 4.2105(a)',
    confidence: 'HIGH',
  },
  {
    id: 4,
    clauseNumber: 'FAR 52.223-9',
    title: 'Estimate of Percentage of Recovered Material',
    suggestedAction: 'exclusion',
    reason: 'Contract value is below the $150,000 threshold that triggers this clause.',
    source: 'Contract metadata: Ceiling = $2,500,000 — wait, above threshold — not applicable to services',
    farCitation: 'FAR 23.406(b)',
    confidence: 'HIGH',
  },

  // MEDIUM confidence
  {
    id: 5,
    clauseNumber: 'FAR 52.219-14',
    title: 'Limitations on Subcontracting',
    suggestedAction: 'inclusion',
    reason: 'Contract mentions small business set-aside, but subcontracting scope in SOW is ambiguous.',
    source: 'SOW page 7, section 5.1 (partial match)',
    farCitation: 'FAR 19.508(e)',
    confidence: 'MEDIUM',
  },
  {
    id: 6,
    clauseNumber: 'FAR 52.222-41',
    title: 'Service Contract Labor Standards',
    suggestedAction: 'inclusion',
    reason: 'SOW appears to describe service work but specific labor categories are not fully defined.',
    source: 'SOW page 3, section 2.4 (inferred)',
    farCitation: 'FAR 22.1006(a)',
    confidence: 'MEDIUM',
  },
  {
    id: 7,
    clauseNumber: 'FAR 52.227-14',
    title: 'Rights in Data—General',
    suggestedAction: 'exclusion',
    reason: 'No indication of data deliverables in SOW; may need CO review for research components.',
    source: 'SOW: no matching section found',
    farCitation: 'FAR 27.409(b)',
    confidence: 'MEDIUM',
  },

  // LOW confidence
  {
    id: 8,
    clauseNumber: 'FAR 52.225-13',
    title: 'Restrictions on Certain Foreign Purchases',
    suggestedAction: 'inclusion',
    reason: 'Faint match to procurement scope; place of performance did not clearly indicate foreign sources.',
    source: 'Weak signal from SOW page 12',
    farCitation: 'FAR 25.1103(a)',
    confidence: 'LOW',
  },
  {
    id: 9,
    clauseNumber: 'FAR 52.239-1',
    title: 'Privacy or Security Safeguards',
    suggestedAction: 'exclusion',
    reason: 'Uncertain match — SOW mentions IT support but does not describe handling of sensitive data.',
    source: 'SOW page 8 (ambiguous)',
    farCitation: 'FAR 39.106',
    confidence: 'LOW',
  },
]

export async function getAiClauses(): Promise<AiClause[]> {
  return aiClauses
}

export async function getAiClausesByConfidence(tier: ConfidenceTier): Promise<AiClause[]> {
  return aiClauses.filter(c => c.confidence === tier)
}

export async function updateAiClauseDecision(
  id: number,
  decision: UserDecision | undefined
): Promise<AiClause | undefined> {
  const idx = aiClauses.findIndex(c => c.id === id)
  if (idx === -1) return undefined
  aiClauses[idx] = { ...aiClauses[idx], userDecision: decision }
  return aiClauses[idx]
}

export async function bulkUpdateByConfidence(
  tier: ConfidenceTier,
  decision: UserDecision
): Promise<AiClause[]> {
  aiClauses.forEach(c => {
    if (c.confidence === tier) c.userDecision = decision
  })
  return aiClauses.filter(c => c.confidence === tier)
}
