import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  ReadOnlyGrid,
  GridColumn,
  ButtonWidget,
  RichTextDisplayField,
  TextItem,
} from '@pglevy/sailwind'
import { X, Info, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react'
import {
  getClauses,
  updateClauseAction,
  clearClauseAction,
  bulkUpdateClauseActions,
  bulkClearClauseActions,
  type Clause,
} from '../db/clauses'
import {
  getClauseReviews,
  updateClauseReviewAction,
  clearClauseReviewAction,
  type ClauseReview,
} from '../db/clause-reviews'
import { getIncompleteClauses, type IncompleteClause } from '../db/incomplete-clauses'

export default function ValidateClauseSet() {
  const [clauses, setClauses] = useState<Clause[]>([])
  const [reviews, setReviews] = useState<ClauseReview[]>([])
  const [incomplete, setIncomplete] = useState<IncompleteClause[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null)

  useEffect(() => {
    Promise.all([getClauses(), getClauseReviews(), getIncompleteClauses()]).then(
      ([c, r, i]) => {
        setClauses(c)
        setReviews(r)
        setIncomplete(i)
        setLoading(false)
      }
    )
  }, [])

  const inclusions = clauses.filter(c => c.type === 'inclusion')
  const exclusions = clauses.filter(c => c.type === 'exclusion')

  const handleActionChange = async (id: number, action: 'accept' | 'reject') => {
    await updateClauseAction(id, action)
    setClauses(await getClauses())
  }

  const handleActionClear = async (id: number) => {
    await clearClauseAction(id)
    setClauses(await getClauses())
  }

  const handleAcceptAll = async (type: 'inclusion' | 'exclusion') => {
    await bulkUpdateClauseActions(type, 'accept')
    setClauses(await getClauses())
  }

  const handleRejectAll = async (type: 'inclusion' | 'exclusion') => {
    await bulkUpdateClauseActions(type, 'reject')
    setClauses(await getClauses())
  }

  const handleClearAll = async (type: 'inclusion' | 'exclusion') => {
    await bulkClearClauseActions(type)
    setClauses(await getClauses())
  }

  const handleReviewActionChange = async (id: number, action: 'retain' | 'update') => {
    await updateClauseReviewAction(id, action)
    setReviews(await getClauseReviews())
  }

  const handleReviewActionClear = async (id: number) => {
    await clearClauseReviewAction(id)
    setReviews(await getClauseReviews())
  }

  const handleSave = () => {
    alert('Clause decisions saved.')
  }

  const handleClose = () => {
    window.history.back()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-[80vw] h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Dialog Header (fixed) */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-gray-200 flex-shrink-0 bg-white">
          <HeadingField
            text="Validate Clause Set"
            size="MEDIUM"
            headingTag="H1"
            fontWeight="SEMI_BOLD"
          />
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dialog Body (single scroll) */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-8 py-6">
          {/* Top-level banner (spans both columns) */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#F5F5FC] border border-[#DCDEF5] rounded mb-6">
            <Info
              size={18}
              fill="#2322F0"
              stroke="#F5F5FC"
              strokeWidth={2.5}
              className="flex-shrink-0"
            />
            <span className="text-sm text-[#222222]">
              Review the items below before finalizing the clause set. Make sure all clauses are addressed to complete validation.
            </span>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-1 min-w-0 space-y-6">
          {/* Section 1: Clause Compliance */}
          <CardLayout padding="NONE" showBorder={true} showShadow={false} style="STANDARD">
            <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-gray-200">
              <HeadingField
                text="Clause Compliance"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="NONE"
              />
            </div>
            <div className="px-6 py-5">

            <div className="flex items-center gap-2 mb-4">
              <Info
                size={16}
                fill="#2322F0"
                stroke="#F5F5FC"
                strokeWidth={2.5}
                className="flex-shrink-0"
              />
              <span className="text-sm text-[#222222]">
                Selecting "Accept All" or "Reject All" applies that action to all clauses in this section.
              </span>
            </div>

            <RichTextDisplayField
              value={[
                <TextItem
                  key="d"
                  text="The following clauses should be included or excluded based on current rules and templates. Your decisions will be saved and cannot be undone."
                  color="SECONDARY"
                  size="SMALL"
                />,
              ]}
              marginBelow="LESS"
            />

            {/* Inclusions */}
            <ClauseSection
              title="INCLUSIONS"
              count={inclusions.length}
              clauses={inclusions}
              sourceLabel="Recommended by"
              selectedClauseId={selectedClause?.id}
              onClauseClick={setSelectedClause}
              onActionChange={handleActionChange}
              onActionClear={handleActionClear}
              onAcceptAll={() => handleAcceptAll('inclusion')}
              onRejectAll={() => handleRejectAll('inclusion')}
              onClearAll={() => handleClearAll('inclusion')}
            />

            {/* Exclusions */}
            <ClauseSection
              title="EXCLUSIONS"
              count={exclusions.length}
              clauses={exclusions}
              sourceLabel="Added through"
              selectedClauseId={selectedClause?.id}
              onClauseClick={setSelectedClause}
              onActionChange={handleActionChange}
              onActionClear={handleActionClear}
              onAcceptAll={() => handleAcceptAll('exclusion')}
              onRejectAll={() => handleRejectAll('exclusion')}
              onClearAll={() => handleClearAll('exclusion')}
            />
            </div>
          </CardLayout>

          {/* Section 2: Clauses to Review */}
          <CardLayout padding="NONE" showBorder={true} showShadow={false} style="STANDARD">
            <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-gray-200">
              <HeadingField
                text="Clauses to Review"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="NONE"
              />
            </div>
            <div className="px-6 py-5">

            <div className="flex items-center gap-2 mb-6">
              <Info
                size={16}
                fill="#2322F0"
                stroke="#F5F5FC"
                strokeWidth={2.5}
                className="flex-shrink-0"
              />
              <span className="text-sm text-[#222222]">
                Some clauses have updates waiting for review. Review each one and choose to accept the update, keep the current version, or edit the clause text.
              </span>
            </div>

            <ReviewTable
              reviews={reviews}
              onActionChange={handleReviewActionChange}
              onActionClear={handleReviewActionClear}
            />
            </div>
          </CardLayout>

          {/* Section 3: Incomplete clauses */}
          <CardLayout padding="NONE" showBorder={true} showShadow={false} style="STANDARD">
            <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-gray-200">
              <HeadingField
                text="Incomplete clauses"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="NONE"
              />
            </div>
            <div className="px-6 py-5">

            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle
                size={16}
                fill="#856C00"
                stroke="#FFFCEB"
                strokeWidth={2.5}
                className="flex-shrink-0"
              />
              <span className="text-sm text-[#222222]">
                The following clauses have missing information. Review the clauses with errors in the clause set summary and mark them as complete.
              </span>
            </div>

            <IncompleteTable incomplete={incomplete} />
            </div>
          </CardLayout>
          </div>

          {/* Clause detail card (right side - sticky with own scroll) */}
          {selectedClause && (
            <div className="w-[420px] h-[650px] flex-shrink-0 sticky top-0">
              <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
                <div className="px-5 py-4 flex items-start justify-between border-b border-gray-200 flex-shrink-0">
                  <div className="pr-3 min-w-0">
                    <div className="text-sm text-gray-500 mb-0.5">
                      {selectedClause.clauseNumber}
                    </div>
                    <HeadingField
                      text={selectedClause.title}
                      size="SMALL"
                      headingTag="H2"
                      fontWeight="SEMI_BOLD"
                      marginBelow="NONE"
                    />
                  </div>
                  <button
                    onClick={() => setSelectedClause(null)}
                    aria-label="Close clause details"
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="px-5 py-4 overflow-y-auto flex-1">
                  <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                    Prescription text
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                    {selectedClause.text}
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Dialog Footer (fixed) */}
        <div className="px-8 py-4 border-t border-gray-200 flex justify-end bg-white flex-shrink-0">
          <ButtonWidget
            label="Save"
            style="SOLID"
            color="ACCENT"
            size="STANDARD"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SourceCell — renders recommendedBy with optional external-link reference
// ============================================================================

function SourceCell({
  recommendedBy,
  reference,
}: {
  recommendedBy: Clause['recommendedBy']
  reference?: string
}) {
  if (!reference) {
    return <span>{recommendedBy}</span>
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{recommendedBy} from</span>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-[#2322F0] hover:underline font-medium"
      >
        <ExternalLink size={14} className="flex-shrink-0" />
        {reference}
      </button>
    </span>
  )
}

// ============================================================================
// ClauseSection — Inclusions / Exclusions grid with per-row Accept/Reject
// ============================================================================

interface ClauseSectionProps {
  title: string
  count: number
  clauses: Clause[]
  sourceLabel: string
  selectedClauseId?: number
  onClauseClick: (clause: Clause) => void
  onActionChange: (id: number, action: 'accept' | 'reject') => void
  onActionClear: (id: number) => void
  onAcceptAll: () => void
  onRejectAll: () => void
  onClearAll: () => void
}

function ClauseSection({
  title,
  count,
  clauses,
  sourceLabel,
  selectedClauseId,
  onClauseClick,
  onActionChange,
  onActionClear,
  onAcceptAll,
  onRejectAll,
  onClearAll,
}: ClauseSectionProps) {
  // Clear all is enabled whenever any clause in the section has a selection
  const hasAnySelection = clauses.some(c => c.action)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <RichTextDisplayField
          value={[
            <TextItem key="title" text={title} style="STRONG" size="SMALL" />,
            <TextItem
              key="count"
              text={` (${count})`}
              color="SECONDARY"
              size="SMALL"
            />,
          ]}
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onAcceptAll}
            className="text-sm text-[#2322F0] hover:underline"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={onRejectAll}
            className="text-sm text-[#2322F0] hover:underline"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={!hasAnySelection}
            className={`text-sm ${
              hasAnySelection
                ? 'text-[#2322F0] hover:underline cursor-pointer'
                : 'text-[#6C6C75] cursor-not-allowed'
            }`}
          >
            Clear all
          </button>
        </div>
      </div>

      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col />
          <col className="w-64" />
          <col className="w-32" />
          <col className="w-52" />
        </colgroup>
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="pb-2 pr-4 font-normal text-gray-500">Clause</th>
            <th className="pb-2 pr-4 font-normal text-gray-500">{sourceLabel}</th>
            <th className="pb-2 pr-4 font-normal text-gray-500">Usage</th>
            <th className="pb-2 pr-4 font-normal text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {clauses.map(row => (
            <tr
              key={row.id}
              className={`border-b border-gray-100 ${
                selectedClauseId === row.id ? 'bg-blue-50' : ''
              }`}
            >
              <td className="py-3 pr-4">
                <button
                  type="button"
                  onClick={() => onClauseClick(row)}
                  className="text-[#2322F0] hover:underline text-left"
                >
                  {row.clauseNumber} | {row.title}
                </button>
              </td>
              <td className="py-3 pr-4">
                <SourceCell recommendedBy={row.recommendedBy} reference={row.sourceReference} />
              </td>
              <td className="py-3 pr-4">{row.usage}</td>
              <td className="py-3 pr-4">
                <div className="grid grid-cols-[auto_auto_auto] items-center gap-3 justify-start">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name={`action-${row.id}`}
                      checked={row.action === 'accept'}
                      onChange={() => onActionChange(row.id, 'accept')}
                      className="cursor-pointer accent-[#2322F0]"
                    />
                    <span>Accept</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name={`action-${row.id}`}
                      checked={row.action === 'reject'}
                      onChange={() => onActionChange(row.id, 'reject')}
                      className="cursor-pointer accent-[#2322F0]"
                    />
                    <span>Reject</span>
                  </label>
                  {row.action ? (
                    <button
                      type="button"
                      onClick={() => onActionClear(row.id)}
                      className="text-sm text-[#2322F0] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// ReviewTable — Existing vs New pair with Retain/Update radio
// ============================================================================

interface ReviewTableProps {
  reviews: ClauseReview[]
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}

function ReviewTable({ reviews, onActionChange, onActionClear }: ReviewTableProps) {
  return (
    <table className="w-full text-sm table-fixed">
      <colgroup>
        <col className="w-56" />
        <col className="w-32" />
        <col className="w-72" />
        <col className="w-72" />
        <col className="w-48" />
      </colgroup>
      <thead>
        <tr className="text-left border-b border-gray-200">
          <th className="pb-2 pr-4 font-normal text-gray-500">Clause</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Status</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Effective Date</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Last Updated</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Action</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map(r => (
          <ReviewRow
            key={r.id}
            review={r}
            onActionChange={onActionChange}
            onActionClear={onActionClear}
          />
        ))}
      </tbody>
    </table>
  )
}

interface ReviewRowProps {
  review: ClauseReview
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}

/**
 * Renders a compared date value. If existing and new match, shows once.
 * Otherwise shows existing -> new as a diff view with removed/added highlights.
 */
function DateCompare({ existing, next }: { existing: string; next: string }) {
  if (existing === next) {
    return <span className="whitespace-nowrap">{existing}</span>
  }
  return (
    <div className="flex items-center gap-1.5 text-[#222222] whitespace-nowrap">
      <span>{existing}</span>
      <ArrowRight size={14} className="flex-shrink-0" />
      <span className="font-semibold">{next}</span>
    </div>
  )
}

function ReviewRow({ review, onActionChange, onActionClear }: ReviewRowProps) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-4 align-middle">
        {review.clauseNumber} | {review.title}
      </td>
      <td className="py-3 pr-4 align-middle text-gray-600">
        {review.status || '-'}
      </td>
      <td className="py-3 pr-4 align-middle">
        <DateCompare existing={review.existingEffectiveDate} next={review.newEffectiveDate} />
      </td>
      <td className="py-3 pr-4 align-middle">
        <DateCompare existing={review.existingLastUpdated} next={review.newLastUpdated} />
      </td>
      <td className="py-3 pr-4 align-middle">
        <div className="grid grid-cols-[auto_auto_auto] items-center gap-3 justify-start">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={`review-${review.id}`}
              checked={review.action === 'retain'}
              onChange={() => onActionChange(review.id, 'retain')}
              className="cursor-pointer accent-[#2322F0]"
            />
            <span>Retain</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={`review-${review.id}`}
              checked={review.action === 'update'}
              onChange={() => onActionChange(review.id, 'update')}
              className="cursor-pointer accent-[#2322F0]"
            />
            <span>Update</span>
          </label>
          {review.action ? (
            <button
              type="button"
              onClick={() => onActionClear(review.id)}
              className="text-sm text-[#2322F0] hover:underline cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <span />
          )}
        </div>
      </td>
    </tr>
  )
}

// ============================================================================
// IncompleteTable — Clauses with missing information
// ============================================================================

interface IncompleteTableProps {
  incomplete: IncompleteClause[]
}

function IncompleteTable({ incomplete }: IncompleteTableProps) {
  return (
    <ReadOnlyGrid data={incomplete} spacing="DENSE" borderStyle="LIGHT">
      <GridColumn
        label="Clause"
        width="WIDE"
        value={(row: IncompleteClause) => (
          <TextItem
            text={`${row.clauseNumber} | ${row.title}`}
            size="STANDARD"
          />
        )}
      />
    </ReadOnlyGrid>
  )
}
