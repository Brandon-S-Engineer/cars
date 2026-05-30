import WaIcon from './wa-icon'
import { waUrl } from '@/lib/catalogo-utils'

export default function FloatingWhatsApp({ msg }: { msg?: string }) {
  return (
    <a
      href={waUrl(msg ?? 'Hola Edith, vi tu catálogo y quiero más información.')}
      target="_blank" rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="wa-fab fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-semibold pl-4 pr-5 h-14 rounded-full transition-colors"
    >
      <span className="relative grid place-items-center w-8 h-8">
        <span className="wa-ping" />
        <span className="relative"><WaIcon size={26} /></span>
      </span>
      <span className="hidden sm:inline">Escríbeme</span>
    </a>
  )
}
