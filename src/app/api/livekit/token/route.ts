import { env } from "@/lib/env";
import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { isTeacher } from "@/lib/auth";

export async function GET(request: Request) {
  if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) {
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
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const canPublish = role === "host" ? isTeacher(user.email) : false;
  if (role === "host" && !canPublish) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const identity = `${role}-${user.id}`;
  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity,
  });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish,
    canSubscribe: true,
  });
  const token = await at.toJwt();
  return NextResponse.json({ token, url: env.LIVEKIT_URL, roomName });
}
