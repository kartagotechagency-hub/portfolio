import React from "react";

interface BrandLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Custom geometric wordmark matching the KartagoTech Agency identity:
 * "K Λ R T Λ G O T E C H" with chevron A's and tracked "A G E N C Y" in #8291EA.
 */
export function BrandLogo({
  variant = "dark",
  size = "md",
  className = "",
}: BrandLogoProps) {
  const primaryFill = variant === "dark" ? "#111318" : "#FFFFFF";
  const accentFill = "#8291EA";

  const dimensions = {
    sm: { width: 156, height: 30 },
    md: { width: 192, height: 37 },
    lg: { width: 240, height: 46 },
  }[size];

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 436 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="KartagoTech Agency"
      className={className}
    >
      {/* K */}
      <path
        d="M6 8H11.5V26.2L29.5 8H36.6L20.3 24.3L37.6 44H30.5L16.4 27.9L11.5 32.8V44H6V8Z"
        fill={primaryFill}
      />
      {/* Λ (A1) */}
      <path
        d="M43 44L59.5 8H65L81.5 44H75.4L62.25 14.8L49.1 44H43Z"
        fill={primaryFill}
      />
      {/* R */}
      <path
        d="M89 8H107.5C115.2 8 120 12.2 120 18.6C120 23.8 116.4 27.6 110.4 28.8L121.2 44H114.5L104.4 29.4H94.5V44H89V8ZM94.5 12.9V24.6H107C111.7 24.6 114.4 22.3 114.4 18.7C114.4 15.1 111.7 12.9 107 12.9H94.5Z"
        fill={primaryFill}
      />
      {/* T */}
      <path d="M126 8H154V13H142.8V44H137.2V13H126V8Z" fill={primaryFill} />
      {/* Λ (A2) */}
      <path
        d="M157 44L173.5 8H179L195.5 44H189.4L176.25 14.8L163.1 44H157Z"
        fill={primaryFill}
      />
      {/* G */}
      <path
        d="M219.5 44.7C208.7 44.7 201 37.2 201 26C201 14.8 208.8 7.3 219.7 7.3C227.1 7.3 232.8 10.6 235.6 16.2L230.7 18.8C228.6 14.8 224.7 12.4 219.7 12.4C212 12.4 206.7 18 206.7 26C206.7 34 212 39.6 219.7 39.6C226 39.6 230.5 36.2 231.5 30.1H220V25.2H237.2V28.8C237.2 38.5 230.1 44.7 219.5 44.7Z"
        fill={primaryFill}
      />
      {/* O */}
      <path
        d="M262 44.7C251.2 44.7 243.5 37.2 243.5 26C243.5 14.8 251.2 7.3 262 7.3C272.8 7.3 280.5 14.8 280.5 26C280.5 37.2 272.8 44.7 262 44.7ZM262 39.6C269.6 39.6 274.8 34 274.8 26C274.8 18 269.6 12.4 262 12.4C254.4 12.4 249.2 18 249.2 26C249.2 34 254.4 39.6 262 39.6Z"
        fill={primaryFill}
      />
      {/* T */}
      <path d="M285.5 8H313.5V13H302.3V44H296.7V13H285.5V8Z" fill={primaryFill} />
      {/* E */}
      <path
        d="M320 8H345V12.9H325.5V23.2H342.5V28H325.5V39.1H345.5V44H320V8Z"
        fill={primaryFill}
      />
      {/* C */}
      <path
        d="M370.5 44.7C359.7 44.7 352 37.2 352 26C352 14.8 359.7 7.3 370.5 7.3C378.2 7.3 384.1 10.9 386.8 16.9L381.8 19.3C379.8 14.8 375.7 12.4 370.5 12.4C362.9 12.4 357.7 18 357.7 26C357.7 34 362.9 39.6 370.5 39.6C375.9 39.6 380.1 37 382.1 32.3L387.1 34.6C384.3 41 378.3 44.7 370.5 44.7Z"
        fill={primaryFill}
      />
      {/* H */}
      <path
        d="M394.5 8H400V23.2H423.5V8H429V44H423.5V28.1H400V44H394.5V8Z"
        fill={primaryFill}
      />

      {/* A G E N C Y */}
      <text
        x="218"
        y="74"
        textAnchor="middle"
        fill={accentFill}
        fontSize="18"
        fontWeight="600"
        letterSpacing="16"
        fontFamily="var(--font-manrope), var(--font-inter), sans-serif"
      >
        AGENCY
      </text>
    </svg>
  );
}
