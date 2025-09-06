import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white",
        className
      )}
    >
      {children}
    </span>
  );
}


