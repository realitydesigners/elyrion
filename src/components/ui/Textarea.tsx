"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg bg-[#1C1E23] px-3 py-2 text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-neutral-500/20",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
