"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg bg-[#1C1E23] px-3 py-2 text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-neutral-500/20",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
