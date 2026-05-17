import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  pregunta: z.string().min(1).max(300),
  respuesta: z.string().min(1).max(2000),
  orden: z.number().int().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plantillas = await prisma.plantilla.findMany({ orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }] })
  return NextResponse.json(plantillas)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const plantilla = await prisma.plantilla.create({ data: parsed.data })
  return NextResponse.json(plantilla, { status: 201 })
}
