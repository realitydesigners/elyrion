import Image from "next/image";
import { HiSearch, HiUser, HiShoppingCart, HiMenu } from "react-icons/hi";

import SplineWithLoader from "@/components/SplineWithLoader";

export default function App() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="flex items-center justify-between backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-xl border border-white/15 dark:border-white/15 shadow-2xl px-2 py-2 lg:px-4 lg:py-2">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Image
              src="/Elyrion-logo.png"
              alt="Elyrion Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-white">Elyrion</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Reality Recode
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Written Works
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Policies
            </a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <HiSearch className="w-5 h-5 text-white" />
            </button>

            {/* Person Icon */}
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <HiUser className="w-5 h-5 text-white" />
            </button>

            {/* Cart Icon with Badge */}
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors relative">
              <HiShoppingCart className="w-5 h-5 text-white" />
              {/* Cart Badge */}
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <HiMenu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Spline */}
      <section className="relative w-full h-screen">
        <SplineWithLoader
          scene="https://prod.spline.design/F6BcbYJkSdRDdQTg/scene.splinecode"
          className="absolute inset-0 w-full h-full"
        />
      </section>

      {/* Reality Recode System */}
      {/* <RealityRecode /> */}
    </div>
  );
}
