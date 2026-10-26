import { SiteNav } from '@pglevy/sailwind'
import { LayoutGrid, List, Layers, CircleHelp, Shuffle, BookOpen } from 'lucide-react'
import { useLocation } from 'wouter'

const navItems = [
  { label: 'Clause Sets', icon: LayoutGrid, path: null },
  { label: 'Clauses', icon: List, path: null },
  { label: 'Templates', icon: Layers, path: null },
  { label: 'Questionnaires', icon: CircleHelp, path: '/questions-landing' },
  { label: 'Rules', icon: Shuffle, path: '/rules' },
  { label: 'Library', icon: BookOpen, path: '/library' },
]

export type AppNavItem = (typeof navItems)[number]['label']

/** Left site navigation shared by the Clause Automation pages. */
export default function AppNav({ selected }: { selected: AppNavItem }) {
  const [, setLocation] = useLocation()

  const pages = navItems.map(({ path, ...item }) => ({
    ...item,
    isSelected: item.label === selected,
    onClick: path ? () => setLocation(path) : undefined,
  }))

  return (
    // SiteNav is fixed at 240px with 14px labels. The arbitrary variants widen it to 280px and bump the text.
    <div className="h-full shrink-0 [&>nav]:w-[280px] [&_nav_span.text-sm]:text-base [&_nav_span.text-lg]:text-xl">
      <SiteNav
        displayName="Clause Automation"
        pages={pages}
        userName="Privilege User"
        appianLogoSrc="/images/icon-appian-header-blue.svg"
        highlightColor="#C7C4F4"
      />
    </div>
  )
}
