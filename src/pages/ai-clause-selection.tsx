import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  MessageBanner,
  MilestoneField,
  TextField,
  DropdownField,
  ButtonWidget,
  ButtonArrayLayout,
  RichTextDisplayField,
  TextItem,
  TagField,
  FileCard,
  ProgressBar,
  CollapsibleSection,
  StampField,
} from '@pglevy/sailwind'
import { Upload, Sparkles, Check, X } from 'lucide-react'
import {
  getAiClauses,
  updateAiClauseDecision,
  bulkUpdateByConfidence,
  type AiClause,
  type ConfidenceTier,
} from '../db/ai-clauses'

type Step = 0 | 1 | 2 | 3

export default function AiClauseSelection() {
  const [step, setStep] = useState<Step>(0)
  const [contractName, setContractName] = useState('')
  const [contractType, setContractType] = useState<string | undefined>()
  const [ceiling, setCeiling] = useState('')
  const [setAside, setSetAside] = useState<string | undefined>()
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [clauses, setClauses] = useState<AiClause[]>([])

  useEffect(() => {
    if (step === 2 && analyzing) {
      const interval = setInterval(() => {
        setAnalyzeProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setAnalyzing(false)
            getAiClauses().then(setClauses)
            return 100
          }
          return prev + 10
        })
      }, 200)
      return () => clearInterval(interval)
    }
  }, [step, analyzing])

  const handleStartAnalysis = () => {
    setStep(2)
    setAnalyzing(true)
    setAnalyzeProgress(0)
  }

  const handleFileUpload = () => {
    // Mock file upload
    setUploadedFile({ name: 'IT_Services_SOW_FY26.pdf', size: 1_240_000 })
  }

  const handleDecision = async (id: number, decision: 'accepted' | 'rejected') => {
    await updateAiClauseDecision(id, decision)
    setClauses(await getAiClauses())
  }

  const handleBulkAccept = async (tier: ConfidenceTier) => {
    await bulkUpdateByConfidence(tier, 'accepted')
    setClauses(await getAiClauses())
  }

  const handleBulkReject = async (tier: ConfidenceTier) => {
    await bulkUpdateByConfidence(tier, 'rejected')
    setClauses(await getAiClauses())
  }

  const canProceedStep0 = contractName && contractType && ceiling
  const canProceedStep1 = !!uploadedFile

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <HeadingField
          text="Create Clause Set"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />

        <div className="mb-8">
          <MilestoneField
            steps={['Contract details', 'Upload document', 'AI review', 'Confirm']}
            active={step}
            orientation="HORIZONTAL"
            stepStyle="CHEVRON"
            color="ACCENT"
          />
        </div>

        {step === 0 && (
          <StepContractDetails
            contractName={contractName}
            setContractName={setContractName}
            contractType={contractType}
            setContractType={setContractType}
            ceiling={ceiling}
            setCeiling={setCeiling}
            setAside={setAside}
            setSetAside={setSetAside}
            onNext={() => setStep(1)}
            canProceed={!!canProceedStep0}
          />
        )}

        {step === 1 && (
          <StepUploadDocument
            uploadedFile={uploadedFile}
            onUpload={handleFileUpload}
            onRemove={() => setUploadedFile(null)}
            onBack={() => setStep(0)}
            onNext={handleStartAnalysis}
            canProceed={canProceedStep1}
          />
        )}

        {step === 2 && (
          <StepAiReview
            analyzing={analyzing}
            progress={analyzeProgress}
            clauses={clauses}
            onDecision={handleDecision}
            onBulkAccept={handleBulkAccept}
            onBulkReject={handleBulkReject}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepConfirm
            clauses={clauses}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Step 0: Contract details
// ============================================================================

interface Step0Props {
  contractName: string
  setContractName: (v: string) => void
  contractType: string | undefined
  setContractType: (v: string) => void
  ceiling: string
  setCeiling: (v: string) => void
  setAside: string | undefined
  setSetAside: (v: string) => void
  onNext: () => void
  canProceed: boolean
}

function StepContractDetails(props: Step0Props) {
  return (
    <CardLayout padding="MORE" showShadow={true} showBorder={false}>
      <HeadingField
        text="Enter contract details"
        size="MEDIUM_PLUS"
        headingTag="H2"
        marginBelow="STANDARD"
      />
      <RichTextDisplayField
        value={[
          <TextItem
            key="d"
            text="Basic details about the contract. AI will use this to tailor clause suggestions."
            color="SECONDARY"
            size="STANDARD"
          />,
        ]}
        marginBelow="MORE"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Contract name"
          required={true}
          value={props.contractName}
          onChange={props.setContractName}
          placeholder="e.g. FY26 IT Services Contract"
        />
        <DropdownField
          label="Contract type"
          required={true}
          choiceLabels={['Commercial items', 'Non-commercial supplies', 'Services', 'Construction', 'R&D']}
          choiceValues={['commercial', 'non-commercial', 'services', 'construction', 'rd']}
          value={props.contractType}
          onChange={props.setContractType}
          placeholder="Select..."
        />
        <TextField
          label="Ceiling value ($)"
          required={true}
          value={props.ceiling}
          onChange={props.setCeiling}
          placeholder="e.g. 2500000"
        />
        <DropdownField
          label="Set-aside"
          choiceLabels={['None', 'Small Business', '8(a)', 'HUBZone', 'SDVOSB', 'WOSB']}
          choiceValues={['none', 'sb', '8a', 'hubzone', 'sdvosb', 'wosb']}
          value={props.setAside}
          onChange={props.setSetAside}
          placeholder="Select..."
        />
      </div>

      <div className="mt-8 flex justify-end">
        <ButtonWidget
          label="Next"
          style="SOLID"
          color="ACCENT"
          size="STANDARD"
          disabled={!props.canProceed}
          icon="ChevronRight"
          iconPosition="END"
          onClick={props.onNext}
        />
      </div>
    </CardLayout>
  )
}

// ============================================================================
// Step 1: Upload document
// ============================================================================

interface Step1Props {
  uploadedFile: { name: string; size: number } | null
  onUpload: () => void
  onRemove: () => void
  onBack: () => void
  onNext: () => void
  canProceed: boolean
}

function StepUploadDocument(props: Step1Props) {
  return (
    <CardLayout padding="MORE" showShadow={true} showBorder={false}>
      <HeadingField
        text="Upload SOW or PWS"
        size="MEDIUM_PLUS"
        headingTag="H2"
        marginBelow="STANDARD"
      />
      <RichTextDisplayField
        value={[
          <TextItem
            key="d"
            text="Upload a Statement of Work or Performance Work Statement. AI will read the document and suggest applicable clauses."
            color="SECONDARY"
            size="STANDARD"
          />,
        ]}
        marginBelow="MORE"
      />

      {!props.uploadedFile ? (
        <div
          className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50 cursor-pointer hover:border-blue-400 transition-colors"
          onClick={props.onUpload}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white rounded-full">
              <Upload size={32} className="text-blue-600" />
            </div>
            <RichTextDisplayField
              value={[
                <TextItem
                  key="t"
                  text="Click to upload document"
                  style="STRONG"
                  size="MEDIUM"
                  color="ACCENT"
                />,
                <br key="br1" />,
                <TextItem
                  key="s"
                  text="PDF, DOCX, or plain text — up to 25 MB"
                  color="SECONDARY"
                  size="SMALL"
                />,
              ]}
            />
          </div>
        </div>
      ) : (
        <div>
          <FileCard
            fileName={props.uploadedFile.name}
            fileSize={props.uploadedFile.size}
            fileType="pdf"
            showRemove={true}
            onRemove={props.onRemove}
            maxWidth="400px"
          />
          <div className="mt-4">
            <MessageBanner
              primaryText="Document ready for AI analysis"
              secondaryText="Click 'Analyze with AI' to identify clauses for inclusion or exclusion."
              backgroundColor="SUCCESS"
              highlightColor="SUCCESS"
              icon="success"
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <ButtonWidget
          label="Back"
          style="OUTLINE"
          color="STANDARD"
          size="STANDARD"
          onClick={props.onBack}
        />
        <ButtonWidget
          label="Analyze with AI"
          style="SOLID"
          color="ACCENT"
          size="STANDARD"
          disabled={!props.canProceed}
          icon="Sparkles"
          iconPosition="START"
          onClick={props.onNext}
        />
      </div>
    </CardLayout>
  )
}

// ============================================================================
// Step 2: AI review
// ============================================================================

interface Step2Props {
  analyzing: boolean
  progress: number
  clauses: AiClause[]
  onDecision: (id: number, decision: 'accepted' | 'rejected') => void
  onBulkAccept: (tier: ConfidenceTier) => void
  onBulkReject: (tier: ConfidenceTier) => void
  onBack: () => void
  onNext: () => void
}

function StepAiReview(props: Step2Props) {
  if (props.analyzing) {
    return (
      <CardLayout padding="MORE" showShadow={true} showBorder={false}>
        <div className="py-16 flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-100 rounded-full animate-pulse">
            <Sparkles size={40} className="text-blue-600" />
          </div>
          <HeadingField
            text="AI is analyzing your document..."
            size="MEDIUM"
            headingTag="H2"
          />
          <RichTextDisplayField
            value={[
              <TextItem
                key="s"
                text="Reading SOW, matching against FAR prescriptions, evaluating each clause."
                color="SECONDARY"
                size="STANDARD"
              />,
            ]}
          />
          <div className="w-full max-w-md mt-4">
            <ProgressBar
              percentage={props.progress}
              color="ACCENT"
              style="THICK"
              showPercentage={true}
            />
          </div>
        </div>
      </CardLayout>
    )
  }

  const highClauses = props.clauses.filter(c => c.confidence === 'HIGH')
  const mediumClauses = props.clauses.filter(c => c.confidence === 'MEDIUM')
  const lowClauses = props.clauses.filter(c => c.confidence === 'LOW')

  const decidedCount = props.clauses.filter(c => c.userDecision).length
  const totalCount = props.clauses.length

  return (
    <div className="space-y-4">
      <CardLayout padding="STANDARD" showShadow={true} showBorder={false}>
        <div className="flex items-center justify-between">
          <RichTextDisplayField
            value={[
              <TextItem key="i" text="AI review complete." style="STRONG" size="STANDARD" />,
              <TextItem
                key="r"
                text={` ${totalCount} clauses evaluated. ${decidedCount} of ${totalCount} decisions made.`}
                color="SECONDARY"
                size="STANDARD"
              />,
            ]}
          />
          <StampField
            text={`${decidedCount}/${totalCount}`}
            backgroundColor={decidedCount === totalCount ? 'POSITIVE' : 'ACCENT'}
            contentColor="STANDARD"
            size="SMALL"
            shape="ROUNDED"
          />
        </div>
      </CardLayout>

      <ConfidenceGroup
        tier="HIGH"
        label="High confidence"
        description="Strong evidence supports the suggestion. Recommended to accept."
        color="POSITIVE"
        clauses={highClauses}
        onDecision={props.onDecision}
        onBulkAccept={() => props.onBulkAccept('HIGH')}
        onBulkReject={() => props.onBulkReject('HIGH')}
      />

      <ConfidenceGroup
        tier="MEDIUM"
        label="Medium confidence"
        description="Reasonable evidence — worth reviewing before accepting."
        color="WARN"
        clauses={mediumClauses}
        onDecision={props.onDecision}
        onBulkAccept={() => props.onBulkAccept('MEDIUM')}
        onBulkReject={() => props.onBulkReject('MEDIUM')}
      />

      <ConfidenceGroup
        tier="LOW"
        label="Low confidence"
        description="Weak signals — typically reject unless you have context AI missed."
        color="NEGATIVE"
        clauses={lowClauses}
        onDecision={props.onDecision}
        onBulkAccept={() => props.onBulkAccept('LOW')}
        onBulkReject={() => props.onBulkReject('LOW')}
      />

      <div className="flex justify-between pt-2">
        <ButtonWidget
          label="Back"
          style="OUTLINE"
          color="STANDARD"
          size="STANDARD"
          onClick={props.onBack}
        />
        <ButtonWidget
          label="Continue"
          style="SOLID"
          color="ACCENT"
          size="STANDARD"
          icon="ChevronRight"
          iconPosition="END"
          onClick={props.onNext}
        />
      </div>
    </div>
  )
}

// ============================================================================
// ConfidenceGroup — one confidence tier
// ============================================================================

interface ConfidenceGroupProps {
  tier: ConfidenceTier
  label: string
  description: string
  color: 'POSITIVE' | 'WARN' | 'NEGATIVE'
  clauses: AiClause[]
  onDecision: (id: number, decision: 'accepted' | 'rejected') => void
  onBulkAccept: () => void
  onBulkReject: () => void
}

function ConfidenceGroup(props: ConfidenceGroupProps) {
  const decidedInGroup = props.clauses.filter(c => c.userDecision).length

  return (
    <CardLayout padding="STANDARD" showShadow={true} showBorder={false}>
      <CollapsibleSection
        title={`${props.label} (${props.clauses.length})`}
        defaultOpen={true}
      >
        <div className="mb-3 flex items-center justify-between">
          <RichTextDisplayField
            value={[
              <TextItem
                key="d"
                text={props.description}
                color="SECONDARY"
                size="SMALL"
              />,
              <br key="br" />,
              <TextItem
                key="p"
                text={`${decidedInGroup} of ${props.clauses.length} decided`}
                color="SECONDARY"
                size="SMALL"
              />,
            ]}
          />
          <ButtonArrayLayout
            buttons={[
              {
                label: 'Accept all',
                style: 'OUTLINE',
                color: 'POSITIVE',
                size: 'SMALL',
                icon: 'Check',
                iconPosition: 'START',
                onClick: props.onBulkAccept,
              },
              {
                label: 'Reject all',
                style: 'OUTLINE',
                color: 'NEGATIVE',
                size: 'SMALL',
                icon: 'X',
                iconPosition: 'START',
                onClick: props.onBulkReject,
              },
            ]}
            align="END"
          />
        </div>

        <div className="space-y-2">
          {props.clauses.map(clause => (
            <ClauseCard
              key={clause.id}
              clause={clause}
              tierColor={props.color}
              onDecision={props.onDecision}
            />
          ))}
        </div>
      </CollapsibleSection>
    </CardLayout>
  )
}

// ============================================================================
// ClauseCard — one clause row
// ============================================================================

interface ClauseCardProps {
  clause: AiClause
  tierColor: 'POSITIVE' | 'WARN' | 'NEGATIVE'
  onDecision: (id: number, decision: 'accepted' | 'rejected') => void
}

function ClauseCard(props: ClauseCardProps) {
  const { clause } = props
  const decisionColor =
    clause.userDecision === 'accepted' ? 'POSITIVE' :
    clause.userDecision === 'rejected' ? 'NEGATIVE' :
    undefined

  const cardStyle =
    clause.userDecision === 'accepted' ? 'SUCCESS' :
    clause.userDecision === 'rejected' ? 'ERROR' :
    'STANDARD'

  return (
    <CardLayout padding="STANDARD" showBorder={true} showShadow={false} style={cardStyle}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <RichTextDisplayField
              value={[
                <TextItem key="n" text={clause.clauseNumber} style="STRONG" size="STANDARD" />,
                <TextItem
                  key="t"
                  text={` — ${clause.title}`}
                  size="STANDARD"
                />,
              ]}
            />
            <TagField
              tags={[
                {
                  text: clause.suggestedAction === 'inclusion' ? 'Include' : 'Exclude',
                  backgroundColor: clause.suggestedAction === 'inclusion' ? 'ACCENT' : 'SECONDARY',
                },
              ]}
              size="SMALL"
            />
            {decisionColor && (
              <TagField
                tags={[
                  {
                    text: clause.userDecision === 'accepted' ? 'Accepted' : 'Rejected',
                    backgroundColor: decisionColor,
                  },
                ]}
                size="SMALL"
              />
            )}
          </div>

          <div className="mt-2">
            <RichTextDisplayField
              value={[
                <TextItem
                  key="l"
                  text="Reason: "
                  style="STRONG"
                  size="SMALL"
                  color="SECONDARY"
                />,
                <TextItem
                  key="r"
                  text={clause.reason}
                  size="SMALL"
                  color="SECONDARY"
                />,
              ]}
            />
          </div>

          <div className="mt-1 flex flex-wrap gap-4">
            <RichTextDisplayField
              value={[
                <TextItem
                  key="s"
                  text={`Source: ${clause.source}`}
                  size="SMALL"
                  color="SECONDARY"
                />,
              ]}
            />
            <RichTextDisplayField
              value={[
                <TextItem
                  key="c"
                  text={`Citation: ${clause.farCitation}`}
                  size="SMALL"
                  color="SECONDARY"
                />,
              ]}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <ButtonWidget
            label="Accept"
            style={clause.userDecision === 'accepted' ? 'SOLID' : 'OUTLINE'}
            color="POSITIVE"
            size="SMALL"
            icon="Check"
            iconPosition="START"
            onClick={() => props.onDecision(clause.id, 'accepted')}
          />
          <ButtonWidget
            label="Reject"
            style={clause.userDecision === 'rejected' ? 'SOLID' : 'OUTLINE'}
            color="NEGATIVE"
            size="SMALL"
            icon="X"
            iconPosition="START"
            onClick={() => props.onDecision(clause.id, 'rejected')}
          />
        </div>
      </div>
    </CardLayout>
  )
}

// ============================================================================
// Step 3: Confirm
// ============================================================================

interface Step3Props {
  clauses: AiClause[]
  onBack: () => void
}

function StepConfirm(props: Step3Props) {
  const accepted = props.clauses.filter(c => c.userDecision === 'accepted')
  const rejected = props.clauses.filter(c => c.userDecision === 'rejected')
  const pending = props.clauses.filter(c => !c.userDecision)

  return (
    <CardLayout padding="MORE" showShadow={true} showBorder={false}>
      <HeadingField
        text="Review your clause set"
        size="MEDIUM_PLUS"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <CardLayout padding="STANDARD" style="SUCCESS" showBorder={true}>
          <div className="text-center">
            <RichTextDisplayField
              value={[
                <TextItem
                  key="c"
                  text={`${accepted.length}`}
                  style="STRONG"
                  size="LARGE_PLUS"
                  color="POSITIVE"
                />,
                <br key="br" />,
                <TextItem key="l" text="Accepted" color="SECONDARY" size="SMALL" />,
              ]}
              align="CENTER"
            />
          </div>
        </CardLayout>
        <CardLayout padding="STANDARD" style="ERROR" showBorder={true}>
          <div className="text-center">
            <RichTextDisplayField
              value={[
                <TextItem
                  key="c"
                  text={`${rejected.length}`}
                  style="STRONG"
                  size="LARGE_PLUS"
                  color="NEGATIVE"
                />,
                <br key="br" />,
                <TextItem key="l" text="Rejected" color="SECONDARY" size="SMALL" />,
              ]}
              align="CENTER"
            />
          </div>
        </CardLayout>
        <CardLayout padding="STANDARD" style="WARN" showBorder={true}>
          <div className="text-center">
            <RichTextDisplayField
              value={[
                <TextItem
                  key="c"
                  text={`${pending.length}`}
                  style="STRONG"
                  size="LARGE_PLUS"
                />,
                <br key="br" />,
                <TextItem key="l" text="Pending" color="SECONDARY" size="SMALL" />,
              ]}
              align="CENTER"
            />
          </div>
        </CardLayout>
      </div>

      {pending.length > 0 && (
        <MessageBanner
          primaryText={`${pending.length} clauses still need a decision`}
          secondaryText="Go back to Step 3 to accept or reject the remaining clauses."
          backgroundColor="WARN"
          highlightColor="WARN"
          icon="warning"
          marginBelow="MORE"
        />
      )}

      {pending.length === 0 && (
        <MessageBanner
          primaryText="All decisions made"
          secondaryText="You can now finalize this clause set."
          backgroundColor="SUCCESS"
          highlightColor="SUCCESS"
          icon="success"
          marginBelow="MORE"
        />
      )}

      <CollapsibleSection title={`Accepted clauses (${accepted.length})`} defaultOpen={true}>
        <div className="space-y-2 pt-2">
          {accepted.map(c => (
            <div key={c.id} className="flex items-start gap-2 py-1">
              <Check size={16} className="text-green-600 mt-1 flex-shrink-0" />
              <RichTextDisplayField
                value={[
                  <TextItem key="n" text={c.clauseNumber} style="STRONG" size="SMALL" />,
                  <TextItem key="t" text={` — ${c.title}`} size="SMALL" />,
                ]}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={`Rejected clauses (${rejected.length})`} defaultOpen={false}>
        <div className="space-y-2 pt-2">
          {rejected.map(c => (
            <div key={c.id} className="flex items-start gap-2 py-1">
              <X size={16} className="text-red-600 mt-1 flex-shrink-0" />
              <RichTextDisplayField
                value={[
                  <TextItem key="n" text={c.clauseNumber} style="STRONG" size="SMALL" />,
                  <TextItem key="t" text={` — ${c.title}`} size="SMALL" />,
                ]}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <div className="mt-8 flex justify-between">
        <ButtonWidget
          label="Back"
          style="OUTLINE"
          color="STANDARD"
          size="STANDARD"
          onClick={props.onBack}
        />
        <ButtonWidget
          label="Finalize clause set"
          style="SOLID"
          color="ACCENT"
          size="STANDARD"
          disabled={pending.length > 0}
          onClick={() => alert('Clause set finalized.')}
        />
      </div>
    </CardLayout>
  )
}
