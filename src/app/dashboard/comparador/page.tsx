import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ComparadorClient from '@/components/dashboard/comparador-client'

export default async function ComparadorPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === 'ADMIN'

  const overrides = await prisma.specOverride.findMany({
    select: { modeloId: true, versionId: true, categoriaId: true, label: true, valor: true },
  })

  return <ComparadorClient overrides={overrides} isAdmin={isAdmin} />
}
