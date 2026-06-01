import Link from 'next/link'
import { Images, ChevronRight } from 'lucide-react'
import { MODELOS } from '@/lib/fichas-data'
import { prisma } from '@/lib/db'

export default async function CatalogoAdminPage() {
  // Count photos per model in one query
  const counts = await prisma.catalogPhoto.groupBy({
    by: ['modelId'],
    _count: { id: true },
  })
  const countMap = Object.fromEntries(counts.map((c) => [c.modelId, c._count.id]))

  // Cover photos
  const covers = await prisma.catalogPhoto.findMany({
    where: { versionId: null },
    orderBy: { order: 'asc' },
    select: { modelId: true, url: true },
  })
  const coverMap = Object.fromEntries(covers.map((c) => [c.modelId, c.url]))

  const marcas = [...new Set(MODELOS.map((m) => m.marca))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Fotos del catálogo</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Agrega fotos a cada modelo y versión. Aparecen automáticamente en el sitio público.
        </p>
      </div>

      <div className="space-y-8">
        {marcas.map((marca) => {
          const modelos = MODELOS.filter((m) => m.marca === marca)
          return (
            <div key={marca}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {marca}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {modelos.map((model) => {
                  const total = countMap[model.id] ?? 0
                  const cover = coverMap[model.id]
                  return (
                    <Link
                      key={model.id}
                      href={`/dashboard/catalogo/${model.id}`}
                      className="group flex items-center gap-4 rounded-xl border bg-card p-4 hover:border-foreground/30 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cover} alt={model.modelo} className="h-full w-full object-cover" />
                        ) : (
                          <Images className="h-6 w-6 text-muted-foreground/40" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{model.modelo} {model.año}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {model.versiones.length} {model.versiones.length === 1 ? 'versión' : 'versiones'}
                        </p>
                        <p className={`text-xs mt-1 font-medium ${total > 0 ? 'text-green-600' : 'text-muted-foreground/60'}`}>
                          {total > 0 ? `${total} ${total === 1 ? 'foto' : 'fotos'}` : 'Sin fotos'}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
