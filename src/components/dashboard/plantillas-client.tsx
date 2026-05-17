'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type Plantilla = {
  id: string
  pregunta: string
  respuesta: string
  orden: number
}

// ── Card ──────────────────────────────────────────────────────────────────────

function PlantillaCard({
  plantilla,
  onSave,
  onDelete,
}: {
  plantilla: Plantilla
  onSave: (id: string, pregunta: string, respuesta: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(plantilla.id === '__new__')
  const [pregunta, setPregunta] = useState(plantilla.pregunta)
  const [respuesta, setRespuesta] = useState(plantilla.respuesta)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const save = async () => {
    if (!pregunta.trim() || !respuesta.trim()) return
    setSaving(true)
    await onSave(plantilla.id, pregunta.trim(), respuesta.trim())
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => {
    if (plantilla.id === '__new__') {
      onDelete('__new__')
    } else {
      setPregunta(plantilla.pregunta)
      setRespuesta(plantilla.respuesta)
      setEditing(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(respuesta)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (editing) {
    return (
      <div className="rounded-xl border-2 border-ring bg-card p-4 space-y-3">
        <Input
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Pregunta del cliente"
          className="font-medium"
          autoFocus
        />
        <textarea
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Respuesta predeterminada"
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={cancel} disabled={saving}>
            <X className="h-3.5 w-3.5 mr-1.5" />
            Cancelar
          </Button>
          <Button size="sm" onClick={save} disabled={saving || !pregunta.trim() || !respuesta.trim()}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
            Guardar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-2 group">
      <div className="flex items-start gap-2">
        <p className="flex-1 text-sm font-semibold leading-snug">{plantilla.pregunta}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={copy}
            title="Copiar respuesta"
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setEditing(true)}
            title="Editar"
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(plantilla.id)}
            title="Eliminar"
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{plantilla.respuesta}</p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PlantillasClient() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addingNew, setAddingNew] = useState(false)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/plantillas')
    if (res.ok) setPlantillas(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const handleSave = async (id: string, pregunta: string, respuesta: string) => {
    if (id === '__new__') {
      const res = await fetch('/api/plantillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta, respuesta }),
      })
      if (res.ok) {
        const created: Plantilla = await res.json()
        setPlantillas((prev) => [...prev.filter((p) => p.id !== '__new__'), created])
      }
      setAddingNew(false)
    } else {
      const res = await fetch(`/api/plantillas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta, respuesta }),
      })
      if (res.ok) {
        const updated: Plantilla = await res.json()
        setPlantillas((prev) => prev.map((p) => (p.id === id ? updated : p)))
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (id === '__new__') {
      setPlantillas((prev) => prev.filter((p) => p.id !== '__new__'))
      setAddingNew(false)
      return
    }
    await fetch(`/api/plantillas/${id}`, { method: 'DELETE' })
    setPlantillas((prev) => prev.filter((p) => p.id !== id))
  }

  const addNew = () => {
    if (addingNew) return
    setAddingNew(true)
    setPlantillas((prev) => [{ id: '__new__', pregunta: '', respuesta: '', orden: 0 }, ...prev])
  }

  const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const filtered = search.trim()
    ? plantillas.filter(
        (p) =>
          normalize(p.pregunta).includes(normalize(search)) ||
          normalize(p.respuesta).includes(normalize(search)),
      )
    : plantillas

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Plantillas de respuesta</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Respuestas listas para copiar y enviar al cliente.</p>
        </div>
        <Button onClick={addNew} disabled={addingNew} size="sm" className="gap-1.5 shrink-0">
          <Plus className="h-3.5 w-3.5" />
          Nueva
        </Button>
      </div>

      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar plantilla..."
        className="max-w-sm"
      />

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Cargando...</span>
        </div>
      ) : filtered.length === 0 ? (
        <p className={cn('text-sm text-muted-foreground py-8', search ? '' : 'text-center')}>
          {search ? 'Sin resultados.' : 'No hay plantillas. Crea la primera.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <PlantillaCard key={p.id} plantilla={p} onSave={handleSave} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
