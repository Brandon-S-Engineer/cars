import fs from "fs";
import path from "path";
import Stripe from "stripe";

// Load .env manually — no dotenv dep needed
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnv();

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY is not set");
  process.exit(1);
}

const stripe = new Stripe(stripeKey);

const CUSTOMERS = [
  { name: "Alice Johnson",    email: "alice.johnson@example.com" },
  { name: "Bob Martinez",     email: "bob.martinez@example.com" },
  { name: "Carol Williams",   email: "carol.williams@example.com" },
  { name: "David Chen",       email: "david.chen@example.com" },
  { name: "Eva Rossi",        email: "eva.rossi@example.com" },
  { name: "Frank Müller",     email: "frank.muller@example.com" },
  { name: "Grace Park",       email: "grace.park@example.com" },
  { name: "Henry Okonkwo",    email: "henry.okonkwo@example.com" },
  { name: "Isabella Santos",  email: "isabella.santos@example.com" },
  { name: "James Nguyen",     email: "james.nguyen@example.com" },
];

// plan index → which customers get which plan, and whether to cancel
// true = active, false = cancel after creation
const SUBSCRIPTION_PLAN: Array<{ customerIdx: number; planKey: "pro" | "enterprise"; cancel: boolean }> = [
  { customerIdx: 0, planKey: "pro",        cancel: false },
  { customerIdx: 1, planKey: "pro",        cancel: false },
  { customerIdx: 2, planKey: "enterprise", cancel: false },
  { customerIdx: 3, planKey: "pro",        cancel: true  },
  { customerIdx: 4, planKey: "enterprise", cancel: false },
  { customerIdx: 5, planKey: "pro",        cancel: false },
  { customerIdx: 6, planKey: "enterprise", cancel: true  },
  { customerIdx: 7, planKey: "pro",        cancel: true  },
  { customerIdx: 8, planKey: "enterprise", cancel: false },
  { customerIdx: 9, planKey: "pro",        cancel: false },
];

async function seed() {
  console.log("Creating products and prices...");

  const proProduct = await stripe.products.create({ name: "Pro Plan" });
  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2900,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Pro Plan Monthly",
  });

  const enterpriseProduct = await stripe.products.create({ name: "Enterprise Plan" });
  const enterprisePrice = await stripe.prices.create({
    product: enterpriseProduct.id,
    unit_amount: 9900,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Enterprise Plan Monthly",
  });

  const prices = { pro: proPrice.id, enterprise: enterprisePrice.id };
  console.log(`  Pro Plan price:        ${proPrice.id}  ($${proPrice.unit_amount! / 100}/mo)`);
  console.log(`  Enterprise Plan price: ${enterprisePrice.id}  ($${enterprisePrice.unit_amount! / 100}/mo)`);

  console.log("\nCreating customers...");
  const customers: Stripe.Customer[] = [];
  for (const c of CUSTOMERS) {
    const customer = await stripe.customers.create({ name: c.name, email: c.email });
    customers.push(customer);
    console.log(`  ${customer.id}  ${c.name}`);
  }

  console.log("\nCreating subscriptions...");
  for (const sub of SUBSCRIPTION_PLAN) {
    const customer = customers[sub.customerIdx];
    const priceId = prices[sub.planKey];

    // Stripe requires a payment method for subscriptions; use a test card token
    const pm = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripe.paymentMethods.attach(pm.id, { customer: customer.id });
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: pm.id },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: pm.id,
    });

    if (sub.cancel) {
      await stripe.subscriptions.cancel(subscription.id);
      console.log(`  ${subscription.id}  ${sub.planKey.padEnd(10)}  canceled  → ${customer.email}`);
    } else {
      console.log(`  ${subscription.id}  ${sub.planKey.padEnd(10)}  active    → ${customer.email}`);
    }
  }

  console.log("\nSeed complete.");
  console.log(`  Products:      2`);
  console.log(`  Customers:     ${customers.length}`);
  console.log(`  Subscriptions: ${SUBSCRIPTION_PLAN.length} (${SUBSCRIPTION_PLAN.filter(s => !s.cancel).length} active, ${SUBSCRIPTION_PLAN.filter(s => s.cancel).length} canceled)`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
