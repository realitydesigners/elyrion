import Image from "next/image";
import { HiSearch, HiShoppingCart, HiMenu } from "react-icons/hi";
import SplineWithLoader from "@/components/SplineWithLoader";
import AuthButton from "@/components/AuthButton";
import NextClassBanner from "@/components/NextClassBanner";

export default function App() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Header is global; hero below */}
      <NextClassBanner />

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
