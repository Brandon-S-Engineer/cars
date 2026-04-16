import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import OverviewClient from '@/components/dashboard/overview-client'

export default async function DashboardPage() {
  const session = await auth()

  const totalUsers = await prisma.user.count()
  const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } })
  const regularUsers = await prisma.user.count({ where: { role: 'USER' } })

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  const usersPerMonth = await prisma.user.groupBy({
    by: ['createdAt'],
    _count: { id: true },
    orderBy: { createdAt: 'asc' },
  })

  const chartData = [
    { month: 'Ene', usuarios: 0 },
    { month: 'Feb', usuarios: 0 },
    { month: 'Mar', usuarios: 0 },
    { month: 'Abr', usuarios: 0 },
    { month: 'May', usuarios: 0 },
    { month: 'Jun', usuarios: 0 },
    { month: 'Jul', usuarios: 0 },
  ]

  usersPerMonth.forEach((entry) => {
    const month = new Date(entry.createdAt).getMonth()
    if (month < chartData.length) {
      chartData[month].usuarios += entry._count.id
    }
  })

  return (
    <OverviewClient
      userName={session?.user?.name ?? session?.user?.email ?? ''}
      totalUsers={totalUsers}
      adminUsers={adminUsers}
      regularUsers={regularUsers}
      recentUsers={recentUsers}
      chartData={chartData}
    />
  )
}
