import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  ReadOnlyGrid,
  GridColumn,
  ButtonWidget,
  RichTextDisplayField,
  TextItem,
  TagField,
} from '@pglevy/sailwind'
import { X, Info, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react'
import {
  getClauses,
  updateClauseAction,
  clearClauseAction,
  bulkUpdateClauseActions,
  bulkClearClauseActions,
  type Clause,
} from '../db/clauses'
import {
  getClauseUpdateReviews,
  updateClauseUpdateReviewAction,
  clearClauseUpdateReviewAction,
  type ClauseUpdateReview,
} from '../db/clause-update-reviews'
import { getIncompleteClauses, type IncompleteClause } from '../db/incomplete-clauses'

/** What the side panel is currently showing. */
type PanelView =
  | { kind: 'clause'; clause: Clause }
  | { kind: 'update'; review: ClauseUpdateReview }
  /** Clause Updates has no rows — the pane still opens and explains why. */
  | { kind: 'updates-empty' }

export default function ValidateClauseSetOption3() {
  const [clauses, setClauses] = useState<Clause[]>([])
  const [reviews, setReviews] = useState<ClauseUpdateReview[]>([])
  const [incomplete, setIncomplete] = useState<IncompleteClause[]>([])
  const [loading, setLoading] = useState(true)
  const [panel, setPanel] = useState<PanelView | null>(null)

  useEffect(() => {
    Promise.all([getClauses(), getClauseUpdateReviews(), getIncompleteClauses()]).then(
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

  // Rows whose newer version has not cleared policy review. These are still
  // selectable — the warning above the table sets the expectation.
  const pendingCount = reviews.filter(r => r.pendingReview).length

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
    await updateClauseUpdateReviewAction(id, action)
    setReviews(await getClauseUpdateReviews())
  }

  const handleReviewActionClear = async (id: number) => {
    await clearClauseUpdateReviewAction(id)
    setReviews(await getClauseUpdateReviews())
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
      <div className="w-[87vw] h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
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
          <div className="flex items-center gap-2 px-4 py-3 bg-[#F5F5FC] border border-[#DCDEF5] rounded mb-6">
            <Info
              size={18}
              fill="#2322F0"
              stroke="#F5F5FC"
              strokeWidth={2.5}
              className="flex-shrink-0"
            />
            <span className="text-sm text-[#222222]">
              Review the items below before finalizing the clause set. Make sure all are addressed to complete validation.
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start">
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
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="d"
                        text="Review the clauses suggested based on current rules and templates."
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

                  <ClauseSection
                    title="SUGGESTED INCLUSIONS"
                    count={inclusions.length}
                    clauses={inclusions}
                    sourceLabel="Recommended by"
                    selectedClauseId={panel?.kind === 'clause' ? panel.clause.id : undefined}
                    onClauseClick={c => setPanel({ kind: 'clause', clause: c })}
                    onActionChange={handleActionChange}
                    onActionClear={handleActionClear}
                    onAcceptAll={() => handleAcceptAll('inclusion')}
                    onRejectAll={() => handleRejectAll('inclusion')}
                    onClearAll={() => handleClearAll('inclusion')}
                  />

                  <ClauseSection
                    title="SUGGESTED EXCLUSIONS"
                    count={exclusions.length}
                    clauses={exclusions}
                    sourceLabel="Added through"
                    selectedClauseId={panel?.kind === 'clause' ? panel.clause.id : undefined}
                    onClauseClick={c => setPanel({ kind: 'clause', clause: c })}
                    onActionChange={handleActionChange}
                    onActionClear={handleActionClear}
                    onAcceptAll={() => handleAcceptAll('exclusion')}
                    onRejectAll={() => handleRejectAll('exclusion')}
                    onClearAll={() => handleClearAll('exclusion')}
                  />
                </div>
              </CardLayout>

              {/* Section 2: Clause Updates */}
              <CardLayout padding="NONE" showBorder={true} showShadow={false} style="STANDARD">
                <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-gray-200">
                  <HeadingField
                    text="Clause Updates"
                    size="SMALL"
                    headingTag="H2"
                    fontWeight="SEMI_BOLD"
                    marginBelow="NONE"
                  />
                </div>
                <div className="px-6 py-5">
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="d"
                        text={
                          reviews.length === 0
                            ? 'No clause updates are available. Every clause in this set is on its latest version.'
                            : 'New versions of these clauses are available. Accept the update or keep the current version.'
                        }
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="EVEN_LESS"
                  />

                  {pendingCount > 0 && (
                    <div className="flex items-start gap-2 mb-6">
                      <AlertTriangle
                        size={16}
                        fill="#856C00"
                        stroke="#FFFCEB"
                        strokeWidth={2.5}
                        className="flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-[#222222] leading-relaxed">
                        Items are pending review. Review the changes before proceeding
                      </span>
                    </div>
                  )}

                  <UpdateTable
                    reviews={reviews}
                    selectedReviewId={panel?.kind === 'update' ? panel.review.id : undefined}
                    isEmptySelected={panel?.kind === 'updates-empty'}
                    onReviewClick={r => setPanel({ kind: 'update', review: r })}
                    onEmptyClick={() => setPanel({ kind: 'updates-empty' })}
                    onActionChange={handleReviewActionChange}
                    onActionClear={handleReviewActionClear}
                  />
                </div>
              </CardLayout>

              {/* Section 3: Incomplete clauses */}
              <CardLayout padding="NONE" showBorder={true} showShadow={false} style="STANDARD">
                <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-gray-200">
                  <HeadingField
                    text="Incomplete Clauses"
                    size="SMALL"
                    headingTag="H2"
                    fontWeight="SEMI_BOLD"
                    marginBelow="NONE"
                  />
                </div>
                <div className="px-6 py-5">
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="d"
                        text="Complete the fill-in for these clauses from summary and mark them as complete."
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="STANDARD"
                  />

                  <IncompleteTable incomplete={incomplete} />
                </div>
              </CardLayout>
            </div>

            {/* Side panel */}
            {panel && (
              <div className="w-full lg:w-[380px] xl:w-[440px] lg:flex-shrink-0 h-[650px] lg:sticky lg:top-0">
                {panel.kind === 'clause' ? (
                  <ClausePanel clause={panel.clause} onClose={() => setPanel(null)} />
                ) : panel.kind === 'update' ? (
                  <UpdatePanel review={panel.review} onClose={() => setPanel(null)} />
                ) : (
                  <UpdatesEmptyPanel onClose={() => setPanel(null)} />
                )}
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
// SourceCell — how the clause got here, with a link to its source clause set
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
  const hasAnySelection = clauses.some(c => c.action)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <RichTextDisplayField
          value={[
            <TextItem key="title" text={title} style="STRONG" size="SMALL" />,
            <TextItem key="count" text={` (${count})`} color="SECONDARY" size="SMALL" />,
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
                <span className="text-[#222222]">
                  {row.clauseNumber} | {row.title}
                </span>{' '}
                <button
                  type="button"
                  onClick={() => onClauseClick(row)}
                  className="text-[#2322F0] hover:underline whitespace-nowrap"
                >
                  (View)
                </button>
              </td>
              <td className="py-3 pr-4">
                <SourceCell recommendedBy={row.recommendedBy} reference={row.sourceReference} />
              </td>
              <td className="py-3 pr-4">{row.usage}</td>
              <td className="py-3 pr-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                    <input
                      type="radio"
                      name={`action-${row.id}`}
                      checked={row.action === 'accept'}
                      onChange={() => onActionChange(row.id, 'accept')}
                      className="cursor-pointer accent-[#2322F0]"
                    />
                    <span>Accept</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
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
// IncompleteTable — Clauses with missing information
// ============================================================================

function IncompleteTable({ incomplete }: { incomplete: IncompleteClause[] }) {
  return (
    <ReadOnlyGrid data={incomplete} spacing="DENSE" borderStyle="LIGHT">
      <GridColumn
        label="Clause"
        width="WIDE"
        value={(row: IncompleteClause) => (
          <TextItem text={`${row.clauseNumber} | ${row.title}`} size="STANDARD" />
        )}
      />
    </ReadOnlyGrid>
  )
}

// ============================================================================
// UpdateTable — every clause with a version change, actionable or not.
// Every row offers a newer version, so Retain/Update always applies. Status
// carries a Pending Review tag when that version has not cleared policy
// approval — the CO can still select it, with a warning above the table.
// ============================================================================

interface UpdateTableProps {
  reviews: ClauseUpdateReview[]
  selectedReviewId?: number
  /** True when the side pane is showing the Clause Updates empty state. */
  isEmptySelected: boolean
  onReviewClick: (review: ClauseUpdateReview) => void
  /** Opens the side pane on the empty state when there are no rows. */
  onEmptyClick: () => void
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}

function UpdateTable({
  reviews,
  selectedReviewId,
  isEmptySelected,
  onReviewClick,
  onEmptyClick,
  onActionChange,
  onActionClear,
}: UpdateTableProps) {
  return (
    <table className="w-full text-sm table-fixed">
      <colgroup>
        <col style={{ width: '28%' }} />
        <col style={{ width: '16%' }} />
        <col style={{ width: '18%' }} />
        <col style={{ width: '18%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>
      <thead>
        <tr className="text-left border-b border-gray-200">
          <th className="pb-2 pr-4 font-normal text-gray-500">Clause</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Status</th>
          <th className="pb-2 pr-4 font-normal text-gray-500 text-right">Current Effective Date</th>
          <th className="pb-2 pr-4 font-normal text-gray-500 text-right">New Effective Date</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Action</th>
        </tr>
      </thead>
      <tbody>
        {reviews.length === 0 && (
          <tr className={`border-b border-gray-100 ${isEmptySelected ? 'bg-blue-50' : ''}`}>
            <td colSpan={5} className="py-3 pr-4">
              <button
                type="button"
                onClick={onEmptyClick}
                className="text-[#2322F0] hover:underline text-left"
              >
                All clauses are the latest version.
              </button>
            </td>
          </tr>
        )}
        {reviews.map(r => (
          <UpdateRow
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
  )
}

function UpdateRow({
  review,
  isSelected,
  onReviewClick,
  onActionChange,
  onActionClear,
}: {
  review: ClauseUpdateReview
  isSelected: boolean
  onReviewClick: (review: ClauseUpdateReview) => void
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}) {
  return (
    <tr className={`border-b border-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}>
      <td className="py-3 pr-4 align-middle">
        <span className="text-[#222222]">
          {review.clauseNumber} | {review.title}
        </span>{' '}
        <button
          type="button"
          onClick={() => onReviewClick(review)}
          className="text-[#2322F0] hover:underline whitespace-nowrap"
        >
          (View)
        </button>
      </td>

      <td className="py-3 pr-4 align-middle">
        {review.pendingReview ? (
          <TagField
            size="SMALL"
            tags={[
              {
                text: 'Pending Review',
                backgroundColor: 'YELLOW_50',
                textColor: 'YELLOW_800',
                tooltip: 'This version has not cleared policy approval yet. You can still select it.',
              },
            ]}
          />
        ) : (
          <span className="text-[#6C6C75]">-</span>
        )}
      </td>

      <td className="py-3 pr-4 align-middle text-right">
        <CurrentDate value={review.current.effectiveDate} />
      </td>

      <td className="py-3 pr-4 align-middle text-right">
        <NewDate value={review.available.effectiveDate} />
      </td>

      <td className="py-3 pr-4 align-middle">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
            <input
              type="radio"
              name={`update-${review.id}`}
              checked={review.action === 'retain'}
              onChange={() => onActionChange(review.id, 'retain')}
              className="cursor-pointer accent-[#2322F0]"
            />
            <span>Retain</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
            <input
              type="radio"
              name={`update-${review.id}`}
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

/** The date on the version currently in the clause set. */
function CurrentDate({ value }: { value: string }) {
  return <span className="whitespace-nowrap">{value}</span>
}

/** The date on the version being offered. */
function NewDate({ value }: { value: string }) {
  return <span className="whitespace-nowrap">{value}</span>
}

// ============================================================================
// ClausePanel — prescription text for a compliance row
// ============================================================================

function ClausePanel({ clause, onClose }: { clause: Clause; onClose: () => void }) {
  const [tab, setTab] = useState<'prescription' | 'clause'>('prescription')

  // Reset to the first tab when a different clause is opened.
  useEffect(() => {
    setTab('prescription')
  }, [clause.id])

  const tabs = [
    { id: 'prescription' as const, label: 'Prescription text' },
    { id: 'clause' as const, label: 'Clause text' },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
      <PanelHeader
        eyebrow={clause.clauseNumber}
        title={clause.title}
        onClose={onClose}
        closeLabel="Close clause details"
      />

      <div className="px-5 pt-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex gap-4">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-[#2322F0] text-[#2322F0]'
                  : 'border-transparent text-[#6C6C75] hover:text-[#222222]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 overflow-y-auto flex-1">
        <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {tab === 'prescription' ? clause.text : clause.clauseText}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Metadata change summary — used both when the clause text is unchanged and
// alongside the redline when text + metadata both changed.
// ============================================================================

type MetadataChange = { label: string; from: string; to: string }

/** Builds the list of metadata fields that differ between the two versions. */
function metadataChanges(review: ClauseUpdateReview): MetadataChange[] {
  const currentName = review.current.clauseName ?? review.title
  const availableName = review.available.clauseName ?? review.title
  return [
    currentName !== availableName && {
      label: 'Clause name',
      from: currentName,
      to: availableName,
    },
    review.current.effectiveDate !== review.available.effectiveDate && {
      label: 'Effective date',
      from: review.current.effectiveDate,
      to: review.available.effectiveDate,
    },
  ].filter(Boolean) as MetadataChange[]
}

function MetadataChangeList({ changes }: { changes: MetadataChange[] }) {
  return (
    <div className="space-y-5">
      {changes.map(c => (
        <div key={c.label} className="text-sm">
          <div className="text-[#222222] font-semibold mb-1.5">{c.label}</div>
          <div className="flex items-center gap-2.5 flex-wrap leading-relaxed text-[#222222]">
            <span>{c.from}</span>
            <span className="text-gray-500">changed to</span>
            <span>{c.to}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// UpdatePanel — compares versions for a Clause Updates row
// ============================================================================

function UpdatePanel({
  review,
  onClose,
}: {
  review: ClauseUpdateReview
  onClose: () => void
}) {
  // Opens on the diff, since that is what the decision hinges on. The toggle
  // swaps to the plain original text for anyone who wants to read it straight.
  const [showOriginal, setShowOriginal] = useState(false)

  // Reset when a different row is opened.
  useEffect(() => {
    setShowOriginal(false)
  }, [review.id])

  // The clause body is identical between versions — skip the redline and show
  // what actually changed (effective date, version name). Retain/Update still
  // applies, since there is a new version to adopt.
  if (review.clauseTextUnchanged) {
    return (
      <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
        <PanelHeader
          eyebrow={review.clauseNumber}
          title={review.title}
          onClose={onClose}
          closeLabel="Close update details"
        />
        <div className="px-5 py-5 overflow-y-auto flex-1">
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[#F5F5FC] border border-[#DCDEF5] rounded mb-6">
            <Info
              size={15}
              fill="#2322F0"
              stroke="#F5F5FC"
              strokeWidth={2.5}
              className="flex-shrink-0 mt-0.5"
            />
            <span className="text-xs text-[#222222] leading-relaxed">
              The clause text is unchanged in this version. Only the details below were updated.
            </span>
          </div>

          <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
            What changed
          </span>
          <div className="mt-4">
            <MetadataChangeList changes={metadataChanges(review)} />
          </div>

          <div className="mt-8 pt-5 border-t border-gray-200">
            <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Clause text
            </span>
            <div className="mt-3 flex flex-col items-center text-center py-8 px-4 bg-[#FAFAFC] border border-gray-200 rounded">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EDF7EE] mb-3">
                <CheckCircle size={26} stroke="#70BF73" strokeWidth={2} />
              </div>
              <span className="text-sm text-[#222222] font-semibold mb-1">
                No changes to the clause text
              </span>
              <span className="text-xs text-[#6C6C75] leading-relaxed">
                The clause text is identical to the current version. Only the details above changed.
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
      <PanelHeader
        eyebrow={review.clauseNumber}
        title={review.title}
        onClose={onClose}
        closeLabel="Close update details"
      />

      {/* When a metadata summary leads, the Clause text label + toggle move
          inline above the redline so the heading sits with its content. */}
      {!review.showMetadataSummary && (
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
      )}

      <div className="px-5 py-4 overflow-y-auto flex-1">
        {review.pendingReview && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[#FFFCEB] border border-[#FFECA4] rounded mb-4">
            <AlertTriangle
              size={15}
              fill="#856C00"
              stroke="#FFFCEB"
              strokeWidth={2.5}
              className="flex-shrink-0 mt-0.5"
            />
            <span className="text-xs text-[#222222] leading-relaxed">
              {review.pendingNotice ??
                'AI updated this clause. Pending policy approval. Review changes before proceeding.'}
            </span>
          </div>
        )}

        {review.showMetadataSummary && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              What changed
            </span>
            <div className="mt-4">
              <MetadataChangeList changes={metadataChanges(review)} />
            </div>
          </div>
        )}

        {/* Inline Clause text header — only when the metadata summary leads. */}
        {review.showMetadataSummary && (
          <div className="flex items-center justify-between mb-3">
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
        )}

        {showOriginal ? (
          <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {review.current.text}
          </div>
        ) : (
          <>
            <DiffLegend />
            <TextDiff oldText={review.current.text} newText={review.available.text} />
            {review.skippedNote && (
              <div className="mt-4 px-3 py-2.5 bg-[#F5F5F7] border border-gray-200 rounded text-xs text-[#6C6C75]">
                {review.skippedNote}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// UpdatesEmptyPanel — Clause Updates has no rows. The pane still opens so the
// CO gets an explicit confirmation rather than wondering if it failed to load.
// ============================================================================

function UpdatesEmptyPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
      <PanelHeader
        eyebrow="Clause Updates"
        title="No updates available"
        onClose={onClose}
        closeLabel="Close update details"
      />

      <div className="px-5 py-4 overflow-y-auto flex-1">
        <div className="flex flex-col items-center text-center py-10">
          <CheckCircle
            size={40}
            fill="#117C00"
            stroke="#FFFFFF"
            strokeWidth={2}
            className="mb-4"
          />
          <HeadingField
            text="Everything is up to date"
            size="SMALL"
            headingTag="H3"
            fontWeight="SEMI_BOLD"
            marginBelow="LESS"
          />
          <RichTextDisplayField
            align="CENTER"
            value={[
              <TextItem
                key="body"
                text="Every clause in this set is on its latest published version, so there is nothing to retain or update. New versions will appear here as they are published."
                color="SECONDARY"
                size="STANDARD"
              />,
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function PanelHeader({
  eyebrow,
  title,
  onClose,
  closeLabel,
}: {
  eyebrow: string
  title: string
  onClose: () => void
  closeLabel: string
}) {
  return (
    <div className="px-5 py-4 flex items-start justify-between border-b border-gray-200 flex-shrink-0">
      <div className="pr-3 min-w-0">
        <div className="text-sm text-gray-500 mb-0.5">{eyebrow}</div>
        <HeadingField
          text={title}
          size="SMALL"
          headingTag="H2"
          fontWeight="SEMI_BOLD"
          marginBelow="NONE"
        />
      </div>
      <button
        onClick={onClose}
        aria-label={closeLabel}
        className="text-gray-500 hover:text-gray-700 flex-shrink-0"
      >
        <X size={20} />
      </button>
    </div>
  )
}

// ============================================================================
// DiffLegend — shows the removed / added styling using the styling itself
// ============================================================================

function DiffLegend() {
  return (
    <RichTextDisplayField
      value={[
        <TextItem key="rl" text="Text removed: " color="SECONDARY" size="STANDARD" />,
        <TextItem
          key="rv"
          text="Text removed"
          style="STRIKETHROUGH"
          color="#9F0019"
          size="STANDARD"
        />,
        <TextItem key="sp" text="   " size="STANDARD" />,
        <TextItem key="al" text="Text added: " color="SECONDARY" size="STANDARD" />,
        <TextItem key="av" text="Text added" color="#117C00" size="STANDARD" />,
      ]}
      marginBelow="LESS"
    />
  )
}

// ============================================================================
// TextDiff — word-level diff between two clause texts
// ============================================================================

type DiffOp = { type: 'equal' | 'insert' | 'delete'; value: string }

function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter(t => t.length > 0)
}

/** Longest-common-subsequence diff over word tokens. */
function diffTokens(a: string[], b: string[]): DiffOp[] {
  const n = a.length
  const m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
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
