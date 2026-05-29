import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Car, ChevronLeft, MessageCircle } from 'lucide-react'
import { MODELOS } from '@/lib/fichas-data'
import { getCatalogData } from '@/lib/catalogo-db'
import { formatMXN, waUrl, getBrandStyle } from '@/lib/catalogo-utils'
import PublicNav from '@/components/public/public-nav'
import FloatingWhatsApp from '@/components/public/floating-whatsapp'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return MODELOS.map((m) => ({ slug: m.id }))
}

export default async function ModeloDetailPage({ params }: { params: { slug: string } }) {
  const model = MODELOS.find((m) => m.id === params.slug)
  if (!model) notFound()

  const catalog = await getCatalogData()
  const entry = catalog.find((m) => m.ficha.id === model.id)
  const units = entry?.units ?? 0
  const precioDesde = entry?.precioDesde ?? null

  const style = getBrandStyle(model.marca)
  const waMsgGeneral = `Hola Edith, me interesa el ${model.marca} ${model.modelo} ${model.año}, ¿podrías darme más información?`

  return (
    <>
      <PublicNav />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-5">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Catálogo
          </Link>
        </div>

        {/* Hero imagen placeholder */}
        <div className={cn('w-full h-60 md:h-80 bg-gradient-to-br flex flex-col items-center justify-center gap-3 mt-4', style.gradient)}>
          <Car className={cn('h-20 w-20 opacity-15', style.text)} />
          <span className={cn('text-xs font-semibold uppercase tracking-widest opacity-25', style.text)}>
            Fotos próximamente
          </span>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

            {/* ── Columna izquierda ──────────────────────────────────────────── */}
            <div>
              <p className="text-sm text-muted-foreground">{model.marca} · {model.año}</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-0.5">{model.modelo}</h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                {units > 0 ? (
                  <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3.5 py-1.5 rounded-full text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse" />
                    {units} {units === 1 ? 'unidad disponible' : 'unidades disponibles'}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3.5 py-1.5 rounded-full text-sm">
                    Sin unidades en este momento
                  </div>
                )}
                {precioDesde && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-sm font-bold">
                    Desde {formatMXN(precioDesde)}
                  </div>
                )}
              </div>

              {/* Versiones */}
              <h2 className="text-xl font-semibold mt-10 mb-4">Versiones disponibles</h2>
              <div className="space-y-3">
                {model.versiones.map((version) => {
                  const waMsg = `Hola Edith, me interesa el ${model.marca} ${model.modelo} ${model.año} versión ${version.nombre}`
                  // Show first 3 specs from first category as highlights
                  const highlights = version.categorias[0]?.specs
                    .filter((s) => s.valor && s.valor !== '—')
                    .slice(0, 3) ?? []

                  return (
                    <div key={version.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{version.nombre}</h3>
                          {highlights.length > 0 && (
                            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                              {highlights.map((spec) => (
                                <span key={spec.label} className="text-xs text-muted-foreground">
                                  <span className="font-medium text-foreground/70">{spec.label}:</span>{' '}
                                  {spec.valor}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <a
                          href={waUrl(waMsg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#1ebe5d] transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Consultar
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Columna derecha — CTA sticky ─────────────────────────────── */}
            <div className="lg:sticky lg:top-24 self-start space-y-4">
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <p className="text-xs text-muted-foreground">{model.marca} · {model.año}</p>
                <h3 className="font-bold text-xl mt-0.5">{model.modelo}</h3>

                {precioDesde ? (
                  <>
                    <p className="text-3xl font-bold text-amber-600 mt-3">
                      {formatMXN(precioDesde)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Precio desde. Puede variar según versión y disponibilidad.
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm mt-3">Consultar precio disponible</p>
                )}

                <a
                  href={waUrl(waMsgGeneral)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-base hover:bg-[#1ebe5d] transition-colors mt-5"
                >
                  <MessageCircle className="h-5 w-5" />
                  Quiero este auto
                </a>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  Te respondo en minutos
                </p>

                {units > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg text-center border border-green-100">
                    <p className="text-sm text-green-700 font-semibold">
                      {units} {units === 1 ? 'unidad en stock' : 'unidades en stock'}
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">Entrega inmediata disponible</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl border p-4 text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ¿Quieres ver más opciones?
                </p>
                <Link
                  href="/catalogo"
                  className="text-sm font-medium text-foreground hover:underline mt-1 inline-block"
                >
                  Ver catálogo completo →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <FloatingWhatsApp msg={waMsgGeneral} />
    </>
  )
}
