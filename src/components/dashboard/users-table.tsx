'use client'

import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, ColumnDef, SortingState } from '@tanstack/react-table'
import { useState } from 'react'
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
              <option value='USER'>User</option>
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
              <option value='USER'>User</option>
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

  const refresh = () => router.refresh()

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    refresh()
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
      cell: ({ row }) => row.getValue('role') === 'ADMIN' ? 'Admin' : 'Usuario',
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
    data: users,
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
        <CreateUserDialog onSuccess={refresh} />
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
