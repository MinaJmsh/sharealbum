import { CameraIcon, QrIcon } from "./LandingPageShared";

export default function PhoneMockup() {
  const photos = [
    { color: "linear-gradient(135deg,#E8C5C0,#DDA8A0)", label: "Sophie & Tom" },
    { color: "linear-gradient(135deg,#C8D5C0,#A8BFA0)", label: "Garden Party" },
    { color: "linear-gradient(135deg,#D4B896,#C9A87C)", label: "Ceremony" },
    { color: "linear-gradient(135deg,#DDA8A0,#C98F87)", label: "First Dance" },
    { color: "linear-gradient(135deg,#A8BFA0,#8DAA84)", label: "Reception" },
    { color: "linear-gradient(135deg,#C9A87C,#B8905E)", label: "Speeches" },
  ];

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "4px",
              marginBottom: "14px",
            }}
          >
            {photos.map((p, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: "8px",
                  background: p.color,
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "4px",
                  position: "relative",
                  overflow: "hidden",
                  animation: `fadeIn 0.4s ease both ${i * 80}ms`,
                }}
              >
                <span
                  style={{
                    fontSize: "0.55rem",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "'DM Sans',sans-serif",
                    background: "rgba(0,0,0,0.2)",
                    padding: "1px 4px",
                    borderRadius: "3px",
                  }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
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
