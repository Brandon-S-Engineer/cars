import { auth } from '@/lib/auth'
import ProfileClient from '@/components/dashboard/profile-client'

export default async function ProfilePage() {
  const session = await auth()

  return (
    <div className='space-y-6 max-w-lg'>
      <h1 className='text-2xl font-semibold'>Perfil</h1>
      <ProfileClient
        name={session?.user?.name ?? ''}
        email={session?.user?.email ?? ''}
        role={session?.user?.role ?? 'USER'}
      />
    </div>
  )
}
