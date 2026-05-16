import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { extractSpreadsheetId } from '@/lib/google-oauth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  spreadsheetUrl: z.string().min(1),
  sheetName: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const config = await prisma.inventarioConfig.findUnique({ where: { id: 'singleton' } })
  return NextResponse.json(config)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const spreadsheetId = extractSpreadsheetId(parsed.data.spreadsheetUrl)
  const sheetName = parsed.data.sheetName ?? 'Sheet1'

  const config = await prisma.inventarioConfig.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', spreadsheetId, sheetName },
    update: { spreadsheetId, sheetName },
  })

  return NextResponse.json(config)
}
