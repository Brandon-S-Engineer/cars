'use client'

import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, ColumnDef, SortingState } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LineChart, BarChart, ProgressBar } from '@/components/dashboard/charts'
import { cn } from '@/lib/utils'

type DailyPoint = { date: string; users: number; signups: number; sessions: number }
type MonthlyPoint = { month: string; users: number; sessions: number; revenue: number }

type StripeTransaction = {
  id: string
  customerEmail: string
  amount: number
  currency: string
  status: string
  date: number
}

type Props = {
  totalUsers: number
  adminUsers: number
  regularUsers: number
  monthly: MonthlyPoint[]
  daily: DailyPoint[]
  transactions: StripeTransaction[]
}

const COUNTRIES = [
  { c: 'United States', code: 'US', v: 1284, pct: 42 },
  { c: 'Germany', code: 'DE', v: 618, pct: 20 },
  { c: 'Spain', code: 'ES', v: 432, pct: 14 },
  { c: 'Mexico', code: 'MX', v: 298, pct: 10 },
  { c: 'Brazil', code: 'BR', v: 211, pct: 7 },
  { c: 'Other', code: '··', v: 220, pct: 7 },
]

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  refunded: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
}

function fmtAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

function TransactionsTable({ transactions }: { transactions: StripeTransaction[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<StripeTransaction>[] = useMemo(
    () => [
      {
        accessorKey: 'customerEmail',
        header: 'Customer',
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => fmtAmount(row.getValue('amount'), row.original.currency),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s: string = row.getValue('status')
          return (
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', STATUS_STYLES[s] ?? 'bg-muted text-muted-foreground')}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          )
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) =>
          new Date((row.getValue('date') as number) * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-base">Transactions</CardTitle>
            <CardDescription>Recent Stripe payments (test mode)</CardDescription>
          </div>
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs h-8 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-md border-t">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b bg-muted/50">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                    No transactions found. Add a real Stripe test key to load data.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MetricsClient({ totalUsers, adminUsers: _adminUsers, regularUsers: _regularUsers, monthly, daily, transactions }: Props) {
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

      <TransactionsTable transactions={transactions} />
    </div>
  )
}
