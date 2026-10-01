import { useState, useEffect } from 'react'
import { SiteNav, ButtonWidget } from '@pglevy/sailwind'
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
} from 'lucide-react'
import { getRules, RULE_TOTAL_COUNT, type Rule } from '../db/rules'

type OptionTab = 'option1' | 'option2' | 'option3'
type SourceTab = 'all' | 'Standard' | 'Custom'

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

  useEffect(() => {
    getRules().then(setRules)
  }, [])

  const navPages = [
    { label: 'Clause Sets', icon: LayoutList },
    { label: 'Clauses', icon: List },
    { label: 'Templates', icon: Layers },
    { label: 'Questionnaires', icon: HelpCircle },
    { label: 'Rules', icon: Shuffle, isSelected: true },
  ]

  // Option-specific grid behavior
  const showSourceColumn = option === 'option1' || option === 'option3'
  const showSourceSubtext = option === 'option2'
  const showSourceTabs = option === 'option3'

  const visibleRules =
    showSourceTabs && sourceTab !== 'all'
      ? rules.filter(r => r.source === sourceTab)
      : rules

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <SiteNav
        displayName="Clause Automation"
        pages={navPages}
        userName="Arun Ganesh"
        highlightColor="ACCENT"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Option tabs (above the heading) */}
        <div className="flex items-center gap-6 px-8 pt-4 border-b border-gray-200 flex-shrink-0">
          {OPTION_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setOption(tab.id)
                setSourceTab('all')
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
            {/* Source tabs (Option 3 only) */}
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
                        <div className="text-xs text-gray-500 mt-0.5">{rule.source}</div>
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
                    <td className="px-4 py-3 text-right">
                      <button aria-label="Row actions" className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
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
                <span className="font-semibold text-gray-900">1 – {visibleRules.length}</span> of {showSourceTabs && sourceTab !== 'all' ? visibleRules.length : RULE_TOTAL_COUNT}
              </span>
              <PageControl label="Next"><ChevronRight size={16} /></PageControl>
              <PageControl label="Last"><ChevronsRight size={16} /></PageControl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
