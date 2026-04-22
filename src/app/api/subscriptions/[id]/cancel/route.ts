import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/require-admin'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin()
  if (error) return error

  const { id } = await params

  const canceled = await stripe.subscriptions.cancel(id)

  // In Stripe API 2026-03-25.dahlia, current_period_end is on SubscriptionItem
  const item = canceled.items.data[0]
  const periodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000) : new Date()

  await prisma.stripeSubscription.upsert({
    where: { stripeSubscriptionId: id },
    update: { status: 'canceled', cancelAtPeriodEnd: false },
    create: {
      stripeSubscriptionId: id,
      stripeCustomerId: typeof canceled.customer === 'string' ? canceled.customer : canceled.customer.id,
      customerEmail: '',
      status: 'canceled',
      planName: item?.price.id ?? 'Unknown',
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    },
  })

  return NextResponse.json({ ok: true })
}
