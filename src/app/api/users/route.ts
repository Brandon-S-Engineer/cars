import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { requireAdmin } from '@/lib/require-admin'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']),
})

export async function POST(req: Request) {
  const error = await requireAdmin()
  if (error) return error

  const body = await req.json()
  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })
  if (existing) {
    return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

  const user = await prisma.user.create({
    data: { ...parsed.data, password: hashedPassword },
  })
  return NextResponse.json(user)
}
