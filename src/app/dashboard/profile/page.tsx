import { auth } from '@/lib/auth'
import ProfileClient from '@/components/dashboard/profile-client'

export default async function ProfilePage() {
  const session = await auth()
  return (
    <ProfileClient
      name={session?.user?.name ?? ''}
      email={session?.user?.email ?? ''}
      role={(session?.user as { role?: string })?.role ?? 'USER'}
    />
  )
}
