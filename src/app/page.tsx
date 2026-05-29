import Link from 'next/link'
import { ChevronRight, MessageCircle, Car } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCatalogData } from '@/lib/catalogo-db'
import { formatMXN, waUrl, getBrandStyle } from '@/lib/catalogo-utils'
import PublicNav from '@/components/public/public-nav'
import FloatingWhatsApp from '@/components/public/floating-whatsapp'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const modelos = await getCatalogData()
  const conUnidades = modelos.filter((m) => m.units > 0)
  const totalUnidades = modelos.reduce((s, m) => s + m.units, 0)
  const marcas = [...new Set(conUnidades.map((m) => m.ficha.marca))]
  const destacados = conUnidades.slice(0, 4)

  return (
    <>
      <PublicNav />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            {totalUnidades > 0 ? `${totalUnidades} autos disponibles hoy` : 'Catálogo actualizado'}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-5">
            Encuentra tu próximo auto sin complicaciones
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
            Catálogo actualizado con los mejores modelos Jeep, RAM, Fiat y más.
            Asesoría personalizada directo por WhatsApp.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3.5 rounded-full text-base font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver catálogo completo
              <ChevronRight className="h-4 w-4" />
            </Link>
            <a
              href={waUrl('Hola Edith, me gustaría información sobre sus autos disponibles')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full text-base font-semibold hover:bg-[#1ebe5d] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Escríbeme por WhatsApp
            </a>
          </div>

          {marcas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {marcas.map((m) => (
                <span key={m} className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Modelos destacados ───────────────────────────────────────────────── */}
      {destacados.length > 0 && (
        <section className="py-20 bg-gray-50 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Disponibles ahora</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Listos para entrega inmediata.
                </p>
              </div>
              <Link
                href="/catalogo"
                className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                Ver todos <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {destacados.map(({ ficha, units, precioDesde }) => {
                const style = getBrandStyle(ficha.marca)
                return (
                  <Link
                    key={ficha.id}
                    href={`/catalogo/${ficha.id}`}
                    className="group rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div
                      className={cn(
                        'h-44 bg-gradient-to-br flex flex-col items-center justify-center gap-1.5',
                        style.gradient,
                      )}
                    >
                      <Car className={cn('h-10 w-10 opacity-20', style.text)} />
                      <span className={cn('text-[10px] font-semibold uppercase tracking-widest opacity-30', style.text)}>
                        {ficha.marca}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground">{ficha.marca} · {ficha.año}</p>
                      <h3 className="font-semibold text-base mt-0.5 group-hover:underline decoration-1 underline-offset-2">
                        {ficha.modelo}
                      </h3>
                      {precioDesde && (
                        <p className="text-amber-600 font-bold text-sm mt-1.5">
                          Desde {formatMXN(precioDesde)}
                        </p>
                      )}
                      <p className="text-xs text-green-600 font-medium mt-0.5">
                        {units} {units === 1 ? 'unidad disponible' : 'unidades disponibles'}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Por qué Edith ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🚗', titulo: 'Marcas premium', texto: 'Jeep, RAM, Fiat y más. Siempre los mejores modelos del año.' },
            { icon: '💬', titulo: 'Asesoría directa', texto: 'Sin intermediarios. Hablas directo con quien te puede ayudar.' },
            { icon: '✅', titulo: 'Inventario en tiempo real', texto: 'El catálogo se actualiza solo. Lo que ves está disponible.' },
          ].map((item) => (
            <div key={item.titulo} className="space-y-3">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="font-semibold text-lg">{item.titulo}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Listo para encontrar tu auto?
          </h2>
          <p className="text-white/50 mb-8 text-base">
            Escríbeme por WhatsApp y te ayudo sin compromisos.
          </p>
          <a
            href={waUrl('Hola Edith, me gustaría información sobre sus autos disponibles')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
            Contactar a Edith
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-6 bg-gray-950 text-white/30 text-xs text-center">
        © {new Date().getFullYear()} Edith Soria · Todos los derechos reservados
      </footer>

      <FloatingWhatsApp />
    </>
  )
}
