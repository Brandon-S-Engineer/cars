import { prisma } from '@/lib/db'
import SheetsList from '@/components/dashboard/sheets-list'

export default async function SheetsPage() {
  const sheets = await prisma.connectedSheet.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <SheetsList sheets={sheets} />
}
