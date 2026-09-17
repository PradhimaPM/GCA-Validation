import { useState, useEffect } from 'react'
import { HeadingField, ButtonWidget } from '@pglevy/sailwind'
import { X, Sparkles, ChevronRight } from 'lucide-react'
import { getSuggestedClauses, type SuggestedClause } from '../db/suggested-clauses'

export default function AddSuggestedClauses() {
  const [clauses, setClauses] = useState<SuggestedClause[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    getSuggestedClauses().then(c => {
      setClauses(c)
      setLoading(false)
    })
  }, [])

  const available = clauses.filter(c => !selectedIds.includes(c.id))
  const selected = clauses.filter(c => selectedIds.includes(c.id))

  const toggle = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleClose = () => {
    window.history.back()
  }

  const handleAdd = () => {
    alert(`${selected.length} clause${selected.length === 1 ? '' : 's'} added.`)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-[87vw] max-w-[1024px] h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Dialog Header (fixed) */}
        <div className="px-6 py-4 flex items-start justify-between border-b border-gray-200 flex-shrink-0 bg-white">
          <div className="flex items-start gap-2.5">
            <Sparkles size={20} className="text-[#2322F0] flex-shrink-0 mt-0.5" />
            <div>
              <HeadingField
                text="Add Suggested Clauses"
                size="SMALL"
                headingTag="H1"
                fontWeight="SEMI_BOLD"
                marginBelow="NONE"
              />
              <span className="text-sm text-[#6C6C75]">
                Select clauses to add to this clause set
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dialog Body (two columns) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Available column */}
          <div className="flex-1 min-w-0 flex flex-col border-r border-gray-200 bg-[#F5F5F7]">
            <div className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
              <span className="text-xs uppercase tracking-wide text-[#6C6C75] font-semibold">
                Available ({available.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {available.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-[#6C6C75]">
                  All clauses have been selected.
                </div>
              ) : (
                available.map(clause => (
                  <AvailableRow
                    key={clause.id}
                    clause={clause}
                    onToggle={() => toggle(clause.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Selected column */}
          <div className="w-[38%] flex-shrink-0 flex flex-col bg-[#F5F5F7]">
            <div className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
              <span className="text-xs uppercase tracking-wide text-[#6C6C75] font-semibold">
                Selected ({selected.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selected.length === 0 ? (
                <div className="px-8 py-16 text-center text-sm text-[#6C6C75] leading-relaxed">
                  Select clauses from the left to stage them for addition
                </div>
              ) : (
                selected.map(clause => (
                  <SelectedRow
                    key={clause.id}
                    clause={clause}
                    onRemove={() => toggle(clause.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dialog Footer (fixed) */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between bg-white flex-shrink-0">
          <ButtonWidget
            label="Cancel"
            style="OUTLINE"
            color="SECONDARY"
            size="STANDARD"
            onClick={handleClose}
          />
          <ButtonWidget
            label="Add Clauses"
            style="SOLID"
            color="ACCENT"
            size="STANDARD"
            disabled={selected.length === 0}
            onClick={handleAdd}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// AvailableRow — a selectable clause on the left, with a checkbox and metadata
// ============================================================================

function AvailableRow({
  clause,
  onToggle,
}: {
  clause: SuggestedClause
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left px-6 py-4 border-b border-gray-100 flex items-start gap-3 hover:bg-gray-50 group"
    >
      <input
        type="checkbox"
        checked={false}
        readOnly
        aria-label={`Select ${clause.clauseNumber}`}
        className="mt-0.5 cursor-pointer accent-[#2322F0] flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#222222]">{clause.clauseNumber}</div>
        <div className="text-sm text-[#222222] mt-0.5">{clause.title}</div>
        <div className="text-xs text-[#6C6C75] mt-1">
          {clause.clauseType} • {clause.regulation} • {clause.effectiveDate}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1"
      />
    </button>
  )
}

// ============================================================================
// SelectedRow — a staged clause on the right, with a checked box and remove
// ============================================================================

function SelectedRow({
  clause,
  onRemove,
}: {
  clause: SuggestedClause
  onRemove: () => void
}) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-start gap-3">
      <input
        type="checkbox"
        checked
        onChange={onRemove}
        aria-label={`Remove ${clause.clauseNumber}`}
        className="mt-0.5 cursor-pointer accent-[#2322F0] flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#222222]">{clause.clauseNumber}</div>
        <div className="text-sm text-[#222222] mt-0.5">{clause.title}</div>
        <div className="text-xs text-[#6C6C75] mt-1">
          {clause.clauseType} • {clause.regulation} • {clause.effectiveDate}
        </div>
      </div>
    </div>
  )
}
