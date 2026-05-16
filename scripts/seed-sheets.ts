/**
 * Seed script: creates a Google Spreadsheet populated with complementary
 * business data and registers each tab as a ConnectedSheet in Prisma.
 *
 * Run:  npm run seed:sheets
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
 * and DATABASE_URL in .env (loaded automatically from project root).
 *
 * Idempotent: bails out if the seed sheets are already registered.
 */

import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'
import { PrismaClient } from '@prisma/client'

// ---------------------------------------------------------------------------
// Env loading
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (!(key in process.env)) process.env[key] = val
  }
}

loadEnv()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SheetTab {
  title: string
  rows: string[][]
}

// ---------------------------------------------------------------------------
// Data — 12 months of Jan–Dec 2025
// ---------------------------------------------------------------------------

/**
 * Monthly Revenue: MRR/ARR growth curve, expansion + churn breakdown.
 * Shows the aggregate business-level view over time.
 */
function monthlyRevenue(): string[][] {
  const headers = ['Month', 'MRR ($)', 'ARR ($)', 'New MRR ($)', 'Expansion MRR ($)', 'Churned MRR ($)', 'Net New MRR ($)', 'Active Customers']
  const rows = [
    ['Jan 2025', 18400, 220800, 3200, 800, 600, 3400, 142],
    ['Feb 2025', 20100, 241200, 3400, 1100, 400, 4100, 156],
    ['Mar 2025', 21800, 261600, 2900, 900, 1200, 2600, 165],
    ['Apr 2025', 22500, 270000, 2400, 700, 2400, 700, 169],
    ['May 2025', 24200, 290400, 3100, 1200, 600, 3700, 182],
    ['Jun 2025', 25800, 309600, 2800, 1100, 300, 3600, 193],
    ['Jul 2025', 26900, 322800, 2400, 700, 1000, 2100, 199],
    ['Aug 2025', 27800, 333600, 2200, 900, 200, 2900, 207],
    ['Sep 2025', 29100, 349200, 2700, 1300, 700, 3300, 218],
    ['Oct 2025', 30200, 362400, 2600, 800, 1300, 2100, 225],
    ['Nov 2025', 31800, 381600, 3100, 1200, 700, 3600, 237],
    ['Dec 2025', 32900, 394800, 2400, 900, 1200, 2100, 248],
  ]
  return [headers, ...rows.map((r) => r.map(String))]
}

/**
 * Customer Acquisition: lead volume and conversion by channel, plus CAC.
 * Answers "where do customers come from?" — lives here rather than in the DB
 * because it's marketing data, not transactional data.
 */
function customerAcquisition(): string[][] {
  const headers = ['Month', 'Organic', 'Paid Search', 'Referral', 'Social', 'Email', 'Total Leads', 'Conversions', 'Conv Rate (%)', 'CAC ($)']
  const rows = [
    ['Jan 2025', 89, 124, 38, 52, 21, 324, 18, '5.6', 412],
    ['Feb 2025', 95, 148, 42, 61, 19, 365, 22, '6.0', 388],
    ['Mar 2025', 78, 132, 35, 48, 24, 317, 16, '5.0', 436],
    ['Apr 2025', 102, 156, 51, 74, 28, 411, 19, '4.6', 458],
    ['May 2025', 118, 189, 63, 82, 31, 483, 24, '5.0', 392],
    ['Jun 2025', 134, 201, 71, 95, 29, 530, 27, '5.1', 374],
    ['Jul 2025', 121, 175, 58, 78, 26, 458, 21, '4.6', 408],
    ['Aug 2025', 143, 218, 79, 102, 33, 575, 26, '4.5', 381],
    ['Sep 2025', 158, 241, 88, 115, 37, 639, 31, '4.9', 358],
    ['Oct 2025', 147, 228, 82, 108, 34, 599, 28, '4.7', 372],
    ['Nov 2025', 172, 262, 94, 131, 41, 700, 34, '4.9', 341],
    ['Dec 2025', 164, 247, 89, 124, 38, 662, 32, '4.8', 352],
  ]
  return [headers, ...rows.map((r) => r.map(String))]
}

