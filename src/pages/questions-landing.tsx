import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  FileCard,
  MessageBanner,
  RichTextDisplayField,
  TextItem,
  TabsField,
} from '@pglevy/sailwind'
import { Library, PencilLine, Zap, Award, Settings2 } from 'lucide-react'
import QuestionsShell from '../components/questions-shell'
import {
  getQuestionImportOptions,
  type QuestionImportOption,
} from '../db/question-import-options'
import { importSystemQuestions, importCustomQuestions } from '../db/questions'
import { EXCEL_ACCEPT, isExcelFile } from '../lib/excel-file'

const optionIcons: Record<QuestionImportOption['key'], ReactNode> = {
  SYSTEM: <Library size={28} aria-hidden="true" />,
  MANUAL: <PencilLine size={28} aria-hidden="true" />,
}

const optionButtonIcons: Record<QuestionImportOption['key'], string> = {
  SYSTEM: 'Download',
  MANUAL: 'Upload',
}

const optionDescriptionColors: Record<QuestionImportOption['key'], 'SECONDARY' | 'GRAY_500'> = {
  SYSTEM: 'SECONDARY',
  MANUAL: 'GRAY_500',
}

/** Reasons to pick system questions, shown as benefit cards in Option 3. */
const systemBenefits: Array<{ icon: ReactNode; title: string; description: string }> = [
  {
    icon: <Zap size={22} aria-hidden="true" />,
    title: 'Save hours of setup',
    description: 'Dozens of questions ready to use out of the box.',
  },
  {
    icon: <Award size={22} aria-hidden="true" />,
    title: 'Built on best practices',
    description: 'Curated from real GCA acquisition workflows.',
  },
  {
    icon: <Settings2 size={22} aria-hidden="true" />,
    title: 'Fully editable',
    description: 'Add, remove, or edit any question anytime.',
  },
]

