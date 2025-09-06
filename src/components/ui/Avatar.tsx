import Image from "next/image";
import { cn } from "@/lib/cn";

export function Avatar({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  return (
    <div className={cn("h-8 w-8 rounded-full bg-white/10 overflow-hidden", className)}>
      {src ? (
        <Image src={src} alt={alt ?? ""} width={32} height={32} className="h-full w-full object-cover" />
      ) : null}
    </div>
  );
}


