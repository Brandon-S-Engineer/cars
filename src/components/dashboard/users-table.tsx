'use client'

import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, ColumnDef, SortingState } from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type User = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

const createSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['ADMIN', 'USER']),
})

const editSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  role: z.enum(['ADMIN', 'USER']),
})

type CreateForm = z.infer<typeof createSchema>
type EditForm = z.infer<typeof editSchema>

function CreateUserDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
  })

  const onSubmit = async (data: CreateForm) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? 'Error al crear usuario')
      return
    }
    reset()
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger render={<Button size='sm' />}>+ Nuevo usuario</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'>
          <div className='space-y-2'>
            <Label>Nombre</Label>
            <Input {...register('name')} />
            {errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label>Email</Label>
            <Input
              type='email'
              {...register('email')}
            />
            {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label>Password</Label>
            <Input
              type='password'
              {...register('password')}
            />
            {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label>Rol</Label>
            <select
              {...register('role')}
              className='w-full border rounded-md px-3 py-2 text-sm bg-background'>
              <option value='USER'>Usuario</option>
              <option value='ADMIN'>Admin</option>
            </select>
          </div>
          {error && <p className='text-sm text-destructive'>{error}</p>}
          <Button
            type='submit'
            className='w-full'>
            Crear
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditUserDialog({ user, onSuccess }: { user: User; onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: user.name ?? '', role: user.role as 'ADMIN' | 'USER' },
  })

  const onSubmit = async (data: EditForm) => {
    await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant='outline'
            size='sm'
          />
        }>
        Editar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'>
          <div className='space-y-2'>
            <Label>Nombre</Label>
            <Input {...register('name')} />
            {errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label>Rol</Label>
            <select
              {...register('role')}
              className='w-full border rounded-md px-3 py-2 text-sm bg-background'>
              <option value='USER'>Usuario</option>
              <option value='ADMIN'>Admin</option>
            </select>
          </div>
          <Button
            type='submit'
            className='w-full'>
            Guardar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function UsersTable({ users }: { users: User[] }) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const refresh = () => router.refresh()

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    refresh()
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!startDate && !endDate) return true
      const created = new Date(user.createdAt)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      if (start && created < start) return false
      if (end) {
        const endOfDay = new Date(end)
        endOfDay.setHours(23, 59, 59, 999)
        if (created > endOfDay) return false
      }
      return true
    })
  }, [users, startDate, endDate])

  const exportCSV = () => {
    const headers = ['Nombre', 'Email', 'Rol', 'Creado']
    const rows = filteredUsers.map((u) => [u.name ?? '', u.email, u.role === 'ADMIN' ? 'Admin' : 'Usuario', new Date(u.createdAt).toLocaleDateString()])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'usuarios.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => row.getValue('name') ?? '—',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.getValue('role') === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{row.getValue('role') === 'ADMIN' ? 'Admin' : 'Usuario'}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <EditUserDialog
            user={row.original}
            onSuccess={refresh}
          />
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleDelete(row.original.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: filteredUsers,
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
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Input
          placeholder='Buscar usuarios...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='max-w-sm'
        />
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={exportCSV}>
            Exportar CSV
          </Button>
          <CreateUserDialog onSuccess={refresh} />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Label className='text-sm text-muted-foreground whitespace-nowrap'>Desde</Label>
          <Input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='w-40'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Label className='text-sm text-muted-foreground whitespace-nowrap'>Hasta</Label>
          <Input
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='w-40'
          />
        </div>
        {(startDate || endDate) && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setStartDate('')
              setEndDate('')
            }}>
            Limpiar
          </Button>
        )}
      </div>

      <div className='rounded-md border'>
        <table className='w-full text-sm'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className='border-b bg-muted/50'>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer select-none'
                    onClick={header.column.getToggleSortingHandler()}>
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
                <td
                  colSpan={columns.length}
                  className='px-4 py-8 text-center text-muted-foreground'>
                  No hay usuarios
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='border-b hover:bg-muted/30 transition-colors'>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-4 py-3'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </p>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
