import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent

        let customerEmail = pi.receipt_email ?? ''
        if (!customerEmail && pi.customer) {
          const customerId = typeof pi.customer === 'string' ? pi.customer : pi.customer.id
          const customer = await stripe.customers.retrieve(customerId)
          if (!customer.deleted && customer.email) {
            customerEmail = customer.email
          }
        }

        const charge = pi.latest_charge
          ? typeof pi.latest_charge === 'string'
            ? await stripe.charges.retrieve(pi.latest_charge)
            : (pi.latest_charge as Stripe.Charge)
          : null

        const isRefunded = charge?.refunded ?? false
        const status = isRefunded ? 'refunded' : 'paid'

        await prisma.stripeTransaction.upsert({
          where: { stripeId: pi.id },
          update: { status, customerEmail },
          create: {
            stripeId: pi.id,
            customerEmail,
            amount: pi.amount,
            currency: pi.currency,
            status,
            stripeCreatedAt: new Date(pi.created * 1000),
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        await upsertSubscription(sub)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const periodEnd = getItemPeriodEnd(sub)
        await prisma.stripeSubscription.upsert({
          where: { stripeSubscriptionId: sub.id },
          update: { status: 'canceled', cancelAtPeriodEnd: false },
          create: {
            stripeSubscriptionId: sub.id,
            stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
            customerEmail: await getCustomerEmail(sub.customer),
            status: 'canceled',
            planName: getPlanName(sub),
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
          },
        })
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function upsertSubscription(sub: Stripe.Subscription) {
  const customerEmail = await getCustomerEmail(sub.customer)
  const periodEnd = getItemPeriodEnd(sub)
  await prisma.stripeSubscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    update: {
      status: sub.status,
      planName: getPlanName(sub),
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      customerEmail,
    },
    create: {
      stripeSubscriptionId: sub.id,
      stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
      customerEmail,
      status: sub.status,
      planName: getPlanName(sub),
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  })
}

// In Stripe API 2026-03-25.dahlia, current_period_end moved to SubscriptionItem
function getItemPeriodEnd(sub: Stripe.Subscription): Date {
  const item = sub.items.data[0]
  if (item?.current_period_end) return new Date(item.current_period_end * 1000)
  return new Date()
}

async function getCustomerEmail(customer: string | Stripe.Customer | Stripe.DeletedCustomer): Promise<string> {
  const customerId = typeof customer === 'string' ? customer : customer.id
  const c = await stripe.customers.retrieve(customerId)
  if (!c.deleted && c.email) return c.email
  return ''
}

function getPlanName(sub: Stripe.Subscription): string {
  const item = sub.items.data[0]
  if (!item) return 'Unknown'
  const price = item.price
  const product = price.product
  if (typeof product === 'object' && !('deleted' in product && product.deleted)) {
    return (product as Stripe.Product).name ?? price.id
  }
  return price.id
}
