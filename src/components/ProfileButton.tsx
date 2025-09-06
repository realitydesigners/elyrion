"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

type Profile = {
  name: string | null;
  email: string | null;
  image: string | null;
  subscriptionStatus: string;
};

export default function ProfileButton() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) {
        setProfile(null);
        return;
      }
      const name = (user.user_metadata?.name as string) ?? null;
      const email = user.email ?? null;
      const image =
        (user.user_metadata?.avatar_url as string) ??
        (user.user_metadata?.picture as string) ??
        null;
      const sub =
        (user.app_metadata as any)?.subscription_status ||
        (user.user_metadata as any)?.subscription_status ||
        "Free";
      setProfile({ name, email, image, subscriptionStatus: sub });
    });
  }, []);

  if (!profile) return null;

  const initials = (profile.name || profile.email || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Open profile"
      >
        {profile.image ? (
          <Avatar src={profile.image} alt={profile.name || "User"} />
        ) : (
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-0 flex items-start justify-end p-4">
            <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0d0f1a]/95 backdrop-blur p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                {profile.image ? (
                  <Avatar src={profile.image} alt={profile.name || "User"} />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {profile.name || "Member"}
                  </div>
                  <div className="text-white/60 text-sm truncate">
                    {profile.email}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-white/60 text-sm">Subscription:</span>
                <Badge>{profile.subscriptionStatus}</Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <a
                  href="/account"
                  className="text-center rounded-lg bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
                >
                  Manage
                </a>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="rounded-lg bg-white/10 text-white px-4 py-2 text-sm font-medium hover:bg-white/20"
                >
                  Sign out
                </button>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-3 w-full text-center text-sm text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
