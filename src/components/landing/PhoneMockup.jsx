import { CameraIcon, QrIcon } from "./LandingPageShared";

// Small wedding-aesthetic photo set for the phone mockup marquee.
// Swap for real ShareAlbum ceremony photos when available.
const MOCKUP_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1470753937643-efeb931202a9?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=160&auto=format&fit=crop&q=60",
];

function splitIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => columns[i % columnCount].push(item));
  return columns;
}

function MiniPhotoCard({ src }) {
  return (
    <div
      style={{
        aspectRatio: "1",
        borderRadius: "8px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(201,168,124,0.05), rgba(201,168,124,0.18))",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}

function MiniMarqueeColumn({ photos, duration, reverse }) {
  const REPEATS = 4;
  const base = Array.from({ length: REPEATS }, () => photos).flat();
  const doubled = [...base, ...base];

  return (
    <div style={{ flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
      <div
        className="phone-marquee-track"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((src, j) => (
          <MiniPhotoCard key={j} src={src} />
        ))}
      </div>
    </div>
  );
}

// Three-column vertical marquee, sized to sit inside the phone mockup body.
// Self-contained CSS animation (own injected @keyframes) so it doesn't
// depend on any Tailwind marquee config.
function PhotoMarqueeMini({ height = 320 }) {
  const columns = splitIntoColumns(MOCKUP_PHOTOS, 3);

  return (
    <div
      style={{
        position: "relative",
        height: `${height}px`,
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "14px",
      }}
    >
      <style>{`
        @keyframes phone-marquee-scroll-y {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .phone-marquee-track {
          animation-name: phone-marquee-scroll-y;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>

      <div style={{ display: "flex", height: "100%", gap: "4px" }}>
        {columns.map((col, i) => (
          <MiniMarqueeColumn
            key={i}
            photos={col}
            duration={35 + i * 3}
            reverse={i % 2 === 1}
          />
        ))}
      </div>

      {/* fade into the phone's ivory background top/bottom */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "18%",
          background: "linear-gradient(180deg, #FAF7F2 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "18%",
          background: "linear-gradient(0deg, #FAF7F2 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function PhoneMockup() {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          background:
            "radial-gradient(ellipse,rgba(201,168,124,0.2) 0%,transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          width: "260px",
          background: "#2E2520",
          borderRadius: "38px",
          padding: "10px",
          boxShadow:
            "0 32px 80px rgba(46,37,32,0.35),0 0 0 1px rgba(255,255,255,0.08) inset",
          position: "relative",
        }}
      >
        <div
          style={{
            background: "#FAF7F2",
            borderRadius: "30px",
            overflow: "hidden",
            minHeight: "520px",
            padding: "20px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
              padding: "0 4px",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                color: "#5C5148",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
              }}
            >
              9:41
            </span>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {[4, 6, 8].map((h) => (
                <div
                  key={h}
                  style={{
                    width: "3px",
                    height: `${h}px`,
                    background: "#5C5148",
                    borderRadius: "1px",
                  }}
                />
              ))}
              <div
                style={{
                  width: "14px",
                  height: "6px",
                  border: "1.5px solid #5C5148",
                  borderRadius: "2px",
                  marginLeft: "3px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "1px",
                    top: "1px",
                    width: "7px",
                    height: "2px",
                    background: "#5C5148",
                    borderRadius: "1px",
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg,#C9A87C,#C98F87)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#2E2520",
                  }}
                >
                  Sophie & Tom's Wedding
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#9A8F85",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  247 photos · 48 contributors
                </div>
              </div>
            </div>
          </div>

          <PhotoMarqueeMini height={320} />

          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "linear-gradient(135deg,#C9A87C,#B8905E)",
              borderRadius: "12px",
              border: "none",
              color: "white",
              fontSize: "0.78rem",
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <CameraIcon /> Add your photos
          </button>
        </div>
        <div
          style={{
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
      <div
        className="phone-badge-right"
        style={{
          position: "absolute",
          top: "60px",
          right: "-50px",
          background: "rgba(255,252,248,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(201,168,124,0.35)",
          borderRadius: "14px",
          padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(90,70,50,0.12)",
          animation: "orbFloat2 4s ease-in-out infinite",
          width: "160px",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            color: "#5C5148",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 500,
          }}
        >
          📸 New upload
        </div>
        <div
          style={{
            fontSize: "0.65rem",
            color: "#9A8F85",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Anna added 14 photos
        </div>
      </div>
      <div
        className="phone-badge-left"
        style={{
          position: "absolute",
          bottom: "40px",
          left: "-55px",
          background: "rgba(255,252,248,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(210,200,188,0.55)",
          borderRadius: "14px",
          padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(90,70,50,0.12)",
          animation: "orbFloat3 5s ease-in-out infinite",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div style={{ color: "#C9A87C" }}>
          <QrIcon />
        </div>
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "#2E2520",
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 600,
            }}
          >
            Scan to join
          </div>
          <div
            style={{
              fontSize: "0.6rem",
              color: "#9A8F85",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            No sign-up needed
          </div>
        </div>
      </div>
    </div>
  );
}
