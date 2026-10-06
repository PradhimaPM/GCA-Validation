import { useState, useEffect, useRef } from 'react'
import { SiteNav, ButtonWidget, DropdownField } from '@pglevy/sailwind'
import {
  LayoutList,
  List,
  Layers,
  HelpCircle,
  Shuffle,
  Search,
  Download,
  Filter,
  RefreshCw,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  ChevronsRight,
  X,
  Pencil,
  Check,
  Eye,
  Plus,
  History,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { getRules, createRule, RULE_TOTAL_COUNT, type Rule } from '../db/rules'

type OptionTab = 'option1' | 'option2' | 'option3'
type SourceTab = 'all' | 'Standard' | 'Custom'

const SOURCE_FILTER_CHOICES = ['Custom', 'Standard']

const OPTION_TABS: { id: OptionTab; label: string }[] = [
  { id: 'option1', label: 'Option 1' },
  { id: 'option2', label: 'Option 2' },
  { id: 'option3', label: 'Option 3' },
]

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>([])
  const [search, setSearch] = useState('')
  const [option, setOption] = useState<OptionTab>('option1')
  const [sourceTab, setSourceTab] = useState<SourceTab>('all')
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)

  // Row menu + dialogs
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [cloningRule, setCloningRule] = useState<Rule | null>(null)
  const [confirmation, setConfirmation] = useState<Rule | null>(null)
  const [standardBlockRule, setStandardBlockRule] = useState<Rule | null>(null)

  useEffect(() => {
    getRules().then(setRules)
  }, [])

  const refresh = () => getRules().then(setRules)

  const navPages = [
    { label: 'Clause Sets', icon: LayoutList },
    { label: 'Clauses', icon: List },
    { label: 'Templates', icon: Layers },
    { label: 'Questionnaires', icon: HelpCircle },
    { label: 'Rules', icon: Shuffle, isSelected: true },
  ]

  const showSourceColumn = option === 'option1' || option === 'option3'
  const showSourceSubtext = option === 'option2'
  const showSourceTabs = option === 'option3'

  const isSourceFiltered =
    (showSourceTabs && sourceTab !== 'all') || (showSourceColumn && sourceFilter !== null)

  const visibleRules = rules.filter(r => {
    if (showSourceTabs && sourceTab !== 'all' && r.source !== sourceTab) return false
    if (showSourceColumn && sourceFilter !== null && r.source !== sourceFilter) return false
    return true
  })

  const handleCloneCreated = async (newRule: Rule) => {
    await refresh()
    setCloningRule(null)
    setConfirmation(newRule)
  }

  const handleEditFromConfirmation = () => {
    if (confirmation) {
      setEditingRule(confirmation)
      setConfirmation(null)
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <SiteNav
        displayName="Clause Automation"
        pages={navPages}
        userName="Arun Ganesh"
        highlightColor="ACCENT"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Option tabs */}
        <div className="flex items-center gap-6 px-8 pt-4 border-b border-gray-200 flex-shrink-0">
          {OPTION_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setOption(tab.id)
                setSourceTab('all')
                setSourceFilter(null)
              }}
              className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                option === tab.id
                  ? 'border-[#2322F0] text-[#2322F0]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Page header */}
        <div className="flex items-start justify-between px-8 pt-6 pb-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-normal text-gray-900">Rules</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create conditional rules to include or exclude clauses based on clause set data
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <ButtonWidget label="Create Rule" style="OUTLINE" color="ACCENT" size="SMALL" icon="Plus" iconPosition="START" />
            <ButtonWidget label="Create Rules with AI" style="SOLID" color="ACCENT" size="SMALL" icon="Sparkles" iconPosition="START" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="bg-white border border-gray-200 rounded-md shadow-sm">
            {/* Source tabs (Option 3) */}
            {showSourceTabs && (
              <div className="flex items-center gap-6 px-4 pt-3 border-b border-gray-100">
                {([
                  { id: 'all', label: 'All' },
                  { id: 'Standard', label: 'Standard' },
                  { id: 'Custom', label: 'Custom' },
                ] as { id: SourceTab; label: string }[]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSourceTab(tab.id)}
                    className={`pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      sourceTab === tab.id
                        ? 'border-[#2322F0] text-[#2322F0]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search Rules"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-2 text-sm font-medium text-[#2322F0] border border-[#2322F0] rounded hover:bg-blue-50">
                SEARCH
              </button>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs uppercase tracking-wide text-gray-500">Status</span>
                <button className="flex items-center justify-between gap-2 flex-1 max-w-sm px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50">
                  <span>Any</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
              </div>
              {showSourceColumn && (
                <div className="flex items-center gap-2 w-60 shrink-0">
                  <span className="text-xs uppercase tracking-wide text-gray-500">Source</span>
                  <DropdownField
                    label="Source"
                    labelPosition="COLLAPSED"
                    placeholder="Any"
                    choiceLabels={SOURCE_FILTER_CHOICES}
                    choiceValues={SOURCE_FILTER_CHOICES}
                    value={sourceFilter}
                    saveInto={value => setSourceFilter(value ?? null)}
                    marginBelow="NONE"
                  />
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <IconButton label="Export"><Download size={16} /></IconButton>
                <IconButton label="Filter"><Filter size={16} /></IconButton>
                <IconButton label="Refresh"><RefreshCw size={16} /></IconButton>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  <th className="text-left font-semibold px-4 py-3">Name</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  {showSourceColumn && (
                    <th className="text-left font-semibold px-4 py-3">Source</th>
                  )}
                  <th className="text-left font-semibold px-4 py-3">Conditions</th>
                  <th className="text-right font-semibold px-4 py-3">Included Clauses</th>
                  <th className="text-right font-semibold px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      Excluded Clauses
                      <ChevronDown size={14} className="text-gray-500" />
                    </span>
                  </th>
                  <th className="text-left font-semibold px-4 py-3">Last Updated</th>
                  <th className="w-10 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {visibleRules.map(rule => (
                  <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{rule.name}</div>
                      {showSourceSubtext && (
                        <div className="text-xs text-[#6C6C75] mt-0.5">{rule.source}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag status={rule.status} />
                    </td>
                    {showSourceColumn && (
                      <td className="px-4 py-3 text-gray-700">{rule.source}</td>
                    )}
                    <td className="px-4 py-3 text-gray-700">
                      {rule.conditionCount} condition{rule.conditionCount === 1 ? '' : 's'} • {rule.groupCount} group{rule.groupCount === 1 ? '' : 's'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{rule.includedClauses}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{rule.excludedClauses}</td>
                    <td className="px-4 py-3 text-gray-700">{rule.lastUpdated}</td>
                    <td className="px-4 py-3 text-right relative">
                      <RowActionsMenu
                        rule={rule}
                        isOpen={menuOpenId === rule.id}
                        onToggle={() => setMenuOpenId(menuOpenId === rule.id ? null : rule.id)}
                        onClose={() => setMenuOpenId(null)}
                        onEdit={() => {
                          setMenuOpenId(null)
                          if (rule.source === 'Standard') {
                            setStandardBlockRule(rule)
                          } else {
                            setEditingRule(rule)
                          }
                        }}
                        onClone={() => {
                          setMenuOpenId(null)
                          setCloningRule(rule)
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paging */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 text-sm text-gray-600">
              <PageControl label="First" disabled><ChevronsRight size={16} className="rotate-180" /></PageControl>
              <PageControl label="Previous" disabled><ChevronRight size={16} className="rotate-180" /></PageControl>
              <span className="px-2">
                <span className="font-semibold text-gray-900">1 – {visibleRules.length}</span> of {isSourceFiltered ? visibleRules.length : RULE_TOTAL_COUNT}
              </span>
              <PageControl label="Next"><ChevronRight size={16} /></PageControl>
              <PageControl label="Last"><ChevronsRight size={16} /></PageControl>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {editingRule && (
        <EditRuleDialog
          rule={editingRule}
          onClose={() => setEditingRule(null)}
        />
      )}
      {cloningRule && (
        <CloneRuleDialog
          rule={cloningRule}
          onClose={() => setCloningRule(null)}
          onCreated={handleCloneCreated}
        />
      )}
      {confirmation && (
        <ConfirmationDialog
          rule={confirmation}
          onClose={() => setConfirmation(null)}
          onEdit={handleEditFromConfirmation}
        />
      )}
      {standardBlockRule && (
        <StandardBlockDialog
          rule={standardBlockRule}
          onClose={() => setStandardBlockRule(null)}
          onClone={() => {
            const r = standardBlockRule
            setStandardBlockRule(null)
            setCloningRule(r)
          }}
        />
      )}
    </div>
  )
}

// ============================================================================
// Row three-dot menu — options differ by source
// ============================================================================

interface RowActionsMenuProps {
  rule: Rule
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onEdit: () => void
  onClone: () => void
}

function RowActionsMenu(props: RowActionsMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!props.isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        props.onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [props])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        aria-label="Row actions"
        onClick={props.onToggle}
        className="text-gray-400 hover:text-gray-600 p-1"
      >
        <MoreVertical size={16} />
      </button>
      {props.isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 text-left">
          <MenuItem icon={<Pencil size={14} />} label="Edit Rule" onClick={props.onEdit} />
          <MenuItem icon={<History size={14} />} label="View rule history" />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  destructive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
        destructive ? 'text-red-600' : 'text-gray-700'
      }`}
    >
      <span className={destructive ? 'text-red-500' : 'text-gray-500'}>{icon}</span>
      {label}
    </button>
  )
}

// ============================================================================
// Standard-rule block dialog — "You can't edit standard rules. Clone instead?"
// ============================================================================

interface StandardBlockDialogProps {
  rule: Rule
  onClose: () => void
  onClone: () => void
}

function StandardBlockDialog(props: StandardBlockDialogProps) {
  return (
    <DialogShell title="Edit Rule" width="MEDIUM">
      <div className="px-6 pt-5 pb-6">
        <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border-l-4 border-[#2322F0] rounded">
          <Info size={18} className="text-[#2322F0] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-800">
            <p>
              <span className="font-semibold">{props.rule.name}</span> is a standard rule and can't be edited directly.
            </p>
            <p className="mt-1">Clone it as a custom rule to make changes.</p>
          </div>
        </div>
      </div>
      <DialogFooter bordered align="SPLIT">
        <OutlineButton label="CANCEL" onClick={props.onClose} />
        <PrimaryButton label="CLONE TO EDIT" onClick={props.onClone} />
      </DialogFooter>
    </DialogShell>
  )
}

// ============================================================================
// Clone Rule dialog — prefilled name "copy_<rulename>"
// ============================================================================

interface CloneRuleDialogProps {
  rule: Rule
  onClose: () => void
  onCreated: (newRule: Rule) => void
}

function CloneRuleDialog(props: CloneRuleDialogProps) {
  const [name, setName] = useState(`clone_${props.rule.name}`)
  const [submitting, setSubmitting] = useState(false)

  const MAX_NAME = 50
  const canSubmit = name.trim().length > 0 && !submitting

  const handleCreate = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    const { id: _id, ...rest } = props.rule
    const newRule = await createRule({
      ...rest,
      name: name.trim(),
      source: 'Custom',
      status: 'Draft',
      lastUpdated: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    })
    props.onCreated(newRule)
  }

  return (
    <DialogShell title="Clone Rule" width="MEDIUM">
      <div className="px-6 pt-5 pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.slice(0, MAX_NAME))}
            autoFocus
            className="w-full px-3 py-2 pr-14 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {name.length}/{MAX_NAME}
          </span>
        </div>
      </div>
      <DialogFooter bordered align="SPLIT">
        <OutlineButton label="CANCEL" onClick={props.onClose} />
        <PrimaryButton label="CLONE" disabled={!canSubmit} onClick={handleCreate} />
      </DialogFooter>
    </DialogShell>
  )
}

// ============================================================================
// Confirmation dialog — "Rule cloned. Edit now?"
// ============================================================================

interface ConfirmationDialogProps {
  rule: Rule
  onClose: () => void
  onEdit: () => void
}

function ConfirmationDialog(props: ConfirmationDialogProps) {
  return (
    <DialogShell title="Rule Cloned" width="MEDIUM">
      <div className="px-6 pt-5 pb-6">
        <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border-l-4 border-green-600 rounded">
          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-800">
            <p>
              <span className="font-semibold">{props.rule.name}</span> was created as a custom rule.
            </p>
            <p className="mt-1">Do you want to edit it now?</p>
          </div>
        </div>
      </div>
      <DialogFooter bordered align="SPLIT">
        <OutlineButton label="NOT NOW" onClick={props.onClose} />
        <PrimaryButton label="EDIT RULE" onClick={props.onEdit} />
      </DialogFooter>
    </DialogShell>
  )
}

// ============================================================================
// Edit Rule dialog — stepper (Create → Include → Exclude)
// ============================================================================

interface EditRuleDialogProps {
  rule: Rule
  onClose: () => void
}

const EDIT_STEPS = ['Create Rule', 'Include Clauses', 'Exclude Clauses']

function EditRuleDialog(props: EditRuleDialogProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState(props.rule.name)
  const [status, setStatus] = useState<'Active' | 'Inactive'>(
    props.rule.status === 'Active' ? 'Active' : 'Inactive'
  )
  const [mode, setMode] = useState<'EDIT' | 'PREVIEW'>('EDIT')
  const [match, setMatch] = useState<'AND' | 'OR'>('AND')

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 pt-10 z-50">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 flex items-start justify-between border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Rule</h2>
            <p className="text-xs text-[#6C6C75] mt-0.5">
              Required fields are marked with an asterisk (*)
            </p>
          </div>
          <button onClick={props.onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-8 py-5 flex-shrink-0">
          <Stepper steps={EDIT_STEPS} active={step} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          {step === 0 && (
            <StepCreateRule
              name={name}
              setName={setName}
              status={status}
              setStatus={setStatus}
              mode={mode}
              setMode={setMode}
              match={match}
              setMatch={setMatch}
            />
          )}
          {step === 1 && <StepIncludeClauses />}
          {step === 2 && <StepExcludeClauses />}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <ButtonWidget
            label="Cancel"
            style="LINK"
            color="ACCENT"
            size="SMALL"
            onClick={props.onClose}
          />
          <div className="flex gap-2">
            {step > 0 && (
              <ButtonWidget
                label="Back"
                style="OUTLINE"
                color="ACCENT"
                size="SMALL"
                onClick={() => setStep(step - 1)}
              />
            )}
            {step < EDIT_STEPS.length - 1 ? (
              <ButtonWidget
                label="Next"
                style="SOLID"
                color="ACCENT"
                size="SMALL"
                onClick={() => setStep(step + 1)}
              />
            ) : (
              <ButtonWidget
                label="Save"
                style="SOLID"
                color="ACCENT"
                size="SMALL"
                onClick={props.onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Stepper ---------------------------------------------------------------

function Stepper({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="flex items-start">
      {steps.map((label, i) => {
        const isActive = i === active
        const isDone = i < active
        return (
          <div key={label} className="flex items-start flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                  isActive
                    ? 'border-[#2322F0] text-[#2322F0] bg-white'
                    : isDone
                    ? 'border-[#2322F0] bg-[#2322F0] text-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : ''}
              </div>
              <span
                className={`mt-2 text-xs ${
                  isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mt-3 mx-2" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---- Step 0: Create Rule ---------------------------------------------------

interface StepCreateRuleProps {
  name: string
  setName: (v: string) => void
  status: 'Active' | 'Inactive'
  setStatus: (v: 'Active' | 'Inactive') => void
  mode: 'EDIT' | 'PREVIEW'
  setMode: (v: 'EDIT' | 'PREVIEW') => void
  match: 'AND' | 'OR'
  setMatch: (v: 'AND' | 'OR') => void
}

function StepCreateRule(props: StepCreateRuleProps) {
  return (
    <div>
      {/* Name + Status */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={props.name}
            onChange={e => props.setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6 pt-1.5">
            <RadioOption
              label="Active"
              checked={props.status === 'Active'}
              onChange={() => props.setStatus('Active')}
            />
            <RadioOption
              label="Inactive"
              checked={props.status === 'Inactive'}
              onChange={() => props.setStatus('Inactive')}
            />
          </div>
        </div>
      </div>

      {/* Conditions header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Conditions</h3>
          <p className="text-xs text-[#6C6C75] mt-0.5">
            Ensure multiple conditions of the same clause data type aren't pointing to multiple different values
          </p>
        </div>
        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
          <SegmentButton
            label="Edit"
            icon={<Pencil size={13} />}
            active={props.mode === 'EDIT'}
            onClick={() => props.setMode('EDIT')}
          />
          <SegmentButton
            label="Preview"
            icon={<Eye size={13} />}
            active={props.mode === 'PREVIEW'}
            onClick={() => props.setMode('PREVIEW')}
          />
        </div>
      </div>

      {/* Match */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Match <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-6">
          <RadioOption
            label="All Condition (AND)"
            checked={props.match === 'AND'}
            onChange={() => props.setMatch('AND')}
          />
          <RadioOption
            label="Any Condition (OR)"
            checked={props.match === 'OR'}
            onChange={() => props.setMatch('OR')}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4" />

      {/* Condition row */}
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end mb-3">
        <FormField label="Clause Data" required>
          <DropdownStub value="Contract Category" />
        </FormField>
        <FormField label="Operator" required>
          <DropdownStub value="Equals" />
        </FormField>
        <FormField label="Value" required>
          <DropdownStub value="New" />
        </FormField>
        <button
          aria-label="Remove condition"
          className="h-9 w-9 flex items-center justify-center text-[#2322F0] hover:bg-blue-50 rounded"
        >
          <X size={16} />
        </button>
      </div>

      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2322F0] hover:underline">
        <Plus size={14} />
        Add Condition
      </button>

      {/* Condition group */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md py-6 flex flex-col items-center">
        <p className="text-sm text-[#6C6C75] mb-2">Condition group goes here</p>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2322F0] hover:underline">
          <Plus size={14} />
          Add Condition Group
        </button>
      </div>
    </div>
  )
}

function StepIncludeClauses() {
  return (
    <div className="py-16 text-center">
      <h3 className="text-base font-semibold text-gray-900">Include Clauses</h3>
      <p className="text-sm text-[#6C6C75] mt-2">
        Pick the clauses to include when this rule's conditions match.
      </p>
    </div>
  )
}

function StepExcludeClauses() {
  return (
    <div className="py-16 text-center">
      <h3 className="text-base font-semibold text-gray-900">Exclude Clauses</h3>
      <p className="text-sm text-[#6C6C75] mt-2">
        Pick the clauses to exclude when this rule's conditions match.
      </p>
    </div>
  )
}

// ---- Shared edit-dialog bits -----------------------------------------------

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700">
      <span
        onClick={onChange}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          checked ? 'border-[#2322F0]' : 'border-gray-400'
        }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-[#2322F0]" />}
      </span>
      {label}
    </label>
  )
}

function SegmentButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
        active
          ? 'bg-blue-50 text-[#2322F0]'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

function DropdownStub({ value }: { value: string }) {
  return (
    <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-800 border border-gray-300 rounded hover:bg-gray-50">
      <span>{value}</span>
      <ChevronDown size={16} className="text-gray-400" />
    </button>
  )
}

// ============================================================================
// Shared dialog shell (matches "Save Filters" template)
// ============================================================================

function DialogShell({
  title,
  children,
  width = 'SMALL',
}: {
  title: string
  children: React.ReactNode
  width?: 'SMALL' | 'MEDIUM'
}) {
  const widthClass = width === 'MEDIUM' ? 'max-w-xl' : 'max-w-md'
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className={`w-full ${widthClass} bg-white rounded shadow-2xl overflow-hidden`}>
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

function DialogFooter({
  children,
  bordered,
  align = 'END',
}: {
  children: React.ReactNode
  bordered?: boolean
  align?: 'END' | 'SPLIT'
}) {
  return (
    <div
      className={`flex items-center gap-3 px-6 py-4 bg-white ${
        bordered ? 'border-t border-gray-200' : ''
      } ${align === 'SPLIT' ? 'justify-between' : 'justify-end'}`}
    >
      {children}
    </div>
  )
}

function OutlineButton({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 text-sm font-semibold tracking-wide border rounded transition-colors ${
        disabled
          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
          : 'border-[#2322F0] text-[#2322F0] hover:bg-blue-50'
      }`}
    >
      {label}
    </button>
  )
}

function PrimaryButton({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 text-sm font-semibold tracking-wide text-white rounded transition-colors ${
        disabled
          ? 'bg-blue-200 cursor-not-allowed'
          : 'bg-[#2322F0] hover:bg-[#1C1BC9]'
      }`}
    >
      {label}
    </button>
  )
}

// ============================================================================
// Shared row helpers
// ============================================================================

function StatusTag({ status }: { status: Rule['status'] }) {
  const isActive = status === 'Active'
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      }`}
    >
      {status}
    </span>
  )
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-8 h-8 text-gray-500 border border-gray-300 rounded hover:bg-gray-50"
    >
      {children}
    </button>
  )
}

function PageControl({
  label,
  disabled,
  children,
}: {
  label: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      className={`flex items-center justify-center w-7 h-7 rounded ${
        disabled ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}
