'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const nameSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Requerido'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
})

type NameForm = z.infer<typeof nameSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfileClient({ name, email, role }: { name: string; email: string; role: string }) {
  const [nameSuccess, setNameSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const nameForm = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onNameSubmit = async (data: NameForm) => {
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setNameSuccess(true)
    setTimeout(() => setNameSuccess(false), 3000)
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPasswordError(null)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    })

    if (!res.ok) {
      const json = await res.json()
      setPasswordError(json.error ?? 'Error al cambiar password')
      return
    }

    setPasswordSuccess(true)
    passwordForm.reset()
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Información general</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1'>
            <Label className='text-muted-foreground text-xs'>Email</Label>
            <p className='text-sm'>{email}</p>
          </div>
          <div className='space-y-1'>
            <Label className='text-muted-foreground text-xs'>Rol</Label>
            <p className='text-sm'>{role === 'ADMIN' ? 'Admin' : 'Usuario'}</p>
          </div>
          <form
            onSubmit={nameForm.handleSubmit(onNameSubmit)}
            className='space-y-3'>
            <div className='space-y-2'>
              <Label>Nombre</Label>
              <Input {...nameForm.register('name')} />
              {nameForm.formState.errors.name && <p className='text-sm text-destructive'>{nameForm.formState.errors.name.message}</p>}
            </div>
            {nameSuccess && <p className='text-sm text-emerald-500'>Nombre actualizado</p>}
            <Button
              type='submit'
              size='sm'>
              Guardar nombre
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Cambiar password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className='space-y-3'>
            <div className='space-y-2'>
              <Label>Password actual</Label>
              <Input
                type='password'
                {...passwordForm.register('currentPassword')}
              />
              {passwordForm.formState.errors.currentPassword && <p className='text-sm text-destructive'>{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>
            <div className='space-y-2'>
              <Label>Nuevo password</Label>
              <Input
                type='password'
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && <p className='text-sm text-destructive'>{passwordForm.formState.errors.newPassword.message}</p>}
            </div>
            {passwordError && <p className='text-sm text-destructive'>{passwordError}</p>}
            {passwordSuccess && <p className='text-sm text-emerald-500'>Password actualizado</p>}
            <Button
              type='submit'
              size='sm'>
              Cambiar password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
