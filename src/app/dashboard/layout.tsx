import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/shell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const user = {
    name: session.user?.name ?? session.user?.email ?? '',
    email: session.user?.email ?? '',
    role: (session.user as { role?: string })?.role ?? 'USER',
  }

  return <DashboardShell user={user}>{children}</DashboardShell>
}
