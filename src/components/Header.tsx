"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileButton from "@/components/ProfileButton";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="flex items-center justify-between backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-xl border border-white/15 dark:border-white/15 shadow-2xl px-2 py-2 lg:px-4 lg:py-2">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Elyrion-logo.png"
              alt="Elyrion Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-white">Elyrion</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/live"
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Live
          </Link>
          <Link
            href="/archive"
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Archive
          </Link>
          <Link
            href="/host"
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Host
          </Link>
          <Link
            href="/pricing"
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Pricing
          </Link>
          <Link
            href="/account"
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Account
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
