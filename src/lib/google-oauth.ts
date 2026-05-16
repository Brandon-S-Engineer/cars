import { google } from 'googleapis'
import { prisma } from './db'

function getRedirectUri() {
  const base = process.env.AUTH_URL ?? 'http://localhost:3000'
  return `${base}/api/auth/google/callback`
}

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    getRedirectUri(),
  )
}

export function getAuthUrl() {
  return getOAuthClient().generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    prompt: 'consent',
  })
}

export async function isGoogleConnected(): Promise<boolean> {
  const token = await prisma.googleOAuthToken.findUnique({ where: { id: 'singleton' } })
  return !!token
}

export async function getAuthenticatedClient() {
  const token = await prisma.googleOAuthToken.findUnique({ where: { id: 'singleton' } })
  if (!token) throw new Error('NO_TOKEN')

  const client = getOAuthClient()
  client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken ?? undefined,
    expiry_date: token.expiresAt.getTime(),
  })

  // Persist new tokens when the access token is auto-refreshed
  client.on('tokens', async (tokens) => {
    await prisma.googleOAuthToken.update({
      where: { id: 'singleton' },
      data: {
        accessToken: tokens.access_token!,
        expiresAt: new Date(tokens.expiry_date!),
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
      },
    })
  })

  return client
}

export function extractSpreadsheetId(input: string): string {
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (match) return match[1]
  return input.trim()
}