/**
 * Product KPIs: operational health metrics.
 * NPS, CSAT, support resolution time, uptime, and shipping velocity.
 * These are manually tracked or exported from tools — ideal spreadsheet data.
 */
function productKPIs(): string[][] {
  const headers = ['Month', 'NPS Score', 'CSAT (%)', 'Avg Ticket Resolution (hrs)', 'Uptime (%)', 'Features Shipped', 'P1 Bugs Closed', 'MAU']
  const rows = [
    ['Jan 2025', 32, 84.1, 18.0, 99.71, 4, 7, 890],
    ['Feb 2025', 34, 85.4, 16.2, 99.92, 6, 5, 978],
    ['Mar 2025', 31, 83.8, 20.1, 99.54, 3, 11, 1024],
    ['Apr 2025', 36, 86.2, 14.7, 99.81, 7, 4, 1108],
    ['May 2025', 38, 87.0, 13.5, 99.93, 8, 3, 1187],
    ['Jun 2025', 41, 88.3, 11.9, 100.0, 9, 2, 1254],
    ['Jul 2025', 39, 87.4, 13.1, 99.84, 7, 4, 1312],
    ['Aug 2025', 43, 89.1, 10.8, 99.96, 10, 1, 1389],
    ['Sep 2025', 45, 90.0, 9.6, 100.0, 11, 0, 1451],
    ['Oct 2025', 44, 89.5, 11.2, 99.91, 8, 3, 1498],
    ['Nov 2025', 47, 91.2, 8.9, 100.0, 12, 1, 1562],
    ['Dec 2025', 49, 92.0, 7.8, 100.0, 13, 0, 1641],
  ]
  return [headers, ...rows.map((r) => r.map(String))]
}

/**
 * Sales Pipeline: open and recently closed deals with stage, value, and owner.
 * Structured CRM-style data that demos well to clients — a spreadsheet is a
 * realistic home for this before a CRM integration exists.
 */
