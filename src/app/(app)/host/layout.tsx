import { getSupabaseServer } from "@/lib/supabaseServer";
import { isTeacher } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/sign-in?redirect=/host");
  }

  if (!isTeacher(user.email)) {
    redirect("/live");
  }

  return <>{children}</>;
}
