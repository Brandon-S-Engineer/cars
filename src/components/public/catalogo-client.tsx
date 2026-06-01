'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import WaIcon from './wa-icon'
import ModelImage from './model-image'
import { type ModeloCatalogo, formatMXN, waUrl } from '@/lib/catalogo-utils'

export default function CatalogoClient({
  modelos,
  initialMarca = 'todas',
  covers = {},
}: {
  modelos: ModeloCatalogo[]
  initialMarca?: string
  covers?: Record<string, string>
}) {
  const [brandFilter, setBrandFilter] = useState(() => {
    if (initialMarca === 'todas') return 'todas'
    const match = modelos.find((m) => m.ficha.marca.toLowerCase() === initialMarca.toLowerCase())
    return match ? match.ficha.marca : 'todas'
  })
  const [priceMax, setPriceMax] = useState(0)
  const [demoOnly, setDemoOnly] = useState(false)
  const [search, setSearch] = useState('')

  const marcas = useMemo(() => ['todas', ...Array.from(new Set(modelos.map((m) => m.ficha.marca)))], [modelos])

  const filtered = useMemo(() => {
    return modelos.filter(({ ficha, units, precioDesde }) => {
      if (units === 0) return false
      if (brandFilter !== 'todas' && ficha.marca.toLowerCase() !== brandFilter.toLowerCase()) return false
      if (priceMax && precioDesde && precioDesde > priceMax) return false
      if (demoOnly) return false // demo filter is not applicable with current data structure
      if (search) {
        const q = search.toLowerCase()
        if (!`${ficha.marca} ${ficha.modelo}`.toLowerCase().includes(q)) return false
      }
      return true
    }).sort((a, b) => b.units - a.units)
  }, [modelos, brandFilter, priceMax, demoOnly, search])

  const totalUnidades = filtered.reduce((s, m) => s + m.units, 0)

  return (
    <div className="font-hanken bg-paper text-ink min-h-screen">

      {/* Catalog header */}
      <section className="max-w-[1200px] mx-auto px-5 pt-10 pb-6">
        <nav className="text-[13px] text-muted-warm mb-3">
          <Link href="/" className="hover:text-azul-700 transition-colors">Inicio</Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">Catálogo</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-[34px] sm:text-[42px] leading-tight">Catálogo</h1>
            <p className="text-muted-warm mt-2 text-[17px]">
              <span className="font-semibold text-ink">{filtered.length}</span> modelos · Jeep, RAM, Fiat, Peugeot y Dodge
            </p>
          </div>
          <p className="text-[14px] text-muted-warm max-w-sm">
            Si aparece aquí, puedes comprarlo o apartarlo hoy.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[68px] z-30 bg-paper/90 backdrop-blur border-y border-line">
        <div className="max-w-[1200px] mx-auto px-5 py-4 flex flex-col gap-4">
          {/* Brand pills */}
          <div className="flex items-center gap-2 overflow-x-auto scroll-x -mx-1 px-1">
            {marcas.map((m) => (
              <button
                key={m}
                onClick={() => setBrandFilter(m)}
                data-active={brandFilter === m}
                className="shrink-0 px-4 h-10 rounded-full border border-line bg-white text-[14px] font-semibold transition-colors data-[active=true]:bg-azul-700 data-[active=true]:text-white data-[active=true]:border-azul-700 hover:border-azul-500"
              >
                {m === 'todas' ? 'Todas' : m}
              </button>
            ))}
          </div>

          {/* Price / search */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-warm" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar modelo (ej. Compass, 1500…)"
                className="w-full h-11 pl-10 pr-4 rounded-full border border-line bg-white text-[15px] placeholder:text-muted-warm/70 focus:border-azul-500 outline-none"
              />
            </label>
            <select
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="h-11 px-4 rounded-full border border-line bg-white text-[15px] font-medium text-ink"
            >
              <option value={0}>Cualquier precio</option>
              <option value={400000}>Hasta $400,000</option>
              <option value={600000}>Hasta $600,000</option>
              <option value={800000}>Hasta $800,000</option>
              <option value={1200000}>Hasta $1,200,000</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1200px] mx-auto px-5 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-display font-bold text-[22px] text-ink">No hay modelos con esos filtros</div>
            <p className="text-muted-warm mt-2">Ajusta los filtros o escríbeme y te consigo lo que buscas.</p>
            <a
              href={waUrl('Hola Edith, busco un modelo que no veo en el catálogo. ¿Me ayudas?')}
              target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-wa hover:bg-wa-dark text-white font-semibold px-6 h-12 rounded-full transition-colors"
            >
              <WaIcon size={18} />
              Pídemelo por WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(({ ficha, units, precioDesde, precioEspecial }) => {
              const pct = precioDesde && precioEspecial ? Math.round((1 - precioEspecial / precioDesde) * 100) : null
              const descuento = pct !== null && pct > 0 ? pct : null
              const waMsg = `Hola Edith, me interesa el ${ficha.marca} ${ficha.modelo} ${ficha.año}. ¿Qué versiones tienes disponibles?`
              return (
                <article key={ficha.id} className="relative group bg-white rounded-2xl border border-line overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                  <Link href={`/catalogo/${ficha.id}`} className="absolute inset-0 z-[1]" aria-label={`Ver ${ficha.marca} ${ficha.modelo}`} />
                  <div className="block aspect-[16/10] relative overflow-hidden">
                    <ModelImage
                      src={covers[ficha.id] ?? null}
                      alt={`${ficha.marca} ${ficha.modelo}`}
                      phLabel={`foto · ${ficha.marca} ${ficha.modelo}`}
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {units <= 2 && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-[12px] font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                          {units === 1 ? '¡Última unidad!' : '2 disponibles'}
                        </span>
                      )}
                      {descuento !== null && descuento > 0 && (
                        <span className="inline-flex items-center bg-red-500 text-white text-[14px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                          {descuento}% de descuento
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] uppercase tracking-[0.14em] text-muted-warm font-semibold">{ficha.marca} · {ficha.año}</span>
                      <span className="text-[12px] text-muted-warm">{ficha.versiones.length} {ficha.versiones.length === 1 ? 'versión' : 'versiones'}</span>
                    </div>
                    <h3 className="font-display font-bold text-[20px] mt-1.5 text-ink">{ficha.modelo}</h3>
                    <div className="flex items-end justify-between mt-4">
                      <div>
                        {descuento !== null ? (
                          <>
                            {precioDesde && <div className="text-[14px] text-muted-warm line-through">{formatMXN(precioDesde)}</div>}
                            <div className="font-display font-extrabold text-azul-700 text-[22px] leading-none">{formatMXN(precioEspecial!)}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-[12px] text-muted-warm">Precio desde</div>
                            <div className="font-display font-extrabold text-azul-800 text-[22px] leading-none">
                              {precioDesde ? formatMXN(precioDesde) : 'Consultar'}
                            </div>
                          </>
                        )}
                      </div>
                      <Link href={`/catalogo/${ficha.id}#versiones`} className="relative z-2 inline-flex items-center gap-1.5 font-semibold text-azul-700 text-[15px] px-3 py-1.5 rounded-full transition-colors hover:bg-azul-700 hover:text-white">
                        Ver versiones
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </Link>
                    </div>
                    <a
                      href={waUrl(waMsg)}
                      target="_blank" rel="noopener noreferrer"
                      className="relative z-2 mt-4 w-full inline-flex items-center justify-center gap-2 bg-wa hover:bg-wa-dark text-white font-semibold h-11 rounded-full transition-colors"
                    >
                      <WaIcon size={18} />
                      Preguntar por este
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Help band */}
      <section className="max-w-[1200px] mx-auto px-5 pb-16">
        <div className="bg-azul-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-extrabold text-[24px] sm:text-[30px] leading-tight">¿No sabes cuál elegir?</h2>
            <p className="text-azul-100/85 mt-2 text-[16px] max-w-lg">
              Dime para qué lo necesitas y tu presupuesto. Te recomiendo entre las 5 marcas el que más te conviene.
            </p>
          </div>
          <a
            href={waUrl('Hola Edith, no sé cuál auto elegir. Te cuento qué necesito y mi presupuesto para que me recomiendes.')}
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-semibold text-[16px] px-6 h-14 rounded-full transition-colors shadow-lg"
          >
            <WaIcon size={22} />
            Pídeme una recomendación
          </a>
        </div>
      </section>

    </div>
  )
}
