import { auth } from '@/lib/auth'
import ThemeToggle from '@/components/theme-toggle'

export default async function Header() {
  const session = await auth()
  const name = session?.user?.name ?? session?.user?.email ?? ''
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const role = session?.user?.role ?? 'USER'

  return (
    <header className='h-14 border-b bg-background flex items-center justify-end px-8 gap-4'>
      <ThemeToggle />
      <span className='text-sm text-muted-foreground'>{name}</span>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{role === 'ADMIN' ? 'Admin' : 'Usuario'}</span>
      <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold'>{initials}</div>
    </header>
  )
}
