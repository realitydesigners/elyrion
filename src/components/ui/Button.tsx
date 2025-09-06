"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const map: Record<Variant, string> = {
      primary:
        "bg-white text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-400",
      secondary:
        "bg-white/10 text-white hover:bg-white/20 border border-white/20 focus:ring-white/30",
      outline:
        "bg-transparent text-white border border-white/25 hover:bg-white/10 focus:ring-white/30",
      ghost: "bg-transparent text-white hover:bg-white/10 focus:ring-white/30",
    };
    return (
      <button
        ref={ref}
        className={cn(base, map[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
