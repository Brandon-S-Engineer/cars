import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import OverviewClient from '@/components/dashboard/overview-client'

function generateMonthlyData(totalUsers: number) {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
  let base = Math.max(10, Math.round(totalUsers * 0.3))
  return months.map((month) => {
    base += Math.floor(Math.random() * 15) - 3
    return {
      month,
      users: Math.max(5, base),
      revenue: Math.max(1000, base * 40),
    }
  })
}

export default async function DashboardPage() {
  const session = await auth()

  const [totalUsers, adminUsers, regularUsers, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ])

  const monthly = generateMonthlyData(totalUsers)
  // Pin the last point to real total so chart ends at actual count
  monthly[monthly.length - 1].users = totalUsers

  return (
    <OverviewClient
      userName={session?.user?.name ?? session?.user?.email ?? ''}
      totalUsers={totalUsers}
      adminUsers={adminUsers}
      regularUsers={regularUsers}
      recentUsers={recentUsers}
      monthly={monthly}
    />
  )
}
