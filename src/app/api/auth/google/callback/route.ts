import { auth } from '@/lib/auth'
import { getOAuthClient } from '@/lib/google-oauth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.redirect(new URL('/login', req.url))

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/dashboard/inventario?error=oauth_denied', req.url))
  }

  try {
    const client = getOAuthClient()
    const { tokens } = await client.getToken(code)

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL('/dashboard/inventario?error=no_token', req.url))
    }

    await prisma.googleOAuthToken.upsert({
      where: { id: 'singleton' },
      create: {
        id: 'singleton',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3_600_000),
      },
      update: {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3_600_000),
      },
    })

    return NextResponse.redirect(new URL('/dashboard/inventario?connected=1', req.url))
  } catch {
    return NextResponse.redirect(new URL('/dashboard/inventario?error=token_exchange', req.url))
  }
}
