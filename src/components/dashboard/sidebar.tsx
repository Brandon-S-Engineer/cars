'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BarChart2, LogOut, Settings } from 'lucide-react'
import { signOut } from '../../../node_modules/next-auth/react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/metrics', label: 'Metrics', icon: BarChart2 },
  { href: '/dashboard/profile', label: 'Perfil', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className='w-64 h-screen border-r bg-background flex flex-col fixed left-0 top-0'>
      <div className='p-6'>
        <h1 className='text-lg font-semibold'>Dashboard</h1>
      </div>

      <Separator />

      <nav className='flex-1 p-4 space-y-1'>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors', isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              <Icon className='h-4 w-4' />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className='p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start gap-3 text-muted-foreground'
          onClick={() => signOut({ callbackUrl: '/login' })}>
          <LogOut className='h-4 w-4' />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
