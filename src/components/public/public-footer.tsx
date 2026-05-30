import Link from 'next/link'
import WaIcon from './wa-icon'
import { waUrl } from '@/lib/catalogo-utils'

export default function PublicFooter() {
  return (
    <footer className="bg-azul-900 text-azul-100/80 font-hanken">
      <div className="max-w-[1200px] mx-auto px-5 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-white text-azul-900 font-display font-extrabold">ES</span>
            <span className="font-display font-extrabold text-white text-[18px]">Edith Soria</span>
          </div>
          <p className="mt-4 text-[14px] max-w-xs">
            Asesoría directa en autos Jeep, RAM, Fiat, Peugeot y Dodge. Atención personal por WhatsApp.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Catálogo</h4>
          <ul className="space-y-2 text-[14px]">
            <li><Link href="/catalogo" className="hover:text-white transition-colors">Todos los modelos</Link></li>
            <li><Link href="/catalogo?marca=jeep" className="hover:text-white transition-colors">Jeep · RAM · Fiat</Link></li>
            <li><Link href="/catalogo?marca=peugeot" className="hover:text-white transition-colors">Peugeot · Dodge</Link></li>
            <li><Link href="/catalogo" className="hover:text-white transition-colors">Disponibles hoy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Más</h4>
          <ul className="space-y-2 text-[14px]">
            <li><Link href="/#financiamiento" className="hover:text-white transition-colors">Financiamiento</Link></li>
            <li><Link href="/#porque" className="hover:text-white transition-colors">Por qué conmigo</Link></li>
            <li><Link href="/#sobre-mi" className="hover:text-white transition-colors">Sobre mí</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contacto directo</h4>
          <a
            href={waUrl('Hola Edith, vi tu sitio y quiero más información.')}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-wa hover:bg-wa-dark text-white font-semibold px-4 h-11 rounded-full transition-colors"
          >
            <WaIcon size={18} />
            WhatsApp
          </a>
          <p className="mt-3 text-[14px]">
            Tel. <a href="tel:+525581631195" className="text-white font-semibold">55 8163 1195</a>
          </p>
          <p className="text-[14px]">Lun–Sáb · 9:00–19:00</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px]">
          <span>© {new Date().getFullYear()} Edith Soria · Venta de autos nuevos en México</span>
          <span>Precios y disponibilidad sujetos a cambio · Imágenes ilustrativas</span>
        </div>
      </div>
    </footer>
  )
}
