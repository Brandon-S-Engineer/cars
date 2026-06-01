'use client'

import { useState, useCallback } from 'react'
import WaIcon from './wa-icon'
import { waUrl } from '@/lib/catalogo-utils'

const ANNUAL = 0.139

function calcPmt(principal: number, months: number): number {
  const r = ANNUAL / 12
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

function fmt(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-MX')
}

export default function FinanceCalculator({
  price,
  modelName,
}: {
  price: number
  modelName: string
}) {
  const [downPct, setDownPct] = useState(25)
  const [term, setTerm] = useState(60)

  const down = price * (downPct / 100)
  const principal = price - down
  const monthly = calcPmt(principal, term)

  const waMsg = useCallback(
    () =>
      `Hola Edith, me interesa esta cotización del ${modelName}: enganche de ${fmt(down)} (${downPct}%) a ${term} meses, mensualidad aprox. ${fmt(monthly)}. ¿Me confirmas disponibilidad?`,
    [down, downPct, term, monthly, modelName],
  )

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
      <span className="text-[13px] uppercase tracking-[0.16em] text-azul-200 font-semibold">
        Estimador de financiamiento
      </span>
      <h2 className="font-display font-extrabold text-[26px] sm:text-[30px] leading-tight mt-2 text-white">
        Arma tu mensualidad
      </h2>
      <p className="text-azul-100/75 text-[15px] mt-1.5">
        Mueve el enganche y el plazo para ver una estimación. El cálculo formal lo hacemos juntos.
      </p>

      {/* Enganche slider */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[15px] font-medium text-white">Enganche</label>
          <span className="font-display font-bold text-[18px] text-white">
            {downPct}% · {fmt(down)}
          </span>
        </div>
        <input
          type="range"
          min="20" max="40" step="5"
          value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
          className="w-full accent-wa h-2"
        />
        <div className="flex justify-between text-[12px] text-azul-200 mt-1">
          <span>20%</span><span>40%</span>
        </div>
      </div>

      {/* Plazo */}
      <div className="mt-5">
        <label className="text-[15px] font-medium block mb-2 text-white">Plazo</label>
        <select
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          className="w-full h-12 px-4 rounded-xl bg-azul-800 border border-white/15 text-white font-medium"
        >
          <option value={12}>12 meses</option>
          <option value={24}>24 meses</option>
          <option value={36}>36 meses</option>
          <option value={48}>48 meses</option>
          <option value={60}>60 meses</option>
        </select>
      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-azul-800/60 rounded-xl p-4">
          <div className="text-[13px] text-azul-200">A financiar</div>
          <div className="font-display font-bold text-[20px] text-white">{fmt(principal)}</div>
        </div>
        <div className="bg-wa/15 border border-wa/40 rounded-xl p-4">
          <div className="text-[13px] text-azul-100">Mensualidad aprox.</div>
          <div className="font-display font-extrabold text-[24px] text-white">{fmt(monthly)}</div>
        </div>
      </div>

      <a
        href={waUrl(waMsg())}
        target="_blank" rel="noopener noreferrer"
        className="mt-5 w-full inline-flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-dark text-white font-bold text-[16px] py-3.5 rounded-full transition-colors"
      >
        <WaIcon size={20} />
        Enviarme esta cotización
      </a>
      <p className="text-[12px] text-azul-200/80 mt-3">
        Estimación con tasa anual aproximada, solo informativa. No constituye una oferta de crédito.
      </p>
    </div>
  )
}
