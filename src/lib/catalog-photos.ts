'use server'

import { revalidatePath } from 'next/cache'
import { put, del } from '@vercel/blob'
import { prisma } from './db'

export type CatalogPhoto = {
  id: string
  modelId: string
  versionId: string | null
  url: string
  order: number
}

export async function getModelPhotos(modelId: string): Promise<CatalogPhoto[]> {
  return prisma.catalogPhoto.findMany({
    where: { modelId },
    orderBy: [{ versionId: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function getCoverPhoto(modelId: string): Promise<string | null> {
  const photo = await prisma.catalogPhoto.findFirst({
    where: { modelId, versionId: null },
    orderBy: { order: 'asc' },
    select: { url: true },
  })
  return photo?.url ?? null
}

export async function getVersionPhotos(modelId: string, versionId: string): Promise<string[]> {
  const photos = await prisma.catalogPhoto.findMany({
    where: { modelId, versionId },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    select: { url: true },
  })
  return photos.map((p) => p.url)
}

export async function uploadPhoto(formData: FormData) {
  const file = formData.get('file') as File
  const modelId = formData.get('modelId') as string
  const versionId = (formData.get('versionId') as string) || null

  if (!file || !modelId) throw new Error('Missing file or modelId')

  const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '-').toLowerCase()
  const path = `catalog/${modelId}/${versionId ?? 'cover'}/${Date.now()}-${safeName}`

  const blob = await put(path, file, { access: 'public' })

  const count = await prisma.catalogPhoto.count({ where: { modelId, versionId } })
  await prisma.catalogPhoto.create({
    data: { modelId, versionId, url: blob.url, order: count },
  })

  revalidatePath(`/dashboard/catalogo/${modelId}`)
  revalidatePath(`/catalogo/${modelId}`)
  revalidatePath('/')
}

export async function deletePhoto(photoId: string) {
  const photo = await prisma.catalogPhoto.findUnique({ where: { id: photoId } })
  if (!photo) return

  try {
    await del(photo.url)
  } catch {
    // Blob may already be deleted — continue
  }

  await prisma.catalogPhoto.delete({ where: { id: photoId } })

  revalidatePath(`/dashboard/catalogo/${photo.modelId}`)
  revalidatePath(`/catalogo/${photo.modelId}`)
  revalidatePath('/')
}