function salesPipeline(): string[][] {
  const headers = ['Stage', 'Company', 'ARR Value ($)', 'Probability (%)', 'Expected Close', 'Account Owner', 'Days Since Last Activity']
  const rows = [
    ['Prospecting', 'Nexum Logistics', 12000, 10, 'Mar 31, 2026', 'Carlos López', 2],
    ['Prospecting', 'Orbix Health', 8400, 10, 'Apr 15, 2026', 'Sofia García', 5],
    ['Discovery', 'Brivo Financial', 24000, 25, 'Mar 15, 2026', 'Carlos López', 1],
    ['Discovery', 'Trellis Manufacturing', 18000, 25, 'Mar 28, 2026', 'María Martínez', 3],
    ['Demo Scheduled', 'Apex Consulting', 36000, 40, 'Feb 28, 2026', 'Sofia García', 0],
    ['Demo Scheduled', 'Steelpoint Capital', 48000, 40, 'Mar 10, 2026', 'Luis Hernández', 1],
    ['Proposal Sent', 'Clarinex Retail', 60000, 60, 'Feb 20, 2026', 'Carlos López', 2],
    ['Proposal Sent', 'Meridian Tech', 42000, 60, 'Mar 05, 2026', 'María Martínez', 4],
    ['Negotiation', 'Vantage Healthcare', 96000, 80, 'Feb 14, 2026', 'Sofia García', 1],
    ['Negotiation', 'Torque Systems', 72000, 80, 'Feb 18, 2026', 'Luis Hernández', 0],
    ['Closed Won', 'Pinnacle Media', 84000, 100, 'Jan 31, 2026', 'Carlos López', 12],
    ['Closed Won', 'Linx Solutions', 54000, 100, 'Feb 03, 2026', 'María Martínez', 8],
    ['Closed Lost', 'Drifton Labs', 28000, 0, 'Jan 15, 2026', 'Luis Hernández', 22],
  ]
  return [headers, ...rows.map((r) => r.map(String))]
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? ''
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? ''
  // Accept a full URL, a bare ID, or an ID with trailing /edit?... params.
  const rawSheetInput = process.env.SEED_SHEET_ID ?? ''
  const urlMatch = rawSheetInput.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  const spreadsheetId = urlMatch ? urlMatch[1] : rawSheetInput.split('/')[0].trim()

  if (!email || email.includes('your-service-account')) {
    console.error('✗  GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in .env')
    process.exit(1)
  }
  if (!rawKey || rawKey.includes('BEGIN RSA')) {
    console.error('✗  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not set in .env')
    process.exit(1)
  }
  if (!spreadsheetId || spreadsheetId === 'your-spreadsheet-id') {
    console.error(
      '✗  SEED_SHEET_ID is not set in .env\n' +
      '   1. Create a blank Google Sheet at https://sheets.google.com\n' +
      '   2. Share it (Editor) with your GOOGLE_SERVICE_ACCOUNT_EMAIL\n' +
      '   3. Copy the ID from the URL and set SEED_SHEET_ID in .env',
    )
    process.exit(1)
  }

  const prisma = new PrismaClient()

  // --- Idempotency guard ---
  const existing = await prisma.connectedSheet.findFirst({
    where: { name: 'Monthly Revenue' },
  })
  if (existing) {
    console.log(
      '  Seed sheets already exist in the database.\n' +
      '  Delete them from /dashboard/sheets and re-run to recreate.',
    )
    await prisma.$disconnect()
    return
  }

  // --- Google auth (spreadsheets scope only — no Drive creation needed) ---
  const auth = new google.auth.JWT({
    email,
    key: rawKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheetsApi = google.sheets({ version: 'v4', auth })

  const tabs: SheetTab[] = [
    { title: 'Monthly Revenue',      rows: monthlyRevenue() },
    { title: 'Customer Acquisition', rows: customerAcquisition() },
    { title: 'Product KPIs',         rows: productKPIs() },
    { title: 'Sales Pipeline',       rows: salesPipeline() },
  ]

  // --- Step 1: Add 4 new tabs to the existing spreadsheet ---
  console.log('Adding tabs…')
  const addResponse = await sheetsApi.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: tabs.map((tab, index) => ({
        addSheet: { properties: { title: tab.title, index: index + 1 } },
      })),
    },
  })

  const sheetIds = addResponse.data.replies!.map(
    (reply) => reply.addSheet!.properties!.sheetId!,
  )
  console.log(`  Added: ${tabs.map((t) => t.title).join(', ')}`)

  // --- Step 2: Write all data in a single batchUpdate call ---
  console.log('Writing data…')
  await sheetsApi.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: tabs.map((tab) => ({
        range: `'${tab.title}'!A1`,
        values: tab.rows,
      })),
    },
  })

  // --- Step 3: Format every tab (bold headers, freeze row 1, auto-resize) ---
  console.log('Formatting headers…')
  await sheetsApi.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: sheetIds.flatMap((sheetId, i) => [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                backgroundColor: { red: 0.918, green: 0.918, blue: 0.918 },
              },
            },
            fields: 'userEnteredFormat(textFormat,backgroundColor)',
          },
        },
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: tabs[i].rows[0].length,
            },
          },
        },
      ]),
    },
  })

  // --- Step 4: Register each tab as a ConnectedSheet in Prisma ---
  console.log('Registering in database…')
  for (const tab of tabs) {
    await prisma.connectedSheet.create({
      data: { name: tab.title, spreadsheetId, range: tab.title },
    })
    console.log(`  ✓  ${tab.title}`)
  }

  await prisma.$disconnect()

  console.log('')
  console.log('Done.')
  console.log(`  Spreadsheet → https://docs.google.com/spreadsheets/d/${spreadsheetId}`)
  console.log('  Dashboard   → /dashboard/sheets')
}

main().catch((err: unknown) => {
  console.error('Error:', err instanceof Error ? err.message : err)
  process.exit(1)
})
