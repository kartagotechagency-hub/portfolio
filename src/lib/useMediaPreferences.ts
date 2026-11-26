"use client";

import { useEffect, useState } from "react";

export function useMediaPreferences() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const update = () => {
      setReducedMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    update();
    motionQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);

    return () => {
      motionQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  return { reducedMotion, isMobile };
}
