import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/require-admin'
import { NextResponse } from 'next/server'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin()
  if (error) return error

  const { id } = await params

  await prisma.connectedSheet.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
