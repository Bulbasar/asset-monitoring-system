"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CMSPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first module (Brands) when CMS is loaded
    router.replace("/cms/brands");
  }, [router]);

  return null;
}
