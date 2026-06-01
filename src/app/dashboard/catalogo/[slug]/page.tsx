import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { MODELOS } from '@/lib/fichas-data'
import { getModelPhotos } from '@/lib/catalog-photos'
import PhotoSection from './photo-section'

export default async function ModelPhotoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const model = MODELOS.find((m) => m.id === slug)
  if (!model) notFound()

  const allPhotos = await getModelPhotos(model.id)
  const coverPhotos = allPhotos.filter((p) => p.versionId === null)

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/catalogo"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Catálogo
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-semibold">{model.marca} {model.modelo} {model.año}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Las fotos aparecen automáticamente en el sitio. Agrega primero la foto de portada.
        </p>
      </div>

      {/* Portada del modelo — aparece en el catálogo y landing */}
      <PhotoSection
        title="Foto de portada"
        description="Aparece en el catálogo y en la landing. Elige la foto más atractiva del auto."
        modelId={model.id}
        versionId={null}
        photos={coverPhotos}
      />

      {/* Una sección por versión */}
      {model.versiones.map((version) => {
        const vPhotos = allPhotos.filter((p) => p.versionId === version.id)
        return (
          <PhotoSection
            key={version.id}
            title={version.nombre}
            description="Fotos del interior, exterior, tablero y cajuela de esta versión."
            modelId={model.id}
            versionId={version.id}
            photos={vPhotos}
          />
        )
      })}
    </div>
  )
}
