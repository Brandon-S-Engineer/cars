'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/sidebar'
import TopBar from '@/components/dashboard/topbar'
import ChatWidget from '@/components/dashboard/chat-widget'

export default function DashboardShell({ user, children }: { user: { name: string; email: string; role: string }; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleSidebar = () => {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem('sidebar-collapsed', String(next))
      } catch {}
      return next
    })
  }

  return (
    <div className='flex min-h-screen bg-sidebar text-foreground'>
      <Sidebar collapsed={collapsed} />
      <div className='flex-1 min-w-0 flex flex-col'>
        <TopBar
          onToggleSidebar={toggleSidebar}
          user={user}
        />
        <main className='flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto'>{children}</main>
      </div>
      <ChatWidget />
    </div>
  )
}
