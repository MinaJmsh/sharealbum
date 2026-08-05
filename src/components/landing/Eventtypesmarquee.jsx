import { useState } from "react";
import Separator from "./Seperator";

const ALBUM_TYPES = [
  { label: "Wedding Albums", accent: "#C98F87" },
  { label: "Travel Albums", accent: "#C9A87C" },
  { label: "Family Albums", accent: "#8DAA84" },
  { label: "Graduation Albums", accent: "#B8905E" },
  { label: "Baby Albums", accent: "#C98F87" },
  { label: "Pet Albums", accent: "#8DAA84" },
  { label: "Birthday Albums", accent: "#C9A87C" },
  { label: "Anniversary Albums", accent: "#C98F87" },
];

/**
 * Infinite horizontal marquee announcing the event types ShareAlbum
 * supports. Glass band with hairline border, edge fade mask, and a
 * seamless duplicated-track loop. Pauses on hover.
 *
 * Self-contained: keyframes are injected via <style> so it survives
 * Tailwind purge/dev-restart issues, per project convention.
 */
export default function EventTypesMarquee() {
  const [paused, setPaused] = useState(false);

  // Render the item row twice back-to-back so translateX(-50%) loops seamlessly.
  const renderTrack = (keyPrefix) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "36px",
        paddingRight: "36px",
        flexShrink: 0,
      }}
    >
      {ALBUM_TYPES.map((item, i) => (
        <div
          key={`${keyPrefix}-${i}`}
          style={{ display: "flex", alignItems: "center", gap: "36px" }}
        >
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.92rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "#5C5148",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: item.accent,
                display: "inline-block",
                boxShadow: `0 0 8px ${item.accent}66`,
              }}
            /> */}
            {item.label}
          </span>
          <Separator color="#C9A87C" size={5} opacity={0.4} />
        </div>
      ))}
    </div>
  );

  return (
    <section
      style={{
        position: "relative",
        padding: "18px 0",
        zIndex: 1,
      }}
    >
      <style>{`
        @keyframes eventTypesMarqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .event-types-marquee-track {
            animation-duration: 90s !important;
          }
        }
      `}</style>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          background: "rgba(255,252,248,0.72)",
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          borderTop: "1px solid rgba(210,200,188,0.55)",
          borderBottom: "1px solid rgba(210,200,188,0.55)",
          boxShadow:
            "0 4px 24px rgba(90,70,50,0.08), 0 1px 4px rgba(90,70,50,0.06)",
          padding: "16px 0",
          maskImage:
            "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
        }}
      >
        <div
          className="event-types-marquee-track"
          style={{
            display: "flex",
            width: "max-content",
            paddingLeft: "24px",
            animation: "eventTypesMarqueeScroll 34s linear infinite",
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform",
          }}
        >
          {renderTrack("a")}
          {renderTrack("b")}
        </div>
      </div>
    </section>
  );
}
