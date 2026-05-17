'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Copy, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type CarAnuncio, useAnunciador } from '@/lib/anunciador-store'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(val: string): string {
  const num = Number(val.replace(/[^0-9.]/g, ''))
  if (!num) return val
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num)
}

function generatePost(car: CarAnuncio): string {
  const lines: string[] = []

  const titulo = [car.año, car.descripcion].filter(Boolean).join(' ')
  if (titulo) lines.push(`🚗 ${titulo}`)
  lines.push('')

  const listaNum = car.precio ? Number(car.precio.replace(/[^0-9.]/g, '')) : 0
  const ofertaNum = car.oferta ? Number(car.oferta.replace(/[^0-9.]/g, '')) : 0
  const tieneOferta = ofertaNum > 0 && ofertaNum !== listaNum

  if (tieneOferta && car.precio) {
    lines.push(`🔥 Precio especial: ${fmt(car.oferta!)}`)
    lines.push(`   Precio lista: ${fmt(car.precio)}`)
  } else if (car.precio) {
    lines.push(`💰 Precio: ${fmt(car.precio)}`)
  }
  lines.push('')

  if (car.colorExt) lines.push(`🎨 Color exterior: ${car.colorExt}`)
  if (car.colorInt) lines.push(`🎨 Color interior: ${car.colorInt}`)
  if (car.sucursal) lines.push(`📍 Sucursal: ${car.sucursal}`)
  lines.push('')

  if (car.status === 'normal') lines.push('✅ ¡Disponible para entrega inmediata!')
  else if (car.status === 'demo') lines.push('🏷️ Unidad de exhibición disponible para venta')
  else if (car.status === 'reservado' || car.status === 'demo-reservado') lines.push('⚠️ Unidad actualmente apartada')
  lines.push('')

  lines.push('¿Te interesa? ¡Escríbeme! 📲')

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  normal: 'Disponible',
  demo: 'Demo disponible',
  reservado: 'Apartado',
  'demo-reservado': 'Demo — Apartado',
}

const STATUS_CLASS: Record<string, string> = {
  normal: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  demo: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  reservado: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  'demo-reservado': 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{label}</span>
      <span className={cn('text-sm font-medium text-right', highlight && 'text-green-600 dark:text-green-400')}>{value}</span>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
        <Megaphone className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center max-w-sm">
        <h2 className="text-lg font-semibold">Ningún vehículo seleccionado</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Ve al inventario y haz click en cualquier fila para generar el anuncio.
        </p>
      </div>
      <Button variant="outline" onClick={() => router.push('/dashboard/inventario')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Ir al inventario
      </Button>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AnunciadorClient() {
  const { car } = useAnunciador()
  const router = useRouter()
  const [post, setPost] = useState(() => (car ? generatePost(car) : ''))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (car) setPost(generatePost(car))
  }, [car])

  const copy = async () => {
    await navigator.clipboard.writeText(post)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!car) return <EmptyState />

  const listaNum = car.precio ? Number(car.precio.replace(/[^0-9.]/g, '')) : 0
  const ofertaNum = car.oferta ? Number(car.oferta.replace(/[^0-9.]/g, '')) : 0
  const tieneOferta = ofertaNum > 0 && ofertaNum !== listaNum

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.push('/dashboard/inventario')} className="mt-0.5 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{car.tab} #{car.num}</p>
          <h1 className="text-xl font-semibold leading-tight truncate">
            {[car.año, car.descripcion].filter(Boolean).join(' ') || 'Vehículo'}
          </h1>
        </div>
        <span className={cn('shrink-0 text-xs font-medium px-2.5 py-1 rounded-full', STATUS_CLASS[car.status])}>
          {STATUS_LABEL[car.status]}
        </span>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
        {/* Detail card */}
        <div className="rounded-xl border bg-card p-5 space-y-1 self-start">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2">Detalles</p>
          {car.año && <DetailRow label="Año" value={car.año} />}
          {car.precio && <DetailRow label="Precio lista" value={fmt(car.precio)} />}
          {tieneOferta && car.oferta && <DetailRow label="Precio oferta" value={fmt(car.oferta)} highlight />}
          {car.colorExt && <DetailRow label="Color exterior" value={car.colorExt} />}
          {car.colorInt && <DetailRow label="Color interior" value={car.colorInt} />}
          {car.sucursal && <DetailRow label="Sucursal" value={car.sucursal} />}
        </div>

        {/* Facebook post */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto para Facebook</p>
            <Button onClick={copy} size="sm" className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            rows={14}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-xs text-muted-foreground">Puedes editar el texto antes de copiarlo.</p>
        </div>
      </div>
    </div>
  )
}
