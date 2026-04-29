import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/require-admin'
import { getSpreadsheetTitle, extractSpreadsheetId } from '@/lib/google-sheets'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const connectSchema = z.object({
  input: z.string().min(1),
  name: z.string().optional(),
  range: z.string().optional(),
})

export async function GET() {
  const error = await requireAdmin()
  if (error) return error

  const sheets = await prisma.connectedSheet.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(sheets)
}

export async function POST(req: Request) {
  const error = await requireAdmin()
  if (error) return error

  const body = await req.json()
  const parsed = connectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const spreadsheetId = extractSpreadsheetId(parsed.data.input)
  const range = parsed.data.range?.trim() || 'Sheet1'

  let resolvedName = parsed.data.name?.trim()
  if (!resolvedName) {
    try {
      resolvedName = await getSpreadsheetTitle(spreadsheetId)
    } catch {
      return NextResponse.json({ error: 'Could not access the spreadsheet. Make sure the service account has been granted Viewer access.' }, { status: 400 })
    }
  }

  const sheet = await prisma.connectedSheet.create({
    data: { name: resolvedName, spreadsheetId, range },
  })

  return NextResponse.json(sheet)
}
