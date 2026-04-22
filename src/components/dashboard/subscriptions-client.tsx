'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, ColumnDef, SortingState } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export type SubscriptionRow = {
  id: string
  customerEmail: string
  planName: string
  status: string
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  past_due: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  canceled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  trialing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  unpaid: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
}

function CancelDialog({ subscriptionId, onSuccess }: { subscriptionId: string; onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, { method: 'POST' })
      if (!res.ok) throw new Error()
      setOpen(false)
      toast.success('Subscription canceled')
      onSuccess()
    } catch {
      toast.error('Failed to cancel subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        Cancel
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel subscription?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will immediately cancel the subscription in Stripe. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Keep
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={loading}>
            {loading ? 'Canceling…' : 'Cancel subscription'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SubscriptionsClient({ subscriptions }: { subscriptions: SubscriptionRow[] }) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const refresh = () => router.refresh()

  const columns: ColumnDef<SubscriptionRow>[] = useMemo(
    () => [
      {
        accessorKey: 'customerEmail',
        header: 'Customer',
      },
      {
        accessorKey: 'planName',
        header: 'Plan',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s: string = row.getValue('status')
          return (
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', STATUS_STYLES[s] ?? 'bg-muted text-muted-foreground')}>
              {s.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
            </span>
          )
        },
      },
      {
        accessorKey: 'currentPeriodEnd',
        header: 'Renewal date',
        cell: ({ row }) => {
          const ts = row.getValue('currentPeriodEnd') as number
          const status: string = row.getValue('status')
          if (status === 'canceled') return <span className="text-muted-foreground">—</span>
          return new Date(ts * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const status: string = row.getValue('status')
          if (status === 'canceled') {
            return <span className="text-xs text-muted-foreground">Canceled</span>
          }
          return <CancelDialog subscriptionId={row.original.id} onSuccess={refresh} />
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const table = useReactTable({
    data: subscriptions,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stripe subscription status for all customers.
          </p>
        </div>
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border">
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
                  No subscriptions found. Add a real Stripe test key to load data.
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

      <div className="flex items-center justify-between">
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
    </div>
  )
}
