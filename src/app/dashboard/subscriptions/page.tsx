import { stripe } from '@/lib/stripe'
import SubscriptionsClient, { SubscriptionRow } from '@/components/dashboard/subscriptions-client'
import Stripe from 'stripe'

async function fetchSubscriptions(): Promise<SubscriptionRow[]> {
  try {
    // expand depth capped at 4 levels: data.items.data.price = 4
    // going one deeper to .product would hit Stripe's limit and return a 400
    const list = await stripe.subscriptions.list({
      limit: 50,
      status: 'all',
      expand: ['data.customer', 'data.items.data.price'],
    })

    return list.data.map((sub) => {
      const customer = sub.customer as Stripe.Customer | Stripe.DeletedCustomer
      const customerEmail = !customer.deleted && customer.email ? customer.email : '—'

      const item = sub.items.data[0]
      // price.product is unexpanded (string ID); use the price nickname set at creation
      const planName = item?.price.nickname ?? item?.price.id ?? 'Unknown'

      // In Stripe API 2026-03-25.dahlia, current_period_end is on SubscriptionItem
      const currentPeriodEnd = item?.current_period_end ?? Math.floor(Date.now() / 1000)

      return {
        id: sub.id,
        customerEmail,
        planName,
        status: sub.status,
        currentPeriodEnd,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      }
    })
  } catch (err) {
    console.error('[subscriptions] fetch failed:', err)
    return []
  }
}

export default async function SubscriptionsPage() {
  const subscriptions = await fetchSubscriptions()
  return <SubscriptionsClient subscriptions={subscriptions} />
}
