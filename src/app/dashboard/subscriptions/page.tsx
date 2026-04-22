import { stripe } from '@/lib/stripe'
import SubscriptionsClient, { SubscriptionRow } from '@/components/dashboard/subscriptions-client'
import Stripe from 'stripe'

async function fetchSubscriptions(): Promise<SubscriptionRow[]> {
  try {
    const list = await stripe.subscriptions.list({
      limit: 50,
      status: 'all',
      expand: ['data.customer', 'data.items.data.price.product'],
    })

    return list.data.map((sub) => {
      const customer = sub.customer as Stripe.Customer | Stripe.DeletedCustomer
      const customerEmail = !customer.deleted && customer.email ? customer.email : '—'

      const item = sub.items.data[0]
      let planName = 'Unknown'
      if (item) {
        const product = item.price.product
        if (typeof product === 'object' && !('deleted' in product && product.deleted)) {
          planName = (product as Stripe.Product).name ?? item.price.id
        } else if (typeof product === 'string') {
          planName = item.price.id
        }
      }

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
  } catch {
    return []
  }
}

export default async function SubscriptionsPage() {
  const subscriptions = await fetchSubscriptions()
  return <SubscriptionsClient subscriptions={subscriptions} />
}
