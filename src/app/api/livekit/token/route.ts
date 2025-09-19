import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { isTeacher } from "@/lib/auth";

export async function GET(request: Request) {
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    return NextResponse.json(
      { error: "LiveKit not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") === "host" ? "host" : "viewer";
  const roomName = searchParams.get("room") || "elyrion-class";

  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  // Allow anonymous tokens for viewer/host during testing
  if (!user && (role === "viewer" || role === "host")) {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      { identity: `${role}-anon-${Date.now()}` }
    );
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: role === "host",
      canSubscribe: true,
    });
    const token = await at.toJwt();
    return NextResponse.json({ token, url: process.env.LIVEKIT_URL, roomName });
  }
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const canPublish = role === "host" ? true : false; // allow anonymous host for testing

  const identity = `${role}-${user.id}`;
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity,
    }
  );
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish,
    canSubscribe: true,
  });
  const token = await at.toJwt();
  return NextResponse.json({ token, url: process.env.LIVEKIT_URL, roomName });
}
