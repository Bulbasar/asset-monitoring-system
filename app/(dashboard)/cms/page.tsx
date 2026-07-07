"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CMSPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if we're already on the correct path
    if (window.location.pathname === "/cms") {
      router.replace("/cms/brands");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-muted-foreground">Redirecting to Brands...</div>
    </div>
  );
}
