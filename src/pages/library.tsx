import { HeadingField, RichTextDisplayField, TextItem, CardLayout, ButtonWidget, Icon } from '@pglevy/sailwind'
import { useLocation } from 'wouter'
import LibraryShell from '../components/library-shell'

export default function Library() {
  const [, setLocation] = useLocation()

  return (
    <LibraryShell showTabs={true} activeTab="option-1">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
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
      </header>

      {/* Empty state card */}
      <div className="px-8 py-8">
        <CardLayout padding="EVEN_MORE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto py-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-5">
              <Icon icon="BookOpen" size="LARGE" color="ACCENT" />
            </div>

            <HeadingField
              text="No library installed"
              size="MEDIUM"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="EVEN_LESS"
            />

            <RichTextDisplayField
              value={[
                <TextItem
                  key="desc"
                  text="Download the latest package from Forum, then import it to get started."
                  color="SECONDARY"
                  size="STANDARD"
                />,
              ]}
              marginBelow="STANDARD"
            />

            <div className="flex items-center gap-3 mt-2">
              <ButtonWidget
                label="Import library"
                style="OUTLINE"
                color="ACCENT"
                icon="Upload"
                iconPosition="START"
                onClick={() => setLocation('/library/import')}
              />
              <ButtonWidget
                label="Forum download page"
                style="SOLID"
                color="ACCENT"
                icon="ExternalLink"
                iconPosition="END"
                onClick={() => alert('Opening Forum download page in a new tab (not wired up in this prototype).')}
              />
            </div>
          </div>
        </CardLayout>
      </div>
    </LibraryShell>
  )
}
