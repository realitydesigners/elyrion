"use client";
import { createClient } from "@/lib/supabase/client";
import { getURL } from "@/utils/helpers";
import type { Provider } from "@supabase/supabase-js";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

function useSignInWithOAuth(redirect?: string | null) {
  const supabase = createClient();

  return async (e: React.FormEvent<HTMLFormElement>, provider: Provider) => {
    e.preventDefault();
    const redirectURL = redirect
      ? getURL(`/api/auth/callback?redirect=${encodeURIComponent(redirect)}`)
      : getURL("/api/auth/callback");

    if (provider === "discord") {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectURL,
          scopes: "identify",
        },
      });
    } else {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectURL,
        },
      });
    }
  };
}

function useSignInWithEmail(redirect?: string | null) {
  const supabase = createClient();

  return async (email: string) => {
    const redirectURL = redirect
      ? getURL(`/api/auth/callback?redirect=${encodeURIComponent(redirect)}`)
      : getURL("/api/auth/callback");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectURL,
      },
    });

    return { error };
  };
}

function SignInContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const signInWithOAuth = useSignInWithOAuth(redirect);
  const signInWithEmail = useSignInWithEmail(redirect);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithOAuth(e, "google");
    } catch (error) {
      console.error("OAuth sign-in error:", error);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await signInWithEmail(email);
      if (error) {
        if ((error as any).message?.includes("already in use")) {
          setMessage(
            "This email is already registered with a different sign-in method. Please use Google sign-in instead."
          );
        } else {
          setMessage("Error sending login link. Please try again.");
        }
      } else {
        setMessage("Check your email for the login link!");
        setEmail("");
      }
    } catch (_error) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative  w-full overflow-hidden">
      <div className="relative flex min-h-[100vh] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px] space-y-12 sm:max-w-[380px] lg:w-[420px] lg:max-w-lg">
          <div className="space-y-4">
            <div className="space-y-3">
              <h1 className="font-russo bg-gradient-to-br text-white text-4xl font-bold  sm:text-5xl lg:text-5xl">
                Welcome to Elyrion
              </h1>
              <p className="font-outfit  max-w-[90%] text-base primary-text/90 sm:text-lg">
                Sign in to access your classes and the archive.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleEmailSignIn} className="mb-4">
              <div className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg font-outfit bg-[#1C1E23] px-4 py-2  text-white placeholder:primary-text focus:ring-2 focus:ring-neutral-500/20 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-lg bg-[#1C1E23] p-[1px] transition-all duration-300 hover:scale-[1.01] focus:ring-2 focus:ring-neutral-500/20 focus:outline-none active:scale-[0.99]"
                >
                  <span className="relative flex w-full items-center justify-center rounded-lg bg-white px-6 py-3 font-mono text-base font-medium text-neutral-900 shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:bg-neutral-100 lg:py-2.5">
                    <div className="absolute inset-0 -translate-x-full animate-[shine-loop_5s_ease-in-out_infinite] bg-[linear-gradient(-60deg,transparent_0%,transparent_25%,rgba(229,231,235,0.9)_35%,rgba(229,231,235,0.9)_45%,transparent_75%,transparent_100%)] group-hover:animate-[shine-loop_5s_ease-in-out_infinite]" />
                    <span className="relative text-base sm:text-base font-outfit">
                      {isLoading ? "Sending..." : "Sign in with Email"}
                    </span>
                  </span>
                </button>
              </div>
              {message && (
                <p className="mt-2 text-center text-sm primary-text">
                  {message}
                </p>
              )}
            </form>

            <div className="relative flex items-center justify-center">
              <span className="relative px-4 text-xs primary-text font-outfit">
                Or continue with
              </span>
            </div>

            <form onSubmit={handleSignIn}>
              <button
                className="group relative w-full overflow-hidden rounded-lg bg-[#1C1E23] p-[1px] transition-all duration-300 hover:scale-[1.01] focus:ring-2 focus:ring-neutral-500/20 focus:outline-none active:scale-[0.99]"
                type="submit"
              >
                <span className="relative flex w-full items-center justify-center rounded-lg bg-white px-6 py-3 font-mono text-base font-medium text-neutral-900 shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:bg-neutral-100 lg:py-2.5">
                  <div className="absolute inset-0 -translate-x-full animate-[shine-loop_5s_ease-in-out_infinite] bg-[linear-gradient(-60deg,transparent_0%,transparent_25%,rgba(229,231,235,0.9)_35%,rgba(229,231,235,0.9)_45%,transparent_75%,transparent_100%)] group-hover:animate-[shine-loop_5s_ease-in-out_infinite]" />
                  <FcGoogle className="relative mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-5 sm:w-5" />
                  <span className="relative text-base sm:text-base font-outfit">
                    Continue with Google
                  </span>
                </span>
              </button>
            </form>
            <p className="text-center font-mono text-xs primary-text/90 font-outfit">
              Currently in beta. By signing in, you agree to our {""}
              <a href="/terms" className="text-white">
                Terms of Service
              </a>{" "}
              and {""}
              <a href="/privacy" className="text-white">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full overflow-hidden">
          <div className="relative flex min-h-[100vh] flex-col items-center justify-center px-6 py-16">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
