import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(50),
})

type TabData = { name: string; headers: string[]; rows: string[][] }

// ── OpenAI helpers ────────────────────────────────────────────────────────────

const openaiHeaders = (key: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${key}`,
})

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  'X-Accel-Buffering': 'no',
}

// ── Tool definition ───────────────────────────────────────────────────────────

const INVENTORY_TOOL = {
  type: 'function',
  function: {
    name: 'buscar_inventario',
    description: 'Busca unidades de autos en el inventario por modelo, color exterior, marca u otros criterios. Úsala siempre que un cliente pregunte por disponibilidad.',
    parameters: {
      type: 'object',
      properties: {
        modelo: {
          type: 'string',
          description: 'Nombre del modelo (ej: Compass, Wrangler, Gladiator). Puede ser parcial.',
        },
        color_exterior: {
          type: 'string',
          description: 'Color exterior del vehículo (ej: azul, negro, blanco). Puede ser parcial.',
        },
        marca: {
          type: 'string',
          description: 'Tab del inventario: JEEP, MAINSTREAM, LCV, o TRANSITO IMA/ AMSA',
        },
        excluir_reservados: {
          type: 'boolean',
          description: 'Si es true, omite unidades marcadas como RESERVADO',
        },
      },
      required: [],
    },
  },
}

// ── Color synonyms ────────────────────────────────────────────────────────────
// Maps a user color query (any language/variant) to the terms to search for

const COLOR_SYNONYMS: Record<string, string[]> = {
  // Azul — HYDRO BLUE, AZUL JAZZ, AZUL INGARO, AZUL LIBECCI
  azul:      ['BLUE', 'AZUL'],
  blue:      ['BLUE', 'AZUL'],

  // Rojo — RED HOT, ROJO GRANATE, ROJO DINAMITA, ROJO COLORADO, ROJO MONTECARLO, ROJO MONTE CARLO
  rojo:      ['RED', 'ROJO'],
  red:       ['RED', 'ROJO'],

  // Negro — NEGRO DIAMANTE, NEGRO CARBON, NEGRO BRILLANTE, NEGRO VESUBIO, NEGRO
  negro:     ['NEGRO', 'BLACK'],
  black:     ['NEGRO', 'BLACK'],

  // Blanco — BLANCO BRILLANTE, BLANCO POLAR, BLANCO BANCHISA, BLANCO OKENITE, BLANCO ICY, BLANCO NACARADO
  blanco:    ['BLANCO', 'WHITE'],
  white:     ['BLANCO', 'WHITE'],

  // Gris — GRIS BALTICO, GRIS FERROSO, GRIS MANTARRAYA, GRIS SILVERSTONE, GRIS ARTENSE,
  //         GRIS SELENIUM, GRIS PLATINIUM, GRIS TITANEO, GRIS CINZA STRATO, GRIS CUARZO METALICO
  //         + GRANITO (gris piedra)
  gris:      ['GRIS', 'GRAY', 'GREY', 'GRANITO'],
  gray:      ['GRIS', 'GRAY', 'GREY', 'GRANITO'],
  grey:      ['GRIS', 'GRAY', 'GREY', 'GRANITO'],
  granito:   ['GRANITO'],

  // Plata — PLATA METALICO, PLATA MARTILLADO, PLATA ESTELA, PLATA ESTELAR, PLATA BARI
  plata:     ['PLATA', 'SILVER', 'PLATINUM'],
  plateado:  ['PLATA', 'SILVER', 'PLATINUM'],
  silver:    ['PLATA', 'SILVER', 'PLATINUM'],

  // Dorado — SLASH GOLD, SLASCH GOLD (typo en la hoja)
  dorado:    ['GOLD', 'SLASH', 'SLASCH'],
  gold:      ['GOLD', 'SLASH', 'SLASCH'],

  // Verde — VERDE MOJITO
  verde:     ['VERDE', 'GREEN'],
  green:     ['VERDE', 'GREEN'],

  // Beige — BEIGE 1941
  beige:     ['BEIGE', 'CREMA', 'CREAM'],
  crema:     ['BEIGE', 'CREMA', 'CREAM'],

  // Resto
  naranja:   ['NARANJA', 'ORANGE'],
  orange:    ['NARANJA', 'ORANGE'],
  amarillo:  ['AMARILLO', 'YELLOW'],
  yellow:    ['AMARILLO', 'YELLOW'],
  cafe:      ['CAFE', 'BROWN', 'COGNAC'],
  marron:    ['CAFE', 'BROWN', 'COGNAC'],
  brown:     ['CAFE', 'BROWN', 'COGNAC'],
  morado:    ['MORADO', 'PURPLE', 'VIOLET'],
  purple:    ['MORADO', 'PURPLE', 'VIOLET'],
}

function colorTerms(query: string): string[] {
  return COLOR_SYNONYMS[query.toLowerCase().trim()] ?? [query.toUpperCase()]
}

// ── Search function (runs in code, not by AI) ─────────────────────────────────

type RowKind = 'demo' | 'demo-reservado' | 'normal' | 'reservado'
const KIND_ORDER: Record<RowKind, number> = { demo: 0, 'demo-reservado': 1, normal: 2, reservado: 3 }

function rowKind(row: string[]): RowKind {
  const flat = row.join(' ').toUpperCase()
  const demo = flat.includes('DEMO')
  const reservado = flat.includes('RESERVADO')
  if (demo && reservado) return 'demo-reservado'
  if (demo) return 'demo'
  if (reservado) return 'reservado'
  return 'normal'
}

function ejecutarBusqueda(
  tabs: TabData[],
  args: { modelo?: string; color_exterior?: string; marca?: string; excluir_reservados?: boolean },
): string {
  const { modelo, color_exterior, marca, excluir_reservados } = args
  const resultados: string[] = []

  for (const tab of tabs) {
    if (marca && !tab.name.toUpperCase().includes(marca.toUpperCase())) continue

    const colorExtIdx = tab.headers.findIndex((h) => h.toLowerCase().includes('color ext'))
    const colorIntIdx = tab.headers.findIndex((h) => h.toLowerCase().includes('color int'))
    const sucursalIdx = tab.headers.findIndex((h) => {
      const k = h.toLowerCase()
      return k.includes('sucursal') || k.includes('ubicac')
    })
    const descripIdx = tab.headers.findIndex((h) => {
      const k = h.toLowerCase()
      return k.includes('descrip') || k.includes('modelo y')
    })

    // Detect price columns: named headers first, then empty headers by value > 100k
    let precioIdx = -1
    let ofertaIdx = -1
    tab.headers.forEach((h, i) => {
      const k = h.toLowerCase()
      if (k.includes('precio') && !k.includes('alterna') && !k.includes('msi')) {
        if (precioIdx === -1) precioIdx = i
        else if (ofertaIdx === -1) ofertaIdx = i
      }
    })
    if (precioIdx === -1) {
      // Empty headers — detect by value in first few rows
      tab.rows.slice(0, 5).forEach((r) => {
        tab.headers.forEach((h, i) => {
          if (h.trim()) return
          const num = Number((r[i] ?? '').replace(/[^0-9.]/g, ''))
          if (num > 100_000) {
            if (precioIdx === -1) precioIdx = i
            else if (ofertaIdx === -1 && i !== precioIdx) ofertaIdx = i
          }
        })
      })
    }

    // Sort same as dashboard: demo → demo-reservado → normal → reservado
    const sorted = [...tab.rows].sort((a, b) => KIND_ORDER[rowKind(a)] - KIND_ORDER[rowKind(b)])

    // Number rows BEFORE filtering, same as the dashboard table
    const numbered = sorted.map((row, i) => ({ row, num: i + 1 }))

    for (const { row, num } of numbered) {
      const flat = row.join(' ').toUpperCase()

      if (modelo && !flat.includes(modelo.toUpperCase())) continue

      if (color_exterior) {
        const haystack = (colorExtIdx >= 0 ? (row[colorExtIdx] ?? '') : flat).toUpperCase()
        const terms = colorTerms(color_exterior)
        if (!terms.some((t) => haystack.includes(t))) continue
      }

      const kind = rowKind(row)
      if (excluir_reservados && (kind === 'reservado' || kind === 'demo-reservado')) continue

      const status =
        kind === 'demo-reservado' ? '[DEMO — RESERVADO por otro cliente]'
        : kind === 'demo' ? '[DEMO disponible]'
        : kind === 'reservado' ? '[RESERVADO por otro cliente]'
        : '[DISPONIBLE]'

      const listaNum = precioIdx >= 0 ? Number((row[precioIdx] ?? '').replace(/[^0-9.]/g, '')) : 0
      const ofertaNum = ofertaIdx >= 0 ? Number((row[ofertaIdx] ?? '').replace(/[^0-9.]/g, '')) : 0
      const fmt = (n: number) => n > 0 ? `$${n.toLocaleString('es-MX')}` : null

      const parts: string[] = [`${tab.name} #${num}`]
      if (descripIdx >= 0 && row[descripIdx]?.trim()) parts.push(`nombre:${row[descripIdx].trim()}`)
      if (listaNum > 0) parts.push(`precio:${fmt(listaNum)}`)
      if (ofertaNum > 0 && ofertaNum !== listaNum) parts.push(`oferta:${fmt(ofertaNum)}`)
      if (sucursalIdx >= 0 && row[sucursalIdx]?.trim()) parts.push(`sucursal:${row[sucursalIdx].trim()}`)
      row.forEach((v, i) => {
        if (i === descripIdx || i === sucursalIdx || i === precioIdx || i === ofertaIdx) return
        const val = v?.trim()
        if (!val) return
        if (i === colorExtIdx) parts.push(`ext:${val}`)
        else if (i === colorIntIdx) parts.push(`int:${val}`)
        else parts.push(val)
      })
      parts.push(status)
      resultados.push(parts.join(' · '))
    }
  }

  if (resultados.length === 0) return 'No se encontraron unidades con esos criterios.'
  const total = resultados.length
  const muestra = resultados.slice(0, 20)
  const extra = total > 20 ? `\n(${total - 20} unidades adicionales — afina los criterios para ver menos)` : ''
  return `${total} unidad(es) encontrada(s):\n${muestra.join('\n')}${extra}`
}

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres un asistente de ventas para Edith Soria, vendedora en Interlomas Mundo Automotriz / Grupo Automundo.
Tu trabajo es ayudarle a responder preguntas de clientes sobre disponibilidad de autos de forma rápida y precisa.

