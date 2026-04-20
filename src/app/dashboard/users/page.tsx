import { prisma } from '@/lib/db'
import UsersTable from '@/components/dashboard/users-table'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <UsersTable users={users} />
}
