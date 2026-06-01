'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WaIcon from './wa-icon'
import { waUrl } from '@/lib/catalogo-utils'
import { cn } from '@/lib/utils'

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur border-b border-line font-hanken">
      <div className="max-w-[1200px] mx-auto px-5 h-[68px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Edith Soria — inicio">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-azul-700 text-white font-display font-extrabold text-lg leading-none">
            ES
          </span>
          <span className="leading-none">
            <span className="block font-display font-extrabold text-[19px] tracking-tight text-ink">Edith Soria</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-muted-warm mt-0.5">Asesora de autos</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-ink/80">
          <Link href="/catalogo" className={cn('hover:text-azul-700 transition-colors', pathname.startsWith('/catalogo') && 'text-azul-700 font-semibold')}>Catálogo</Link>
          <Link href="/#financiamiento" className="hover:text-azul-700 transition-colors">Financiamiento</Link>
          <Link href="/#porque" className="hover:text-azul-700 transition-colors">Por qué conmigo</Link>
          <Link href="/#sobre-mi" className="hover:text-azul-700 transition-colors">Sobre mí</Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waUrl('Hola Edith, vi tu sitio y me gustaría que me asesores para encontrar mi próximo auto.')}
            target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-wa hover:bg-wa-dark text-white font-semibold px-4 h-11 rounded-full transition-colors shadow-sm"
          >
            <WaIcon size={20} />
            WhatsApp
          </a>
          <Link href="/catalogo" className="hidden lg:inline-flex items-center bg-azul-700 hover:bg-azul-800 text-white font-semibold px-5 h-11 rounded-full transition-colors">
            Ver catálogo
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={open}
            className="lg:hidden grid place-items-center w-11 h-11 rounded-full border border-line text-ink"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-line bg-paper">
          <nav className="max-w-[1200px] mx-auto px-5 py-3 flex flex-col text-[16px] font-medium text-ink">
            <Link href="/catalogo" className="py-3 border-b border-line" onClick={() => setOpen(false)}>Catálogo</Link>
            <Link href="/#financiamiento" className="py-3 border-b border-line" onClick={() => setOpen(false)}>Financiamiento</Link>
            <Link href="/#porque" className="py-3 border-b border-line" onClick={() => setOpen(false)}>Por qué conmigo</Link>
            <Link href="/#sobre-mi" className="py-3" onClick={() => setOpen(false)}>Sobre mí</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
