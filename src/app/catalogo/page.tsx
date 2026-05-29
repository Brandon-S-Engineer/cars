import { getCatalogData } from '@/lib/catalogo-db'
import CatalogoClient from '@/components/public/catalogo-client'
import PublicNav from '@/components/public/public-nav'
import FloatingWhatsApp from '@/components/public/floating-whatsapp'

export const dynamic = 'force-dynamic'

export default async function CatalogoPage() {
  const modelos = await getCatalogData()
  return (
    <>
      <PublicNav />
      <CatalogoClient modelos={modelos} />
      <FloatingWhatsApp />
    </>
  )
}
