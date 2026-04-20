'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

// ─── LineChart ──────────────────────────────────────────────────────────────

interface LineChartProps {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  height?: number
  accent?: string
  showDots?: boolean
  gradient?: boolean
  yFormatter?: (v: number) => string
}

export function LineChart({
  data,
  xKey,
  yKey,
  height = 260,
  accent,
  showDots = true,
  gradient = true,
  yFormatter = (v) => String(v),
}: LineChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(600)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width)
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const pad = { l: 44, r: 16, t: 16, b: 28 }
  const iw = Math.max(100, w - pad.l - pad.r)
  const ih = height - pad.t - pad.b
  const values = data.map((d) => d[yKey] as number)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const yMax = max + range * 0.15
  const yMin = Math.max(0, min - range * 0.15)
  const yRange = yMax - yMin || 1

  const xStep = data.length > 1 ? iw / (data.length - 1) : iw
  const pts = data.map((d, i) => ({
    x: pad.l + i * xStep,
    y: pad.t + ih - ((( d[yKey] as number) - yMin) / yRange) * ih,
    d,
  }))

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${pad.t + ih} L ${pts[0].x} ${pad.t + ih} Z`

  const ticks = 4
  const yTicks: { v: number; y: number }[] = []
  for (let i = 0; i <= ticks; i++) {
    const v = yMin + (yRange * i) / ticks
    yTicks.push({ v, y: pad.t + ih - (i / ticks) * ih })
  }

  const stroke = accent || 'currentColor'
  const gradId = useMemo(() => 'g' + Math.random().toString(36).slice(2), [])

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    let closest = 0
    let best = Infinity
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - x)
      if (dist < best) { best = dist; closest = i }
    })
    setHover(closest)
  }

  return (
    <div ref={ref} className="relative w-full" style={{ height }} onMouseLeave={() => setHover(null)}>
      <svg width={w} height={height} onMouseMove={handleMove} className="overflow-visible">
        <defs>
          {gradient && (
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={t.y} y2={t.y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 3" />
            <text x={pad.l - 8} y={t.y + 4} textAnchor="end" fontSize="11" className="fill-muted-foreground">
              {yFormatter(Math.round(t.v))}
            </text>
          </g>
        ))}
        {pts.map((p, i) => {
          const every = Math.max(1, Math.floor(data.length / Math.min(data.length, Math.floor(w / 70))))
          if (i % every !== 0 && i !== data.length - 1) return null
          return (
            <text key={i} x={p.x} y={height - 8} textAnchor="middle" fontSize="11" className="fill-muted-foreground">
              {String(p.d[xKey])}
            </text>
          )
        })}
        {gradient && <path d={areaPath} fill={`url(#${gradId})`} />}
        <path d={linePath} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {showDots && pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hover === i ? 4.5 : 3}
            fill="var(--background)"
            stroke={stroke}
            strokeWidth="2"
          />
        ))}
        {hover !== null && pts[hover] && (
          <line
            x1={pts[hover].x}
            x2={pts[hover].x}
            y1={pad.t}
            y2={pad.t + ih}
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeDasharray="3 3"
          />
        )}
      </svg>
      {hover !== null && pts[hover] && (() => {
        const p = pts[hover]
        const left = Math.min(Math.max(p.x - 60, 4), w - 124)
        const top = Math.max(8, p.y - 56)
        return (
          <div
            className="absolute pointer-events-none bg-popover border border-border rounded-md shadow-md px-3 py-2 text-xs min-w-[110px]"
            style={{ left, top }}
          >
            <div className="text-muted-foreground">{String(p.d[xKey])}</div>
            <div className="font-mono font-semibold">{yFormatter(p.d[yKey] as number)}</div>
          </div>
        )
      })()}
    </div>
  )
}

// ─── BarChart ────────────────────────────────────────────────────────────────

interface BarChartProps {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  height?: number
  accent?: string
}

export function BarChart({ data, xKey, yKey, height = 220, accent }: BarChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(400)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver((es) => { for (const e of es) setW(e.contentRect.width) })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const pad = { l: 40, r: 12, t: 12, b: 24 }
  const iw = w - pad.l - pad.r
  const ih = height - pad.t - pad.b
  const values = data.map((d) => d[yKey] as number)
  const max = Math.max(...values) || 1
  const barW = (iw / data.length) * 0.62
  const step = iw / data.length
  const stroke = accent || 'currentColor'

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      <svg width={w} height={height}>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + ih * (1 - t)}
            y2={pad.t + ih * (1 - t)}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="2 3"
          />
        ))}
        {data.map((d, i) => {
          const h = ((d[yKey] as number) / max) * ih
          const x = pad.l + i * step + (step - barW) / 2
          const y = pad.t + ih - h
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={x} y={y} width={barW} height={h} rx="3" fill={stroke} opacity={hover === i ? 1 : 0.85} />
              <text x={x + barW / 2} y={height - 6} textAnchor="middle" fontSize="11" className="fill-muted-foreground">
                {String(d[xKey])}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

export function Sparkline({
  data,
  stroke = 'currentColor',
  width = 100,
  height = 32,
  fill = true,
}: {
  data: number[]
  stroke?: string
  width?: number
  height?: number
  fill?: boolean
}) {
  const gradId = useMemo(() => 's' + Math.random().toString(36).slice(2), [])
  if (!data || data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = width / (data.length - 1 || 1)
  const pts = data.map((v, i): [number, number] => [i * step, height - ((v - min) / range) * (height - 4) - 2])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color,
}: {
  value: number
  max?: number
  className?: string
  color?: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className={cn('h-2 bg-muted rounded-full overflow-hidden', className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color || 'var(--foreground)' }}
      />
    </div>
  )
}

// ─── DonutChart ──────────────────────────────────────────────────────────────

export function DonutChart({
  segments,
  size = 160,
  strokeW = 18,
}: {
  segments: { value: number; color: string }[]
  size?: number
  strokeW?: number
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - strokeW) / 2
  const c = 2 * Math.PI * r
  let off = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth={strokeW}
      />
      {segments.map((s, i) => {
        const len = (s.value / total) * c
        const dash = `${len} ${c - len}`
        const rot = -90 + (off / total) * 360
        off += s.value
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={dash}
            strokeLinecap="butt"
            transform={`rotate(${rot} ${size / 2} ${size / 2})`}
          />
        )
      })}
    </svg>
  )
}