export default function QuestionsLanding() {
  const [options, setOptions] = useState<QuestionImportOption[]>([])
  const [, setLocation] = useLocation()
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getQuestionImportOptions().then(setOptions)
  }, [])

  const triggerSystemImport = () => {
    importSystemQuestions().then(() => setLocation('/questions-review'))
  }

  const triggerUploadPicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isExcelFile(file)) {
        setExcelFile(file)
        setFileError(false)
      } else {
        setFileError(true)
      }
    }
    // Reset so choosing the same file again still fires onChange.
    event.target.value = ''
  }

  /* ------------------------------------------------------------------------ */
  /* Reusable blocks                                                           */
  /* ------------------------------------------------------------------------ */

  /** The icon circle used on the main System Questions card across all tabs. */
  const SystemIconBubble = ({ large = false }: { large?: boolean }) => (
    <div
      className={`flex items-center justify-center rounded-full ${
        large ? 'w-20 h-20 mb-5' : 'w-16 h-16 mb-4'
      }`}
      style={{ backgroundColor: '#E8E7FD', color: '#2322F0' }}
    >
      {large ? <Library size={36} aria-hidden="true" /> : optionIcons.SYSTEM}
    </div>
  )

  /** The hero System Questions card, used in Options 2 and 3. */
  const SystemHeroCard = () => (
    <CardLayout
      padding="EVEN_MORE"
      showBorder={true}
      showShadow={true}
      shape="SEMI_ROUNDED"
    >
      <div className="flex flex-col items-center text-center">
        <SystemIconBubble large={true} />
        <HeadingField
          text="Import system questions"
          size="LARGE"
          headingTag="H2"
          fontWeight="SEMI_BOLD"
          align="CENTER"
          marginBelow="EVEN_LESS"
        />
        <div className="mb-6 max-w-md">
          <RichTextDisplayField
            align="CENTER"
            value={[
              <TextItem
                key="desc"
                text="Add the standard questions that ship with the solution. Review them, pick the ones you need, and start building clause sets right away."
                color="SECONDARY"
                size="MEDIUM"
              />,
            ]}
            marginBelow="NONE"
          />
        </div>
        <ButtonWidget
          label="Import system questions"
          style="SOLID"
          color="ACCENT"
          size="MEDIUM"
          icon="Download"
          iconPosition="START"
          onClick={triggerSystemImport}
        />
      </div>
    </CardLayout>
  )

  /** The subtle "import manually" row used in Option 3 below the benefit cards. */
  const ManualInlineCard = () => (
    <div className="flex items-center justify-between gap-4 rounded-md border border-dashed border-gray-300 bg-gray-50 px-5 py-4">
      <div className="flex items-start gap-3">
        <PencilLine
          size={20}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-gray-500"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Have your own questions ready?
          </p>
          <p className="text-xs text-gray-600">
            Upload a spreadsheet to add many questions at once.
          </p>
        </div>
      </div>
      <ButtonWidget
        label="Upload Excel"
        style="OUTLINE"
        color="ACCENT"
        size="SMALL"
        icon="Upload"
        iconPosition="START"
        onClick={triggerUploadPicker}
      />
    </div>
  )

  /* ------------------------------------------------------------------------ */
  /* Tab contents                                                              */
  /* ------------------------------------------------------------------------ */

  /** Option 1 — the current layout: two equal, stacked import cards. */
  const option1Content = (
    <div className="mx-auto flex max-w-xl flex-col gap-6 pt-2">
      {options.map(option => (
        <CardLayout
          key={option.id}
          padding="MORE"
          showBorder={true}
          showShadow={false}
          shape="SEMI_ROUNDED"
          height="AUTO"
        >
          <div className="flex flex-col items-center text-center h-full">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: '#E8E7FD', color: '#2322F0' }}
            >
              {optionIcons[option.key]}
            </div>
            <HeadingField
              text={option.title}
              size="MEDIUM_PLUS"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              align="CENTER"
              marginBelow="EVEN_LESS"
            />
            <div className="mb-6 flex-1">
              <RichTextDisplayField
                align="CENTER"
                value={[
                  <TextItem
                    key="desc"
                    text={option.description}
                    color={optionDescriptionColors[option.key]}
                    size="MEDIUM"
                  />,
                ]}
                marginBelow="NONE"
              />
            </div>
            <ButtonWidget
              label={option.buttonLabel}
              style={option.key === 'SYSTEM' ? 'SOLID' : 'OUTLINE'}
              color="ACCENT"
              size="MEDIUM"
              icon={optionButtonIcons[option.key]}
              iconPosition="START"
              onClick={
                option.key === 'SYSTEM' ? triggerSystemImport : triggerUploadPicker
              }
            />
          </div>
        </CardLayout>
      ))}
    </div>
  )

  /** Option 2 — one prominent card for System Questions, manual as a text link. */
  const option2Content = (
    <div className="mx-auto max-w-xl pt-2">
      <SystemHeroCard />
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have questions in a spreadsheet?{' '}
        <button
          type="button"
          onClick={triggerUploadPicker}
          className="font-semibold text-blue-700 underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
        >
          Upload Excel file
        </button>
      </p>
    </div>
  )

  /** Option 3 — hero System card, three benefit cards, then the manual row. */
  const option3Content = (
    <div className="mx-auto max-w-4xl pt-2">
      <div className="mx-auto max-w-xl">
        <SystemHeroCard />
      </div>

      <div className="mt-10 mb-4 text-center">
        <HeadingField
          text="Why system questions?"
          size="MEDIUM"
          headingTag="H3"
          fontWeight="SEMI_BOLD"
          align="CENTER"
          marginBelow="NONE"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {systemBenefits.map(benefit => (
          <div
            key={benefit.title}
            className="flex flex-col items-start rounded-md border border-gray-200 bg-white px-5 py-5"
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: '#E8E7FD', color: '#2322F0' }}
            >
              {benefit.icon}
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-900">{benefit.title}</p>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ManualInlineCard />
      </div>
    </div>
  )

  return (
    <QuestionsShell>
      <div className="px-8 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <HeadingField
              text="Add your first questions"
              size="LARGE_PLUS"
              headingTag="H1"
              fontWeight="REGULAR"
              align="CENTER"
              marginBelow="EVEN_LESS"
            />
            <RichTextDisplayField
              align="CENTER"
              value={[
                <TextItem
                  key="subtitle"
                  text="You haven't added any questions yet. Choose how you want to get started."
                  color="SECONDARY"
                  size="MEDIUM_PLUS"
                />,
              ]}
              marginBelow="NONE"
            />
          </div>

          {fileError && (
            <div className="mx-auto mb-6 max-w-xl">
              <MessageBanner
                primaryText="File must be an Excel file (.xlsx or .xls)."
                secondaryText="Choose a different file and try again."
                backgroundColor="ERROR"
                highlightColor="NEGATIVE"
                icon="error"
                announceBehavior="DISPLAY_AND_ANNOUNCE"
                showCloseButton={true}
                onClose={() => setFileError(false)}
                marginBelow="NONE"
              />
            </div>
          )}

          <TabsField
            tabs={[
              { value: 'option1', label: 'Option 1', content: option1Content },
              { value: 'option2', label: 'Option 2', content: option2Content },
              { value: 'option3', label: 'Option 3', content: option3Content },
            ]}
            defaultValue="option1"
            variant="UNDERLINE"
            contentsPadding="MORE"
            fullWidthSeparator={true}
            marginBelow="NONE"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={EXCEL_ACCEPT}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload Excel sheet"
            tabIndex={-1}
          />

          {excelFile && (
            <div className="mx-auto mt-8 max-w-xl">
              <CardLayout
                padding="STANDARD"
                showBorder={true}
                showShadow={false}
                shape="SEMI_ROUNDED"
              >
                <HeadingField
                  text="Ready to import"
                  size="SMALL"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  marginBelow="LESS"
                />
                <FileCard
                  fileName={excelFile.name}
                  fileSize={excelFile.size}
                  showRemove={true}
                  onRemove={() => setExcelFile(null)}
                />
                <div className="mt-4 flex justify-end">
                  <ButtonWidget
                    label="Import questions"
                    style="SOLID"
                    color="ACCENT"
                    onClick={async () => {
                      await importCustomQuestions(excelFile.name, 'john.smith')
                      setLocation('/questions')
                    }}
                  />
                </div>
              </CardLayout>
            </div>
          )}
        </div>
      </div>
    </QuestionsShell>
  )
}
