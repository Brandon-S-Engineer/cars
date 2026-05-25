import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/require-admin'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const keySchema = z.object({
  modeloId:    z.string().min(1).max(100),
  versionId:   z.string().min(1).max(100),
  categoriaId: z.string().min(1).max(100),
  label:       z.string().min(1).max(200),
})

const upsertSchema = keySchema.extend({
  valor: z.string().min(1).max(1000),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const overrides = await prisma.specOverride.findMany({
    select: { modeloId: true, versionId: true, categoriaId: true, label: true, valor: true },
  })
  return NextResponse.json(overrides)
}

export async function PUT(req: Request) {
  const guard = await requireAdmin()
  if (guard) return guard

  const session = await auth()
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = upsertSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { modeloId, versionId, categoriaId, label, valor } = parsed.data
  const override = await prisma.specOverride.upsert({
    where: { modeloId_versionId_categoriaId_label: { modeloId, versionId, categoriaId, label } },
    update: { valor, updatedById: session!.user.id },
    create: { modeloId, versionId, categoriaId, label, valor, updatedById: session!.user.id },
    select: { modeloId: true, versionId: true, categoriaId: true, label: true, valor: true },
  })
  return NextResponse.json(override)
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin()
  if (guard) return guard

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = keySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { modeloId, versionId, categoriaId, label } = parsed.data
  await prisma.specOverride.deleteMany({ where: { modeloId, versionId, categoriaId, label } })
  return NextResponse.json({ ok: true })
}
