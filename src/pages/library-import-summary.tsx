import { useLocation } from 'wouter'
import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
  ButtonWidget,
  MessageBanner,
  TagField,
  ReadOnlyGrid,
  GridColumn,
} from '@pglevy/sailwind'
import LibraryShell from '../components/library-shell'

type ChangeRow = {
  object: string
  created: number
  updated: number
  retired: number
  skipped: number
  failed: number
}

const summaryRows: ChangeRow[] = [
  { object: 'Rules', created: 1141, updated: 0, retired: 0, skipped: 0, failed: 0 },
  { object: 'Questions', created: 402, updated: 0, retired: 0, skipped: 0, failed: 0 },
  { object: 'Responses', created: 1036, updated: 0, retired: 0, skipped: 0, failed: 0 },
  { object: 'Questionnaire placements', created: 402, updated: 0, retired: 0, skipped: 0, failed: 0 },
]

type ChangeCounts = { category: string; added: number; changed: number; retired: number }

const changesApplied: ChangeCounts[] = [
  { category: 'Rules', added: 43, changed: 118, retired: 6 },
  { category: 'Questions', added: 12, changed: 9, retired: 2 },
  { category: 'Questionnaire placements', added: 12, changed: 9, retired: 2 },
]

/** Small label/value row used in the Overview card. */
function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-sm text-gray-900">{value}</div>
    </div>
  )
}

/** Numeric change chip (e.g. "+ 43 new"). */
function ChangeChip({
  symbol,
  text,
  tone,
}: {
  symbol: '+' | '~' | '−'
  text: string
  tone: 'POSITIVE' | 'WARN' | 'NEGATIVE'
}) {
  const palette = {
    POSITIVE: { bg: '#DCFCE7', fg: '#166534', border: '#86EFAC' },
    WARN: { bg: '#FEF9C3', fg: '#854D0E', border: '#FDE047' },
    NEGATIVE: { bg: '#FEE2E2', fg: '#991B1B', border: '#FCA5A5' },
  }[tone]

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs"
      style={{ backgroundColor: palette.bg, color: palette.fg, borderColor: palette.border }}
    >
      <span aria-hidden="true">{symbol}</span>
      <span>{text}</span>
    </span>
  )
}

