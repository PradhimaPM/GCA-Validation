import { useState, useEffect } from 'react'
import {
  HeadingField,
  ReadOnlyGrid,
  GridColumn,
  ButtonWidget,
  RichTextDisplayField,
  TextItem,
  TagField,
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

type TabId = 'compliance' | 'updates' | 'errors'

export default function ValidateClauseSetOption2() {
  const [clauses, setClauses] = useState<Clause[]>([])
  const [reviews, setReviews] = useState<ClauseReview[]>([])
  const [incomplete, setIncomplete] = useState<IncompleteClause[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null)
  const [selectedReview, setSelectedReview] = useState<ClauseReview | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('compliance')

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

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'compliance', label: 'Recommendation', count: clauses.length },
    { id: 'updates', label: 'Updates', count: reviews.length },
    { id: 'errors', label: 'Errors', count: incomplete.length },
  ]

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

        {/* Tabs (fixed below header) */}
        <div className="px-8 pt-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#2322F0] text-[#2322F0]'
                    : 'border-transparent text-[#6C6C75] hover:text-[#222222]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Dialog Body (single scroll) */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-8 py-6">
          {/* Top-level banner */}
          {/* <div className="flex items-center gap-2 px-4 py-3 bg-[#F5F5FC] border border-[#DCDEF5] rounded mb-6">
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
          </div> */}

          <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start">
            <div className="flex-1 min-w-0 space-y-6">
              {activeTab === 'compliance' && (
                <ComplianceSection
                  inclusions={inclusions}
                  exclusions={exclusions}
                  selectedClauseId={selectedClause?.id}
                  onClauseClick={setSelectedClause}
                  onActionChange={handleActionChange}
                  onActionClear={handleActionClear}
                  onAcceptAll={handleAcceptAll}
                  onRejectAll={handleRejectAll}
                  onClearAll={handleClearAll}
                />
              )}

              {activeTab === 'updates' && (
                <UpdatesSection
                  reviews={reviews}
                  selectedReviewId={selectedReview?.id}
                  onReviewClick={setSelectedReview}
                  onActionChange={handleReviewActionChange}
                  onActionClear={handleReviewActionClear}
                />
              )}

              {activeTab === 'errors' && <ErrorsSection incomplete={incomplete} />}
            </div>

            {/* Review detail card (right side - only visible in updates tab) */}
            {selectedReview && activeTab === 'updates' && (
              <div className="w-full lg:w-[380px] xl:w-[420px] lg:flex-shrink-0 h-[650px] lg:sticky lg:top-0">
                <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
                  <div className="px-5 py-4 flex items-start justify-between border-b border-gray-200 flex-shrink-0">
                    <div className="pr-3 min-w-0">
                      <div className="text-sm text-gray-500 mb-0.5">
                        {selectedReview.clauseNumber}
                      </div>
                      <HeadingField
                        text={selectedReview.title}
                        size="SMALL"
                        headingTag="H2"
                        fontWeight="SEMI_BOLD"
                        marginBelow="NONE"
                      />
                    </div>
                    <button
                      onClick={() => setSelectedReview(null)}
                      aria-label="Close clause details"
                      className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
                    <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                      Clause text
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-[#222222]">Show original text</span>
                      <input
                        type="checkbox"
                        checked={showOriginal}
                        onChange={e => setShowOriginal(e.target.checked)}
                        className="cursor-pointer accent-[#2322F0]"
                      />
                    </label>
                  </div>
                  <div className="px-5 py-4 overflow-y-auto flex-1">
                    {showOriginal ? (
                      <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                        {selectedReview.existingText}
                      </div>
                    ) : (
                      <TextDiff
                        oldText={selectedReview.existingText}
                        newText={selectedReview.newText}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Clause detail card (right side - only visible in compliance tab) */}
            {selectedClause && activeTab === 'compliance' && (
              <div className="w-full lg:w-[380px] xl:w-[420px] lg:flex-shrink-0 h-[650px] lg:sticky lg:top-0">
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
// Section wrappers (card + gray header band + info banner + content)
// ============================================================================

function SectionCard({
  title,
  banner,
  children,
}: {
  title: string
  banner?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-gray-200">
        <HeadingField
          text={title}
          size="SMALL"
          headingTag="H2"
          fontWeight="SEMI_BOLD"
          marginBelow="NONE"
        />
      </div>
      <div className="px-6 py-5">
        {banner}
        {children}
      </div>
    </div>
  )
}

interface ComplianceSectionProps {
  inclusions: Clause[]
  exclusions: Clause[]
  selectedClauseId?: number
  onClauseClick: (clause: Clause) => void
  onActionChange: (id: number, action: 'accept' | 'reject') => void
  onActionClear: (id: number) => void
  onAcceptAll: (type: 'inclusion' | 'exclusion') => void
  onRejectAll: (type: 'inclusion' | 'exclusion') => void
  onClearAll: (type: 'inclusion' | 'exclusion') => void
}

function ComplianceSection(props: ComplianceSectionProps) {
  return (
    <SectionCard
      title="Clause Compliance"
      banner={
        <>
          <RichTextDisplayField
            value={[
              <TextItem
                key="d"
                text="The following clauses should be included or excluded based on current rules and templates."
                color="SECONDARY"
                size="STANDARD"
              />,
            ]}
            marginBelow="STANDARD"
          />
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
        </>
      }
    >
      <ClauseSection
        title="INCLUSIONS"
        count={props.inclusions.length}
        clauses={props.inclusions}
        sourceLabel="Recommended by"
        selectedClauseId={props.selectedClauseId}
        onClauseClick={props.onClauseClick}
        onActionChange={props.onActionChange}
        onActionClear={props.onActionClear}
        onAcceptAll={() => props.onAcceptAll('inclusion')}
        onRejectAll={() => props.onRejectAll('inclusion')}
        onClearAll={() => props.onClearAll('inclusion')}
      />
      <ClauseSection
        title="EXCLUSIONS"
        count={props.exclusions.length}
        clauses={props.exclusions}
        sourceLabel="Added through"
        selectedClauseId={props.selectedClauseId}
        onClauseClick={props.onClauseClick}
        onActionChange={props.onActionChange}
        onActionClear={props.onActionClear}
        onAcceptAll={() => props.onAcceptAll('exclusion')}
        onRejectAll={() => props.onRejectAll('exclusion')}
        onClearAll={() => props.onClearAll('exclusion')}
      />
    </SectionCard>
  )
}

interface UpdatesSectionProps {
  reviews: ClauseReview[]
  selectedReviewId?: number
  onReviewClick: (review: ClauseReview) => void
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}

function UpdatesSection({
  reviews,
  selectedReviewId,
  onReviewClick,
  onActionChange,
  onActionClear,
}: UpdatesSectionProps) {
  return (
    <SectionCard
      title="Clauses with Updates"
      banner={
        <>
          <RichTextDisplayField
            value={[
              <TextItem
                key="d"
                text="Below clauses have a latest version available. Accept the update or retain your current version."
                color="SECONDARY"
                size="STANDARD"
              />,
            ]}
            marginBelow="STANDARD"
          />
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle
              size={16}
              fill="#856C00"
              stroke="#FFFCEB"
              strokeWidth={2.5}
              className="flex-shrink-0"
            />
            <span className="text-sm text-[#222222]">
              Some clause updates are pending review. Retain your current version, request admin for approval, or edit the clause text.
            </span>
          </div>
        </>
      }
    >
      <ReviewTable
        reviews={reviews}
        selectedReviewId={selectedReviewId}
        onReviewClick={onReviewClick}
        onActionChange={onActionChange}
        onActionClear={onActionClear}
      />
    </SectionCard>
  )
}

function ErrorsSection({ incomplete }: { incomplete: IncompleteClause[] }) {
  return (
    <SectionCard
      title="Incomplete clauses"
      banner={
        <RichTextDisplayField
          value={[
            <TextItem
              key="d"
              text="The following clauses are missing fill-in values. Complete the fill-in values in the clause set summary and mark them as complete."
              color="SECONDARY"
              size="STANDARD"
            />,
          ]}
          marginBelow="STANDARD"
        />
      }
    >
      <IncompleteTable incomplete={incomplete} />
    </SectionCard>
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
    <span className="inline-flex items-center gap-1">
      <span>{recommendedBy}</span>
      <span>(</span>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-[#2322F0] hover:underline font-medium"
      >
        <ExternalLink size={14} className="flex-shrink-0" />
        {reference}
      </button>
      <span>)</span>
    </span>
  )
}

// ============================================================================
// ClauseSection — Inclusions / Exclusions grid
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
// ReviewTable — single row per clause with date diff
// ============================================================================

interface ReviewTableProps {
  reviews: ClauseReview[]
  selectedReviewId?: number
  onReviewClick: (review: ClauseReview) => void
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}

function ReviewTable({
  reviews,
  selectedReviewId,
  onReviewClick,
  onActionChange,
  onActionClear,
}: ReviewTableProps) {
  return (
    <div>
    <table className="w-full text-sm table-fixed">
      <colgroup>
        <col style={{ width: '24%' }} />
        <col style={{ width: '14%' }} />
        <col style={{ width: '19%' }} />
        <col style={{ width: '19%' }} />
        <col style={{ width: '24%' }} />
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
            isSelected={selectedReviewId === r.id}
            onReviewClick={onReviewClick}
            onActionChange={onActionChange}
            onActionClear={onActionClear}
          />
        ))}
      </tbody>
    </table>
    </div>
  )
}

/**
 * Renders the review status. "Pending Review" gets a yellow tag;
 * "Updated" shows as a dash since the date diff already conveys the update.
 */
function StatusCell({ status }: { status: string }) {
  if (status === 'Pending Review') {
    return (
      <TagField
        size="SMALL"
        tags={[
          {
            text: status,
            backgroundColor: 'YELLOW_50',
            textColor: 'YELLOW_800',
          },
        ]}
      />
    )
  }
  return <span>-</span>
}

function DateCompare({ existing, next }: { existing: string; next: string }) {
  if (existing === next) {
    return <span>{existing}</span>
  }
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[#222222]">
      <span className="whitespace-nowrap">{existing}</span>
      <ArrowRight size={14} className="flex-shrink-0" />
      <span className="font-semibold whitespace-nowrap">{next}</span>
    </div>
  )
}

interface ReviewRowProps {
  review: ClauseReview
  isSelected: boolean
  onReviewClick: (review: ClauseReview) => void
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}

function ReviewRow({
  review,
  isSelected,
  onReviewClick,
  onActionChange,
  onActionClear,
}: ReviewRowProps) {
  return (
    <tr className={`border-b border-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}>
      <td className="py-3 pr-4 align-middle">
        <button
          type="button"
          onClick={() => onReviewClick(review)}
          className="text-[#2322F0] hover:underline text-left"
        >
          {review.clauseNumber} | {review.title}
        </button>
      </td>
      <td className="py-3 pr-4 align-middle text-gray-600">
        <StatusCell status={review.status} />
      </td>
      <td className="py-3 pr-4 align-middle">
        <DateCompare existing={review.existingEffectiveDate} next={review.newEffectiveDate} />
      </td>
      <td className="py-3 pr-4 align-middle">
        <DateCompare existing={review.existingLastUpdated} next={review.newLastUpdated} />
      </td>
      <td className="py-3 pr-4 align-middle">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
            <input
              type="radio"
              name={`review-${review.id}`}
              checked={review.action === 'retain'}
              onChange={() => onActionChange(review.id, 'retain')}
              className="cursor-pointer accent-[#2322F0]"
            />
            <span>Retain</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
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

function IncompleteTable({ incomplete }: { incomplete: IncompleteClause[] }) {
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


// ============================================================================
// TextDiff — word-level diff renderer using LCS
// ============================================================================

type DiffOp = { type: 'equal' | 'delete' | 'insert'; value: string }

/**
 * Tokenizes text into words + whitespace/punctuation so we can diff at
 * word level while preserving spacing on render.
 */
function tokenize(text: string): string[] {
  // Split into words, whitespace, and punctuation as separate tokens
  return text.match(/\s+|[A-Za-z0-9']+|[^\sA-Za-z0-9']/g) ?? []
}

/**
 * Standard LCS-based diff. Returns an ordered list of operations
 * to transform `a` into `b`.
 */
function diffTokens(a: string[], b: string[]): DiffOp[] {
  const n = a.length
  const m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  const ops: DiffOp[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'equal', value: a[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'delete', value: a[i] })
      i++
    } else {
      ops.push({ type: 'insert', value: b[j] })
      j++
    }
  }
  while (i < n) ops.push({ type: 'delete', value: a[i++] })
  while (j < m) ops.push({ type: 'insert', value: b[j++] })
  return ops
}

function TextDiff({ oldText, newText }: { oldText: string; newText: string }) {
  const ops = diffTokens(tokenize(oldText), tokenize(newText))
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
      {ops.map((op, idx) => {
        if (op.type === 'equal') {
          return <span key={idx}>{op.value}</span>
        }
        if (op.type === 'delete') {
          return (
            <span key={idx} className="text-[#9F0019] line-through">
              {op.value}
            </span>
          )
        }
        return (
          <span key={idx} className="text-[#117C00] font-semibold">
            {op.value}
          </span>
        )
      })}
    </div>
  )
}
