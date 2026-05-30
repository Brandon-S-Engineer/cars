import { getCatalogData } from '@/lib/catalogo-db'
import CatalogoClient from '@/components/public/catalogo-client'
import UtilityBar from '@/components/public/utility-bar'
import PublicNav from '@/components/public/public-nav'
import PublicFooter from '@/components/public/public-footer'
import FloatingWhatsApp from '@/components/public/floating-whatsapp'

export const dynamic = 'force-dynamic'

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string }>
}) {
  const [modelos, { marca }] = await Promise.all([getCatalogData(), searchParams])
  return (
    <>
      <UtilityBar />
      <PublicNav />
      <CatalogoClient modelos={modelos} initialMarca={marca ?? 'todas'} />
      <PublicFooter />
      <FloatingWhatsApp />
    </>
  )
}
