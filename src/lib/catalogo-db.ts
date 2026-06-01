import { MODELOS } from './fichas-data'
import { prisma } from './db'
import { parseInventarioForCatalog, type ModeloCatalogo, type TabData } from './catalogo-utils'

export async function getCoverPhotos(): Promise<Record<string, string>> {
  const covers = await prisma.catalogPhoto.findMany({
    where: { versionId: null },
    orderBy: { order: 'asc' },
    select: { modelId: true, url: true },
  })
  const map: Record<string, string> = {}
  for (const c of covers) {
    if (!map[c.modelId]) map[c.modelId] = c.url
  }
  return map
}

export async function getCatalogData(): Promise<ModeloCatalogo[]> {
  try {
    const config = await prisma.inventarioConfig.findUnique({ where: { id: 'singleton' } })
    if (!config?.cachedCsv) {
      return MODELOS.map((ficha) => ({ ficha, units: 0, precioDesde: null, precioEspecial: null, listaDelEspecial: null, preciosPorVersion: {} }))
    }
    const tabs: TabData[] = JSON.parse(config.cachedCsv)
    return parseInventarioForCatalog(tabs, MODELOS)
  } catch {
    return MODELOS.map((ficha) => ({ ficha, units: 0, precioDesde: null, precioEspecial: null, listaDelEspecial: null, preciosPorVersion: {} }))
  }
}
