import { useState, type DragEvent } from 'react'
import { useLocation } from 'wouter'
import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
  ButtonWidget,
  Icon,
  FieldLabel,
  FileCard,
} from '@pglevy/sailwind'
import LibraryShell from '../components/library-shell'

/**
 * Stand-in JSON payload used in this prototype. The real import flow would
 * take whatever JSON the user downloaded from Forum; this just lets us skip
 * the OS file picker and jump to the summary.
 */
const MOCK_PACKAGE = {
  manifest: {
    name: 'GCA Library',
    version: '4.1.2',
    previousVersion: '4.1.0',
    farDfarsBaseline: 'FAC 2025-06',
    minimumGcaVersion: '4.1',
  },
  counts: {
    rules: 1141,
    questions: 402,
    responses: 1036,
    questionnairePlacements: 402,
  },
}

/** Build a File-like object with sample JSON contents. */
function makeMockFile(): File {
  const body = JSON.stringify(MOCK_PACKAGE, null, 2)
  return new File([body], 'gca-library-4.1.2.json', { type: 'application/json' })
}

export default function LibraryImport() {
  const [, setLocation] = useLocation()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (f: File | null | undefined) => {
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.json')) {
      alert('Please select a .json file.')
      return
    }
    setFile(f)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    // Use whatever file the user drops; if nothing lands, fall back to the mock.
    const dropped = e.dataTransfer.files?.[0]
    handleFile(dropped ?? makeMockFile())
  }

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

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
          <div className="px-8 py-8">
            <div className="text-center mb-6">
              <HeadingField
                text="Upload package"
                size="MEDIUM"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                align="CENTER"
                marginBelow="EVEN_LESS"
              />
              <RichTextDisplayField
                value={[
                  <TextItem
                    key="instr"
                    text="Select the JSON file downloaded from the Forum."
                    color="SECONDARY"
                    size="STANDARD"
                  />,
                ]}
                align="CENTER"
                marginBelow="NONE"
              />
            </div>

            <FieldLabel label="Library package" required />

            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`mt-2 border-2 border-dashed rounded-lg transition-colors ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              {file ? (
                <div className="p-6 flex justify-center">
                  <FileCard
                    fileName={file.name}
                    fileSize={file.size}
                    fileType="JSON"
                    showRemove={true}
                    onRemove={() => setFile(null)}
                    maxWidth="420px"
                  />
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Icon icon="UploadCloud" size="LARGE" color="ACCENT" />
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="drop"
                        text="Drop the package here or"
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="EVEN_LESS"
                  />
                  <ButtonWidget
                    label="Choose file"
                    style="OUTLINE"
                    color="ACCENT"
                    onClick={() => handleFile(makeMockFile())}
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <RichTextDisplayField
                value={[
                  <TextItem
                    key="forum"
                    text="Forum download page"
                    color="ACCENT"
                    size="STANDARD"
                    link={() => alert('Opening Forum download page in a new tab (not wired up in this prototype).')}
                    linkStyle="STANDALONE"
                  />,
                ]}
                marginBelow="NONE"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
            <ButtonWidget
              label="Cancel"
              style="LINK"
              color="ACCENT"
              onClick={() => setLocation('/library')}
            />
            <ButtonWidget
              label="Next"
              style="SOLID"
              color="ACCENT"
              disabled={!file}
              onClick={() => setLocation('/library/import/confirm')}
            />
          </div>
        </CardLayout>
      </div>
    </LibraryShell>
  )
}
