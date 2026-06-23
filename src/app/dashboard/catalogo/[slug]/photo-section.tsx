'use client'

import { useRef, useState, useTransition } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { uploadPhoto, deletePhoto, type CatalogPhoto } from '@/lib/catalog-photos'

const MAX_FILE_MB = 10

export default function PhotoSection({
  title,
  description,
  modelId,
  versionId,
  photos,
}: {
  title: string
  description: string
  modelId: string
  versionId: string | null
  photos: CatalogPhoto[]
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, startUpload] = useTransition()
  const [deleting, startDelete] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`La foto pesa demasiado (máximo ${MAX_FILE_MB}MB). Intenta con una foto más ligera.`)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    const fd = new FormData()
    fd.append('file', file)
    fd.append('modelId', modelId)
    if (versionId) fd.append('versionId', versionId)

    startUpload(async () => {
      try {
        await uploadPhoto(fd)
      } catch {
        setError('No se pudo subir la foto. Intenta de nuevo.')
      } finally {
        if (fileRef.current) fileRef.current.value = ''
      }
    })
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Existing photos */}
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              className="h-24 w-32 object-cover rounded-lg border border-border"
            />
            <button
              onClick={() => startDelete(() => deletePhoto(photo.id))}
              disabled={deleting}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              title="Eliminar foto"
            >
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </button>
          </div>
        ))}

        {/* Upload button */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="h-24 w-32 rounded-lg border-2 border-dashed border-border hover:border-foreground/40 flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">{uploading ? 'Subiendo...' : 'Agregar foto'}</span>
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {photos.length === 0 && !uploading && (
        <p className="text-xs text-muted-foreground/60">Sin fotos todavía.</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
