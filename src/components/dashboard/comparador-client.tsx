'use client'

import { useState, useMemo } from 'react'
import { GitCompareArrows, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FICHAS, MODELOS, fichaLabel, type FichaTecnica } from '@/lib/fichas-data'

// ── Selector de ficha ─────────────────────────────────────────────────────────

function FichaSelector({
  value,
  onSelect,
  onRemove,
  usedIds,
  removable,
}: {
  value: string | null
  onSelect: (id: string) => void
  onRemove: () => void
  usedIds: string[]
  removable: boolean
}) {
  const [open, setOpen] = useState(false)

  const fichaActual = value ? FICHAS.find((f) => f.id === value) : null

  return (
    <div className="relative">
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 cursor-pointer hover:border-foreground/30 transition-colors min-w-[200px]',
          open && 'border-foreground/40 ring-1 ring-foreground/20',
        )}
        onClick={() => setOpen((o) => !o)}>
        {fichaActual ? (
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">{fichaActual.modelo}</div>
            <div className="text-sm font-semibold">
              {fichaActual.año} {fichaActual.version}
            </div>
          </div>
        ) : (
          <div className="flex-1 text-sm text-muted-foreground">Seleccionar versión…</div>
        )}
        <div className="flex items-center gap-1">
          {removable && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-64 rounded-xl border bg-popover shadow-lg overflow-hidden">
            {MODELOS.map((modelo) => {
              const fichasModelo = FICHAS.filter((f) => f.modelo === modelo)
              return (
                <div key={modelo}>
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {modelo}
                  </div>
                  {fichasModelo.map((ficha) => {
                    const disabled = usedIds.includes(ficha.id) && ficha.id !== value
                    return (
                      <button
                        key={ficha.id}
                        disabled={disabled}
                        onClick={() => {
                          onSelect(ficha.id)
                          setOpen(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors',
                          ficha.id === value
                            ? 'bg-foreground text-background font-medium'
                            : disabled
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-accent',
                        )}>
                        <span>
                          {ficha.año} {ficha.version}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ── Tabla comparadora ─────────────────────────────────────────────────────────

function ComparadorTabla({
  fichas,
  categoriaId,
  soloDiferencias,
}: {
  fichas: FichaTecnica[]
  categoriaId: string
  soloDiferencias: boolean
}) {
  const categorias = categoriaId === 'todas'
    ? fichas[0].categorias.map((c) => c.id)
    : [categoriaId]

  return (
    <div className="rounded-xl border overflow-hidden">
      {categorias.map((catId, catIdx) => {
        const catRef = fichas[0].categorias.find((c) => c.id === catId)
        if (!catRef) return null

        const rows = catRef.specs.map((spec) => {
          const valores = fichas.map((ficha) => {
            const cat = ficha.categorias.find((c) => c.id === catId)
            return cat?.specs.find((s) => s.label === spec.label)?.valor ?? '—'
          })
          const hayDiferencia = new Set(valores).size > 1
          return { label: spec.label, valores, hayDiferencia }
        })

        const rowsFiltrados = soloDiferencias ? rows.filter((r) => r.hayDiferencia) : rows
        if (rowsFiltrados.length === 0) return null

        return (
          <div key={catId}>
            {/* Encabezado de categoría */}
            <div
              className={cn(
                'px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40 border-b',
                catIdx > 0 && 'border-t',
              )}>
              {catRef.nombre}
            </div>

            {rowsFiltrados.map((row, rowIdx) => (
              <div
                key={row.label}
                className={cn(
                  'grid border-b last:border-b-0',
                  row.hayDiferencia && 'bg-amber-50/60 dark:bg-amber-950/20',
                )}
                style={{ gridTemplateColumns: `220px repeat(${fichas.length}, 1fr)` }}>
                {/* Label */}
                <div
                  className={cn(
                    'px-4 py-2.5 text-xs text-muted-foreground border-r flex items-center',
                    rowIdx % 2 === 0 ? 'bg-muted/20' : '',
                    row.hayDiferencia && 'bg-amber-50/80 dark:bg-amber-950/30',
                  )}>
                  {row.hayDiferencia && (
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 inline-block" />
                  )}
                  {row.label}
                </div>

                {/* Valores por ficha */}
                {row.valores.map((valor, colIdx) => (
                  <div
                    key={colIdx}
                    className={cn(
                      'px-4 py-2.5 text-sm border-r last:border-r-0',
                      rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/10',
                      row.hayDiferencia && colIdx === 0 && 'bg-amber-50/40 dark:bg-amber-950/10',
                      row.hayDiferencia && colIdx === row.valores.length - 1 && 'bg-green-50/60 dark:bg-green-950/20 font-medium text-green-700 dark:text-green-400',
                    )}>
                    {valor}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TODAS_CATEGORIAS = { id: 'todas', nombre: 'Todas las categorías' }

export default function ComparadorClient() {
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>([
    'commander-2025-overland',
    'commander-2026-overland',
  ])
  const [categoriaId, setCategoriaId] = useState('todas')
  const [soloDiferencias, setSoloDiferencias] = useState(false)

  const fichasSeleccionadas = useMemo(
    () => selectedIds.map((id) => (id ? FICHAS.find((f) => f.id === id) : null)).filter(Boolean) as FichaTecnica[],
    [selectedIds],
  )

  const listas = useMemo(() => {
    if (fichasSeleccionadas.length === 0) return []
    return [TODAS_CATEGORIAS, ...fichasSeleccionadas[0].categorias.map((c) => ({ id: c.id, nombre: c.nombre }))]
  }, [fichasSeleccionadas])

  const usedIds = selectedIds.filter(Boolean) as string[]

  const addSlot = () => setSelectedIds((prev) => [...prev, null])

  const updateSlot = (idx: number, id: string) =>
    setSelectedIds((prev) => prev.map((v, i) => (i === idx ? id : v)))

  const removeSlot = (idx: number) =>
    setSelectedIds((prev) => prev.filter((_, i) => i !== idx))

  const listaCompleta = fichasSeleccionadas.length >= 2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Comparador de versiones</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona dos o más versiones para comparar sus especificaciones.
          </p>
        </div>
      </div>

      {/* Selectores */}
      <div className="flex flex-wrap items-start gap-3">
        {selectedIds.map((id, idx) => (
          <FichaSelector
            key={idx}
            value={id}
            usedIds={usedIds}
            removable={selectedIds.length > 2}
            onSelect={(newId) => updateSlot(idx, newId)}
            onRemove={() => removeSlot(idx)}
          />
        ))}
        {selectedIds.length < 4 && (
          <Button variant="outline" size="sm" className="h-[62px] px-4 rounded-xl border-dashed gap-2" onClick={addSlot}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        )}
      </div>

      {/* Filtros */}
      {listaCompleta && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Tabs de categoría */}
          <div className="flex items-center gap-1 flex-wrap">
            {listas.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaId(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  categoriaId === cat.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
                )}>
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Toggle solo diferencias */}
          <button
            onClick={() => setSoloDiferencias((v) => !v)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              soloDiferencias
                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-400'
                : 'bg-background border-border text-muted-foreground hover:text-foreground',
            )}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
            Solo diferencias
          </button>
        </div>
      )}

      {/* Encabezados de columna */}
      {listaCompleta && (
        <div
          className="grid rounded-xl border bg-card overflow-hidden"
          style={{ gridTemplateColumns: `220px repeat(${fichasSeleccionadas.length}, 1fr)` }}>
          <div className="px-4 py-3 border-r text-xs text-muted-foreground font-medium">Especificación</div>
          {fichasSeleccionadas.map((ficha, idx) => (
            <div
              key={ficha.id}
              className={cn(
                'px-4 py-3 border-r last:border-r-0',
                idx === fichasSeleccionadas.length - 1 && 'bg-green-50/50 dark:bg-green-950/10',
              )}>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{ficha.modelo}</div>
              <div className="text-sm font-bold">
                {ficha.año} {ficha.version}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabla */}
      {listaCompleta ? (
        <ComparadorTabla
          fichas={fichasSeleccionadas}
          categoriaId={categoriaId}
          soloDiferencias={soloDiferencias}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <GitCompareArrows className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Selecciona al menos dos versiones</h2>
            <p className="text-sm text-muted-foreground mt-1">Usa los selectores de arriba para elegir qué comparar.</p>
          </div>
        </div>
      )}

      {/* Leyenda */}
      {listaCompleta && !soloDiferencias && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
          Las filas resaltadas indican especificaciones que difieren entre versiones. La última columna se resalta en verde.
        </p>
      )}
    </div>
  )
}
