import {
  HeadingField,
  ButtonWidget,
  RichTextDisplayField,
  TextItem,
} from '@pglevy/sailwind'
import { X } from 'lucide-react'

/**
 * Empty-state variant of the Validate Clause Set popup.
 * Same shell as Option 1 — each table renders an empty-state row
 * inside the table body. No section-level info/warning banners or
 * bulk action links since there is nothing to act on.
 */
export default function ValidateClauseSetEmpty() {
  const handleClose = () => {
    window.history.back()
  }

  const handleSave = () => {
    alert('Clause decisions saved.')
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
          <div className="space-y-6">
            {/* Section 1: Clause Compliance */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
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
                <EmptyClauseTable
                  title="INCLUSIONS"
                  sourceLabel="Recommended by"
                  message="No clauses to include. Clause set is up to date."
                />

                <EmptyClauseTable
                  title="EXCLUSIONS"
                  sourceLabel="Added through"
                  message="No clauses to exclude. Clause set is up to date."
                />
              </div>
            </div>

            {/* Section 2: Clause Updates */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
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
                <EmptyReviewTable message="All clauses are the latest version." />
              </div>
            </div>

            {/* Section 3: Incomplete clauses */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
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
                <EmptyIncompleteTable message="No incomplete clauses." />
              </div>
            </div>
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
// Empty tables — same headers as their real counterparts, single message row
// ============================================================================

function EmptyClauseTable({
  title,
  sourceLabel,
  message,
}: {
  title: string
  sourceLabel: string
  message: string
}) {
  return (
    <div className="mb-6">
      <div className="mb-2">
        <RichTextDisplayField
          value={[
            <TextItem key="title" text={title} style="STRONG" size="SMALL" />,
            <TextItem key="count" text=" (0)" color="SECONDARY" size="SMALL" />,
          ]}
        />
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
          <tr>
            <td colSpan={4} className="py-8 text-center text-sm text-[#6C6C75]">
              {message}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function EmptyReviewTable({ message }: { message: string }) {
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
        <tr>
          <td colSpan={5} className="py-8 text-center text-sm text-[#6C6C75]">
            {message}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function EmptyIncompleteTable({ message }: { message: string }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b border-gray-200">
          <th className="pb-2 pr-4 font-normal text-gray-500">Clause</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-8 text-center text-sm text-[#6C6C75]">
            {message}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
