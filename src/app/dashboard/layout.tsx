import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/sidebar'
import Header from '@/components/dashboard/header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-1 ml-64 flex flex-col'>
        <Header />
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  )
}
