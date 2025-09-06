import { getSupabaseServer } from "@/lib/supabaseServer";
import { env } from "@/lib/env";

export async function requireUser() {
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export function isTeacher(email: string | null | undefined) {
  if (!email) return false;
  const allow = (env.TEACHER_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.toLowerCase());
}
