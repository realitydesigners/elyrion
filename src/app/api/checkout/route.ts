import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Placeholder: integrate Stripe Checkout here
  const form = await request.formData();
  const price = form.get("price");
  return NextResponse.redirect(
    new URL(`/account?started=${price}`, request.url)
  );
}
