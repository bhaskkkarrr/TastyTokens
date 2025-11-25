// LoadingDots.jsx
import React from "react";

/**
 * LoadingDots
 * Props:
 *  - size: size of each dot in px (default 10)
 *  - color: CSS color string or Tailwind color class (default "#059669" (emerald-600))
 *  - speed: animation duration in seconds (default 0.6)
 *  - className: extra classes for container
 */
export default function LoadingDots({
  size = 10,
  color = "#059669",
  speed = 0.6,
  className = "",
}) {
  const style = {
    // Inline CSS variables passed to the stylesheet below
    ["--dot-size"]: `${size}px`,
    ["--dot-color"]: color,
    ["--anim-speed"]: `${speed}s`,
  };

  return (
    <div
      className={`loading-dots inline-flex items-end gap-1 ${className}`}
      style={style}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span className="sr-only">Loading…</span>

      <span
        className="dot"
        aria-hidden="true"
        style={{ animationDelay: "0s" }}
      />
      <span
        className="dot"
        aria-hidden="true"
        style={{ animationDelay: "0.12s" }}
      />
      <span
        className="dot"
        aria-hidden="true"
        style={{ animationDelay: "0.24s" }}
      />

      <style>{`
        .loading-dots {
          /* ensures dots sit baseline and can animate upward */
          align-items: flex-end;
        }

        .dot {
          width: var(--dot-size);
          height: var(--dot-size);
          background: var(--dot-color);
          border-radius: 9999px;
          display: inline-block;
          transform: translateY(0);
          animation-name: bounceY;
          animation-duration: var(--anim-speed);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes bounceY {
          0%   { transform: translateY(0); }
          25%  { transform: translateY(-8px); }
          50%  { transform: translateY(0); }
          100% { transform: translateY(0); }
        }

        /* If you want slightly more separation at small sizes */
        @media (max-width: 420px) {
          .loading-dots { gap: 6px; }
        }
      `}</style>
    </div>
  );
}
