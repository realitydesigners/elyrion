import React from "react";
import Spline from "@splinetool/react-spline";

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: () => void;
}

const SplineScene: React.FC<SplineSceneProps> = ({
  scene,
  className,
  onLoad,
}) => {
  return <Spline scene={scene} className={className} onLoad={onLoad} />;
};

export default SplineScene;
