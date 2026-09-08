"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import InstallPrompt from "@/components/ecommerce/InstallPrompt";

export default function InstallPromptGate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") !== "1") return;
    setArmed(true);

    const params = new URLSearchParams(searchParams);
    params.delete("welcome");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!armed) return null;
  return <InstallPrompt />;
}
