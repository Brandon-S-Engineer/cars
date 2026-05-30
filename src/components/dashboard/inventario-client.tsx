'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, RefreshCw, Loader2, AlertCircle, ExternalLink, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useInventarioHighlight } from '@/lib/inventario-highlight-store'
import { type CarAnuncio, useAnunciador } from '@/lib/anunciador-store'

// ── Types ─────────────────────────────────────────────────────────────────────

type TabData = {
  name: string
  headers: string[]
  rows: string[][]
}

type InventarioData = {
  tabs: TabData[]
  lastSyncAt: string | null
  sheetUrl: string | null
}

type RowKind = 'demo' | 'demo-reservado' | 'normal' | 'reservado'
type ColRole = 'price' | 'vin' | 'eco' | 'other'

// ── Constants ─────────────────────────────────────────────────────────────────

const BRAND_ORDER = ['JEEP', 'MAINSTREAM', 'LCV', 'TRANSITO IMA/ AMSA']

const SORT_ORDER: Record<RowKind, number> = {
  demo: 0,
  'demo-reservado': 1,
  normal: 2,
  reservado: 3,
}

// Columns to always skip — row numbers and brand duplicates
const SKIP_COLS = new Set([
  'no', 'no.', 'n°', 'no..', 'marca', 'marca temporal',
])

// Columns that go at the tail (after all others)
const TAIL_COL_NAMES = new Set(['vin', 'eco'])

// Explicit display order for standard tabs (JEEP / MAINSTREAM / LCV)
// Anything not listed gets order 50 (middle)
const STANDARD_ORDER: Record<string, number> = {
  'precio de lista': 1,
  'precio oferta principal': 2,
  'precio contado': 3,
  'modelo': 4,
  'comentario': 5,
  'descripción....': 6,
  'color exterior': 7,
  'color interior': 8,
  'días': 9,
  'ubicación': 10,
  'status': 11,
  'fecha asignación': 12,
  'modelo y cepos': 13,
  'sucursal': 14,
  'vin': 90,
  'eco': 91,
}

// Transito columns to skip
const TRANSITO_SKIP = new Set(['no.', 'no', 'n°'])

