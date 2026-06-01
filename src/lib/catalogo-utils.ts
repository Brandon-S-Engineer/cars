import type { ModeloFicha } from './fichas-data'

// ── WhatsApp ──────────────────────────────────────────────────────────────────

export const WA_NUMBER = '525581631195'
export const waUrl = (msg?: string) =>
  msg
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/${WA_NUMBER}`

// ── Types ─────────────────────────────────────────────────────────────────────

export type TabData = { name: string; headers: string[]; rows: string[][] }

export type ModeloCatalogo = {
  ficha: ModeloFicha
  units: number
  precioDesde: number | null
  precioEspecial: number | null
  preciosPorVersion: Record<string, number | null>
}

// ── Brand visuals ─────────────────────────────────────────────────────────────

export const BRAND_STYLES: Record<string, { gradient: string; text: string }> = {
  Jeep:    { gradient: 'from-green-800 to-green-950',   text: 'text-green-300' },
  RAM:     { gradient: 'from-red-800 to-red-950',       text: 'text-red-300' },
  Fiat:    { gradient: 'from-orange-700 to-orange-950', text: 'text-orange-300' },
  Peugeot: { gradient: 'from-blue-700 to-blue-950',     text: 'text-blue-300' },
  Dodge:   { gradient: 'from-gray-700 to-gray-950',     text: 'text-gray-300' },
}

export function getBrandStyle(marca: string) {
  return BRAND_STYLES[marca] ?? { gradient: 'from-slate-700 to-slate-950', text: 'text-slate-300' }
}

// ── Formatting ────────────────────────────────────────────────────────────────

export function formatMXN(num: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(num)
}

// ── Inventory parsing ─────────────────────────────────────────────────────────

const SEARCH_OVERRIDES: Record<string, string[]> = {
  'jt':           ['gladiator', 'jt'],
  'pulse abarth': ['pulse'],
}

// Per-version keyword matching — include: all must match, exclude: none may match
type VersionMatch = { include: string[]; exclude?: string[] }

const VERSION_OVERRIDES: Record<string, VersionMatch> = {
  'rubicon 4 puertas': { include: ['rubicon', 'unlimited'] },
  'rubicon 2 puertas': { include: ['rubicon'], exclude: ['unlimited'] },
  'limited l 4x4':     { include: ['limited l'] },
  'limited "s"':       { include: ['limited'] },
}

const VERSION_IGNORE = new Set(['4x2','4x4','fwd','awd','4p','2p'])

function getVersionMatch(nombre: string): VersionMatch {
  const key = nombre.toLowerCase()
  if (VERSION_OVERRIDES[key]) return VERSION_OVERRIDES[key]
  const words = key.split(/\s+/).filter(w => w.length > 1 && !VERSION_IGNORE.has(w) && !/^\d/.test(w))
  return { include: words }
}

function matchesVersion(desc: string, match: VersionMatch): boolean {
  const d = desc.toLowerCase()
  return match.include.every(w => d.includes(w)) && !(match.exclude?.some(w => d.includes(w)) ?? false)
}

function getKeywords(model: ModeloFicha): string[] {
  const name = model.modelo.toLowerCase()
  return SEARCH_OVERRIDES[name] ?? [name]
}

function detectPriceColIdx(headers: string[], rows: string[][]): number {
  // Pass 1: named "precio" columns (mirrors buildStandardColumns in inventario-client)
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase()
    if (h.includes('precio') && !h.includes('alterna') && !h.includes('msi')) return i
  }
  // Pass 2: empty-header columns (gviz strips headers for numeric/currency cols)
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].trim()) continue
    const sample = rows.slice(0, 10).map((r) => r[i]?.trim()).filter(Boolean)
    if (!sample.length) continue
    if (sample.every((v) => /^\d{4}$/.test(v))) continue               // year col
    if (sample.some((v) => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v))) continue // date col
    if (sample.every((v) => /^\d{4,6}$/.test(v))) continue              // eco/code col
    const nums = sample.map((v) => Number(v.replace(/[^0-9.]/g, ''))).filter((n) => n > 100_000 && n < 10_000_000)
    if (nums.length > 0) return i
  }
  return -1
}

function detectDescIdx(headers: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase()
    if (h.includes('descrip') || h.includes('modelo y')) return i
  }
  return -1
}

function detectComentarioIdx(headers: string[]): number {
  return headers.findIndex((h) => h.toLowerCase().includes('comentario'))
}

function extractPrecioFromComentario(val: string): number | null {
  const match = val.match(/\$\s*[\d,]+(?:\.\d+)?/)
  if (!match) return null
  const num = Number(match[0].replace(/[^0-9.]/g, ''))
  return num > 100_000 && num < 10_000_000 ? num : null
}

export function parseInventarioForCatalog(
  tabs: TabData[],
  models: ModeloFicha[],
): ModeloCatalogo[] {
  return models.map((model) => {
    const keywords = getKeywords(model)
    let minPrice = Infinity
    let unitCount = 0
    let minEspecial = Infinity

    // Per-version min prices
    const versionMatches = model.versiones.map(v => ({ id: v.id, match: getVersionMatch(v.nombre) }))
    const versionMins: Record<string, number> = {}

    for (const tab of tabs) {
      if (tab.name === 'TRANSITO IMA/ AMSA') continue
      const descIdx = detectDescIdx(tab.headers)
      const priceIdx = detectPriceColIdx(tab.headers, tab.rows)
      const comentIdx = detectComentarioIdx(tab.headers)
      if (descIdx < 0) continue

      for (const row of tab.rows) {
        const desc = (row[descIdx] ?? '').toLowerCase()
        if (!keywords.some((kw) => desc.includes(kw))) continue

        unitCount++
        const price = priceIdx >= 0 ? Number((row[priceIdx] ?? '').replace(/[^0-9.]/g, '')) : 0
        const validPrice = price > 100_000 && price < 10_000_000

        if (validPrice && price < minPrice) minPrice = price

        if (comentIdx >= 0) {
          const especial = extractPrecioFromComentario(row[comentIdx] ?? '')
          if (especial && especial < minEspecial) minEspecial = especial
        }

        if (validPrice) {
          for (const { id, match } of versionMatches) {
            if (matchesVersion(desc, match)) {
              if (!versionMins[id] || price < versionMins[id]) versionMins[id] = price
            }
          }
        }
      }
    }

    const preciosPorVersion: Record<string, number | null> = {}
    for (const v of model.versiones) {
      preciosPorVersion[v.id] = versionMins[v.id] ?? null
    }

    return {
      ficha: model,
      units: unitCount,
      precioDesde: minPrice === Infinity ? null : minPrice,
      precioEspecial: minEspecial === Infinity ? null : minEspecial,
      preciosPorVersion,
    }
  })
}
