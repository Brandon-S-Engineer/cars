import { auth } from '@/lib/auth'
import { getAuthUrl } from '@/lib/google-oauth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.redirect(getAuthUrl())
}

export async function DELETE() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.googleOAuthToken.deleteMany()
  return NextResponse.json({ ok: true })
}
