// Self-contained vertical photo marquee — does NOT depend on the
// src/components/ui/marquee.jsx Tailwind-based component or on
// tailwind.config.js having "marquee"/"marquee-vertical" keyframes
// registered. All animation is plain CSS injected via a <style> tag,
// so it's guaranteed to move regardless of Tailwind build/purge state.

// Placeholder wedding/event photography — swap for real ShareAlbum
// event photos (or Supabase Storage covers) when ready.
// const PHOTOS = [
//   "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1470753937643-efeb931202a9?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=400&auto=format&fit=crop&q=70",
//   "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format&fit=crop&q=70",
// ];
// Auto-import all images from src/assets/images
const imageModules = import.meta.glob(
  "../../assets/images/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
);

const PHOTOS = Object.values(imageModules);

// Each column gets the FULL photo set, just rotated to a different starting
// point so columns don't look identical. This guarantees every column has
// enough total content height to fill a tall section without gaps, no
// matter how tall the section ends up being.
function rotatedPhotos(offset) {
  return [...PHOTOS.slice(offset), ...PHOTOS.slice(0, offset)];
}

function splitIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => columns[i % columnCount].push(item));
  return columns;
}

function PhotoCard({ src }) {
  return (
    <figure
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 6px 20px rgba(90,70,50,0.12)",
        background: "rgba(255,252,248,0.4)",
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        style={{
          width: "100%",
          aspectRatio: "3 / 4",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(201,168,124,0.06), rgba(201,168,124,0.16))",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
    </figure>
  );
}

function MarqueeColumn({ photos, duration = 30, reverse = false, gap = 12 }) {
  // Repeat the base set several times, then duplicate that whole block once
  // more. translateY(0 -> -50%) always lines up perfectly this way, and the
  // extra repeats guarantee the track is far taller than any container —
  // even with as few as 2-3 unique photos in a column — so there's never a
  // run of empty space at the bottom, no matter the section height.
  const REPEATS = 5;
  const base = Array.from({ length: REPEATS }, () => photos).flat();
  const doubled = [...base, ...base];

  return (
    <div style={{ flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
      <div
        className="pm-track"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((src, j) => (
          <PhotoCard key={j} src={src} />
        ))}
      </div>
    </div>
  );
}

/**
 * Vertical multi-column photo marquee, fully self-contained CSS animation.
 * Fills whatever height its parent gives it (use height:100% on the parent
 * grid cell / flex item) — no card, no border-radius, no shadow, no fixed
 * box around the whole thing.
 */
export default function PhotoMarquee() {
  const cols2 = splitIntoColumns(PHOTOS, 2);
  const cols3 = splitIntoColumns(PHOTOS, 3);
  const cols4 = splitIntoColumns(PHOTOS, 4);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <style>{`
        @keyframes pm-scroll-y {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .pm-track {
          animation-name: pm-scroll-y;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .pm-cols { display: flex; height: 100%; gap: 12px; }
        .pm-cols-2 { display: flex; }
        .pm-cols-3, .pm-cols-4 { display: none; }
        @media (min-width: 480px) {
          .pm-cols-2 { display: none; }
          .pm-cols-3 { display: flex; }
        }
        @media (min-width: 720px) {
          .pm-cols-3 { display: none; }
          .pm-cols-4 { display: flex; }
        }
      `}</style>

      <div className="pm-cols pm-cols-2">
        {cols2.map((col, i) => (
          <MarqueeColumn
            key={i}
            photos={col}
            duration={90}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
      <div className="pm-cols pm-cols-3">
        {cols3.map((col, i) => (
          <MarqueeColumn
            key={i}
            photos={col}
            duration={100}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
      <div className="pm-cols pm-cols-4">
        {cols4.map((col, i) => (
          <MarqueeColumn
            key={i}
            photos={col}
            duration={110}
            reverse={i % 2 === 1}
          />
        ))}
      </div>

      {/* top/bottom fade into the ivory page background */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "12%",
          background: "linear-gradient(180deg, #FAF7F2 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "12%",
          background: "linear-gradient(0deg, #FAF7F2 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
