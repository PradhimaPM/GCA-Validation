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

/** One row in the Import History grid. */
type ImportRun = {
  id: string
  version: string
  previousVersion: string
  status: 'Completed' | 'Completed with warnings' | 'Failed' | 'In progress'
  startedBy: string
  startedOn: string
  duration: string
  itemsNeedingAttention: number
}

const importHistory: ImportRun[] = [
  {
    id: 'run-412',
    version: '4.1.2',
    previousVersion: '4.1.0',
    status: 'Completed',
    startedBy: 'Privilege User',
    startedOn: 'Oct 23, 2026 8:12 PM',
    duration: '2m 14s',
    itemsNeedingAttention: 0,
  },
  {
    id: 'run-410',
    version: '4.1.0',
    previousVersion: '4.0.8',
    status: 'Completed with warnings',
    startedBy: 'Arun Ganesh',
    startedOn: 'Sep 29, 2026 3:40 PM',
    duration: '2m 46s',
    itemsNeedingAttention: 3,
  },
  {
    id: 'run-408',
    version: '4.0.8',
    previousVersion: '4.0.5',
    status: 'Completed',
    startedBy: 'Arun Ganesh',
    startedOn: 'Jul 11, 2026 10:22 AM',
    duration: '1m 58s',
    itemsNeedingAttention: 0,
  },
  {
    id: 'run-405',
    version: '4.0.5',
    previousVersion: 'None',
    status: 'Completed',
    startedBy: 'Privilege User',
    startedOn: 'Apr 02, 2026 1:04 PM',
    duration: '2m 02s',
    itemsNeedingAttention: 0,
  },
]

const statusDisplay: Record<
  ImportRun['status'],
  { label: string; bg: string; fg: string }
> = {
  Completed: { label: 'Completed', bg: '#DCFCE7', fg: '#166534' },
  'Completed with warnings': { label: 'Warnings', bg: '#FEF9C3', fg: '#854D0E' },
  Failed: { label: 'Failed', bg: '#FEE2E2', fg: '#991B1B' },
  'In progress': { label: 'In progress', bg: '#DBEAFE', fg: '#1E40AF' },
}

/** Label + value row for the Library status panel. */
function StatusRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 py-2 text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-900">{children}</div>
    </div>
  )
}

