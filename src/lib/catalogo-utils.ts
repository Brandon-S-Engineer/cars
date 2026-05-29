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

function getKeywords(model: ModeloFicha): string[] {
  const name = model.modelo.toLowerCase()
  return SEARCH_OVERRIDES[name] ?? [name]
}

function detectPriceColIdx(headers: string[], rows: string[][]): number {
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].toLowerCase().includes('precio de lista')) return i
  }
  for (let i = 0; i < headers.length; i++) {
    const sample = rows.slice(0, 8).map((r) => r[i]?.trim()).filter(Boolean)
    const hits = sample.filter((v) => Number(v.replace(/[^0-9.]/g, '')) > 100_000)
    if (hits.length >= 2) return i
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

export function parseInventarioForCatalog(
  tabs: TabData[],
  models: ModeloFicha[],
): ModeloCatalogo[] {
  return models.map((model) => {
    const keywords = getKeywords(model)
    let minPrice = Infinity
    let unitCount = 0

    for (const tab of tabs) {
      if (tab.name === 'TRANSITO IMA/ AMSA') continue
      const descIdx = detectDescIdx(tab.headers)
      const priceIdx = detectPriceColIdx(tab.headers, tab.rows)
      if (descIdx < 0) continue

      for (const row of tab.rows) {
        const desc = (row[descIdx] ?? '').toLowerCase()
        if (!keywords.some((kw) => desc.includes(kw))) continue

        unitCount++
        if (priceIdx >= 0) {
          const price = Number((row[priceIdx] ?? '').replace(/[^0-9.]/g, ''))
          if (price > 100_000 && price < minPrice) minPrice = price
        }
      }
    }

    return {
      ficha: model,
      units: unitCount,
      precioDesde: minPrice === Infinity ? null : minPrice,
    }
  })
}
