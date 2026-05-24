'use client'

import { useState, useMemo } from 'react'
import { GitCompareArrows, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MODELOS, modeloLabel, type ModeloFicha, type Version } from '@/lib/fichas-data'

// ── Selector de modelo+año ────────────────────────────────────────────────────

function ModeloSelector({
  value,
  onChange,
}: {
  value: ModeloFicha
  onChange: (m: ModeloFicha) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground/30',
          open && 'border-foreground/40 ring-1 ring-foreground/20',
        )}>
        <span className="text-muted-foreground text-xs mr-1">Auto</span>
        {modeloLabel(value)}
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-60 rounded-xl border bg-popover shadow-lg overflow-hidden py-1">
            {MODELOS.map((m) => (
              <button
                key={m.id}
                onClick={() => { onChange(m); setOpen(false) }}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors',
                  m.id === value.id
                    ? 'bg-foreground text-background font-medium'
                    : 'hover:bg-accent',
                )}>
                {modeloLabel(m)}
                <span className="text-xs opacity-60">{m.versiones.length} versiones</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Toggle de versiones ───────────────────────────────────────────────────────

function VersionesToggle({
  versiones,
  selectedIds,
  onToggle,
}: {
  versiones: Version[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Versiones:</span>
      {versiones.map((v, idx) => {
        const active = selectedIds.includes(v.id)
        return (
          <button
            key={v.id}
            onClick={() => onToggle(v.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
              active
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground/40',
            )}>
            {v.nombre}
          </button>
        )
      })}
    </div>
  )
}

// ── Tabla comparadora ─────────────────────────────────────────────────────────

function ComparadorTabla({
  versiones,
  categoriaId,
  soloDiferencias,
}: {
  versiones: Version[]
  categoriaId: string
  soloDiferencias: boolean
}) {
  const catIds = categoriaId === 'todas'
    ? versiones[0].categorias.map((c) => c.id)
    : [categoriaId]

  return (
    <div className="rounded-xl border overflow-hidden">
      {catIds.map((catId, catIdx) => {
        const catRef = versiones[0].categorias.find((c) => c.id === catId)
        if (!catRef) return null

        // Build canonical label set from first version's category
        const rows = catRef.specs.map((spec) => {
          const valores = versiones.map((v) => {
            const cat = v.categorias.find((c) => c.id === catId)
            return cat?.specs.find((s) => s.label === spec.label)?.valor ?? '—'
          })
          const hayDiferencia = new Set(valores).size > 1
          return { label: spec.label, valores, hayDiferencia }
        })

        const rowsFiltrados = soloDiferencias ? rows.filter((r) => r.hayDiferencia) : rows
        if (rowsFiltrados.length === 0) return null

        return (
          <div key={catId}>
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
                className={cn('grid border-b last:border-b-0')}
                style={{ gridTemplateColumns: `200px repeat(${versiones.length}, 1fr)` }}>
                {/* Label */}
                <div
                  className={cn(
                    'px-4 py-2.5 text-xs text-muted-foreground border-r flex items-center gap-1.5',
                    rowIdx % 2 === 0 ? 'bg-muted/20' : '',
                    row.hayDiferencia && 'bg-amber-50/70 dark:bg-amber-950/25',
                  )}>
                  {row.hayDiferencia && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 inline-block" />
                  )}
                  {row.label}
                </div>

                {/* Valores */}
                {row.valores.map((valor, colIdx) => (
                  <div
                    key={colIdx}
                    className={cn(
                      'px-4 py-2.5 text-sm border-r last:border-r-0',
                      rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/10',
                      row.hayDiferencia && 'bg-amber-50/30 dark:bg-amber-950/10',
                      row.hayDiferencia && colIdx === versiones.length - 1 &&
                        'bg-green-50/70 dark:bg-green-950/20 font-medium text-green-700 dark:text-green-400',
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

const TODAS = { id: 'todas', nombre: 'Todas' }

export default function ComparadorClient() {
  const [modelo, setModelo] = useState<ModeloFicha>(MODELOS[0])
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    MODELOS[0].versiones.map((v) => v.id),
  )
  const [categoriaId, setCategoriaId] = useState('todas')
  const [soloDiferencias, setSoloDiferencias] = useState(false)

  const handleModeloChange = (m: ModeloFicha) => {
    setModelo(m)
    setSelectedIds(m.versiones.map((v) => v.id))
    setCategoriaId('todas')
    setSoloDiferencias(false)
  }

  const toggleVersion = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev
        return prev.filter((v) => v !== id)
      }
      return [...prev, id]
    })
  }

  const versionesSeleccionadas = useMemo(
    () => modelo.versiones.filter((v) => selectedIds.includes(v.id)),
    [modelo, selectedIds],
  )

  const categoriaTabs = useMemo(() => {
    if (versionesSeleccionadas.length === 0) return []
    return [TODAS, ...versionesSeleccionadas[0].categorias.map((c) => ({ id: c.id, nombre: c.nombre }))]
  }, [versionesSeleccionadas])

  const listo = versionesSeleccionadas.length >= 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Comparador de versiones</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Elige un auto y selecciona las versiones que quieras comparar.
        </p>
      </div>

      {/* Paso 1 — Modelo */}
      <div className="flex flex-wrap items-center gap-4">
        <ModeloSelector value={modelo} onChange={handleModeloChange} />

        {/* Paso 2 — Versiones */}
        <VersionesToggle
          versiones={modelo.versiones}
          selectedIds={selectedIds}
          onToggle={toggleVersion}
        />
      </div>

      {/* Filtros */}
      {listo && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Categorías */}
          <div className="flex items-center gap-1 flex-wrap">
            {categoriaTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaId(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  categoriaId === cat.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}>
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Solo diferencias — solo aplica cuando hay más de 1 versión */}
          {versionesSeleccionadas.length > 1 && <button
            onClick={() => setSoloDiferencias((v) => !v)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              soloDiferencias
                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-400'
                : 'bg-background border-border text-muted-foreground hover:text-foreground',
            )}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
            Solo diferencias
          </button>}
        </div>
      )}

      {/* Encabezados de columna */}
      {listo && (
        <div
          className="grid rounded-xl border bg-card overflow-hidden"
          style={{ gridTemplateColumns: `200px repeat(${versionesSeleccionadas.length}, 1fr)` }}>
          <div className="px-4 py-3 border-r text-xs text-muted-foreground font-medium">Especificación</div>
          {versionesSeleccionadas.map((v, idx) => (
            <div
              key={v.id}
              className={cn(
                'px-4 py-3 border-r last:border-r-0',
                idx === versionesSeleccionadas.length - 1 && 'bg-green-50/50 dark:bg-green-950/10',
              )}>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{modelo.modelo} {modelo.año}</div>
              <div className="text-sm font-bold">{v.nombre}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabla */}
      {listo ? (
        <ComparadorTabla
          versiones={versionesSeleccionadas}
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
            <p className="text-sm text-muted-foreground mt-1">
              Activa las versiones con los botones de arriba.
            </p>
          </div>
        </div>
      )}

      {/* Leyenda */}
      {listo && !soloDiferencias && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
          Las filas resaltadas indican especificaciones que difieren entre versiones. La última columna seleccionada se resalta en verde.
        </p>
      )}
    </div>
  )
}
