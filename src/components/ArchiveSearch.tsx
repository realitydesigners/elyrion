"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";

export default function ArchiveSearch({
  placeholder = "Search classes...",
}: {
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
        ref.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <Input ref={ref} placeholder={placeholder} />;
}
