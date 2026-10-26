import type { ReactNode } from 'react'
import AppNav from './app-nav'

/**
 * Shared frame for the Library pages: the Clause Automation site navigation on
 * the left, and the page's own content on the right. No top tabs.
 */
export default function LibraryShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AppNav selected="Library" />
      <main className="flex-1 overflow-y-auto border-l border-gray-200">
        {children}
      </main>
    </div>
  )
}
