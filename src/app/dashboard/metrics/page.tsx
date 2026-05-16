import { prisma } from '@/lib/db'
import MetricsClient from '@/components/dashboard/metrics-client'

function seededRng(seed: number) {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

function generateMonthlyData(totalUsers: number) {
  const rng = seededRng(99)
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
  let base = Math.max(10, Math.round(totalUsers * 0.3))
  return months.map((month) => {
    base += Math.floor(rng() * 60) - 10
    return {
      month,
      users: Math.max(5, base),
      sessions: Math.max(20, base * 2),
      revenue: Math.max(1000, base * 40),
    }
  })
}

function generateDailyData() {
  const rng = seededRng(31)
  const data = []
  const now = Date.now()
  let base = 380
  for (let i = 29; i >= 0; i--) {
    base += Math.floor(rng() * 40) - 18
    const d = new Date(now - i * 86400000)
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      users: Math.max(200, base),
      signups: Math.floor(base * 0.06 + rng() * 8),
      sessions: Math.floor(base * (1.8 + rng() * 0.5)),
    })
  }
  return data
}

export default async function MetricsPage() {
  const [totalUsers, adminUsers, regularUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'USER' } }),
  ])

  const monthly = generateMonthlyData(totalUsers)
  const daily = generateDailyData()

  return (
    <MetricsClient
      totalUsers={totalUsers}
      adminUsers={adminUsers}
      regularUsers={regularUsers}
      monthly={monthly}
      daily={daily}
    />
  )
}