REGLAS:
- Cuando un cliente pregunte por un auto, SIEMPRE llama a buscar_inventario antes de responder. Nunca respondas sobre disponibilidad sin haberla consultado.
- Al presentar resultados: incluye la referencia exacta, el nombre del auto (nombre:), precio (precio:), precio de oferta si existe y es diferente (oferta:), color exterior, color interior, sucursal y status.
- IMPORTANTE: la referencia viene como "NOMBRE_TABLA #número" (ej: "JEEP #11", "MAINSTREAM #5", "TRANSITO IMA/ AMSA #394"). Copia SIEMPRE el nombre exacto de la tabla que aparece antes del # — nunca lo sustituyas por otro.
- Los colores están etiquetados ext: (exterior) e int: (interior). La sucursal aparece como sucursal:XXXX.
- Unidades [RESERVADO por otro cliente]: ya están apartadas, no contarlas como disponibles — mencionarlo claramente.
- Unidades [DEMO disponible]: son de exhibición pero también se venden.
- Si no hay match exacto, sugiere lo más similar del inventario.
- Responde en español, breve y directo como WhatsApp.
- Si la pregunta no es sobre autos o el negocio, di: "Solo puedo ayudar con preguntas sobre el inventario de Automundo."`

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 503 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const config = await prisma.inventarioConfig.findUnique({ where: { id: 'singleton' } })
  let tabs: TabData[] = []
  if (config?.cachedCsv) {
    try { tabs = JSON.parse(config.cachedCsv) } catch {}
  }

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...parsed.data.messages]

  // ── Call 1: detect tool use (non-streaming, fast) ──────────────────────────
  const res1 = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: openaiHeaders(apiKey),
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      tools: [INVENTORY_TOOL],
      tool_choice: 'auto',
      max_tokens: 512,
    }),
  })

  if (!res1.ok) {
    const err = await res1.json().catch(() => ({}))
    return NextResponse.json({ error: (err as { error?: { message?: string } })?.error?.message ?? 'OpenAI error' }, { status: 502 })
  }

  const data1 = await res1.json()
  const choice = data1.choices[0]

  // ── Tool call path ─────────────────────────────────────────────────────────
  if (choice.finish_reason === 'tool_calls') {
    const toolCall = choice.message.tool_calls[0]
    let args: Parameters<typeof ejecutarBusqueda>[1] = {}
    try { args = JSON.parse(toolCall.function.arguments) } catch {}

    const searchResult = ejecutarBusqueda(tabs, args)

    const res2 = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: openaiHeaders(apiKey),
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: true,
        max_tokens: 1024,
        messages: [
          ...messages,
          choice.message,
          { role: 'tool', tool_call_id: toolCall.id, content: searchResult },
        ],
      }),
    })

    if (!res2.ok) {
      const err = await res2.json().catch(() => ({}))
      return NextResponse.json({ error: (err as { error?: { message?: string } })?.error?.message ?? 'OpenAI error' }, { status: 502 })
    }

    return new Response(res2.body, { headers: SSE_HEADERS })
  }

  // ── Direct answer (no tool needed — e.g. greetings) — re-call streaming ───
  const res3 = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: openaiHeaders(apiKey),
    body: JSON.stringify({ model: 'gpt-4o-mini', stream: true, max_tokens: 1024, messages }),
  })

  if (!res3.ok) {
    const err = await res3.json().catch(() => ({}))
    return NextResponse.json({ error: (err as { error?: { message?: string } })?.error?.message ?? 'OpenAI error' }, { status: 502 })
  }

  return new Response(res3.body, { headers: SSE_HEADERS })
}
