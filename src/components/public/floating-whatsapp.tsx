import { MessageCircle } from 'lucide-react'
import { waUrl } from '@/lib/catalogo-utils'

export default function FloatingWhatsApp({ msg }: { msg?: string }) {
  return (
    <a
      href={waUrl(msg ?? 'Hola Edith, me gustaría información sobre sus autos disponibles')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-xl hover:bg-[#1ebe5d] transition-all hover:scale-105 font-medium text-sm"
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
