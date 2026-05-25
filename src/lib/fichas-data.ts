export type { Spec, Categoria, Version, ModeloFicha } from './fichas/_shared'
export { MARCA_ORDER, merge, modeloLabel } from './fichas/_shared'

import type { ModeloFicha } from './fichas/_shared'
import { MODELOS_JEEP } from './fichas/jeep'
import { MODELOS_DODGE } from './fichas/dodge'
import { MODELOS_PEUGEOT } from './fichas/peugeot'
import { MODELOS_RAM } from './fichas/ram'

export const MODELOS: ModeloFicha[] = [
  ...MODELOS_JEEP,
  ...MODELOS_DODGE,
  ...MODELOS_PEUGEOT,
  ...MODELOS_RAM,
]
