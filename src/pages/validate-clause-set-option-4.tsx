import { useState, useEffect, useRef } from 'react'
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
import { X, Info, ExternalLink, Clock } from 'lucide-react'
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
  type ClauseVersion,
} from '../db/clause-update-reviews'
import { getIncompleteClauses, type IncompleteClause } from '../db/incomplete-clauses'

/** What the side panel is currently showing. */
type PanelView =
  | { kind: 'clause'; clause: Clause }
  | { kind: 'update'; review: ClauseUpdateReview }

export default function ValidateClauseSetOption4() {
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
              Review the items below before finalizing the clause set. Make sure all clauses are addressed to complete validation.
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
                        text="Include or exclude these clauses based on current rules and templates."
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
                        text="New versions of these clauses are available. Accept the update or keep the current version."
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="STANDARD"
                  />

                  <UpdateTable
                    reviews={reviews}
                    selectedReviewId={panel?.kind === 'update' ? panel.review.id : undefined}
                    onReviewClick={r => setPanel({ kind: 'update', review: r })}
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
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="d"
                        text="Complete the fill-in for these clauses and mark them as complete."
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
                ) : (
                  <UpdatePanel review={panel.review} onClose={() => setPanel(null)} />
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

  // Clauses in a section are copied from a single source clause set, so the link
  // appears once above the table instead of repeating on every row.
  const sourceReference = clauses.find(c => c.sourceReference)?.sourceReference

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

      {sourceReference && (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 my-3 text-sm text-[#6C6C75]">
          <span>Clauses are copied from</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[#2322F0] hover:underline font-medium"
          >
            <ExternalLink size={14} className="flex-shrink-0" />
            {sourceReference}
          </button>
        </div>
      )}

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
              <td className="py-3 pr-4">{row.recommendedBy}</td>
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
// A row is actionable when `available` is set: the dates show current -> new and
// Retain/Update applies. When it isn't, the set already holds the newest usable
// text, so the dates stand alone and the Action cell is a dash.
// Status carries the Pending Review tag when an unapproved alternate exists;
// that version is readable from the side panel but never selectable.
// ============================================================================

interface UpdateTableProps {
  reviews: ClauseUpdateReview[]
  selectedReviewId?: number
  onReviewClick: (review: ClauseUpdateReview) => void
  onActionChange: (id: number, action: 'retain' | 'update') => void
  onActionClear: (id: number) => void
}

function UpdateTable({
  reviews,
  selectedReviewId,
  onReviewClick,
  onActionChange,
  onActionClear,
}: UpdateTableProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-sm text-[#6C6C75] py-2">
        All clauses are the latest version.
      </div>
    )
  }

  return (
    <table className="w-full text-sm table-fixed">
      <colgroup>
        <col style={{ width: '20%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>
      <thead>
        <tr className="text-left border-b border-gray-200">
          <th className="pb-2 pr-4 font-normal text-gray-500">Clause</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Status</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Current Effective Date</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">New Effective Date</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Current Last Updated</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">New Last Updated</th>
          <th className="pb-2 pr-4 font-normal text-gray-500">Action</th>
        </tr>
      </thead>
      <tbody>
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
        <span className="inline-flex items-start gap-1.5">
          {review.pending && (
            <HoverTip text={pendingHelpText(review)}>
              <Clock size={15} className="flex-shrink-0 mt-0.5 text-[#856C00] cursor-help" />
            </HoverTip>
          )}
          <button
            type="button"
            onClick={() => onReviewClick(review)}
            className="text-[#2322F0] hover:underline text-left"
          >
            {review.clauseNumber} | {review.title}
          </button>
        </span>
      </td>

      <td className="py-3 pr-4 align-middle">
        {review.pending ? (
          <HoverTip text={pendingHelpText(review)}>
            <TagField
              size="SMALL"
              tags={[
                {
                  text: 'Pending Review',
                  backgroundColor: 'YELLOW_50',
                  textColor: 'YELLOW_800',
                },
              ]}
              marginBelow="NONE"
            />
          </HoverTip>
        ) : (
          <span className="text-[#6C6C75]">-</span>
        )}
      </td>

      <td className="py-3 pr-4 align-middle">
        <CurrentDate value={review.current.effectiveDate} />
      </td>

      <td className="py-3 pr-4 align-middle">
        <NewDate current={review.current.effectiveDate} next={review.available?.effectiveDate} />
      </td>

      <td className="py-3 pr-4 align-middle">
        <CurrentDate value={review.current.lastUpdated} />
      </td>

      <td className="py-3 pr-4 align-middle">
        <NewDate current={review.current.lastUpdated} next={review.available?.lastUpdated} />
      </td>

      <td className="py-3 pr-4 align-middle">
        {review.available ? (
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
        ) : (
          <span className="text-[#6C6C75]">-</span>
        )}
      </td>
    </tr>
  )
}

/**
 * Tooltip that appears immediately on hover or keyboard focus. Used instead of
 * the native `title` attribute, which has a long delay and unstyled system
 * chrome. Positioned above the trigger, falling below when there is no room.
 */
function HoverTip({ text, children }: { text: string; children: React.ReactNode }) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const TIP_WIDTH = 288
  const TIP_ESTIMATED_HEIGHT = 72
  const GAP = 8

  // Positioned with `fixed` so the dialog's scrolling body cannot clip it.
  const show = () => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const fitsAbove = rect.top - TIP_ESTIMATED_HEIGHT - GAP > 0
    setPosition({
      top: fitsAbove ? rect.top - GAP - TIP_ESTIMATED_HEIGHT : rect.bottom + GAP,
      left: Math.min(rect.left, window.innerWidth - TIP_WIDTH - 16),
    })
  }

  return (
    <span
      ref={triggerRef}
      className="inline-flex"
      onMouseEnter={show}
      onMouseLeave={() => setPosition(null)}
      onFocus={show}
      onBlur={() => setPosition(null)}
      tabIndex={0}
      role="button"
      aria-label={text}
    >
      {children}
      {position && (
        <span
          role="tooltip"
          style={{ top: position.top, left: position.left, width: TIP_WIDTH }}
          className="fixed z-[60] px-3 py-2 rounded bg-[#222222] text-white text-xs leading-relaxed shadow-lg pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  )
}

/**
 * Explains what Pending Review means for this specific row. The tag looks the
 * same either way, but the consequence differs: one row still has an update to
 * take, the other has nothing to decide until approval comes through.
 */
function pendingHelpText(review: ClauseUpdateReview): string {
  if (review.available) {
    return 'Update to import unprocessed clause text to edit as needed, or wait for approval.'
  }
  return 'You already have the unprocessed text. The reviewed version is view-only until approved.'
}

/** The date on the version currently in the clause set. */
function CurrentDate({ value }: { value: string }) {
  return <span className="whitespace-nowrap">{value}</span>
}

/**
 * The date on the version being offered. Renders a dash when there is nothing
 * to move to, or when the date is unchanged between the two versions.
 */
function NewDate({ current, next }: { current: string; next?: string }) {
  if (!next || next === current) {
    return <span className="text-[#6C6C75]">-</span>
  }
  return <span className="whitespace-nowrap">{next}</span>
}

// ============================================================================
// ClausePanel — prescription text for a compliance row
// ============================================================================

function ClausePanel({ clause, onClose }: { clause: Clause; onClose: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
      <PanelHeader
        eyebrow={clause.clauseNumber}
        title={clause.title}
        onClose={onClose}
        closeLabel="Close clause details"
      />
      <div className="px-5 py-4 overflow-y-auto flex-1">
        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
          Prescription text
        </div>
        <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {clause.text}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// UpdatePanel — compares versions for a Clause Updates row
// ============================================================================

type UpdatePanelTab = 'changes' | 'current' | 'pending'

function UpdatePanel({
  review,
  onClose,
}: {
  review: ClauseUpdateReview
  onClose: () => void
}) {
  // Rows with nothing actionable open on their current text, since there is no diff.
  const [tab, setTab] = useState<UpdatePanelTab>(review.available ? 'changes' : 'current')

  // Reset when a different row is opened.
  useEffect(() => {
    setTab(review.available ? 'changes' : 'current')
  }, [review.id, review.available])

  const tabs: { id: UpdatePanelTab; label: string }[] = [
    ...(review.available ? [{ id: 'changes' as const, label: 'Changes' }] : []),
    { id: 'current' as const, label: 'Original version' },
    ...(review.pending ? [{ id: 'pending' as const, label: 'In review' }] : []),
  ]

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col h-full">
      <PanelHeader
        eyebrow={review.clauseNumber}
        title={review.title}
        onClose={onClose}
        closeLabel="Close update details"
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
        {tab === 'changes' && review.available && (
          <>
            {isUnprocessed(review.available, review.hasAlternate) && <UnprocessedBanner />}
            <div className="flex items-center gap-4 text-xs mb-3">
              <span className="inline-flex items-center gap-1.5 text-[#6C6C75]">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#9F0019]" />
                Removed
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#6C6C75]">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#117C00]" />
                Added
              </span>
            </div>
            <TextDiff oldText={review.current.text} newText={review.available.text} />
            {review.skippedNote && (
              <div className="mt-4 px-3 py-2.5 bg-[#F5F5F7] border border-gray-200 rounded text-xs text-[#6C6C75]">
                {review.skippedNote}
              </div>
            )}
          </>
        )}

        {tab === 'current' && (
          <>
            {isUnprocessed(review.current, review.hasAlternate) && <UnprocessedBanner />}
            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {review.current.text}
            </div>
          </>
        )}

        {tab === 'pending' && review.pending && (
          <>
            <div className="flex items-start gap-2 px-3 py-2.5 bg-[#FFFCEB] border border-[#FFECA4] rounded mb-4">
              <Clock size={15} className="flex-shrink-0 mt-0.5 text-[#856C00]" />
              <span className="text-xs text-[#222222] leading-relaxed">
                Read-only until approved. You cannot select this version yet.
              </span>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {review.pending.text}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * True when a version still carries its alternate instructions at the end
 * rather than having them worked into the body.
 */
function isUnprocessed(version: ClauseVersion, hasAlternate: boolean): boolean {
  return hasAlternate && version.kind === 'as-published'
}

/** Flags clause text that has not had its alternate instructions applied yet. */
function UnprocessedBanner() {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 bg-[#F5F5FC] border border-[#DCDEF5] rounded mb-4">
      <Info
        size={15}
        fill="#2322F0"
        stroke="#F5F5FC"
        strokeWidth={2.5}
        className="flex-shrink-0 mt-0.5"
      />
      <span className="text-xs text-[#222222] leading-relaxed">
        This version still has its alternate instructions at the end. Edit the text from the
        document or the clause set summary if you need it applied now.
      </span>
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
