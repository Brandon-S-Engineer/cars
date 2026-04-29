'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ExternalLink, Sheet, Trash2, Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type ConnectedSheet = {
  id: string
  name: string
  spreadsheetId: string
  range: string
  createdAt: Date
}

const connectSchema = z.object({
  input: z.string().min(1, 'Paste a Sheet URL or ID'),
  name: z.string().optional(),
  range: z.string().optional(),
})

type ConnectForm = z.infer<typeof connectSchema>

function ConnectSheetDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConnectForm>({ resolver: zodResolver(connectSchema) })

  const onSubmit = async (data: ConnectForm) => {
    setLoading(true)
    setServerError(null)
    const res = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setLoading(false)

    if (!res.ok) {
      const json = await res.json()
      setServerError(typeof json.error === 'string' ? json.error : 'Failed to connect sheet')
      return
    }

    reset()
    setOpen(false)
    toast.success('Sheet connected')
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size='sm'><Plus className='h-4 w-4 mr-1.5' />Connect sheet</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a Google Sheet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-1'>
          <div className='space-y-2'>
            <Label>Sheet URL or Spreadsheet ID</Label>
            <Input
              {...register('input')}
              placeholder='https://docs.google.com/spreadsheets/d/...'
            />
            {errors.input && <p className='text-sm text-destructive'>{errors.input.message}</p>}
            <p className='text-xs text-muted-foreground'>
              Make sure the service account has been shared as a Viewer on this sheet.
            </p>
          </div>
          <div className='space-y-2'>
            <Label>
              Display name <span className='text-muted-foreground'>(optional)</span>
            </Label>
            <Input {...register('name')} placeholder='Leave blank to use the sheet title' />
          </div>
          <div className='space-y-2'>
            <Label>
              Range <span className='text-muted-foreground'>(optional)</span>
            </Label>
            <Input {...register('range')} placeholder='Sheet1  or  Sheet1!A1:Z100' />
            <p className='text-xs text-muted-foreground'>
              Defaults to the first sheet. Use A1 notation to limit columns.
            </p>
          </div>
          {serverError && <p className='text-sm text-destructive'>{serverError}</p>}
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
            Connect
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DisconnectDialog({ sheet, onSuccess }: { sheet: ConnectedSheet; onSuccess: () => void }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    await fetch(`/api/sheets/${sheet.id}`, { method: 'DELETE' })
    setOpen(false)
    toast.success('Sheet disconnected')
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant='ghost' size='sm' className='text-muted-foreground hover:text-destructive' />
        }>
        <Trash2 className='h-4 w-4' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect &ldquo;{sheet.name}&rdquo;?</DialogTitle>
        </DialogHeader>
        <p className='text-sm text-muted-foreground'>
          This removes the connection from this dashboard. The Google Sheet itself will not be affected.
        </p>
        <div className='flex justify-end gap-2 mt-4'>
          <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant='destructive' onClick={handleDelete}>Disconnect</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SheetsList({ sheets }: { sheets: ConnectedSheet[] }) {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold'>Google Sheets</h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Connect sheets and view their data inside the dashboard.
          </p>
        </div>
        <ConnectSheetDialog onSuccess={refresh} />
      </div>

      {sheets.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-16 gap-3'>
            <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
              <Sheet className='h-5 w-5 text-muted-foreground' />
            </div>
            <p className='text-sm font-medium'>No sheets connected</p>
            <p className='text-sm text-muted-foreground text-center max-w-xs'>
              Connect a Google Sheet to view and explore its data here. Share your sheet with the service account first.
            </p>
            <ConnectSheetDialog onSuccess={refresh} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Connected sheets</CardTitle>
            <CardDescription>{sheets.length} {sheets.length === 1 ? 'sheet' : 'sheets'} connected</CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='rounded-md border mx-6 mb-6'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Name</th>
                    <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Spreadsheet ID</th>
                    <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Range</th>
                    <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Connected</th>
                    <th className='px-4 py-3 text-left font-medium text-muted-foreground'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sheets.map((sheet) => (
                    <tr key={sheet.id} className='border-b last:border-0 hover:bg-muted/30 transition-colors'>
                      <td className='px-4 py-3 font-medium'>{sheet.name}</td>
                      <td className='px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[180px]'>
                        {sheet.spreadsheetId}
                      </td>
                      <td className='px-4 py-3 font-mono text-xs text-muted-foreground'>{sheet.range}</td>
                      <td className='px-4 py-3 text-muted-foreground'>
                        {new Date(sheet.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-1'>
                          <Link
                            href={`/dashboard/sheets/${sheet.id}`}
                            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                            <ExternalLink className='h-3.5 w-3.5 mr-1.5' />
                            View
                          </Link>
                          <DisconnectDialog sheet={sheet} onSuccess={refresh} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
