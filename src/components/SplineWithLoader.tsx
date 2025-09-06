"use client";

import React, { useState, useEffect, Suspense } from "react";
import SplineScene from "./SplineScene";
import SplineLoader from "./SplineLoader";

interface SplineWithLoaderProps {
  scene: string;
  className?: string;
}

const SplineWithLoader: React.FC<SplineWithLoaderProps> = ({
  scene,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);

  useEffect(() => {
    // Ensure loader shows for at least 100ms
    const timer = setTimeout(() => {
      setMinLoadingTime(false);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  const shouldShowLoader = isLoading || minLoadingTime;

  return (
    <div className="relative w-full h-full">
      {shouldShowLoader && <SplineLoader />}
      <Suspense fallback={null}>
        <SplineScene
          scene={scene}
          className={`${className} ${
            shouldShowLoader ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onLoad={handleSplineLoad}
        />
      </Suspense>
    </div>
  );
};

export default SplineWithLoader;