// Priority order for TRANSITO columns
const TRANSITO_PRIORITY = ['unidad', 'color', 'marca', 'modelo', 'distribuidor', 'vin']

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'hace un momento'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)}d`
}

function classifyRow(row: string[]): RowKind {
  const flat = row.join(' ').toUpperCase()
  const demo = flat.includes('DEMO')
  const reservado = flat.includes('RESERVADO')
  if (demo && reservado) return 'demo-reservado'
  if (demo) return 'demo'
  if (reservado) return 'reservado'
  return 'normal'
}

function extractPrecioEspecial(val: string): string | null {
  const match = val.match(/\$\s*[\d,]+(?:\.\d+)?/)
  if (!match) return null
  const num = Number(match[0].replace(/[^0-9.]/g, ''))
  return num > 100_000 ? match[0] : null
}

function formatPrice(val: string): string {
  const num = Number(val.replace(/[^0-9.]/g, ''))
  if (!num) return val
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(num)
}

// ── Column logic ──────────────────────────────────────────────────────────────

// listaIdx: if set, this is the "Oferta" column — compare its value against listaIdx to decide display
type Col = { label: string; idx: number; role: ColRole; listaIdx?: number }

// Standard tabs: JEEP, MAINSTREAM, LCV
// NOTE: gviz strips headers from numeric/currency/date columns — they arrive as "".
// For named columns we trust the name. For empty-header columns we detect by value.
function buildStandardColumns(headers: string[], rows: string[][]): Col[] {
  let listaCol: { idx: number } | null = null
  let ofertaCol: { idx: number } | null = null
  const rest: Col[] = []

  headers.forEach((h, i) => {
    const trimmed = h.trim()
    const key = trimmed.toLowerCase()

    // ── Named column ──────────────────────────────────────────────────────────
    if (trimmed) {
      if (SKIP_COLS.has(key)) return
      if (key.includes('precio')) {
        if (key.includes('alterna') || key.includes('msi')) return
        if (!listaCol) { listaCol = { idx: i }; return }
        if (!ofertaCol) { ofertaCol = { idx: i }; return }
        return
      }
      const role: ColRole = key === 'vin' ? 'vin' : key === 'eco' ? 'eco' : 'other'
      rest.push({ label: trimmed, idx: i, role })
      return
    }

    // ── Empty header — detect from values (gviz omits headers for numeric cols) ─
    const sample = rows.slice(0, 10).map((r) => r[i]?.trim()).filter(Boolean)
    if (!sample.length) return

    // 1. Year: 4 digits, 1990–2040
    if (sample.every((v) => /^\d{4}$/.test(v)) && sample.map(Number).every((n) => n >= 1990 && n <= 2040)) {
      rest.push({ label: 'Modelo', idx: i, role: 'other' })
      return
    }
    // 2. Date: dd/mm/yyyy — must be BEFORE price to avoid stripping "/" and getting big number
    if (sample.some((v) => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v))) {
      rest.push({ label: 'F. Asignación', idx: i, role: 'other' })
      return
    }
    // 3. Price: values > 100k MXN
    const nums = sample.map((v) => Number(v.replace(/[^0-9.]/g, ''))).filter((n) => n > 100_000)
    if (nums.length > 0) {
      if (!listaCol) { listaCol = { idx: i }; return }
      if (!ofertaCol) { ofertaCol = { idx: i }; return }
      return
    }
    // 4. Eco: 4–6 digit internal code
    if (sample.every((v) => /^\d{4,6}$/.test(v))) {
      rest.push({ label: 'Eco', idx: i, role: 'eco' })
      return
    }
  })

  const listaSnap = listaCol as { idx: number } | null
  const ofertaSnap = ofertaCol as { idx: number } | null
  const displayPrice: Col[] = []
  if (listaSnap) {
    displayPrice.push({ label: 'Precio', idx: listaSnap.idx, role: 'price' })
    if (ofertaSnap) {
      displayPrice.push({ label: 'Oferta', idx: ofertaSnap.idx, role: 'price', listaIdx: listaSnap.idx })
    }
  } else if (ofertaSnap) {
    displayPrice.push({ label: 'Precio', idx: ofertaSnap.idx, role: 'price' })
  }

  // Safety net: if still no price found, look for any column with large numeric values
  if (displayPrice.length === 0) {
    headers.forEach((h, i) => {
      if (displayPrice.length >= 2) return
      const sample = rows.slice(0, 5).map((r) => r[i]?.trim()).filter(Boolean)
      const nums = sample.map((v) => Number(v.replace(/[^0-9.]/g, ''))).filter((n) => n > 100_000)
      if (nums.length > 0) {
        if (displayPrice.length === 0) displayPrice.push({ label: 'Precio', idx: i, role: 'price' })
        else displayPrice.push({ label: 'Oferta', idx: i, role: 'price', listaIdx: displayPrice[0].idx })
      }
    })
  }

  rest.sort((a, b) =>
    (STANDARD_ORDER[a.label.toLowerCase()] ?? 50) - (STANDARD_ORDER[b.label.toLowerCase()] ?? 50)
  )

  return [...displayPrice, ...rest]
}

// TRANSITO IMA/ AMSA: different schema, priority columns first then the rest
function buildTransitoColumns(headers: string[]): Col[] {
  const all = headers.flatMap((h, i) => {
    const key = h.toLowerCase().trim()
    if (TRANSITO_SKIP.has(key) || !key) return []
    return [{ label: h.trim(), idx: i, role: 'other' as ColRole }]
  })
  const priority: Col[] = []
  const rest: Col[] = []
  for (const col of all) {
    const key = col.label.toLowerCase().trim()
    const rank = TRANSITO_PRIORITY.indexOf(key)
    if (rank >= 0) priority[rank] = col
    else rest.push(col)
  }
  return [...priority.filter(Boolean), ...rest]
}

// ── Row styling ───────────────────────────────────────────────────────────────

function rowStyle(kind: RowKind, even: boolean): string {
  if (kind === 'normal') {
    return even
      ? 'bg-gray-100 dark:bg-white/[0.07] hover:bg-gray-200/70 dark:hover:bg-white/[0.11]'
      : 'bg-white dark:bg-transparent hover:bg-gray-100/80 dark:hover:bg-white/[0.05]'
  }
  if (kind === 'demo') {
    return even
      ? 'border-l-4 border-l-blue-400 bg-blue-100/60 dark:bg-blue-950/35 hover:bg-blue-100/70'
      : 'border-l-4 border-l-blue-400 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/60'
  }
  if (kind === 'demo-reservado') {
    return even
      ? 'border-l-4 border-l-violet-400 bg-violet-100/60 dark:bg-violet-950/35 hover:bg-violet-100/70'
      : 'border-l-4 border-l-violet-400 bg-violet-50/40 dark:bg-violet-950/20 hover:bg-violet-50/60'
  }
  // reservado
  return even
    ? 'border-l-4 border-l-amber-400 bg-amber-100/60 dark:bg-amber-950/35 hover:bg-amber-100/70'
    : 'border-l-4 border-l-amber-400 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/60'
}

// ── No data state ─────────────────────────────────────────────────────────────

function NoDataState() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
        <Car className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center max-w-sm">
        <h2 className="text-lg font-semibold">Sin datos de inventario</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Abre el Google Sheet del inventario en Chrome. La extensión sincronizará
          los datos automáticamente en unos segundos.
        </p>
      </div>
      <div className="rounded-lg border bg-muted/40 px-5 py-4 text-sm space-y-1.5 max-w-sm w-full">
        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Cómo instalar la extensión
        </p>
        <p>1. Abre <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">chrome://extensions</span></p>
        <p>2. Activa <span className="font-medium">Modo desarrollador</span> (arriba a la derecha)</p>
        <p>3. Clic en <span className="font-medium">Cargar sin empaquetar</span></p>
        <p>4. Selecciona la carpeta <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">extension/</span></p>
        <p>5. Abre el sheet — sincroniza solo.</p>
      </div>
    </div>
  )
}

// ── Brand table ───────────────────────────────────────────────────────────────

function BrandTable({ tab, search, highlightRow, onRowClick }: { tab: TabData; search: string; highlightRow: number | null; onRowClick: (car: CarAnuncio) => void }) {
  const isTransito = tab.name === 'TRANSITO IMA/ AMSA'
  const [filterKind, setFilterKind] = useState<RowKind | null>(null)

  useEffect(() => { setFilterKind(null) }, [tab.name])

  const cols = useMemo(
    () => isTransito ? buildTransitoColumns(tab.headers) : buildStandardColumns(tab.headers, tab.rows),
    [tab, isTransito]
  )

  // Assign stable # per row based on sorted order
  const sortedNumbered = useMemo(
    () =>
      [...tab.rows]
        .sort((a, b) => SORT_ORDER[classifyRow(a)] - SORT_ORDER[classifyRow(b)])
        .map((row, i) => ({ row, num: i + 1, kind: classifyRow(row) })),
    [tab.rows]
  )

  const filtered = useMemo(() => {
    const bySearch = !search.trim()
      ? sortedNumbered
      : sortedNumbered.filter(({ row }) => row.some((c) => c?.toLowerCase().includes(search.toLowerCase())))
    if (!filterKind) return bySearch
    return bySearch.filter(({ kind }) => kind === filterKind)
  }, [sortedNumbered, search, filterKind])

  const counts = useMemo(() => {
    const c = { demo: 0, 'demo-reservado': 0, normal: 0, reservado: 0 }
    tab.rows.forEach((r) => c[classifyRow(r)]++)
    return c
  }, [tab.rows])

  const toggleFilter = (kind: RowKind) => setFilterKind((prev) => (prev === kind ? null : kind))

  return (
    <div className="space-y-3">
      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterKind(null)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            !filterKind ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.rows.length} unidades
        </button>
        {counts.demo > 0 && (
          <button
            onClick={() => toggleFilter('demo')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filterKind === 'demo' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-400 shrink-0" />
            {counts.demo} demo disponible
          </button>
        )}
        {counts['demo-reservado'] > 0 && (
          <button
            onClick={() => toggleFilter('demo-reservado')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filterKind === 'demo-reservado' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="inline-block w-3 h-3 rounded-sm bg-violet-400 shrink-0" />
            {counts['demo-reservado']} demo apartado
          </button>
        )}
        {counts.normal > 0 && (
          <button
            onClick={() => toggleFilter('normal')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filterKind === 'normal' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="inline-block w-3 h-3 rounded-sm bg-gray-400 shrink-0" />
            {counts.normal} disponible
          </button>
        )}
        {counts.reservado > 0 && (
          <button
            onClick={() => toggleFilter('reservado')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filterKind === 'reservado' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="inline-block w-3 h-3 rounded-sm bg-amber-400 shrink-0" />
            {counts.reservado} apartado
          </button>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-3 text-left font-medium text-muted-foreground w-10">#</th>
              {cols.map((col) => (
                <th
                  key={col.idx}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap',
                    col.role === 'price' && 'text-right'
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={cols.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron unidades.
                </td>
              </tr>
            ) : (
              filtered.map(({ row, num, kind }) => (
                <tr
                  key={num}
                  data-row-num={num}
                  onClick={() => {
                    const getByLabel = (kw: string) => {
                      const col = cols.find((c) => c.label.toLowerCase().includes(kw))
                      return col ? (row[col.idx]?.trim() || null) : null
                    }
                    const precioCol = cols.find((c) => c.role === 'price' && c.listaIdx === undefined)
                    const ofertaCol = cols.find((c) => c.listaIdx !== undefined)
                    const listaRaw = precioCol ? (row[precioCol.idx] ?? '') : ''
                    const ofertaRaw = ofertaCol ? (row[ofertaCol.idx] ?? '') : ''
                    const listaNum = Number(listaRaw.replace(/[^0-9.]/g, ''))
                    const ofertaNum = Number(ofertaRaw.replace(/[^0-9.]/g, ''))
                    const añoCol = cols.find((c) => c.label === 'Modelo')
                    const comentarioRaw = getByLabel('comentario')
                    onRowClick({
                      tab: tab.name,
                      num,
                      descripcion: getByLabel('descrip') ?? getByLabel('modelo y'),
                      año: añoCol ? (row[añoCol.idx]?.trim() || null) : null,
                      precio: listaNum > 0 ? listaRaw : null,
                      oferta: ofertaNum > 0 && ofertaNum !== listaNum ? ofertaRaw : null,
                      precioEspecial: comentarioRaw ? extractPrecioEspecial(comentarioRaw) : null,
                      colorExt: getByLabel('color ext'),
                      colorInt: getByLabel('color int'),
                      sucursal: getByLabel('sucursal') ?? getByLabel('ubicac'),
                      status: kind,
                    })
                  }}
                  className={cn(
                    'border-b last:border-0 transition-colors cursor-pointer',
                    num === highlightRow ? 'row-flash' : rowStyle(kind, num % 2 === 0),
                  )}
                >
                  <td className="px-3 py-2.5 text-xs text-muted-foreground font-mono">{num}</td>
                  {cols.map((col) => {
                    const val = row[col.idx] ?? ''
                    const empty = val === '' || val === '-'

                    // Oferta column: compare numeric value against the lista price
                    if (col.listaIdx !== undefined) {
                      const listaNum = Number((row[col.listaIdx] ?? '').replace(/[^0-9.]/g, ''))
                      const ofertaNum = Number(val.replace(/[^0-9.]/g, ''))
                      const same = !ofertaNum || listaNum === ofertaNum
                      return (
                        <td key={col.idx} className="px-4 py-2.5 whitespace-nowrap text-sm text-right tabular-nums">
                          {same
                            ? <span className="text-muted-foreground/30">—</span>
                            : <span className="text-green-600 font-semibold">{formatPrice(val)}</span>
                          }
                        </td>
                      )
                    }

                    const esComentario = col.label.toLowerCase() === 'comentario'
                    const esComentarioConPrecio = esComentario && !empty && !!extractPrecioEspecial(val)
                    const priceMatch = esComentarioConPrecio ? val.match(/\$\s*[\d,]+(?:\.\d+)?/) : null

                    return (
                      <td
                        key={col.idx}
                        className={cn(
                          'px-4 py-2.5 text-sm',
                          esComentario ? 'w-48 max-w-[12rem] whitespace-normal break-words align-top' : 'whitespace-nowrap',
                          col.role === 'price' && 'text-right font-medium tabular-nums',
                          (col.role === 'vin' || col.role === 'eco') && 'font-mono text-xs text-muted-foreground',
                          priceMatch && 'bg-amber-50 dark:bg-amber-950/30',
                        )}
                      >
                        {empty ? (
                          <span className="text-muted-foreground/30">—</span>
                        ) : col.role === 'price' ? (
                          formatPrice(val)
                        ) : priceMatch ? (
                          <>
                            {val.slice(0, priceMatch.index)}
                            <span className="text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                              {priceMatch[0]}
                            </span>
                            {val.slice(priceMatch.index! + priceMatch[0].length)}
                          </>
                        ) : (
                          val
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function InventarioClient() {
  const router = useRouter()
  const setCar = useAnunciador((s) => s.setCar)
  const [data, setData] = useState<InventarioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [highlightRow, setHighlightRow] = useState<number | null>(null)
  const { tab: hlTab, rowNum: hlRowNum, clearHighlight } = useInventarioHighlight()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  const fetchInventario = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/inventario')
      if (res.status === 404) { setData(null); return }
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSheetSync = useCallback(() => {
    if (!data?.sheetUrl) return
    window.open(data.sheetUrl, '_blank')
    setSyncing(true)
    const prevSyncAt = data.lastSyncAt
    const startedAt = Date.now()

    const id = setInterval(async () => {
      if (Date.now() - startedAt > 20_000) {
        clearInterval(id)
        setSyncing(false)
        return
      }
      try {
        const res = await fetch('/api/inventario')
        if (!res.ok) return
        const fresh = await res.json()
        if (fresh.lastSyncAt !== prevSyncAt) {
          clearInterval(id)
          setSyncing(false)
          setData(fresh)
        }
      } catch {}
    }, 3000)
  }, [data])

  useEffect(() => { fetchInventario() }, [fetchInventario])

  const orderedTabs = useMemo(() => {
    if (!data?.tabs) return []
    const map = new Map(data.tabs.map((t) => [t.name, t]))
    const result: TabData[] = []
    for (const name of BRAND_ORDER) {
      if (map.has(name)) result.push(map.get(name)!)
    }
    for (const tab of data.tabs) {
      if (!BRAND_ORDER.includes(tab.name)) result.push(tab)
    }
    return result
  }, [data])

  // React to store highlight (Zustand — works cross-component, no event timing issues)
  useEffect(() => {
    if (!hlTab || !hlRowNum || !orderedTabs.length) return
    const idx = orderedTabs.findIndex((t) => t.name === hlTab)
    if (idx >= 0) setActiveTab(idx)
    setHighlightRow(hlRowNum)
    clearHighlight()
  }, [hlTab, hlRowNum, orderedTabs, clearHighlight])

  // Scroll to highlighted row then clear after animation
  useEffect(() => {
    if (!highlightRow) return
    const scroll = setTimeout(() => {
      document.querySelector(`[data-row-num="${highlightRow}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    const clear = setTimeout(() => setHighlightRow(null), 2500)
    return () => { clearTimeout(scroll); clearTimeout(clear) }
  }, [highlightRow])

  const totalUnits = useMemo(() => orderedTabs.reduce((s, t) => s + t.rows.length, 0), [orderedTabs])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando inventario...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Error al cargar. ¿Está corriendo el servidor?</p>
        <Button onClick={() => fetchInventario()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-1" /> Reintentar
        </Button>
      </div>
    )
  }

  if (!data || orderedTabs.length === 0) return <NoDataState />

  const currentTab = orderedTabs[Math.min(activeTab, orderedTabs.length - 1)]

  return (
    <div className="space-y-5">
      {/* Sticky header + tabs */}
      <div className="sticky top-14 z-20 bg-sidebar -mx-6 md:-mx-8 px-6 md:px-8 pt-5 pb-0">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              {totalUnits} unidades totales
              {data.lastSyncAt && (
                <span className="text-xs">· sincronizado {timeAgo(data.lastSyncAt)}</span>
              )}
              {data.sheetUrl && (
                <button
                  title={syncing ? 'Esperando sincronización...' : 'Abrir Google Sheet y sincronizar'}
                  onClick={handleSheetSync}
                  disabled={syncing}
                  className="inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted-foreground/20 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  {syncing
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <ExternalLink className="h-3.5 w-3.5" />}
                </button>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar VIN, modelo, color..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Brand tabs */}
        <div className="border-b flex gap-0 overflow-x-auto mt-4">
          {orderedTabs.map((tab, i) => (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(i); setSearch('') }}
              className={cn(
                'px-5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                i === activeTab
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.name}
              <span className="ml-2 text-xs text-muted-foreground">{tab.rows.length}</span>
            </button>
          ))}
        </div>
      </div>

      <BrandTable
        tab={currentTab}
        search={search}
        highlightRow={highlightRow}
        onRowClick={(car) => { setCar(car); router.push('/dashboard/anunciador') }}
      />

      {/* Scroll to top */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-20 z-50 h-12 w-12 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:opacity-75 transition-opacity"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