export default function LibraryImportSummary() {
  const [, setLocation] = useLocation()

  return (
    <LibraryShell>
      {/* Page header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <HeadingField
          text="Library import 4.1.2"
          size="LARGE"
          headingTag="H1"
          fontWeight="REGULAR"
          marginBelow="NONE"
        />
      </header>

      <div className="px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left column: Overview + Status */}
          <aside className="space-y-6">
            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Overview"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />
              <div className="space-y-4">
                <OverviewRow label="Installed version" value="4.1.2" />
                <OverviewRow label="Previous version" value="4.1.0" />
                <OverviewRow label="FAR/DFARS baseline" value="FAC 2025-06" />
                <OverviewRow label="Minimum GCA version" value="4.1" />
                <OverviewRow label="Imported by" value="Privilege User" />
                <OverviewRow label="Imported on" value="Oct 23, 2026 8:12 PM" />
              </div>
            </CardLayout>

            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Status"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />
              <TagField
                size="SMALL"
                tags={[
                  { text: 'Import completed', backgroundColor: '#DCFCE7', textColor: '#166534' },
                  { text: 'Library rules off', backgroundColor: '#FEF9C3', textColor: '#854D0E' },
                  { text: 'System questionnaire not default', backgroundColor: '#FEF9C3', textColor: '#854D0E' },
                ]}
                marginBelow="NONE"
              />
            </CardLayout>
          </aside>

          {/* Right column: banner + next steps + changes + summary */}
          <section className="space-y-6">
            <MessageBanner
              primaryText="Import completed. Library 4.1.2 is installed. Library rules aren't on yet."
              backgroundColor="SUCCESS"
              highlightColor="POSITIVE"
              icon="success"
              showDecorativeBar={false}
            />

            {/* Next steps */}
            <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <div className="px-6 py-4 border-b border-gray-200">
                <HeadingField
                  text="Next steps"
                  size="MEDIUM"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  marginBelow="NONE"
                />
              </div>

              <div className="p-6 grid gap-4 md:grid-cols-2">
                <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
                  <HeadingField
                    text="Turn on library rules"
                    size="SMALL"
                    headingTag="H3"
                    fontWeight="SEMI_BOLD"
                    marginBelow="EVEN_LESS"
                  />
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="d"
                        text="Active library rules will be used when clause sets are created."
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="STANDARD"
                  />
                  <ButtonWidget
                    label="Open Solution Hub"
                    style="OUTLINE"
                    color="ACCENT"
                    onClick={() => alert('Open Solution Hub is not wired up in this prototype.')}
                  />
                </CardLayout>

                <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
                  <HeadingField
                    text="Make the system questionnaire the default"
                    size="SMALL"
                    headingTag="H3"
                    fontWeight="SEMI_BOLD"
                    marginBelow="EVEN_LESS"
                  />
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="d"
                        text="Library rules only run when the system questionnaire is the default."
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="STANDARD"
                  />
                  <ButtonWidget
                    label="Set as default"
                    style="OUTLINE"
                    color="ACCENT"
                    onClick={() => alert('Set as default is not wired up in this prototype.')}
                  />
                </CardLayout>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
                <ButtonWidget
                  label="Skip for now"
                  style="LINK"
                  color="ACCENT"
                  onClick={() => setLocation('/library')}
                />
              </div>
            </CardLayout>

            {/* Changes applied */}
            <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <div className="px-6 py-4 border-b border-gray-200">
                <HeadingField
                  text="Changes applied"
                  size="MEDIUM"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  marginBelow="NONE"
                />
              </div>

              <div className="px-6 py-4 space-y-3">
                {changesApplied.map(row => (
                  <div
                    key={row.category}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm text-gray-900">{row.category}</span>
                    <div className="flex items-center gap-2">
                      <ChangeChip symbol="+" text={`${row.added} new`} tone="POSITIVE" />
                      <ChangeChip symbol="~" text={`${row.changed} changed`} tone="WARN" />
                      <ChangeChip symbol="−" text={`${row.retired} retired`} tone="NEGATIVE" />
                    </div>
                  </div>
                ))}
              </div>
            </CardLayout>

            {/* Summary table */}
            <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <div className="px-6 py-4 border-b border-gray-200">
                <HeadingField
                  text="Summary"
                  size="MEDIUM"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  marginBelow="NONE"
                />
              </div>

              <div className="px-6 py-4">
                <ReadOnlyGrid
                  data={summaryRows}
                  pageSize={10}
                  borderStyle="LIGHT"
                  rowHeader={0}
                  accessibilityText="Objects created, updated, retired, skipped, and failed during the library import"
                >
                  <GridColumn label="Object type" width="WIDE" value="object" />
                  <GridColumn
                    label="Created"
                    width="NARROW"
                    align="END"
                    value={(row: ChangeRow) => row.created.toLocaleString()}
                  />
                  <GridColumn
                    label="Updated"
                    width="NARROW"
                    align="END"
                    value={(row: ChangeRow) => row.updated.toLocaleString()}
                  />
                  <GridColumn
                    label="Retired"
                    width="NARROW"
                    align="END"
                    value={(row: ChangeRow) => row.retired.toLocaleString()}
                  />
                  <GridColumn
                    label="Skipped"
                    width="NARROW"
                    align="END"
                    value={(row: ChangeRow) => row.skipped.toLocaleString()}
                  />
                  <GridColumn
                    label="Failed"
                    width="NARROW"
                    align="END"
                    value={(row: ChangeRow) => row.failed.toLocaleString()}
                  />
                </ReadOnlyGrid>
              </div>
            </CardLayout>
          </section>
        </div>
      </div>
    </LibraryShell>
  )
}
