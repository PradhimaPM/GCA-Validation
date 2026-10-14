import { useState, useEffect, type ReactNode } from 'react'
import { useLocation, useParams } from 'wouter'
import {
  SiteNav,
  HeadingField,
  CardLayout,
  DialogField,
  ButtonWidget,
  RichTextDisplayField,
  TextItem,
  TagField,
  MessageBanner,
  TextField,
  RadioButtonField,
} from '@pglevy/sailwind'
import {
  LayoutGrid,
  List,
  Layers,
  CircleHelp,
  Shuffle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  ConditionsEditor,
  type EditConditionsMode,
} from '../components/edit-conditions-form'
import {
  getReviewQueue,
  getRuleReview,
  approveRuleReview,
  saveRuleReviewDraft,
  countConditions,
  type RuleReview,
  type RuleReviewContent,
  type RuleCondition,
  type ConditionJoin,
  type ReviewClause,
} from '../db/rule-reviews'
import {
  updateRuleApproval,
  type RuleApproval,
  type RuleApprovalStatus,
  type RuleActiveStatus,
} from '../db/rule-approvals'

const navPages = [
  { label: 'Clause Sets', icon: LayoutGrid },
  { label: 'Clauses', icon: List },
  { label: 'Templates', icon: Layers },
  { label: 'Questionnaires', icon: CircleHelp },
  { label: 'Rules', icon: Shuffle, isSelected: true },
]

const statusTagColors: Record<RuleApprovalStatus, { background: string; text: string }> = {
  Pending: { background: '#DBEAFE', text: '#1E40AF' },
  Approved: { background: '#D7F3E0', text: '#166534' },
}

const UNSAVED_CONFIRM = 'You have unsaved changes. Discard them and continue?'

const pluralize = (count: number, singular: string) =>
  `${count} ${singular}${count === 1 ? '' : 's'}`

/* -------------------------------------------------------------------------- */
/* Read-only pieces                                                           */
/* -------------------------------------------------------------------------- */

/** Renders long text as read-only paragraphs, keeping the blank lines in the source. */
function TextBlock({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((paragraph, index) => (
        <RichTextDisplayField
          key={index}
          value={[<TextItem key="t" text={paragraph} size="STANDARD" />]}
          marginBelow="STANDARD"
        />
      ))}
    </>
  )
}

/** One condition on a single line: clause data, operator, value. */
function ConditionRow({ condition }: { condition: RuleCondition }) {
  const isQuestion = condition.clauseData === 'Questionnaire Question'
  return (
    <div className="rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900">
      <p>
        <span className="font-medium">{isQuestion ? condition.question : condition.clauseData}</span>{' '}
        <span className="text-gray-600">{condition.operator}</span>{' '}
        <span>{condition.value}</span>
      </p>
      {isQuestion && <p className="mt-0.5 text-xs text-gray-600">{condition.questionnaire}</p>}
    </div>
  )
}

/** Conditions stacked with the join (AND / OR) between them. */
function ConditionStack({ conditions, join }: { conditions: RuleCondition[]; join: ConditionJoin }) {
  return (
    <div>
      {conditions.map((condition, index) => (
        <div key={condition.id}>
          {index > 0 && <p className="py-1 text-xs font-semibold text-gray-600">{join}</p>}
          <ConditionRow condition={condition} />
        </div>
      ))}
    </div>
  )
}

/**
 * A clause-detail card the reviewer can collapse. Both cards on the right pane
 * start collapsed so the pane stays short, and either one opens on click.
 */
function CollapsibleCard({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-md px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {open ? (
          <ChevronUp size={16} aria-hidden="true" className="text-gray-600" />
        ) : (
          <ChevronDown size={16} aria-hidden="true" className="text-gray-600" />
        )}
      </button>
      {open && <div className="border-t border-gray-200 px-4 py-3">{children}</div>}
    </div>
  )
}

