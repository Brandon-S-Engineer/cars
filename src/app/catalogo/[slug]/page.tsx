import { notFound } from 'next/navigation'
import Link from 'next/link'
import WaIcon from '@/components/public/wa-icon'
import UtilityBar from '@/components/public/utility-bar'
import PublicNav from '@/components/public/public-nav'
import PublicFooter from '@/components/public/public-footer'
import FloatingWhatsApp from '@/components/public/floating-whatsapp'
import { MODELOS } from '@/lib/fichas-data'
import { getCatalogData } from '@/lib/catalogo-db'
import { getModelPhotos } from '@/lib/catalog-photos'
import ModelImage from '@/components/public/model-image'
import { formatMXN, waUrl } from '@/lib/catalogo-utils'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return MODELOS.map((m) => ({ slug: m.id }))
}

export default async function ModeloDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const model = MODELOS.find((m) => m.id === slug)
  if (!model) notFound()

  const [catalog, allPhotos] = await Promise.all([getCatalogData(), getModelPhotos(model.id)])
  const entry = catalog.find((m) => m.ficha.id === model.id)
  const coverPhoto = allPhotos.find((p) => p.versionId === null)?.url ?? null
  const units = entry?.units ?? 0
  const precioDesde = entry?.precioDesde ?? null
  const precioEspecial = entry?.precioEspecial ?? null
  const listaDelEspecial = entry?.listaDelEspecial ?? null
  const preciosPorVersion = entry?.preciosPorVersion ?? {}
  const pct = listaDelEspecial && precioEspecial ? Math.round((1 - precioEspecial / listaDelEspecial) * 100) : null
  const descuento = pct !== null && pct > 0 ? pct : null

  const waMsgGeneral = `Hola Edith, me interesa el ${model.marca} ${model.modelo} ${model.año}. ¿Qué versiones tienes disponibles y a qué precio?`

  // Related models (same brand or first 3 others)
  const otros = MODELOS.filter((m) => m.id !== model.id && m.marca === model.marca).slice(0, 3)

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
            <span className="text-ink">{model.marca} {model.modelo}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl aspect-[16/10] overflow-hidden border border-line">
                <ModelImage
                  src={coverPhoto}
                  alt={`${model.marca} ${model.modelo} ${model.año}`}
                  phLabel={`foto · ${model.marca} ${model.modelo} ${model.año}`}
                />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-3">
                {allPhotos.filter((p) => p.versionId === null).slice(1, 5).map((p, i) => (
                  <div key={p.id} className="rounded-xl aspect-[4/3] overflow-hidden border border-line">
                    <ModelImage src={p.url} alt={`Vista ${i + 2}`} />
                  </div>
                ))}
                {allPhotos.filter((p) => p.versionId === null).length <= 1 &&
                  ['exterior', 'interior', 'tablero', 'cajuela'].map((view) => (
                    <div key={view} className="ph rounded-xl aspect-[4/3] flex items-center justify-center border border-line">
                      <span className="ph-tag" style={{ fontSize: 9 }}>{view}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Summary + CTA */}
            <div className="lg:col-span-5 lg:sticky lg:top-[84px]">
              <div className="flex items-center gap-3">
                <span className="text-[13px] uppercase tracking-[0.16em] text-muted-warm font-semibold">
                  {model.marca} · {model.año}
                </span>
                {units === 0 ? (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-[12px] font-semibold px-2.5 py-1 rounded-full">
                    Sin unidades
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
                {model.modelo}
              </h1>

              <div className="mt-5 flex items-end gap-3 flex-wrap">
                <div>
                  {descuento !== null ? (
                    <>
                      {precioDesde && <div className="text-[15px] text-muted-warm line-through">{formatMXN(precioDesde)}</div>}
                      <div className="font-display font-extrabold text-azul-700 text-[34px] leading-none">{formatMXN(precioEspecial!)}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-[13px] text-muted-warm">Precio desde</div>
                      <div className="font-display font-extrabold text-azul-800 text-[34px] leading-none">
                        {precioDesde ? formatMXN(precioDesde) : 'Consultar'}
                      </div>
                    </>
                  )}
                </div>
                {descuento !== null && (
                  <span className="mb-1 inline-flex items-center bg-red-500 text-white text-[13px] font-bold px-2.5 py-1 rounded-full">
                    {descuento}% de descuento
                  </span>
                )}
                <span className="text-[13px] text-muted-warm pb-1">
                  · {model.versiones.length} {model.versiones.length === 1 ? 'versión' : 'versiones'}
                </span>
              </div>

              {/* Quick spec chips from first version */}
              {model.versiones[0] && (() => {
                const desempeno = model.versiones[0].categorias.find((c) => c.id === 'desempeno')
                const chips = desempeno?.specs
                  .filter((s) => ['Motor', 'Transmisión', 'Tracción'].includes(s.label) && s.valor !== '—')
                  .slice(0, 4) ?? []
                return chips.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5 mt-5">
                    {chips.map((spec) => (
                      <div key={spec.label} className="bg-white border border-line rounded-xl px-3.5 py-3">
                        <div className="text-[12px] text-muted-warm">{spec.label}</div>
                        <div className="font-semibold text-ink text-[14px] leading-snug">{spec.valor}</div>
                      </div>
                    ))}
                  </div>
                ) : null
              })()}

              <a
                href={waUrl(waMsgGeneral)}
                target="_blank" rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-bold text-[17px] h-14 rounded-full transition-colors shadow-lg"
              >
                <WaIcon size={24} />
                Preguntar por el {model.modelo}
              </a>
              <p className="text-center text-[13px] text-muted-warm mt-2.5">
                Te respondo personalmente · normalmente en minutos
              </p>
            </div>
          </div>
        </section>

        {/* ── Versiones ─────────────────────────────────────────────────────── */}
        <section id="versiones" className="bg-sand/60 border-y border-line">
          <div className="max-w-[1200px] mx-auto px-5 py-14">
            <div className="flex items-end justify-between gap-4 mb-7">
              <div>
                <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight">
                  Versiones disponibles
                </h2>
                <p className="text-muted-warm mt-2 text-[16px]">
                  Elige la versión que va contigo. Toca cualquiera para ver su ficha completa.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {model.versiones.map((version, idx) => {
                const waMsg = `Hola Edith, me interesa el ${model.marca} ${model.modelo} ${model.año} versión ${version.nombre}. ¿Está disponible?`
                const desempeno = version.categorias.find((c) => c.id === 'desempeno')
                const specs = desempeno?.specs
                  .filter((s) => s.valor !== '—')
                  .slice(0, 4) ?? []

                return (
                  <article
                    key={version.id}
                    className={`bg-white rounded-2xl border ${idx === 0 ? 'border-azul-500 ring-1 ring-azul-500' : 'border-line'} p-5 flex flex-col`}
                  >
                    {idx === 0 && (
                      <div className="text-[11px] font-bold uppercase tracking-wider text-azul-700 mb-2">
                        ★ Versión base
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-[22px] leading-none text-ink">
                        {version.nombre}
                      </h3>
                      {units === 1 ? (
                        <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0">
                          ¡Última unidad!
                        </span>
                      ) : units === 2 ? (
                        <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0">
                          ¡Solo 2!
                        </span>
                      ) : units > 0 ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Disponible
                        </span>
                      ) : null}
                    </div>

                    {(() => {
                      const vPrecio = preciosPorVersion[version.id] ?? precioDesde
                      if (!vPrecio) return null
                      return (
                        <div className="mt-3 flex items-end gap-2 flex-wrap">
                          <div>
                            <span className="text-[12px] text-muted-warm">desde </span>
                            <div className="font-display font-extrabold text-azul-800 text-[24px] leading-none">{formatMXN(vPrecio)}</div>
                          </div>
                        </div>
                      )
                    })()}

                    {specs.length > 0 && (
                      <ul className="mt-4 space-y-2 text-[14px] text-ink/80 flex-1">
                        {specs.map((spec) => (
                          <li key={spec.label} className="flex justify-between border-b border-line pb-2 last:border-0">
                            <span className="text-muted-warm">{spec.label}</span>
                            <span className="font-medium text-right max-w-[60%]">{spec.valor}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-5 flex flex-col gap-2">
                      <a
                        href={waUrl(waMsg)}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-wa hover:bg-wa-dark text-white font-semibold h-11 rounded-full transition-colors"
                      >
                        <WaIcon size={18} />
                        Preguntar por esta
                      </a>
                      <Link
                        href={`/catalogo/${model.id}/${version.id}`}
                        className="inline-flex items-center justify-center gap-1.5 border border-line hover:border-ink/30 font-semibold h-11 rounded-full transition-colors text-[15px] text-ink"
                      >
                        Ver ficha completa
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Comparador de versiones ────────────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-5 py-14">
          <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight mb-2">
            Compara las versiones
          </h2>
          <p className="text-muted-warm text-[16px] mb-6">Lado a lado, lo que cambia entre cada versión.</p>

          <div className="overflow-x-auto scroll-x -mx-5 px-5">
            <table className="w-full min-w-[600px] border-separate border-spacing-0 text-[14px]">
              <thead>
                <tr>
                  <th className="text-left text-[13px] uppercase tracking-wider text-muted-warm font-semibold p-3 align-bottom sticky left-0 bg-paper z-10 w-32" />
                  {model.versiones.map((v, i) => (
                    <th key={v.id} className={`p-3 text-left align-bottom ${i === 0 ? 'bg-azul-50 rounded-t-xl' : ''}`}>
                      <Link href={`/catalogo/${model.id}/${v.id}`} className="font-display font-bold text-[16px] text-ink hover:text-azul-700 transition-colors">
                        {v.nombre}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const refCat = model.versiones[0].categorias.find((c) => c.id === 'desempeno')
                  const rows = refCat?.specs.slice(0, 6) ?? []
                  return rows.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? 'bg-white' : ''}>
                      <td className={`p-3 font-semibold text-muted-warm sticky left-0 z-10 ${i % 2 === 0 ? 'bg-white' : 'bg-paper'}`}>
                        {spec.label}
                      </td>
                      {model.versiones.map((v, vi) => {
                        const cat = v.categorias.find((c) => c.id === 'desempeno')
                        const val = cat?.specs.find((s) => s.label === spec.label)?.valor ?? '—'
                        return (
                          <td key={v.id} className={`p-3 border-t border-line text-ink ${vi === 0 ? 'bg-azul-50/60' : ''}`}>
                            {val}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                })()}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Financiamiento mini ────────────────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-5 pb-14">
          <div className="bg-white border border-line rounded-3xl p-8 sm:p-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[13px] uppercase tracking-[0.16em] text-muted-warm font-semibold">Financiamiento</span>
              <h2 className="font-display font-extrabold text-[26px] sm:text-[32px] leading-tight mt-2">
                {precioDesde ? `El ${model.modelo} desde ${formatMXN(Math.round(precioDesde * 0.8 * 0.139 / 12 / (1 - Math.pow(1 + 0.139 / 12, -60))))} al mes` : `Financia tu ${model.modelo}`}
              </h2>
              <p className="text-muted-warm mt-3 text-[16px]">
                Con enganche del 20% a 60 meses*. En cada versión tienes un estimador para armar tu plan.
              </p>
              <p className="text-[12px] text-muted-warm mt-3">*Cifra ilustrativa. La mensualidad final depende de tu perfil y el plan elegido.</p>
            </div>
            <a
              href={waUrl(`Hola Edith, quiero financiar un ${model.marca} ${model.modelo} ${model.año}. ¿Me ayudas a calcular mi mensualidad?`)}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-bold text-[17px] h-14 rounded-full transition-colors shadow-lg"
            >
              <WaIcon size={22} />
              Calcular mi mensualidad
            </a>
          </div>
        </section>

        {/* ── Relacionados ──────────────────────────────────────────────────── */}
        {otros.length > 0 && (
          <section className="max-w-[1200px] mx-auto px-5 pb-16">
            <h2 className="font-display font-extrabold text-[24px] sm:text-[28px] mb-6 text-ink">
              También te puede gustar
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {otros.map((m) => (
                <Link key={m.id} href={`/catalogo/${m.id}`} className="group bg-white border border-line rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                  <div className="ph aspect-[16/10] flex items-center justify-center">
                    <span className="ph-tag">foto · {m.marca} {m.modelo}</span>
                  </div>
                  <div className="p-4">
                    <div className="text-[12px] uppercase tracking-[0.14em] text-muted-warm font-semibold">{m.marca}</div>
                    <div className="font-display font-bold text-[18px] text-ink">{m.modelo}</div>
                    <div className="font-display font-extrabold text-azul-800 mt-1">
                      {catalog.find((c) => c.ficha.id === m.id)?.precioDesde
                        ? `desde ${formatMXN(catalog.find((c) => c.ficha.id === m.id)!.precioDesde!)}`
                        : 'Consultar'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <PublicFooter />
      <FloatingWhatsApp msg={waMsgGeneral} />
    </div>
  )
}
