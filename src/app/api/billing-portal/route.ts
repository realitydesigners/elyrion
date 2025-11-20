import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServer } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const origin =
      request.headers.get("origin") || request.url.split("/api")[0];

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${origin}/account`,
    });

    return NextResponse.redirect(session.url);
  } catch (error: any) {
    console.error("Billing portal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