/** A compact row in the clause lists: clickable clause number followed by its title. */
function ClauseRow({ clause, onView }: { clause: ReviewClause; onView: () => void }) {
  return (
    <div className="border-b border-gray-100 px-4 py-2 text-sm last:border-b-0">
      <button
        type="button"
        onClick={onView}
        aria-label={`View ${clause.number} ${clause.title}`}
        className="font-semibold text-blue-700 hover:underline focus:outline-none focus-visible:underline"
      >
        {clause.number}
      </button>
      <span className="ml-2 text-gray-700">{clause.title}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function RuleReviewScreen({ pendingOnly }: { pendingOnly: boolean }) {
  const params = useParams<{ id: string }>()
  const ruleId = Number(params.id)
  const [, setLocation] = useLocation()

  const [queue, setQueue] = useState<RuleApproval[]>([])
  const [review, setReview] = useState<RuleReview | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'missing'>('loading')
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [conditionsMode, setConditionsMode] = useState<EditConditionsMode>('PREVIEW')
  const [selectedClauseId, setSelectedClauseId] = useState<number | null>(null)
  const [viewingClauseId, setViewingClauseId] = useState<number | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [activeStatusInput, setActiveStatusInput] = useState<RuleActiveStatus>('Active')

  useEffect(() => {
    let cancelled = false
    setLoadState('loading')
    setDone(false)
    setConditionsMode('PREVIEW')
    Promise.all([getReviewQueue(), getRuleReview(ruleId)]).then(([rules, stored]) => {
      if (cancelled) return
      setQueue(rules)
      if (!stored) {
        setReview(null)
        setLoadState('missing')
        return
      }
      // Work on a copy so unsaved edits never leak into the data layer.
      const copy = structuredClone(stored)
      setReview(copy)
      setDirty(false)
      const foundRule = rules.find(r => r.id === ruleId)
      if (foundRule) {
        setNameInput(foundRule.name)
        setActiveStatusInput(foundRule.activeStatus)
      }
      const included = copy.clauses.filter(c => c.outcome === 'Included')
      const excluded = copy.clauses.filter(c => c.outcome === 'Excluded')
      setSelectedClauseId([...included, ...excluded][0]?.id ?? null)
      setLoadState('ready')
    })
    return () => {
      cancelled = true
    }
  }, [ruleId])

  const rule = queue.find(r => r.id === ruleId)

  const includedClauses = review?.clauses.filter(c => c.outcome === 'Included') ?? []
  const excludedClauses = review?.clauses.filter(c => c.outcome === 'Excluded') ?? []
  const selectedClause = review?.clauses.find(c => c.id === selectedClauseId) ?? null

  const conditionTotal = review ? countConditions(review) : 0

  const toContent = (r: RuleReview): RuleReviewContent => ({
    join: r.join,
    conditions: r.conditions,
    groups: r.groups,
  })

  /* -------------------------------- navigation ------------------------------- */

  const confirmLeave = () => !dirty || window.confirm(UNSAVED_CONFIRM)

  const goToList = () => {
    if (!confirmLeave()) return
    setLocation('/rules-review')
  }

  /* --------------------------------- actions --------------------------------- */

  /** Edits made in-place in EDIT mode write straight through to the review state. */
  const handleConditionsChange = (content: RuleReviewContent) => {
    setReview(prev => (prev ? { ...prev, ...content } : prev))
    setDirty(true)
  }

  /** Persist name/status changes, if any, so the Rules list and header stay in sync. */
  const persistHeaderIfChanged = async () => {
    if (!rule) return
    const patch: Partial<RuleApproval> = {}
    if (nameInput !== rule.name) patch.name = nameInput
    if (activeStatusInput !== rule.activeStatus) patch.activeStatus = activeStatusInput
    if (Object.keys(patch).length === 0) return
    await updateRuleApproval(ruleId, patch)
    setQueue(await getReviewQueue())
  }

  /** Persist edits without changing the rule's status. */
  const handleSave = async () => {
    if (!review) return
    setBusy(true)
    await persistHeaderIfChanged()
    await saveRuleReviewDraft(ruleId, toContent(review))
    setDirty(false)
    setBusy(false)
    setLocation('/rules-review')
  }

  /** Persist edits AND mark the rule as Approved. */
  const handleSaveAndApprove = async () => {
    if (!review) return
    setBusy(true)
    await persistHeaderIfChanged()
    await approveRuleReview(ruleId, toContent(review))
    setDirty(false)
    setBusy(false)
    setLocation('/rules-review')
  }



  /* ---------------------------------- render --------------------------------- */

  const renderShell = (content: ReactNode) => (
    <div className="flex h-screen bg-white">
      <SiteNav
        displayName="Clause Automation"
        pages={navPages}
        userName="Pradhima P M"
        appianLogoSrc="/images/icon-appian-header.png"
        highlightColor="#C7C4F4"
      />
      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden border-l border-gray-200 bg-gray-50">
        {content}
      </main>
    </div>
  )

  if (loadState === 'loading') {
    return renderShell(
      <div className="p-8">
        <HeadingField text="Loading rule..." size="MEDIUM" headingTag="H1" />
      </div>,
    )
  }

  if (loadState === 'missing' || !review || !rule) {
    return renderShell(
      <div className="p-8 max-w-xl">
        <HeadingField text="Rule not found" size="LARGE" headingTag="H1" marginBelow="LESS" />
        <RichTextDisplayField
          value={[<TextItem key="t" text="This rule doesn't exist or has been removed." color="SECONDARY" />]}
          marginBelow="STANDARD"
        />
        <ButtonWidget label="Back to Rules" style="OUTLINE" color="ACCENT" onClick={() => setLocation('/rules-review')} />
      </div>,
    )
  }

  if (done) {
    const counts = {
      Pending: queue.filter(r => r.status === 'Pending').length,
      Approved: queue.filter(r => r.status === 'Approved').length,
    }
    return renderShell(
      <div className="p-8 max-w-2xl">
        <CardLayout padding="MORE" showBorder={true} shape="SEMI_ROUNDED" style="#FFFFFF">
          <HeadingField
            text={pendingOnly ? 'All pending rules reviewed' : 'All rules reviewed'}
            size="LARGE"
            headingTag="H1"
            marginBelow="LESS"
          />
          <RichTextDisplayField
            value={[
              <TextItem
                key="t"
                text="There are no more pending rules in the library."
                color="SECONDARY"
              />,
            ]}
            marginBelow="STANDARD"
          />
          <div className="flex gap-3 mb-6">
            {(Object.keys(counts) as RuleApprovalStatus[]).map(status => (
              <TagField
                key={status}
                size="STANDARD"
                tags={[
                  {
                    text: `${counts[status]} ${status}`,
                    backgroundColor: statusTagColors[status].background,
                    textColor: statusTagColors[status].text,
                  },
                ]}
                marginBelow="NONE"
              />
            ))}
          </div>
          <ButtonWidget
            label="Back to Rules"
            style="SOLID"
            color="ACCENT"
            onClick={() => setLocation('/rules-review')}
          />
        </CardLayout>
      </div>,
    )
  }

  return renderShell(
    <>
      {/* Page header */}
      <div className="shrink-0 border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <HeadingField
                text="Review Rule"
                size="LARGE"
                headingTag="H1"
                fontWeight="REGULAR"
                marginBelow="NONE"
              />
              <TagField
                size="SMALL"
                tags={[
                  {
                    text: rule.status,
                    backgroundColor: statusTagColors[rule.status].background,
                    textColor: statusTagColors[rule.status].text,
                  },
                ]}
                marginBelow="NONE"
              />
            </div>
            <RichTextDisplayField
              value={[
                <TextItem
                  key="subtitle"
                  text="Review the rule and accept it to add to the library"
                  color="SECONDARY"
                  size="STANDARD"
                />,
              ]}
              marginBelow="NONE"
            />
          </div>

        </div>
      </div>



      {/* Two panes, each scrolling on its own */}
      <div className="flex min-h-0 flex-1">
        {/* Left pane: rule, conditions, included and excluded clauses */}
        <section aria-label="Rule" className="min-w-0 flex-[3] overflow-y-auto px-8 py-6">
          <div className="rounded-md border border-gray-200 bg-white">
            {/* Rule header row: Name (read-only) on the left, Status (always editable) on the right. */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-b border-gray-200 px-5 py-4 md:grid-cols-[2fr_1fr] md:items-start">
              <TextField
                label="Name"
                required={true}
                readOnly={true}
                value={nameInput || rule.name}
                marginBelow="NONE"
              />
              <RadioButtonField
                label="Status"
                required={true}
                choiceLabels={['Active', 'Inactive']}
                choiceValues={['Active', 'Inactive']}
                value={activeStatusInput}
                saveInto={value => {
                  if (!value) return
                  setActiveStatusInput(value as RuleActiveStatus)
                  setDirty(true)
                }}
                choiceLayout="COMPACT"
                marginBelow="NONE"
              />
            </div>

            <div className="px-5 py-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <HeadingField
                    text="Conditions"
                    size="MEDIUM_PLUS"
                    headingTag="H3"
                    fontWeight="SEMI_BOLD"
                    marginBelow="EVEN_LESS"
                  />
                  <p className="text-xs text-gray-600">
                    {conditionsMode === 'EDIT'
                      ? "Ensure multiple conditions of the same clause data type aren't pointing to multiple different values"
                      : `Clause set data that triggers this rule · ${pluralize(conditionTotal, 'condition')} · ${pluralize(review.groups.length, 'group')}`}
                  </p>
                </div>
                <div className="shrink-0 inline-flex items-center gap-1 rounded-md bg-gray-100 p-1">
                  <ButtonWidget
                    label="EDIT"
                    style={conditionsMode === 'EDIT' ? 'OUTLINE' : 'GHOST'}
                    color={conditionsMode === 'EDIT' ? 'ACCENT' : 'STANDARD'}
                    size="SMALL"
                    icon="SquarePen"
                    iconPosition="START"
                    onClick={() => setConditionsMode('EDIT')}
                  />
                  <ButtonWidget
                    label="PREVIEW"
                    style={conditionsMode === 'PREVIEW' ? 'OUTLINE' : 'GHOST'}
                    color={conditionsMode === 'PREVIEW' ? 'ACCENT' : 'STANDARD'}
                    size="SMALL"
                    icon="ListChecks"
                    iconPosition="START"
                    onClick={() => setConditionsMode('PREVIEW')}
                  />
                </div>
              </div>

              {conditionsMode === 'EDIT' ? (
                <ConditionsEditor
                  content={toContent(review)}
                  onChange={handleConditionsChange}
                />
              ) : (
                <>
                  {conditionTotal === 0 && (
                    <p className="text-sm text-gray-700">
                      This rule has no conditions, so it applies to every clause set.
                    </p>
                  )}

                  <div className="space-y-4">
                    {review.conditions.length > 0 && (
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                        <ConditionStack conditions={review.conditions} join={review.join} />
                      </div>
                    )}

                    {review.groups.map((group, groupIndex) => (
                      <div key={group.id}>
                        {(review.conditions.length > 0 || groupIndex > 0) && (
                          <p className="pb-2 text-xs font-semibold text-gray-600">{review.join}</p>
                        )}
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                          <p className="mb-3 text-xs text-gray-700">
                            Condition Group {groupIndex + 1}
                          </p>
                          <ConditionStack conditions={group.conditions} join={group.join} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Included and excluded clauses, one row each */}
          {[
            { label: 'Included Clauses', items: includedClauses },
            { label: 'Excluded Clauses', items: excludedClauses },
          ].map(group => (
            <div key={group.label} className="mt-6 overflow-hidden rounded-md border border-gray-200 bg-white">
              <div className="px-5 py-4">
                <HeadingField
                  text={`${group.label} (${group.items.length})`}
                  size="MEDIUM_PLUS"
                  headingTag="H3"
                  fontWeight="SEMI_BOLD"
                  marginBelow="NONE"
                />
              </div>
              <div className="border-t border-gray-200">
                {group.items.length === 0 && (
                  <p className="px-5 py-4 text-sm text-gray-600">
                    No {group.label.toLowerCase()} in this rule.
                  </p>
                )}
                {group.items.map(clause => (
                  <ClauseRow
                    key={clause.id}
                    clause={clause}
                    onView={() => setViewingClauseId(clause.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Right pane: the selected clause */}
        <section
          aria-label="Clause details"
          className="min-w-0 flex-[2] overflow-y-auto border-l border-gray-200 bg-white px-6 py-6"
        >
          {selectedClause ? (
            <div className="space-y-4">
              <HeadingField
                text={`${selectedClause.number} ${selectedClause.title}`}
                size="MEDIUM"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="NONE"
              />

              <CollapsibleCard
                key={`${selectedClause.id}-clauses`}
                title={`Clauses Involved (${includedClauses.length})`}
                defaultOpen={false}
              >
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-800">
                  {includedClauses.map(clause => (
                    <li key={clause.id}>
                      <span className="font-medium">{clause.number}</span>
                      <span className="text-gray-600"> | {clause.title}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleCard>

              <div className="rounded-md border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">Prescription Text</p>
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <p className="mb-2 text-base">
                    <span className="mr-2 text-sm font-semibold text-gray-700">
                      {selectedClause.number}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedClause.title}
                    </span>
                  </p>
                  <TextBlock text={selectedClause.prescription} />
                </div>
              </div>
            </div>
          ) : (
            <MessageBanner
              primaryText="No clause selected"
              secondaryText={
                review.clauses.length === 0
                  ? 'This rule does not include or exclude any clauses.'
                  : 'Pick a clause from the list to review its text.'
              }
              backgroundColor="INFO"
              highlightColor="INFO"
              icon="info"
              showDecorativeBar={false}
              marginBelow="NONE"
            />
          )}
        </section>
      </div>

      {/* Footer actions — Cancel on the left discards edits and returns to the Rules list. */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-gray-200 bg-white px-8 py-3">
        <div className="flex items-center gap-4">
          <ButtonWidget
            label="Cancel"
            style="OUTLINE"
            color="ACCENT"
            disabled={busy}
            onClick={goToList}
          />
        </div>
        <div className="flex items-center gap-3">
          <ButtonWidget
            label="Save"
            style="OUTLINE"
            color="ACCENT"
            disabled={busy}
            onClick={handleSave}
          />
          <ButtonWidget
            label="Save and Approve"
            style="SOLID"
            color="ACCENT"
            disabled={busy}
            onClick={handleSaveAndApprove}
          />
        </div>
      </div>



      {viewingClauseId !== null &&
        (() => {
          const clause = review.clauses.find(c => c.id === viewingClauseId)
          if (!clause) return null
          return (
            <DialogField
              open={true}
              onOpenChange={open => {
                if (!open) setViewingClauseId(null)
              }}
              title={`${clause.number} — ${clause.title}`}
              width="FIT"
              height="EXTRA_TALL"
              marginBelow="NONE"
            >
              <div className="dialog-size-60 flex h-full min-h-0 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto break-words pr-2 text-sm leading-relaxed text-gray-800">
                  <TextBlock text={clause.text} />
                </div>
                <div className="mt-4 flex shrink-0 justify-end border-t border-gray-200 pt-4">
                  <ButtonWidget
                    label="Close"
                    style="OUTLINE"
                    color="ACCENT"
                    onClick={() => setViewingClauseId(null)}
                  />
                </div>
              </div>
            </DialogField>
          )
        })()}

    </>,
  )
}

/** Review any rule, Pending or Approved. */
export default function RuleReviewPage() {
  return <RuleReviewScreen pendingOnly={false} />
}

/** Review only the rules that are still Pending, one after another. */
export function PendingRuleReviewPage() {
  return <RuleReviewScreen pendingOnly={true} />
}
