'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  Users,
  Activity,
  DollarSign,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Calendar,
  Download,
  Check,
  Settings,
  Shield,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { LineChart, DonutChart, Sparkline, ProgressBar } from '@/components/dashboard/charts'
import { cn } from '@/lib/utils'

type RecentUser = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

type MonthlyPoint = { month: string; users: number; revenue: number }

type Props = {
  userName: string
  totalUsers: number
  adminUsers: number
  regularUsers: number
  recentUsers: RecentUser[]
  monthly: MonthlyPoint[]
}

const ACTIVITY = [
  { who: 'Sofia Garcia', what: 'invited 3 new members', when: '12m ago', icon: Users },
  { who: 'Mateo Rodriguez', what: 'published a post', when: '1h ago', icon: FileText },
  { who: 'System', what: 'completed weekly backup', when: '3h ago', icon: Check },
  { who: 'Lucia Martinez', what: 'updated billing settings', when: '5h ago', icon: Settings },
  { who: 'Diego Lopez', what: 'enabled 2FA', when: 'yesterday', icon: Shield },
]

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function OverviewClient({
  userName,
  totalUsers,
  adminUsers,
  regularUsers,
  recentUsers,
  monthly,
}: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = userName.split(' ')[0] || userName

  const sparkUsers = monthly.map((m) => m.users)
  const sparkRevenue = monthly.map((m) => m.revenue)

  const stats = [
    {
      label: 'Total users',
      value: totalUsers.toLocaleString(),
      delta: '+12.4%',
      up: true,
      icon: Users,
      spark: sparkUsers,
    },
    {
      label: 'Active now',
      value: Math.round(totalUsers * 0.7).toLocaleString(),
      delta: '+3.2%',
      up: true,
      icon: Activity,
      spark: sparkUsers.map((v) => v * 0.7),
    },
    {
      label: 'Monthly revenue',
      value: '$48,214',
      delta: '+8.1%',
      up: true,
      icon: DollarSign,
      spark: sparkRevenue,
    },
    {
      label: 'Churn rate',
      value: '2.1%',
      delta: '−0.4%',
      up: false,
      icon: TrendingDown,
      spark: monthly.map((_, i) => 10 - i * 0.4),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{greeting}, {firstName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening across your workspace this week.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-3.5 w-3.5" />Last 30 days
          </Button>
          <Button size="sm">
            <Download className="h-3.5 w-3.5" />Export report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Ico = s.icon
          return (
            <Card key={s.label} className="relative overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Ico className="h-3.5 w-3.5" />
                      <span>{s.label}</span>
                    </div>
                    <div className="text-2xl font-semibold tracking-tight font-mono">{s.value}</div>
                    <div
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium',
                        s.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                      )}
                    >
                      {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {s.delta}
                      <span className="text-muted-foreground font-normal">vs last month</span>
                    </div>
                  </div>
                  <div className="opacity-70">
                    <Sparkline data={s.spark} stroke="var(--foreground)" width={76} height={36} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart + Role distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-start justify-between pb-2">
            <div>
              <CardTitle className="text-base">User activity</CardTitle>
              <CardDescription className="mt-1">Monthly active users over the last year</CardDescription>
            </div>
            <div className="flex gap-1 p-0.5 rounded-md border border-border bg-muted/40">
              {['12M', '6M', '30D', '7D'].map((r, i) => (
                <button
                  key={r}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded',
                    i === 0 ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <LineChart data={monthly} xKey="month" yKey="users" height={260} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Role distribution</CardTitle>
            <CardDescription>Breakdown of accounts by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-2 relative">
              <DonutChart
                segments={[
                  { value: adminUsers, color: 'var(--foreground)' },
                  { value: regularUsers, color: 'var(--muted-foreground)' },
                ]}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-semibold font-mono">{totalUsers}</div>
                <div className="text-[11px] text-muted-foreground">Total</div>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-foreground" />
                    <span>Administrators</span>
                  </div>
                  <span className="font-mono font-medium">{adminUsers}</span>
                </div>
                <ProgressBar value={adminUsers} max={totalUsers} color="var(--foreground)" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <span>Regular users</span>
                  </div>
                  <span className="font-mono font-medium">{regularUsers}</span>
                </div>
                <ProgressBar value={regularUsers} max={totalUsers} color="var(--muted-foreground)" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent users + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent users</CardTitle>
              <CardDescription>New accounts in the last 30 days</CardDescription>
            </div>
            <Link href="/dashboard/users">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-2.5 text-xs font-medium text-muted-foreground">User</th>
                    <th className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground">Role</th>
                    <th className="text-right px-6 py-2.5 text-xs font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name ?? ''} size={30} />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{u.name ?? '—'}</div>
                            <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={u.role === 'ADMIN' ? 'default' : 'muted'}>
                          {u.role === 'ADMIN' ? 'Admin' : 'User'}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right text-xs text-muted-foreground font-mono">
                        {fmtDate(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Activity</CardTitle>
            <CardDescription>Recent workspace events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {ACTIVITY.map((a, i) => {
              const Ico = a.icon
              return (
                <div key={i} className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Ico className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium">{a.who}</span>
                      <span className="text-muted-foreground"> {a.what}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.when}</div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
