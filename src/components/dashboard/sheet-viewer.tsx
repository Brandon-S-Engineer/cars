'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { ArrowLeft, RefreshCw, Loader2, AlertCircle, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  name: string
  spreadsheetId: string
  range: string
}

type RowData = Record<string, string>

export default function SheetViewer({ id, name, spreadsheetId, range }: Props) {
  const [rows, setRows] = useState<RowData[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/sheets/${id}/data`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to load sheet data')
      }
      const json = await res.json()
      const rawRows: string[][] = json.rows ?? []

      if (rawRows.length === 0) {
        setHeaders([])
        setRows([])
        return
      }

      const [headerRow, ...dataRows] = rawRows
      setHeaders(headerRow)
      setRows(
        dataRows.map((row) =>
          Object.fromEntries(headerRow.map((h, i) => [h, row[i] ?? ''])),
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const exportCSV = () => {
    const csvRows = [headers, ...rows.map((r) => headers.map((h) => r[h] ?? ''))]
    const csv = csvRows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<RowData>[] = headers.map((h) => ({
    accessorKey: h,
    header: h,
    cell: ({ row }) => <span className='whitespace-nowrap'>{row.getValue(h)}</span>,
  }))

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3'>
        <Link href='/dashboard/sheets' className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
          <ArrowLeft className='h-4 w-4 mr-1.5' />
          Sheets
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle>{name}</CardTitle>
              <CardDescription className='font-mono text-xs mt-1'>
                {spreadsheetId} · {range}
              </CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {rows.length > 0 && (
                <Button variant='outline' size='sm' onClick={exportCSV}>
                  <Download className='h-3.5 w-3.5 mr-1.5' />
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-20 gap-2 text-muted-foreground'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span className='text-sm'>Loading sheet data…</span>
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center py-16 gap-3 text-destructive'>
              <AlertCircle className='h-6 w-6' />
              <p className='text-sm font-medium'>{error}</p>
              <Button variant='outline' size='sm' onClick={fetchData}>Try again</Button>
            </div>
          ) : rows.length === 0 ? (
            <div className='flex items-center justify-center py-16 text-muted-foreground'>
              <p className='text-sm'>This sheet is empty or the range returned no data.</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Input
                  placeholder='Search all columns…'
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className='max-w-sm'
                />
                <p className='text-sm text-muted-foreground'>
                  {table.getFilteredRowModel().rows.length} rows
                </p>
              </div>

              <div className='rounded-md border overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id} className='border-b bg-muted/50'>
                        {hg.headers.map((header) => (
                          <th
                            key={header.id}
                            className='px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none whitespace-nowrap'
                            onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc'
                              ? ' ↑'
                              : header.column.getIsSorted() === 'desc'
                              ? ' ↓'
                              : ''}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className='border-b last:border-0 hover:bg-muted/30 transition-colors'>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className='px-4 py-3'>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </p>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
