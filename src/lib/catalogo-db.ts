import { MODELOS } from './fichas-data'
import { prisma } from './db'
import { parseInventarioForCatalog, type ModeloCatalogo, type TabData } from './catalogo-utils'

export async function getCatalogData(): Promise<ModeloCatalogo[]> {
  try {
    const config = await prisma.inventarioConfig.findUnique({ where: { id: 'singleton' } })
    if (!config?.cachedCsv) {
      return MODELOS.map((ficha) => ({ ficha, units: 0, precioDesde: null, precioEspecial: null }))
    }
    const tabs: TabData[] = JSON.parse(config.cachedCsv)
    return parseInventarioForCatalog(tabs, MODELOS)
  } catch {
    return MODELOS.map((ficha) => ({ ficha, units: 0, precioDesde: null, precioEspecial: null }))
  }
}
