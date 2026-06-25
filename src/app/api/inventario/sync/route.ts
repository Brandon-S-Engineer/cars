import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

const schema = z.object({
  tabs: z.array(z.object({ name: z.string(), csv: z.string().min(1) })).min(1),
  spreadsheetId: z.string().optional(),
})

function parseCSV(csv: string): string[][] {
  const rows: string[][] = []
  const lines = csv.split('\n')
  for (const line of lines) {
    if (!line.trim()) continue
    const cells: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim()); current = ''
      } else {
        current += char
      }
    }
    cells.push(current.trim())
    rows.push(cells)
  }
  return rows
}

export async function POST(req: Request) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400, headers: CORS })
  }

  let totalRows = 0

  const tabsData = parsed.data.tabs.map(({ name, csv }) => {
    const rows = parseCSV(csv)
    if (rows.length < 2) return { name, headers: [], rows: [] }

    const nonEmpty0 = rows[0].filter(Boolean).length
    const nonEmpty1 = (rows[1] ?? []).filter(Boolean).length
    const startRow = nonEmpty0 <= 3 && nonEmpty1 > nonEmpty0 ? 1 : 0

    const headers = rows[startRow] ?? []
    const dataRows = rows.slice(startRow + 1).filter((r) => r.some((c) => c.trim()))
    totalRows += dataRows.length

    return { name, headers, rows: dataRows }
  })

  const spreadsheetId = parsed.data.spreadsheetId ?? 'extension-sync'

  // Merge with whatever's already cached — an older browser/extension copy that doesn't
  // know about a newly added tab should never be able to wipe it out by syncing a partial list.
  const existing = await prisma.inventarioConfig.findUnique({ where: { id: 'singleton' } })
  let mergedTabs = tabsData
  if (existing?.cachedCsv) {
    try {
      const prevTabs: { name: string; headers: string[]; rows: string[][] }[] = JSON.parse(existing.cachedCsv)
      const incomingNames = new Set(tabsData.map((t) => t.name))
      const preserved = prevTabs.filter((t) => !incomingNames.has(t.name))
      mergedTabs = [...preserved, ...tabsData]
    } catch {
      // old/invalid cache format — fall back to just the new sync
    }
  }

  await prisma.inventarioConfig.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      spreadsheetId,
      cachedCsv: JSON.stringify(mergedTabs),
      lastSyncAt: new Date(),
    },
    update: {
      ...(parsed.data.spreadsheetId ? { spreadsheetId } : {}),
      cachedCsv: JSON.stringify(mergedTabs),
      lastSyncAt: new Date(),
    },
  })

  return NextResponse.json({ ok: true, rows: totalRows }, { headers: CORS })
}
