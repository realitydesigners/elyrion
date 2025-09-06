import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PricingPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <h1 className="text-2xl font-semibold mb-6">Choose your plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            name: "Monthly",
            price: "$29/mo",
            desc: "Access to live classes and archive",
          },
          { name: "Annual", price: "$290/yr", desc: "Two months free" },
        ].map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{p.price}</div>
              <div className="text-white/70 mb-4">{p.desc}</div>
              <form action="/api/checkout" method="POST">
                <input
                  type="hidden"
                  name="price"
                  value={p.name.toLowerCase()}
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
