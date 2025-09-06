import { getSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen px-6 py-16 space-y-2">
      <h1 className="text-2xl font-semibold mb-4">Account</h1>
      <div className="text-white/80">Email: {user.email}</div>
      <form action="/api/billing-portal" method="POST" className="mt-4">
        <button className="rounded-lg bg-white text-neutral-900 px-4 py-2">
          Manage subscription
        </button>
      </form>
    </div>
  );
}
