import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(50),
})

async function buildSystemPrompt(): Promise<string> {
  const [userCount, activeSubCount, recentSheets] = await Promise.all([
    prisma.user.count(),
    prisma.stripeSubscription.count({ where: { status: 'active' } }),
    prisma.connectedSheet.findMany({
      select: { name: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  const sheetNames = recentSheets.length > 0 ? recentSheets.map((s) => s.name).join(', ') : 'none connected'

  return `You are an AI assistant embedded in an internal business admin dashboard.
Your role is strictly limited: you only answer questions about this dashboard's data and features.

CURRENT DASHBOARD SNAPSHOT:
- Total registered users: ${userCount}
- Active subscriptions: ${activeSubCount}
- Total posts (demo content): 36
- Connected Google Sheets (most recent 3): ${sheetNames}

AVAILABLE SECTIONS:
- Overview: summary metrics and activity charts
- Users: registered accounts and roles
- Metrics: revenue and activity charts
- Posts: internal team posts and documentation
- Subscriptions: Stripe subscription plans and their status
- Sheets: connected Google Sheets with business data

STRICT RULES:
1. Only answer questions related to the dashboard data above or its sections.
2. If the user asks about anything unrelated — general coding, current events, creative writing, personal advice, or any topic not listed above — respond with exactly this: "I can only help with questions about this dashboard — users, subscriptions, posts, connected sheets, and metrics."
3. Be concise and factual. Reference the live counts above when they are relevant.
4. Do not speculate about data not present in the snapshot.`
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const systemPrompt = await buildSystemPrompt()

  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      stream: true,
      max_tokens: 1024,
      messages: [{ role: 'system', content: systemPrompt }, ...parsed.data.messages],
    }),
  })

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}))
    return NextResponse.json({ error: (err as { error?: { message?: string } })?.error?.message ?? 'OpenAI request failed' }, { status: 502 })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
