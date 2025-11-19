import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServer } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const planType = form.get("plan") as string;

    if (!planType || !["monthly", "annual"].includes(planType)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId =
      planType === "monthly"
        ? process.env.STRIPE_PRICE_ID_MONTHLY!
        : process.env.STRIPE_PRICE_ID_ANNUAL!;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured" },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || request.url.split("/api")[0];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.redirect(session.url!);
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
