"use client";

import { useLocalStorage } from "@/lib/useLocalStorage";

export default function NextClassBanner() {
  const [dismissed, setDismissed] = useLocalStorage("banner:nextclass", false);
  if (dismissed) return null;
  return (
    <div className="mx-4 my-4 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          <span className="font-medium">Next Class:</span> Sept 24, 7pm PT ·
          "The Digital Temple"
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/live"
            className="rounded-lg bg-white text-neutral-900 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
          >
            Join
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-sm hover:bg-white/20"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
