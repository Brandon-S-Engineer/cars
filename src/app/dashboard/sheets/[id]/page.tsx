import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import SheetViewer from '@/components/dashboard/sheet-viewer'

export default async function SheetViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sheet = await prisma.connectedSheet.findUnique({ where: { id } })
  if (!sheet) notFound()

  return (
    <SheetViewer
      id={sheet.id}
      name={sheet.name}
      spreadsheetId={sheet.spreadsheetId}
      range={sheet.range}
    />
  )
}
