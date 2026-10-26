import type { ReactNode } from 'react'
import { TabsField } from '@pglevy/sailwind'
import { useLocation } from 'wouter'
import AppNav from './app-nav'

/**
 * Shared frame for the Library pages: Clause Automation site navigation on
 * the left, the Option 1 / Option 2 tab bar on top, and the page content below.
 *
 * The tab bar is only rendered on the two "landing" variants; the import
 * wizard, confirm, and summary flows pass showTabs=false.
 */
type LibraryTab = 'option-1' | 'option-2' | 'option-3'

const tabRoutes: Record<LibraryTab, string> = {
  'option-1': '/library',
  'option-2': '/library-option-2',
  'option-3': '/library-option-3',
}

export default function LibraryShell({
  children,
  activeTab,
  showTabs = false,
}: {
  children: ReactNode
  activeTab?: LibraryTab
  showTabs?: boolean
}) {
  const [, setLocation] = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
      <AppNav selected="Library" />
      <main className="flex-1 overflow-y-auto border-l border-gray-200">
        {showTabs && activeTab && (
          <div className="[&_[role=tab]]:px-12 bg-white">
            <TabsField
              tabs={[
                { value: 'option-1', label: 'Option 1' },
                { value: 'option-2', label: 'Option 2' },
                { value: 'option-3', label: 'Option 3' },
              ]}
              value={activeTab}
              onValueChange={value => setLocation(tabRoutes[value as LibraryTab])}
              variant="UNDERLINE"
              size="MEDIUM"
              navigationOnly={true}
              fullWidthSeparator={true}
            />
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
