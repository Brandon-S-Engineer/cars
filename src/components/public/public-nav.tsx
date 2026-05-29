'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { waUrl } from '@/lib/catalogo-utils'
import { cn } from '@/lib/utils'

export default function PublicNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-white/95 backdrop-blur border-b border-border/50">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
          E
        </div>
        <span className="font-semibold text-base">Edith Soria</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/catalogo"
          className={cn(
            'hidden sm:block text-sm font-medium transition-colors',
            pathname.startsWith('/catalogo')
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Catálogo
        </Link>
        <a
          href={waUrl('Hola Edith, me gustaría información sobre sus autos disponibles')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#1ebe5d] transition-colors"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </nav>
  )
}
