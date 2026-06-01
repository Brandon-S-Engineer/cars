import { notFound } from 'next/navigation'
import Link from 'next/link'
import WaIcon from '@/components/public/wa-icon'
import UtilityBar from '@/components/public/utility-bar'
import PublicNav from '@/components/public/public-nav'
import PublicFooter from '@/components/public/public-footer'
import FloatingWhatsApp from '@/components/public/floating-whatsapp'
import FinanceCalculator from '@/components/public/finance-calculator'
import { MODELOS } from '@/lib/fichas-data'
import { getCatalogData } from '@/lib/catalogo-db'
import { getModelPhotos } from '@/lib/catalog-photos'
import ModelImage from '@/components/public/model-image'
import { formatMXN, waUrl } from '@/lib/catalogo-utils'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return MODELOS.flatMap((m) =>
    m.versiones.map((v) => ({ slug: m.id, version: v.id })),
  )
}

export default async function VersionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; version: string }>
}) {
  const { slug, version: versionId } = await params

  const model = MODELOS.find((m) => m.id === slug)
  if (!model) notFound()

  const version = model.versiones.find((v) => v.id === versionId)
  if (!version) notFound()

  const [catalog, allPhotos] = await Promise.all([getCatalogData(), getModelPhotos(model.id)])
  const entry = catalog.find((m) => m.ficha.id === model.id)
  const versionPhotos = allPhotos.filter((p) => p.versionId === version.id)
  const coverPhoto = versionPhotos[0]?.url ?? allPhotos.find((p) => p.versionId === null)?.url ?? null
  const units = entry?.units ?? 0
  const precioDesde = entry?.precioDesde ?? null

  const waMsg = `Hola Edith, me interesa el ${model.marca} ${model.modelo} ${model.año} versión ${version.nombre} (${precioDesde ? formatMXN(precioDesde) : 'consultar precio'}). ¿Está disponible?`

  const otrasVersiones = model.versiones.filter((v) => v.id !== version.id).slice(0, 3)

  return (
    <div className="font-hanken bg-paper text-ink">
      <UtilityBar />
      <PublicNav />

      <main>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-5 pt-8 pb-12">
          <nav className="text-[13px] text-muted-warm mb-4">
            <Link href="/" className="hover:text-azul-700 transition-colors">Inicio</Link>
            <span className="mx-1.5">/</span>
            <Link href="/catalogo" className="hover:text-azul-700 transition-colors">Catálogo</Link>
            <span className="mx-1.5">/</span>
            <Link href={`/catalogo/${model.id}`} className="hover:text-azul-700 transition-colors">{model.marca} {model.modelo}</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">{version.nombre}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl aspect-[16/10] overflow-hidden border border-line">
                <ModelImage src={coverPhoto} alt={`${model.marca} ${model.modelo} ${version.nombre}`} phLabel="exterior" />
              </div>
              <div className="grid grid-cols-5 gap-3 mt-3">
                {versionPhotos.slice(1, 6).map((p, i) => (
                  <div key={p.id} className="rounded-xl aspect-[4/3] overflow-hidden border-2 border-line">
                    <ModelImage src={p.url} alt={`Vista ${i + 2}`} />
                  </div>
                ))}
                {versionPhotos.length <= 1 &&
                  ['exterior', 'interior', 'tablero', 'cajuela', 'ruedas'].map((view) => (
                    <div key={view} className="ph rounded-xl aspect-[4/3] flex items-center justify-center border-2 border-line">
                      <span className="ph-tag" style={{ fontSize: 9 }}>{view}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Summary + CTA — sticky */}
            <div className="lg:col-span-5 lg:sticky lg:top-[84px]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[13px] uppercase tracking-[0.16em] text-muted-warm font-semibold">
                  {model.marca} {model.modelo} · {model.año}
                </span>
                {units === 0 ? (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-[12px] font-semibold px-2.5 py-1 rounded-full">
                    Consultar disponibilidad
                  </span>
                ) : units === 1 ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-[12px] font-semibold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                    ¡Última unidad!
                  </span>
                ) : units === 2 ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-[12px] font-semibold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                    ¡Solo 2 disponibles!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Disponible
                  </span>
                )}
              </div>

              <h1 className="font-display font-extrabold text-[38px] sm:text-[44px] leading-[1.02] mt-2">
                {version.nombre}
              </h1>

              {precioDesde && (
                <div className="mt-5">
                  <div className="text-[13px] text-muted-warm">Precio de lista</div>
                  <div className="font-display font-extrabold text-azul-800 text-[36px] leading-none">
                    {formatMXN(precioDesde)}
                  </div>
                </div>
              )}

              <a
                href={waUrl(waMsg)}
                target="_blank" rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-bold text-[17px] h-14 rounded-full transition-colors shadow-lg"
              >
                <WaIcon size={24} />
                Apartar / preguntar por esta
              </a>
              <div className="mt-3 flex items-center justify-center gap-2 text-[13px] text-muted-warm">
                Te contesta Edith en persona
              </div>
            </div>
          </div>
        </section>

        {/* ── Highlights ─────────────────────────────────────────────────────── */}
        {(() => {
          const desempeno = version.categorias.find((c) => c.id === 'desempeno')
          const highlights = desempeno?.specs.filter((s) => s.valor !== '—').slice(0, 4) ?? []
          if (!highlights.length) return null
          return (
            <section className="max-w-[1200px] mx-auto px-5 pb-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {highlights.map((spec) => (
                  <div key={spec.label} className="bg-white border border-line rounded-2xl p-5">
                    <div className="font-display font-extrabold text-[22px] text-azul-800 leading-tight">{spec.valor}</div>
                    <div className="text-[13px] text-muted-warm mt-1">{spec.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )
        })()}

        {/* ── Ficha técnica completa ─────────────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-5 py-10">
          <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight mb-7">
            Ficha técnica completa
          </h2>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
            {version.categorias.map((cat) => (
              <div key={cat.id}>
                <h3 className="font-display font-bold text-[18px] mb-3 flex items-center gap-2 text-ink">
                  <span className="w-2 h-2 rounded-full bg-azul-600 shrink-0" />
                  {cat.nombre}
                </h3>
                <dl className="text-[15px]">
                  {cat.specs
                    .filter((s) => s.valor !== '—')
                    .map((spec, i, arr) => (
                      <div
                        key={spec.label}
                        className={`flex justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-line' : ''}`}
                      >
                        <dt className="text-muted-warm">{spec.label}</dt>
                        <dd className="font-medium text-right max-w-[60%] text-ink">{spec.valor}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            ))}
          </div>

          <p className="text-[13px] text-muted-warm mt-8">
            Specs de referencia con fines ilustrativos. El equipamiento exacto puede variar según el lote. Te confirmo los detalles de la unidad específica por WhatsApp.
          </p>
        </section>

        {/* ── Financiamiento + Disponibilidad ────────────────────────────────── */}
        <section className="bg-azul-900 text-white">
          <div className="max-w-[1200px] mx-auto px-5 py-14 grid lg:grid-cols-2 gap-8 items-start">
            {precioDesde && (
              <FinanceCalculator price={precioDesde} modelName={`${model.marca} ${model.modelo} ${version.nombre}`} />
            )}

            {/* Disponibilidad */}
            <div>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-300">
                <span className="live-dot" />
                Unidades de esta versión
              </span>
              <h2 className="font-display font-extrabold text-[26px] sm:text-[30px] leading-tight mt-2">
                {units > 0 ? 'Disponibles ahora mismo' : 'Consultar disponibilidad'}
              </h2>
              <p className="text-azul-100/75 text-[15px] mt-1.5 mb-5">
                Solo te mostramos lo que puedes apartar hoy. Lo demás se oculta automáticamente.
              </p>

              {units > 0 ? (
                <div className="space-y-3">
                  {[...Array(Math.min(units, 3))].map((_, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div>
                        <div className="font-semibold">Unidad disponible</div>
                        <div className="text-[13px] text-azul-200">{model.año} · {version.nombre}</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Disponible
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <p className="text-azul-100/75 text-[15px]">
                    Escríbeme para verificar disponibilidad actual o registrarte en lista de espera.
                  </p>
                </div>
              )}

              <a
                href={waUrl(`Hola Edith, me interesa una unidad del ${model.marca} ${model.modelo} ${model.año} versión ${version.nombre}. ¿Me confirmas disponibilidad y colores?`)}
                target="_blank" rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2.5 bg-white text-azul-900 hover:bg-paper font-bold text-[16px] py-3.5 rounded-full transition-colors"
              >
                <WaIcon size={20} />
                Quiero ver una unidad
              </a>
            </div>
          </div>
        </section>

        {/* ── Otras versiones ────────────────────────────────────────────────── */}
        {otrasVersiones.length > 0 && (
          <section className="max-w-[1200px] mx-auto px-5 py-14">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="font-display font-extrabold text-[24px] sm:text-[28px] text-ink">
                Otras versiones del {model.modelo}
              </h2>
              <Link href={`/catalogo/${model.id}`} className="font-semibold text-azul-700 hover:text-azul-900 text-[15px] shrink-0 transition-colors">
                Ver todas →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {otrasVersiones.map((v) => (
                <Link
                  key={v.id}
                  href={`/catalogo/${model.id}/${v.id}`}
                  className="bg-white border border-line rounded-2xl p-5 hover:shadow-lg transition-all"
                >
                  <div className="font-display font-bold text-[18px] text-ink">{v.nombre}</div>
                  {precioDesde && (
                    <div className="font-display font-extrabold text-azul-800 text-[20px] mt-1">
                      {formatMXN(precioDesde)}
                    </div>
                  )}
                  <div className="text-[13px] text-muted-warm mt-1">{model.marca} · {model.año}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA final ─────────────────────────────────────────────────────── */}
        <section className="bg-wa-deep text-white">
          <div className="max-w-[1200px] mx-auto px-5 py-14 text-center">
            <h2 className="font-display font-extrabold text-[28px] sm:text-[38px] leading-tight max-w-2xl mx-auto">
              ¿Te late el {model.modelo} {version.nombre}? Apártalo hoy con un mensaje.
            </h2>
            <a
              href={waUrl(`Hola Edith, quiero apartar el ${model.marca} ${model.modelo} ${model.año} versión ${version.nombre}. ¿Cómo procedemos?`)}
              target="_blank" rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2.5 bg-white text-wa-deep hover:bg-paper font-bold text-[18px] px-8 h-16 rounded-full transition-colors shadow-2xl"
            >
              <WaIcon size={26} />
              Apartar por WhatsApp · 55 8163 1195
            </a>
          </div>
        </section>

      </main>

      <PublicFooter />
      <FloatingWhatsApp msg={waMsg} />
    </div>
  )
}
