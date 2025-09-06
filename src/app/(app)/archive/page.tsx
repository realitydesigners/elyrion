import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import ArchiveSearch from "@/components/ArchiveSearch";
import { Badge } from "@/components/ui/Badge";

const items = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Class ${i + 1}`,
  topic: i % 2 === 0 ? "Astronomy" : "Symbolism",
}));

export default function ArchivePage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Archive</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>Astronomy</Badge>
            <Badge>Symbolism</Badge>
            <Badge>Myth</Badge>
            <Badge>Art</Badge>
          </div>
        </div>
        <div className="w-full sm:w-72">
          <ArchiveSearch />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((x) => (
          <Link key={x.id} href={`/archive/${x.id}`}>
            <Card>
              <div className="aspect-video rounded-lg bg-white/5" />
              <CardContent className="mt-3">
                <CardTitle>{x.title}</CardTitle>
                <div className="text-white/60 text-sm">{x.topic}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
