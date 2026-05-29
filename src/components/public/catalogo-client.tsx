'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Car, MessageCircle } from 'lucide-react'
import { type ModeloCatalogo, formatMXN, waUrl, getBrandStyle } from '@/lib/catalogo-utils'
import { cn } from '@/lib/utils'

export default function CatalogoClient({ modelos }: { modelos: ModeloCatalogo[] }) {
  const [brandFilter, setBrandFilter] = useState<string | null>(null)

  const marcas = useMemo(() => [...new Set(modelos.map((m) => m.ficha.marca))], [modelos])

  const filtered = useMemo(() => {
    const base = brandFilter ? modelos.filter((m) => m.ficha.marca === brandFilter) : modelos
    return [...base].sort((a, b) => b.units - a.units)
  }, [modelos, brandFilter])

  const totalUnidades = modelos.reduce((s, m) => s + m.units, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header filtros */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Catálogo de autos</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {totalUnidades} unidades disponibles
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBrandFilter(null)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  !brandFilter
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                Todos
              </button>
              {marcas.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(brandFilter === b ? null : b)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    brandFilter === b
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No hay modelos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(({ ficha, units, precioDesde }) => {
              const style = getBrandStyle(ficha.marca)
              return (
                <Link
                  key={ficha.id}
                  href={`/catalogo/${ficha.id}`}
                  className="group rounded-2xl overflow-hidden border bg-white hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Imagen placeholder */}
                  <div className={cn('relative h-52 bg-gradient-to-br flex flex-col items-center justify-center gap-2', style.gradient)}>
                    <Car className={cn('h-14 w-14 opacity-15', style.text)} />
                    <span className={cn('text-[10px] font-semibold uppercase tracking-widest opacity-25', style.text)}>
                      {ficha.marca}
                    </span>
                    <div className="absolute top-3 right-3">
                      {units > 0 ? (
                        <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                          {units} disponibles
                        </span>
                      ) : (
                        <span className="bg-black/40 text-white/60 text-xs px-2.5 py-1 rounded-full">
                          Sin unidades
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">{ficha.marca} · {ficha.año}</p>
                    <h3 className="font-bold text-lg mt-0.5 group-hover:underline decoration-1 underline-offset-2">
                      {ficha.modelo}
                    </h3>

                    {precioDesde ? (
                      <p className="text-amber-600 font-bold text-base mt-2">
                        Desde {formatMXN(precioDesde)}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-sm mt-2">Consultar precio</p>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-xs text-muted-foreground">
                        {ficha.versiones.length} {ficha.versiones.length === 1 ? 'versión' : 'versiones'}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        Ver detalles →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA bottom */}
      <div className="bg-white border-t py-14 text-center px-6">
        <p className="text-muted-foreground mb-5">¿No encuentras lo que buscas?</p>
        <a
          href={waUrl('Hola Edith, estoy buscando un auto en específico, ¿me puedes ayudar?')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#1ebe5d] transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          Pregúntale a Edith
        </a>
      </div>
    </div>
  )
}
