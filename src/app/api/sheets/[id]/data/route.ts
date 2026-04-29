import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/require-admin'
import { getSheetData } from '@/lib/google-sheets'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin()
  if (error) return error

  const { id } = await params

  const sheet = await prisma.connectedSheet.findUnique({ where: { id } })
  if (!sheet) {
    return NextResponse.json({ error: 'Sheet not found' }, { status: 404 })
  }

  const rows = await getSheetData(sheet.spreadsheetId, sheet.range)
  return NextResponse.json({ rows })
}
