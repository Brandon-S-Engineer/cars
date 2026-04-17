import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres').optional(),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = updateProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const updateData: { name?: string; password?: string } = {}

  if (parsed.data.name) {
    updateData.name = parsed.data.name
  }

  if (parsed.data.newPassword) {
    if (!parsed.data.currentPassword) {
      return NextResponse.json({ error: 'Password actual requerido' }, { status: 400 })
    }
    const match = await bcrypt.compare(parsed.data.currentPassword, user.password ?? '')
    if (!match) {
      return NextResponse.json({ error: 'Password actual incorrecto' }, { status: 400 })
    }
    updateData.password = await bcrypt.hash(parsed.data.newPassword, 10)
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  })

  return NextResponse.json({ ok: true })
}
