"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AuthButton() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabaseClient.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setIsSignedIn(Boolean(data.session));
      setLoading(false);
    });
    const { data: sub } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setIsSignedIn(Boolean(session));
      }
    );
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  return (
    <button
      onClick={() => supabaseClient.auth.signOut()}
      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
    >
      Sign out
    </button>
  );
}
