import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/sign-in?redirect=/pricing");
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4">Choose your plan</h1>
          <p className="text-white/70">
            Get access to live classes, archive, and community features
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Monthly",
              plan: "monthly",
              price: "$29",
              period: "per month",
              desc: "Access to live classes and archive",
              features: [
                "Live streaming classes",
                "Archive access",
                "Community chat",
                "Cancel anytime",
              ],
            },
            {
              name: "Annual",
              plan: "annual",
              price: "$290",
              period: "per year",
              desc: "Two months free",
              features: [
                "Everything in Monthly",
                "Save $58 per year",
                "Priority support",
                "Early access to new content",
              ],
              popular: true,
            },
          ].map((p) => (
            <Card
              key={p.name}
              className={`relative ${
                p.popular
                  ? "border-blue-500/50 bg-blue-500/5 scale-105"
                  : ""
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{p.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{p.price}</span>
                    <span className="text-white/60">{p.period}</span>
                  </div>
                  <div className="text-white/70 text-sm mt-2">{p.desc}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <form action="/api/checkout" method="POST">
                  <input type="hidden" name="plan" value={p.plan} />
                  <Button
                    type="submit"
                    className={`w-full ${
                      p.popular
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        : ""
                    }`}
                  >
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

