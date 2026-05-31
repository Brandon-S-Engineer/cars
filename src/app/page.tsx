import Link from 'next/link'
import WaIcon from '@/components/public/wa-icon'
import UtilityBar from '@/components/public/utility-bar'
import PublicNav from '@/components/public/public-nav'
import PublicFooter from '@/components/public/public-footer'
import FloatingWhatsApp from '@/components/public/floating-whatsapp'
import { getCatalogData } from '@/lib/catalogo-db'
import { formatMXN, waUrl } from '@/lib/catalogo-utils'

export const dynamic = 'force-dynamic'

const WA_GENERAL = 'Hola Edith, vi tu sitio y quiero que me asesores para escoger mi próximo auto.'

export default async function LandingPage() {
  const modelos = await getCatalogData()
  const disponibles = modelos.filter((m) => m.units > 0)
  const totalUnidades = modelos.reduce((s, m) => s + m.units, 0)
  const destacados = disponibles.slice(0, 6)

  return (
    <div className="font-hanken bg-paper text-ink">
      <UtilityBar />
      <PublicNav />

      <main>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-5 pt-12 pb-14 lg:pt-16 lg:pb-20 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 bg-azul-50 text-azul-800 border border-azul-100 rounded-full px-3 py-1.5 text-[13px] font-semibold">
                Jeep · RAM · Fiat · Peugeot · Dodge
              </span>

              <h1 className="mt-5 font-display font-extrabold text-[40px] sm:text-[52px] leading-[0.98] tracking-tight">
                Tu próximo auto,<br />
                con alguien que <span className="text-azul-700">sí te contesta</span>.
              </h1>

              <p className="mt-5 text-[18px] text-muted-warm max-w-[34rem]">
                Soy Edith Soria. Te muestro modelos, versiones y precios de cinco marcas,
                y te acompaño paso a paso por WhatsApp — sin bots, sin vueltas.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={waUrl(WA_GENERAL)}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-semibold text-[17px] px-6 h-14 rounded-full transition-colors shadow-lg"
                >
                  <WaIcon size={24} />
                  Escríbeme por WhatsApp
                </a>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 border border-ink/15 hover:border-ink/40 text-ink font-semibold text-[17px] px-6 h-14 rounded-full transition-colors"
                >
                  Explorar catálogo
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-9 grid grid-cols-3 gap-5 max-w-md">
                <div>
                  <div className="font-display font-extrabold text-[28px] text-azul-800 leading-none">5</div>
                  <div className="text-[13px] text-muted-warm mt-1.5">marcas en un<br />solo lugar</div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-[28px] text-azul-800 leading-none">40+</div>
                  <div className="text-[13px] text-muted-warm mt-1.5">versiones con<br />specs completas</div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-[28px] text-azul-800 leading-none">&lt;5 min</div>
                  <div className="text-[13px] text-muted-warm mt-1.5">tiempo en que<br />te respondo</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="ph rounded-3xl aspect-[4/3] flex items-center justify-center border border-line">
                  <span className="ph-tag">foto · auto destacado del mes</span>
                </div>

                {/* Floating card — featured model */}
                <div className="absolute -left-3 sm:-left-5 bottom-6 bg-white rounded-2xl border border-line shadow-xl p-4 w-[230px]">
                  <div className="text-[12px] font-semibold text-azul-700">★ Lo más pedido</div>
                  <div className="mt-1.5 font-display font-bold text-[16px] leading-tight text-ink">Jeep Compass Limited 2026</div>
                  <div className="text-[13px] text-muted-warm">Versión tope de gama · 3 colores</div>
                  <div className="mt-2 font-display font-extrabold text-azul-800 text-[18px]">desde $689,900</div>
                </div>

                {/* Floating card — Edith */}
                <div className="absolute -right-2 sm:-right-4 -top-4 bg-white rounded-2xl border border-line shadow-xl p-3 flex items-center gap-3 w-[210px]">
                  <div className="ph rounded-full w-12 h-12 shrink-0 grid place-items-center">
                    <span className="ph-tag" style={{ fontSize: 8, padding: '4px 6px' }}>Edith</span>
                  </div>
                  <div className="leading-tight">
                    <div className="font-semibold text-[14px] text-ink">Te atiende Edith</div>
                    <div className="text-[12px] text-muted-warm">en persona, no un bot</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARCAS ─────────────────────────────────────────────────────────── */}
        <section className="border-y border-line bg-sand/60">
          <div className="max-w-[1200px] mx-auto px-5 py-7">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-[13px] uppercase tracking-[0.18em] text-muted-warm font-semibold">Trabajo estas 5 marcas</span>
              <div className="grid grid-cols-5 gap-3 sm:gap-6 flex-1 max-w-[640px]">
                {['JEEP', 'RAM', 'FIAT', 'PEUGEOT', 'DODGE'].map((marca) => (
                  <Link key={marca} href={`/catalogo?marca=${marca.toLowerCase()}`} className="group text-center">
                    <span className="block font-display font-extrabold text-[18px] sm:text-[22px] tracking-tight text-ink/75 group-hover:text-azul-700 transition-colors">
                      {marca}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MODELOS DESTACADOS ─────────────────────────────────────────────── */}
        {destacados.length > 0 && (
          <section className="max-w-[1200px] mx-auto px-5 py-16">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display font-extrabold text-[30px] sm:text-[36px] leading-tight">Modelos destacados</h2>
                <p className="text-muted-warm mt-2 text-[17px]">Lo más buscado esta semana.</p>
              </div>
              <Link href="/catalogo" className="hidden sm:inline-flex items-center gap-2 font-semibold text-azul-700 hover:text-azul-900 shrink-0 transition-colors">
                Ver todo el catálogo
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destacados.map(({ ficha, units, precioDesde }) => {
                const waMsg = `Hola Edith, me interesa el ${ficha.marca} ${ficha.modelo} ${ficha.año}. ¿Qué versiones tienes disponibles?`
                return (
                  <article key={ficha.id} className="group bg-white rounded-2xl border border-line overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                    <Link href={`/catalogo/${ficha.id}`} className="block ph aspect-[16/10] flex items-center justify-center relative">
                      <span className="ph-tag">foto · {ficha.marca} {ficha.modelo}</span>
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Disponible
                      </span>
                    </Link>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] uppercase tracking-[0.14em] text-muted-warm font-semibold">{ficha.marca} · {ficha.año}</span>
                        <span className="text-[12px] text-muted-warm">{ficha.versiones.length} {ficha.versiones.length === 1 ? 'versión' : 'versiones'}</span>
                      </div>
                      <h3 className="font-display font-bold text-[20px] mt-1.5 text-ink">{ficha.modelo}</h3>
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <div className="text-[12px] text-muted-warm">Precio desde</div>
                          <div className="font-display font-extrabold text-azul-800 text-[22px] leading-none">
                            {precioDesde ? formatMXN(precioDesde) : 'Consultar'}
                          </div>
                        </div>
                        <Link href={`/catalogo/${ficha.id}`} className="inline-flex items-center gap-1.5 font-semibold text-azul-700 hover:text-azul-900 text-[15px] transition-colors">
                          Ver versiones
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </Link>
                      </div>
                      <a
                        href={waUrl(waMsg)}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-wa hover:bg-wa-dark text-white font-semibold h-11 rounded-full transition-colors"
                      >
                        <WaIcon size={18} />
                        Preguntar por este
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            <Link href="/catalogo" className="sm:hidden mt-7 w-full inline-flex items-center justify-center gap-2 border border-ink/15 font-semibold h-12 rounded-full text-ink">
              Ver todo el catálogo
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </section>
        )}

        {/* ── POR QUÉ CONMIGO ────────────────────────────────────────────────── */}
        <section id="porque" className="bg-azul-900 text-white">
          <div className="max-w-[1200px] mx-auto px-5 py-16">
            <div className="max-w-2xl">
              <span className="text-[13px] uppercase tracking-[0.18em] text-azul-200 font-semibold">Por qué comprarme a mí</span>
              <h2 className="font-display font-extrabold text-[30px] sm:text-[36px] leading-tight mt-3">
                Una persona real, no una agencia que te marea
              </h2>
              <p className="text-azul-100/85 mt-3 text-[17px]">
                Mismo auto, mismo precio de lista — pero con alguien que te responde, te explica sin
                tecnicismos y te acompaña hasta que tienes las llaves en la mano.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {[
                { icon: <WaIcon size={22} />, title: 'Te respondo yo', desc: 'Sin chatbots ni call center. Escribes y te contesta Edith, normalmente en minutos.', bg: 'bg-wa' },
                { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 13h2l2-7 4 14 3-9 2 4h5" /></svg>, title: 'Inventario real', desc: 'Lo que ves está disponible. La base se actualiza sola; no te ofrezco lo que ya se vendió.', bg: 'bg-white/10' },
                { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M5 5h9a3 3 0 010 6H7a3 3 0 000 6h10" /></svg>, title: 'Financiamiento', desc: 'Planes a tu medida, enganche y plazo que te acomoden. Te ayudo a armar tu mensualidad.', bg: 'bg-white/10' },
                { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Te acompaño', desc: 'De la primera duda a la entrega y trámites. Una sola persona de principio a fin.', bg: 'bg-white/10' },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className={`w-11 h-11 rounded-full ${item.bg} grid place-items-center`}>
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-[18px] mt-4">{item.title}</h3>
                  <p className="text-azul-100/80 text-[15px] mt-1.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── FINANCIAMIENTO ─────────────────────────────────────────────────── */}
        <section id="financiamiento" className="bg-sand/70 border-y border-line">
          <div className="max-w-[1200px] mx-auto px-5 py-16 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-[13px] uppercase tracking-[0.18em] text-muted-warm font-semibold">Financiamiento</span>
              <h2 className="font-display font-extrabold text-[30px] sm:text-[36px] leading-tight mt-3">
                Llévatelo a meses, sin complicarte
              </h2>
              <p className="text-muted-warm mt-3 text-[17px]">
                Manejo planes de financiamiento de marca y bancarios. Tú me dices cuánto quieres dar
                de enganche y a cuántos meses; yo te armo la mensualidad.
              </p>
              <ul className="mt-5 space-y-2.5 text-[16px] text-ink">
                {['Enganche desde el 10%', 'Plazos de 12 a 60 meses', 'Aceptamos tu auto a cuenta', 'Te ayudo con la pre-aprobación'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-azul-700 text-white grid place-items-center text-[12px] shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={waUrl('Hola Edith, quiero información de financiamiento. ¿Me ayudas a calcular mi mensualidad?')}
                target="_blank" rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-semibold text-[16px] px-6 py-3.5 rounded-full transition-colors shadow-lg"
              >
                <WaIcon size={20} />
                Calcular mi plan por WhatsApp
              </a>
            </div>

            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { model: 'Fiat Pulse · desde', monthly: '$7,490', note: 'enganche 20% · 60 meses*' },
                  { model: 'Peugeot 2008 · desde', monthly: '$9,540', note: 'enganche 20% · 60 meses*' },
                  { model: 'Jeep Compass · desde', monthly: '$12,290', note: 'enganche 20% · 60 meses*' },
                ].map((f) => (
                  <div key={f.model} className="bg-white border border-line rounded-2xl p-5">
                    <div className="text-[13px] text-muted-warm">{f.model}</div>
                    <div className="font-display font-extrabold text-[26px] text-azul-800 mt-1">
                      {f.monthly}<span className="text-[14px] text-muted-warm font-sans font-medium">/mes</span>
                    </div>
                    <div className="text-[13px] text-muted-warm mt-1">{f.note}</div>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-muted-warm mt-4 leading-relaxed">
                *Cifras ilustrativas calculadas con tasa anual aproximada. La mensualidad final depende de tu perfil y el plan elegido.
              </p>
            </div>
          </div>
        </section>

        {/* ── SOBRE MÍ ───────────────────────────────────────────────────────── */}
        <section id="sobre-mi" className="max-w-[1200px] mx-auto px-5 py-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="ph rounded-3xl aspect-[4/5] flex items-center justify-center border border-line">
                <span className="ph-tag">foto · Edith Soria</span>
              </div>
            </div>
            <div className="lg:col-span-7">
              <span className="text-[13px] uppercase tracking-[0.18em] text-muted-warm font-semibold">Sobre mí</span>
              <h2 className="font-display font-extrabold text-[30px] sm:text-[38px] leading-tight mt-3">Hola, soy Edith Soria 👋</h2>
              <p className="text-[18px] text-ink/85 mt-4 max-w-2xl">
                Llevo años ayudando a familias y empresas a encontrar el auto correcto, sin presión y sin letras chiquitas.
                Mi forma de trabajar es simple: te escucho, te muestro opciones reales y te acompaño hasta la entrega.
                Si algo no te conviene, te lo digo.
              </p>
              <p className="text-[18px] text-ink/85 mt-4 max-w-2xl">
                Atiendo a particulares y a empresas con flotillas. Manejo Jeep, RAM, Fiat, Peugeot y Dodge, así que
                puedo compararte modelos entre marcas y recomendarte el que de verdad te conviene.
              </p>
              <div className="mt-6 signature text-azul-800 text-[42px] leading-none">Edith Soria</div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={waUrl('Hola Edith, me gustaría que me asesores para encontrar mi próximo auto.')}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-semibold text-[16px] px-6 py-3.5 rounded-full transition-colors shadow-lg"
                >
                  <WaIcon size={20} />
                  Hablemos por WhatsApp
                </a>
                <span className="text-[15px] text-muted-warm">
                  o llámame al <a href="tel:+525581631195" className="font-semibold text-azul-700 hover:text-azul-900 transition-colors">55 8163 1195</a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
        <section className="bg-wa-deep text-white">
          <div className="max-w-[1200px] mx-auto px-5 py-16 text-center">
            <h2 className="font-display font-extrabold text-[32px] sm:text-[44px] leading-tight max-w-3xl mx-auto">
              ¿Listo para estrenar? Escríbeme y empezamos hoy mismo.
            </h2>
            <p className="text-white/85 text-[18px] mt-4 max-w-xl mx-auto">
              Cuéntame qué buscas y tu presupuesto. Te mando opciones reales con precio y disponibilidad en minutos.
            </p>
            <a
              href={waUrl('Hola Edith, estoy listo para estrenar auto. ¿Me ayudas a encontrar el mío?')}
              target="_blank" rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 bg-white text-wa-deep hover:bg-paper font-bold text-[18px] px-8 h-16 rounded-full transition-colors shadow-2xl"
            >
              <WaIcon size={26} />
              Escríbeme a WhatsApp · 55 8163 1195
            </a>
          </div>
        </section>

      </main>

      <PublicFooter />
      <FloatingWhatsApp />
    </div>
  )
}
