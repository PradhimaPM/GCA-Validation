import { useLocation } from 'wouter'
import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
  ButtonWidget,
  MessageBanner,
} from '@pglevy/sailwind'
import LibraryShell from '../components/library-shell'

/** Simple label / value row used in the overview section. */
function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <div className="w-56 shrink-0 text-sm text-gray-600">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  )
}

/** Count badge used in the Package contents section (e.g. "1,184 Rules"). */
function CountChip({ count, label }: { count: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5">
      <span className="text-sm font-semibold text-gray-900">{count}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  )
}

/** Numeric change pill (reused from the summary page). */
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

export default function LibraryImportConfirm() {
  const [, setLocation] = useLocation()

  return (
    <LibraryShell>
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <HeadingField
              text="Import library"
              size="LARGE"
              headingTag="H1"
              fontWeight="REGULAR"
              marginBelow="NONE"
            />
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">
            <MessageBanner
              primaryText="Importing doesn't change your custom rules, questions or questionnaires."
              backgroundColor="INFO"
              highlightColor="INFO"
              icon="info"
              showDecorativeBar={false}
            />

            <HeadingField
              text="Import summary"
              size="MEDIUM"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="EVEN_LESS"
            />

            <CardLayout padding="MORE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              {/* Overview */}
              <div className="divide-y divide-gray-100">
                <OverviewRow label="Incoming version" value="4.1.2" />
                <OverviewRow label="Installed version" value="4.1.0" />
                <OverviewRow label="FAR/DFARS baseline" value="FAC 2025-06" />
                <OverviewRow label="Minimum GCA version" value="4.1" />
              </div>

              {/* Package contents */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <RichTextDisplayField
                  value={[
                    <TextItem key="pc" text="Package contents" color="SECONDARY" size="STANDARD" />,
                  ]}
                  marginBelow="EVEN_LESS"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <CountChip count="1,184" label="Rules" />
                  <CountChip count="412" label="Questions" />
                  <CountChip count="1" label="Questionnaires" />
                </div>
              </div>

              {/* Changes from previous */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <RichTextDisplayField
                  value={[
                    <TextItem key="chg" text="Changes from 4.1.0" color="SECONDARY" size="STANDARD" />,
                  ]}
                  marginBelow="EVEN_LESS"
                />
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-gray-900">Rules</span>
                    <div className="flex items-center gap-2">
                      <ChangeChip symbol="+" text="43 new" tone="POSITIVE" />
                      <ChangeChip symbol="~" text="118 changed" tone="WARN" />
                      <ChangeChip symbol="−" text="6 retired" tone="NEGATIVE" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-gray-900">Questions</span>
                    <div className="flex items-center gap-2">
                      <ChangeChip symbol="+" text="12 new" tone="POSITIVE" />
                      <ChangeChip symbol="~" text="9 changed" tone="WARN" />
                      <ChangeChip symbol="−" text="2 retired" tone="NEGATIVE" />
                    </div>
                  </div>
                </div>
              </div>

              {/* README link */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <RichTextDisplayField
                  value={[
                    <TextItem
                      key="readme"
                      text="Read the README"
                      color="ACCENT"
                      size="STANDARD"
                      link={() => alert('Opening README (not wired up in this prototype).')}
                      linkStyle="STANDALONE"
                    />,
                  ]}
                  marginBelow="NONE"
                />
              </div>
            </CardLayout>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ButtonWidget
                label="Cancel"
                style="LINK"
                color="ACCENT"
                onClick={() => setLocation('/library')}
              />
              <ButtonWidget
                label="Back"
                style="OUTLINE"
                color="ACCENT"
                onClick={() => setLocation('/library/import')}
              />
            </div>
            <ButtonWidget
              label="Import"
              style="SOLID"
              color="ACCENT"
              onClick={() => setLocation('/library/import/summary')}
            />
          </div>
        </CardLayout>
      </div>
    </LibraryShell>
  )
}
