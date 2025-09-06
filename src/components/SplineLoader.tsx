import React from "react";

const SplineLoader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      {/* Main loading spinner container */}
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="absolute w-24 h-24 border-2 border-transparent border-t-purple-500 border-r-purple-500/50 rounded-full animate-spin"></div>

        {/* Middle rotating ring */}
        <div
          className="absolute w-16 h-16 border-2 border-transparent border-t-pink-500 border-l-pink-500/50 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>

        {/* Inner rotating ring */}
        <div
          className="absolute w-8 h-8 border-2 border-transparent border-t-white border-b-white/50 rounded-full animate-spin"
          style={{ animationDuration: "0.8s" }}
        ></div>

        {/* Center pulsing dot */}
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-white rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default SplineLoader;
