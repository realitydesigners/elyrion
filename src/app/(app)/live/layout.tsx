import { getSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/sign-in?redirect=/live");
  }
  return <>{children}</>;
}
