/**
 * Export script: dumps every car spec sheet (ficha técnica) to a flat,
 * human-readable Markdown file — with the `merge` overrides already applied,
 * exactly as the site renders them.
 *
 * Run:  npx tsx scripts/export-fichas.ts
 *
 * Output:  fichas-export.md  (project root)
 *
 * Read-only: it only reads MODELOS and writes the Markdown file. It does NOT
 * modify any source data.
 */

import fs from 'fs'
import path from 'path'
import { MODELOS } from '../src/lib/fichas-data'
import { MARCA_ORDER } from '../src/lib/fichas/_shared'

const out: string[] = []

out.push('# Fichas técnicas — export para verificación')
out.push('')
out.push('> Generado automáticamente desde `src/lib/fichas/` con los overrides ya aplicados.')
out.push('> Cada versión muestra su ficha COMPLETA y final, tal como aparece en el sitio.')
out.push('> NO editar este archivo a mano: es un volcado de los datos del código.')
out.push('')

// Sort brands by MARCA_ORDER, then keep model order as defined in code
const marcas = [...new Set(MODELOS.map((m) => m.marca))].sort(
  (a, b) => MARCA_ORDER.indexOf(a) - MARCA_ORDER.indexOf(b),
)

let totalModelos = 0
let totalVersiones = 0
let totalSpecs = 0

for (const marca of marcas) {
  out.push('')
  out.push('---')
  out.push('')
  out.push(`# ${marca.toUpperCase()}`)

  const modelos = MODELOS.filter((m) => m.marca === marca)
  for (const modelo of modelos) {
    totalModelos++
    out.push('')
    out.push(`## ${modelo.marca} ${modelo.modelo} ${modelo.año}`)
    out.push(`\`id: ${modelo.id}\` · ${modelo.versiones.length} versión(es)`)

    for (const version of modelo.versiones) {
      totalVersiones++
      out.push('')
      out.push(`### Versión: ${version.nombre}`)
      out.push(`\`versionId: ${version.id}\``)

      for (const cat of version.categorias) {
        out.push('')
        out.push(`#### ${cat.nombre}`)
        for (const spec of cat.specs) {
          totalSpecs++
          out.push(`- **${spec.label}:** ${spec.valor}`)
        }
      }
    }
  }
}

out.push('')
out.push('---')
out.push('')
out.push(
  `_Total: ${totalModelos} modelos · ${totalVersiones} versiones · ${totalSpecs} specs._`,
)
out.push('')

const target = path.join(__dirname, '..', 'fichas-export.md')
fs.writeFileSync(target, out.join('\n'), 'utf8')

console.log(`✓ Escrito: ${target}`)
console.log(`  ${totalModelos} modelos · ${totalVersiones} versiones · ${totalSpecs} specs`)
