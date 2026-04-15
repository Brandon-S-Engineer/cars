import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Overview</h1>
      <p className='text-muted-foreground'>Bienvenido, {session?.user?.name ?? session?.user?.email}</p>
    </div>
  )
}
