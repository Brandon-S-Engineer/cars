'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, BarChart, ProgressBar } from '@/components/dashboard/charts'
import { cn } from '@/lib/utils'

type DailyPoint = { date: string; users: number; signups: number; sessions: number }
type MonthlyPoint = { month: string; users: number; sessions: number; revenue: number }

type Props = {
  totalUsers: number
  adminUsers: number
  regularUsers: number
  monthly: MonthlyPoint[]
  daily: DailyPoint[]
}

const COUNTRIES = [
  { c: 'United States', code: 'US', v: 1284, pct: 42 },
  { c: 'Germany', code: 'DE', v: 618, pct: 20 },
  { c: 'Spain', code: 'ES', v: 432, pct: 14 },
  { c: 'Mexico', code: 'MX', v: 298, pct: 10 },
  { c: 'Brazil', code: 'BR', v: 211, pct: 7 },
  { c: 'Other', code: '··', v: 220, pct: 7 },
]

export default function MetricsClient({ totalUsers, adminUsers: _adminUsers, regularUsers: _regularUsers, monthly, daily }: Props) {
  const [range, setRange] = useState<'7d' | '30d' | '12m'>('30d')

  const data = range === '12m' ? monthly : daily
  const xKey = range === '12m' ? 'month' : 'date'

  const activeUsers = Math.round(totalUsers * 0.7)
  const signups = daily.reduce((s, d) => s + d.signups, 0)
  const sessions = daily.reduce((s, d) => s + d.sessions, 0)

  const cards = [
    { label: 'Total users', value: totalUsers.toLocaleString(), delta: '+12.4%', up: true },
    { label: 'Active users', value: activeUsers.toLocaleString(), delta: '+6.2%', up: true },
    { label: 'New signups', value: signups.toLocaleString(), delta: '+18.0%', up: true, sub: 'last 30 days' },
    { label: 'Sessions', value: sessions.toLocaleString(), delta: '−1.4%', up: false, sub: 'last 30 days' },
  ]

  const displayData = range === '7d' ? daily.slice(-7) : data

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Metrics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Product analytics across users, sessions and revenue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-0.5 rounded-md border border-border bg-muted/40">
            {(['7d', '30d', '12m'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setRange(v)}
                className={cn(
                  'px-2.5 py-1 text-xs rounded',
                  range === v ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {v === '7d' ? '7D' : v === '30d' ? '30D' : '12M'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-3.5 w-3.5" />Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">{c.label}</div>
              <div className="text-2xl font-semibold font-mono mt-1">{c.value}</div>
              <div
                className={cn(
                  'text-xs mt-1 inline-flex items-center gap-1',
                  c.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                )}
              >
                {c.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {c.delta}
                {c.sub && <span className="text-muted-foreground font-normal ml-1">{c.sub}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">Users over time</CardTitle>
            <CardDescription>
              {range === '12m' ? 'Monthly active users' : range === '30d' ? 'Daily active users — last 30 days' : 'Daily active users — last 7 days'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LineChart
            data={displayData as Record<string, unknown>[]}
            xKey={xKey}
            yKey="users"
            height={300}
            yFormatter={(v) => v.toLocaleString()}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Signups</CardTitle>
            <CardDescription>New accounts per day</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={daily.slice(-14) as Record<string, unknown>[]}
              xKey="date"
              yKey="signups"
              height={220}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top countries</CardTitle>
            <CardDescription>Users by region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {COUNTRIES.map((r) => (
              <div key={r.c}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                      {r.code}
                    </span>
                    <span>{r.c}</span>
                  </div>
                  <div className="text-muted-foreground font-mono text-xs">
                    {r.v.toLocaleString()}{' '}
                    <span className="text-foreground/60">· {r.pct}%</span>
                  </div>
                </div>
                <ProgressBar value={r.pct} max={50} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
