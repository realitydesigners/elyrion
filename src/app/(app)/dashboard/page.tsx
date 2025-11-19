import { getSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  HiPlay,
  HiArchiveBox,
  HiCheckCircle,
  HiXCircle,
  HiClock,
} from "react-icons/hi2";

export default async function DashboardPage(props: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/sign-in");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const showSuccessMessage = !!searchParams.session_id;

  const hasActiveSubscription =
    subscription &&
    subscription.status === "active" &&
    new Date(subscription.current_period_end) > new Date();

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-white/70">Welcome back, {user.email}</p>
        </div>

        {showSuccessMessage && (
          <Card className="border-green-500/20 bg-green-500/5 mb-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-400">
                <HiCheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  Payment successful! Your subscription is now active.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {hasActiveSubscription ? (
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <HiCheckCircle className="h-6 w-6 text-green-400" />
                <CardTitle>Active Subscription</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-white/60 mb-1">Plan</div>
                  <div className="text-lg font-semibold capitalize">
                    {subscription.plan_type}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">
                    Renews on
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(
                      subscription.current_period_end
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <Link href="/live">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                      <HiPlay className="h-5 w-5 mr-2" />
                      Join Live Class
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <HiXCircle className="h-6 w-6 text-yellow-400" />
                <CardTitle>No Active Subscription</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-white/80">
                  You need an active subscription to access live classes and
                  the archive.
                </p>
                <Link href="/pricing">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/live">
            <Card className="hover:border-blue-500/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <HiPlay className="h-5 w-5 text-blue-400" />
                  <CardTitle>Live Classes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm">
                  Join live streaming sessions and interact with instructors
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/archive">
            <Card className="hover:border-blue-500/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <HiArchiveBox className="h-5 w-5 text-blue-400" />
                  <CardTitle>Archive</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm">
                  Browse past classes and educational content
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

