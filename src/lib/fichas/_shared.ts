export type Spec = { label: string; valor: string }
export type Categoria = { id: string; nombre: string; specs: Spec[] }
export type Version = { id: string; nombre: string; categorias: Categoria[] }
export type ModeloFicha = { id: string; marca: string; modelo: string; año: number; versiones: Version[] }

export const MARCA_ORDER = ['Jeep', 'Dodge', 'Fiat', 'Peugeot', 'RAM']

// Merges base categorías with per-category per-label overrides, then appends
// any extra specs listed in `extras` for each category.
export function merge(
  base: Categoria[],
  overrides: Record<string, Record<string, string>>,
  extras: Record<string, Spec[]> = {},
): Categoria[] {
  return base.map((cat) => {
    const ov = overrides[cat.id] ?? {}
    const ex = extras[cat.id] ?? []
    const updated = cat.specs.map((s) => ({ label: s.label, valor: ov[s.label] ?? s.valor }))
    return { ...cat, specs: [...updated, ...ex] }
  })
}

export function modeloLabel(m: ModeloFicha): string {
  return `${m.modelo} ${m.año}`
}