export default function LibraryOption3() {
  const [, setLocation] = useLocation()

  return (
    <LibraryShell showTabs={true} activeTab="option-3">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <HeadingField
              text="Library"
              size="LARGE"
              headingTag="H1"
              fontWeight="REGULAR"
              marginBelow="EVEN_LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem
                  key="subtitle"
                  text="Import and manage the OOTB Rules & Questions Library."
                  color="SECONDARY"
                  size="STANDARD"
                />,
              ]}
              marginBelow="NONE"
            />
          </div>

          <div className="shrink-0">
            <ButtonWidget
              label="Import library"
              style="SOLID"
              color="ACCENT"
              icon="Upload"
              iconPosition="START"
              onClick={() => setLocation('/library/import')}
            />
          </div>
        </div>
      </header>

      <div className="px-8 py-6 space-y-6">
        {/* Questionnaire call-to-action banner */}
        <MessageBanner
          primaryText="The system questionnaire isn't the default."
          secondaryText="Library rules only run against the system questionnaire. Set it as the default to use the library's rules on new clause sets."
          backgroundColor="WARN"
          highlightColor="WARN"
          icon="warning"
          showDecorativeBar={true}
          buttons={[
            {
              label: 'Set as default',
              style: 'OUTLINE',
              color: 'ACCENT',
              onClick: () => alert('Set as default is not wired up in this prototype.'),
            },
          ]}
          buttonsAlign="END"
        />

        {/* Two-column: status + import history. min-w-0 on each cell so a
            wide grid inside can scroll instead of pushing the cell wider. */}
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Library status */}
          <CardLayout padding="MORE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
            <HeadingField
              text="Library status"
              size="SMALL"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="STANDARD"
            />

            <div className="divide-y divide-gray-100">
              <StatusRow label="Installed version">4.1.2</StatusRow>
              <StatusRow label="FAR/DFARS baseline">FAC 2025-06</StatusRow>
              <StatusRow label="Imported on">Oct 23, 2026</StatusRow>
              <StatusRow label="Imported by">Privilege User</StatusRow>

              <StatusRow label="Library rules setting">
                <div className="flex flex-col gap-1.5">
                  <TagField
                    size="SMALL"
                    tags={[
                      {
                        text: '✓ On',
                        backgroundColor: '#DCFCE7',
                        textColor: '#166534',
                      },
                    ]}
                    marginBelow="NONE"
                  />
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="link"
                        text="Open Solution Hub"
                        color="ACCENT"
                        size="STANDARD"
                        link={() =>
                          alert('Opening Solution Hub (not wired up in this prototype).')
                        }
                        linkStyle="STANDALONE"
                      />,
                    ]}
                    marginBelow="NONE"
                  />
                </div>
              </StatusRow>

              <StatusRow label="Default questionnaire">
                OOTB Library Questionnaire (system)
              </StatusRow>

              <StatusRow label="Library copy">None</StatusRow>
            </div>
          </CardLayout>

          {/* Import history */}
          <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
            <div className="px-6 py-4 border-b border-gray-200">
              <HeadingField
                text="Import history"
                size="MEDIUM"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="NONE"
              />
            </div>

            <div className="px-6 py-4 overflow-x-auto">
              <ReadOnlyGrid
                data={importHistory}
                pageSize={10}
                borderStyle="LIGHT"
                rowHeader={0}
                initialSorts={[{ field: 'startedOn', ascending: false }]}
                accessibilityText="Previous library import runs"
              >
                <GridColumn
                  label="Version"
                  sortField="version"
                  width="ICON_PLUS"
                  value={(row: ImportRun) => (
                    <RichTextDisplayField
                      value={[
                        <TextItem
                          key="v"
                          text={row.version}
                          color="ACCENT"
                          size="STANDARD"
                          link={() => setLocation('/library/import/summary')}
                          linkStyle="STANDALONE"
                        />,
                      ]}
                      marginBelow="NONE"
                    />
                  )}
                />
                <GridColumn
                  label="Previous"
                  sortField="previousVersion"
                  width="ICON_PLUS"
                  value="previousVersion"
                />
                <GridColumn
                  label="Status"
                  sortField="status"
                  width="NARROW"
                  value={(row: ImportRun) => (
                    <TagField
                      size="SMALL"
                      tags={[
                        {
                          text: statusDisplay[row.status].label,
                          backgroundColor: statusDisplay[row.status].bg,
                          textColor: statusDisplay[row.status].fg,
                          tooltip: row.status,
                        },
                      ]}
                      marginBelow="NONE"
                    />
                  )}
                />
                <GridColumn
                  label="Started by"
                  sortField="startedBy"
                  width="NARROW"
                  value="startedBy"
                />
                <GridColumn
                  label="Started on"
                  sortField="startedOn"
                  width="NARROW_PLUS"
                  value={(row: ImportRun) => (
                    <RichTextDisplayField
                      value={[<TextItem key="t" text={row.startedOn} />]}
                      preventWrapping={true}
                      marginBelow="NONE"
                    />
                  )}
                />
                <GridColumn
                  label="Duration"
                  sortField="duration"
                  width="ICON_PLUS"
                  value="duration"
                />
                <GridColumn
                  label="Attention"
                  sortField="itemsNeedingAttention"
                  width="ICON_PLUS"
                  align="CENTER"
                  value={(row: ImportRun) =>
                    row.itemsNeedingAttention === 0 ? (
                      <RichTextDisplayField
                        value={[<TextItem key="n" text="0" color="SECONDARY" />]}
                        marginBelow="NONE"
                      />
                    ) : (
                      <TagField
                        size="SMALL"
                        tags={[
                          {
                            text: `${row.itemsNeedingAttention}`,
                            backgroundColor: '#FEE2E2',
                            textColor: '#991B1B',
                            tooltip: `${row.itemsNeedingAttention} items need attention`,
                          },
                        ]}
                        marginBelow="NONE"
                      />
                    )
                  }
                />
                <GridColumn
                  label="View"
                  width="ICON"
                  align="CENTER"
                  value={(row: ImportRun) => (
                    <ButtonWidget
                      style="GHOST"
                      color="ACCENT"
                      size="SMALL"
                      icon="Eye"
                      tooltip="View import review"
                      accessibilityText={`View import review for version ${row.version}`}
                      onClick={() => setLocation('/library/import/summary')}
                    />
                  )}
                />
              </ReadOnlyGrid>
            </div>
          </CardLayout>
        </div>
      </div>
    </LibraryShell>
  )
}
