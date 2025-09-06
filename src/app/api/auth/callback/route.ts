import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  return NextResponse.redirect(`${origin}/`);
}
