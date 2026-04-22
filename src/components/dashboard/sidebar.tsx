'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  FileText,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/metrics', label: 'Metrics', icon: BarChart2 },
  { href: '/dashboard/posts', label: 'Posts', icon: FileText },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
]

export default function Sidebar({
  collapsed = false,
  orgName = 'Acme',
}: {
  collapsed?: boolean
  orgName?: string
}) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-screen border-r border-border bg-sidebar text-sidebar-foreground flex flex-col sticky top-0 transition-[width] duration-200 shrink-0',
        collapsed ? 'w-[68px]' : 'w-[240px]',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-4 h-14 border-b border-border',
          collapsed && 'justify-center px-0',
        )}
      >
        <div className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 20 L12 4 L20 20 M7 14 L17 14" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{orgName}</div>
            <div className="text-[11px] text-muted-foreground truncate">Admin workspace</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-2 pt-3 pb-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Platform
          </div>
        )}
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors relative',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
                collapsed && 'justify-center px-0',
              )}
            >
              {isActive && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-foreground rounded-r" />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          title={collapsed ? 'Sign out' : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors',
            collapsed && 'justify-center px-0',
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
