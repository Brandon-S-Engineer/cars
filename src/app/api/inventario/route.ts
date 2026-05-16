import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const config = await prisma.inventarioConfig.findUnique({ where: { id: 'singleton' } })

  if (!config?.cachedCsv) {
    return NextResponse.json({ error: 'NO_DATA' }, { status: 404 })
  }

  try {
    const tabs = JSON.parse(config.cachedCsv)
    const sheetUrl = config.spreadsheetId && config.spreadsheetId !== 'extension-sync'
      ? `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}`
      : null
    return NextResponse.json({ tabs, lastSyncAt: config.lastSyncAt, sheetUrl })
  } catch {
    // Old format (combined CSV) — treat as no data, re-sync needed
    return NextResponse.json({ error: 'NO_DATA' }, { status: 404 })
  }
}
