import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServer } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await getSupabaseServer();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type;

        if (!userId || !planType) {
          console.error("Missing metadata in checkout session");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0].price.id,
          status: subscription.status,
          plan_type: planType,
          current_period_end: new Date(
            (subscription as any).current_period_end * 1000
          ).toISOString(),
        });

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const planType =
          subscription.metadata?.plan_type ||
          (subscription.items.data[0].price.id ===
          process.env.STRIPE_PRICE_ID_ANNUAL
            ? "annual"
            : "monthly");

        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(
              (subscription as any).current_period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
