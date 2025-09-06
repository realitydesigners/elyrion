import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Placeholder: integrate Stripe billing portal here
  return NextResponse.redirect(new URL(`/account?manage=1`, request.url));
}
