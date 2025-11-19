"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileButton from "@/components/ProfileButton";
import {
  HiPlay,
  HiArchiveBox,
  HiMicrophone,
  HiCreditCard,
  HiUser,
  HiSparkles,
} from "react-icons/hi2";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative overflow-hidden">
        {/* Background with enhanced glass effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-900/40 to-slate-900/80 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="absolute inset-0 border-b border-blue-500/20"></div>

        {/* Content */}
        <div className="relative flex items-center justify-between px-6 py-4">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="relative h-10 w-10 ">
                  <Image
                    src="/Elyrion.png"
                    alt="Elyrion Logo"
                    width={36}
                    height={36}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  Elyrion
                </span>
              </div>
            </Link>
          </div>

          {/* Enhanced Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink href="/dashboard" icon={HiSparkles} label="Dashboard" />
            <NavLink href="/live" icon={HiPlay} label="Live" />
            <NavLink href="/archive" icon={HiArchiveBox} label="Archive" />
            <NavLink href="/host" icon={HiMicrophone} label="Host" />
            <NavLink href="/pricing" icon={HiCreditCard} label="Pricing" />
            <NavLink href="/account" icon={HiUser} label="Account" />
          </nav>

          {/* Enhanced Profile Section */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium">Online</span>
            </div>
            <ProfileButton />
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 font-medium"
    >
      <Icon className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
      <span>{label}</span>
    </Link>
  );
}
