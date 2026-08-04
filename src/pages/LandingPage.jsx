// بالای فایل
import { useState, useEffect, useRef, useCallback } from "react";
// ─── Easing constants (Emil: custom curves, never built-in) ───────────────────
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_INOUT = "cubic-bezier(0.77, 0, 0.175, 1)";
// Requires at top of LandingPage.jsx:
import Step1SVG from "../assets/illustrations/step1.svg";
import Step2SVG from "../assets/illustrations/step2.svg";
import Step3SVG from "../assets/illustrations/step3.svg";

// ─── Intersection Observer Hook ───────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, ...options },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const CameraIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const QrIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
    <path d="M14 14h3v3m0 4h3m-3-3v3m-3-7h.01" />
  </svg>
);
const ImageIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const UsersIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const SparkleIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const ChevronDown = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
const DownloadIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// ─── Animated Section Wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ${EASE_OUT} ${delay}ms, transform 0.6s ${EASE_OUT} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Floating orbs background ─────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-8%",
          width: "min(520px,60vw)",
          height: "min(520px,60vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(201,168,124,0.18) 0%,transparent 70%)",
          animation: "orbFloat1 12s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-12%",
          width: "min(400px,50vw)",
          height: "min(400px,50vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(201,143,135,0.14) 0%,transparent 70%)",
          animation: "orbFloat2 15s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "15%",
          width: "min(350px,45vw)",
          height: "min(350px,45vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(141,170,132,0.12) 0%,transparent 70%)",
          animation: "orbFloat3 10s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: `background 0.4s ${EASE_OUT}, box-shadow 0.4s ${EASE_OUT}`,
        background: scrolled ? "rgba(250,247,242,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(210,200,188,0.45)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px rgba(90,70,50,0.07)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#C9A87C,#C98F87)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(201,168,124,0.35)",
              flexShrink: 0,
            }}
          >
            <ImageIcon size={16} />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "#2E2520",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            ShareAlbum
          </span>
        </div>

        <div
          className="nav-desktop"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {[
            ["#how", "How it works"],
            ["#features", "Features"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                color: "#5C5148",
                fontFamily: "'DM Sans',sans-serif",
                textDecoration: "none",
                transition: `background 0.18s ${EASE_OUT}`,
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(201,168,124,0.12)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              {label}
            </a>
          ))}
          <a
            href="#auth"
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              color: "#5C5148",
              fontFamily: "'DM Sans',sans-serif",
              textDecoration: "none",
              border: "1px solid rgba(201,168,124,0.5)",
              transition: `all 0.18s ${EASE_OUT}`,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(201,168,124,0.12)";
              e.target.style.borderColor = "rgba(201,168,124,0.8)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "rgba(201,168,124,0.5)";
            }}
          >
            Log in
          </a>
          <a
            href="#auth"
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              color: "#FAF7F2",
              fontFamily: "'DM Sans',sans-serif",
              textDecoration: "none",
              background: "linear-gradient(135deg,#C9A87C,#B8905E)",
              boxShadow: "0 2px 12px rgba(201,168,124,0.4)",
              transition: `box-shadow 0.18s ${EASE_OUT}, transform 0.18s ${EASE_OUT}`,
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 6px 20px rgba(201,168,124,0.6)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 2px 12px rgba(201,168,124,0.4)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Sign up free
          </a>
        </div>

        <button
          className="nav-mobile"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#5C5148",
            display: "none",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          className="nav-mobile"
          style={{
            background: "rgba(250,247,242,0.97)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(210,200,188,0.4)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {[
            ["#how", "How it works"],
            ["#features", "Features"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "12px 0",
                fontSize: "0.95rem",
                color: "#5C5148",
                fontFamily: "'DM Sans',sans-serif",
                textDecoration: "none",
                borderBottom: "1px solid rgba(210,200,188,0.3)",
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#auth"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: "12px 0",
              fontSize: "0.95rem",
              color: "#5C5148",
              fontFamily: "'DM Sans',sans-serif",
              textDecoration: "none",
              borderBottom: "1px solid rgba(210,200,188,0.3)",
            }}
          >
            Log in
          </a>
          <a
            href="#auth"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: "4px",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "0.95rem",
              color: "#FAF7F2",
              fontFamily: "'DM Sans',sans-serif",
              textDecoration: "none",
              background: "linear-gradient(135deg,#C9A87C,#B8905E)",
              textAlign: "center",
            }}
          >
            Sign up free
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [scanHover, setScanHover] = useState(false);
  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#FAF7F2",
        display: "flex",
        alignItems: "center",
      }}
    >
      <FloatingOrbs />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(210,200,188,0.22) 1px,transparent 1px),linear-gradient(90deg,rgba(210,200,188,0.22) 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)",
        }}
      />
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "120px 24px 80px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="hero-grid">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "100px",
                background: "rgba(255,252,248,0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(201,168,124,0.4)",
                boxShadow: "0 2px 12px rgba(90,70,50,0.08)",
                marginBottom: "28px",
                animation: "fadeUp 0.6s ease both 0.1s",
              }}
            >
              <span style={{ color: "#C9A87C", display: "flex" }}>
                <SparkleIcon />
              </span>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "#9A8F85",
                  fontFamily: "'DM Sans',sans-serif",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Shared memories, beautifully organized
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: "clamp(2.6rem,5vw,4.2rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                color: "#2E2520",
                marginBottom: "24px",
                animation: "fadeUp 0.6s ease both 0.2s",
              }}
            >
              Every moment,
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A87C" }}>
                shared instantly.
              </em>
            </h1>

            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "clamp(0.95rem,2vw,1.05rem)",
                lineHeight: 1.7,
                color: "#5C5148",
                maxWidth: "420px",
                marginBottom: "40px",
                animation: "fadeUp 0.6s ease both 0.35s",
              }}
            >
              Scan the event QR code, upload your photos, and watch the gallery
              come alive in real time — no app download needed for guests.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                animation: "fadeUp 0.6s ease both 0.45s",
              }}
            >
              <button
                onMouseEnter={() => setScanHover(true)}
                onMouseLeave={() => setScanHover(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 26px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#C9A87C 0%,#B8905E 100%)",
                  color: "#FAF7F2",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.92rem",
                  fontWeight: 500,
                  border: "none",
                  boxShadow: scanHover
                    ? "0 10px 32px rgba(201,168,124,0.55)"
                    : "0 4px 20px rgba(201,168,124,0.4)",
                  cursor: "pointer",
                  transform: scanHover ? "translateY(-2px)" : "translateY(0)",
                  transition: `transform 0.2s ${EASE_OUT}, box-shadow 0.2s ${EASE_OUT}`,
                }}
              >
                <CameraIcon size={18} /> Scan to open gallery
              </button>
              <a
                href="#auth"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 26px",
                  borderRadius: "14px",
                  background: "rgba(255,252,248,0.8)",
                  backdropFilter: "blur(8px)",
                  color: "#5C5148",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.92rem",
                  fontWeight: 500,
                  border: "1px solid rgba(210,200,188,0.7)",
                  boxShadow: "0 4px 16px rgba(90,70,50,0.06)",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: `transform 0.2s ${EASE_OUT}, box-shadow 0.2s ${EASE_OUT}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(90,70,50,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(90,70,50,0.06)";
                }}
              >
                Create an event <ArrowRight />
              </a>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "40px",
                animation: "fadeUp 0.6s ease both 0.55s",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex" }}>
                {["#C9A87C", "#C98F87", "#8DAA84", "#D4B896", "#A8BFA0"].map(
                  (c, i) => (
                    <div
                      key={i}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${c},${c}cc)`,
                        border: "2.5px solid #FAF7F2",
                        marginLeft: i ? "-8px" : 0,
                      }}
                    />
                  ),
                )}
              </div>
              <div>
                <div
                  style={{ display: "flex", gap: "2px", marginBottom: "3px" }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} style={{ color: "#C9A87C" }}>
                      <StarIcon />
                    </span>
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#9A8F85",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Loved by <strong style={{ color: "#5C5148" }}>12,000+</strong>{" "}
                  event hosts
                </span>
              </div>
            </div>
          </div>

          <div
            className="hero-phone"
            style={{
              display: "flex",
              justifyContent: "center",
              animation: "fadeUp 0.8s ease both 0.3s",
            }}
          >
            <PhoneMockup />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            opacity: 0.5,
            animation: "fadeIn 1s ease both 1.5s",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9A8F85",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Scroll to explore
          </span>
          <div style={{ animation: "bounce 2s infinite" }}>
            <ChevronDown />
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    num: "01",
    title: "Scan the QR code",
    body: "Each event generates a unique code. Guests scan it on arrival — no app, no account, no friction.",
    accent: "#C9A87C",
    tag: "For guests",
    svg: Step1SVG,
  },
  {
    num: "02",
    title: "Capture & upload",
    body: "Open the camera directly in the gallery. Photos appear in the shared album the moment they're taken.",
    accent: "#C98F87",
    tag: "Instant sharing",
    svg: Step2SVG,
  },
  {
    num: "03",
    title: "Keep every memory",
    body: "See every perspective in one organized, beautiful space. Download the full album as a ZIP anytime.",
    accent: "#8DAA84",
    tag: "Forever yours",
    svg: Step3SVG,
  },
];

// ── Thin vertical progress track — fills TOP → BOTTOM, continuous ──────────
function ProgressTrack({ fillProgress }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        height: "100%",
        width: "3px",
      }}
      aria-hidden="true"
    >
      {STEPS.map((step, i) => {
        const segFill = Math.max(0, Math.min(1, fillProgress - i));
        return (
          <div
            key={i}
            style={{
              position: "relative",
              flex: 1,
              width: "3px",
              borderRadius: "2px",
              background: "rgba(210,200,188,0.35)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${segFill * 100}%`,
                borderRadius: "2px",
                background: step.accent,
                transition: "height 0.12s linear",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Left visual — bare SVG, no card, fit to a fixed measured height ────────
function StepVisual({ activeIndex, fixedHeight }) {
  const s = STEPS[activeIndex];
  return (
    <div
      style={{
        position: "relative",
        height: fixedHeight ? `${fixedHeight}px` : "260px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        transition: `height 0.2s ${EASE_OUT}`,
      }}
    >
      <div style={{ position: "relative", flex: 1, width: "100%" }}>
        {STEPS.map((step, i) => (
          <img
            key={i}
            src={step.svg}
            alt={step.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: i === activeIndex ? 1 : 0,
              transform: i === activeIndex ? "scale(1)" : "scale(0.96)",
              transition: `opacity 0.45s ${EASE_OUT}, transform 0.45s ${EASE_OUT}`,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── One row in the step list ────────────────────────────────────────────────
function StepRow({ step, index, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(index)}
      style={{
        display: "flex",
        gap: "18px",
        padding: "clamp(14px,2vw,20px) 4px",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isActive
            ? "clamp(2rem,2.8vw,2.6rem)"
            : "clamp(1.6rem,2.2vw,2rem)",
          fontWeight: 600,
          lineHeight: 1,
          color: isActive ? step.accent : "rgba(92,81,72,0.22)",
          transition: `all 0.4s ${EASE_OUT}`,
          minWidth: "50px",
        }}
      >
        {step.num}
      </span>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
            fontWeight: 600,
            color: isActive ? "#2E2520" : "rgba(46,37,32,0.5)",
            marginBottom: "6px",
            lineHeight: 1.25,
            transition: `color 0.4s ${EASE_OUT}`,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.84rem",
            lineHeight: 1.65,
            color: isActive ? "#5C5148" : "rgba(92,81,72,0.45)",
            transition: `color 0.4s ${EASE_OUT}`,
            maxWidth: "44ch",
          }}
        >
          {step.body}
        </p>
      </div>
    </div>
  );
}

// ── Main exported section ────────────────────────────────────────────────────
function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [rightColHeight, setRightColHeight] = useState(null);

  const outerRef = useRef(null); // tall pinning wrapper
  const rightColRef = useRef(null); // description column — measured, never stretched
  const rafRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Measure the right column's natural height and mirror it onto the SVG slot
  useEffect(() => {
    const el = rightColRef.current;
    if (!el) return;
    const update = () => setRightColHeight(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [isMobile]);

  // Progress driven by how far we've scrolled through the tall outer wrapper
  useEffect(() => {
    const compute = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolled = -rect.top;
      const raw = (scrolled / scrollable) * STEPS.length;
      const clamped = Math.max(0, Math.min(STEPS.length - 0.001, raw));

      setFillProgress(clamped);
      setActiveIndex(
        Math.min(STEPS.length - 1, Math.max(0, Math.floor(clamped))),
      );
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        compute();
        rafRef.current = null;
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleStepClick = useCallback((i) => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const targetFraction = (i + 0.5) / STEPS.length;
    const targetY = window.scrollY + rect.top + scrollable * targetFraction;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  // Extra scroll runway per step. Mobile needs less since content is shorter.
  const wrapperHeight = isMobile
    ? `${STEPS.length * 70}svh`
    : `${STEPS.length * 90}vh`;
  const pinnedHeight = isMobile ? "100svh" : "100vh";

  return (
    <section id="how" style={{ background: "#FAF7F2", position: "relative" }}>
      <div
        ref={outerRef}
        style={{ position: "relative", height: wrapperHeight }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: pinnedHeight,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            padding: isMobile
              ? "clamp(56px, 10vw, 80px) clamp(16px, 5vw, 24px)"
              : "clamp(72px, 8vw, 96px) clamp(16px, 5vw, 40px)",
            boxSizing: "border-box",
          }}
        >
          {/* Ambient radial backgrounds */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `
                radial-gradient(ellipse at 15% 30%, rgba(232,197,192,0.14) 0%, transparent 55%),
                radial-gradient(ellipse at 85% 70%, rgba(212,184,150,0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(200,213,192,0.08) 0%, transparent 60%)
              `,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              position: "relative",
              width: "100%",
            }}
          >
            <div
              style={{
                marginBottom: isMobile ? "20px" : "clamp(32px, 5vw, 48px)",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#C9A87C",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                How it works
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: isMobile
                    ? "clamp(1.5rem, 6vw, 1.9rem)"
                    : "clamp(1.8rem, 3.6vw, 2.6rem)",
                  fontWeight: 600,
                  color: "#2E2520",
                  marginTop: "8px",
                  lineHeight: 1.1,
                  textWrap: "balance",
                }}
              >
                Three steps.{" "}
                <em
                  style={{ fontStyle: "italic", color: "rgba(46,37,32,0.4)" }}
                >
                  One shared moment.
                </em>
              </h2>
            </div>

            {isMobile ? (
              <div>
                <div style={{ marginBottom: "8px" }}>
                  <StepVisual
                    activeIndex={activeIndex}
                    fixedHeight={
                      rightColHeight ? Math.min(rightColHeight, 220) : 200
                    }
                  />
                </div>
                <div
                  ref={rightColRef}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {STEPS.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px" }}>
                      <div style={{ paddingTop: "6px" }}>
                        <div
                          style={{
                            width: "3px",
                            height: "100%",
                            minHeight: "58px",
                            borderRadius: "2px",
                            background: "rgba(210,200,188,0.35)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: `${Math.max(0, Math.min(1, fillProgress - i)) * 100}%`,
                              background: step.accent,
                              borderRadius: "2px",
                              transition: "height 0.12s linear",
                            }}
                          />
                        </div>
                      </div>
                      <StepRow
                        step={step}
                        index={i}
                        isActive={i === activeIndex}
                        onClick={handleStepClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Desktop: right column keeps its natural (unstretched) height;
              // that height is measured and mirrored onto the SVG slot so the
              // illustration scales to fit it via objectFit: contain.
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.85fr 24px 1.15fr",
                  gap: "0 28px",
                  alignItems: "center",
                }}
              >
                <StepVisual
                  activeIndex={activeIndex}
                  fixedHeight={rightColHeight}
                />
                <ProgressTrack fillProgress={fillProgress} />
                <div
                  ref={rightColRef}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {STEPS.map((step, i) => (
                    <StepRow
                      key={i}
                      step={step}
                      index={i}
                      isActive={i === activeIndex}
                      onClick={handleStepClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #how * { transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  );
}

// Import SVGs as modules — this is why they weren't rendering before
import f1 from "../assets/illustrations/f1.svg";
import f2 from "../assets/illustrations/f2.svg";
import f3 from "../assets/illustrations/f3.svg";
import f4 from "../assets/illustrations/f4.svg";

const ILLUSTRATIONS = { f1, f2, f3, f4 };

// ─── Features Grid — glass bento cards with fading SVG illustrations ─────────
function Features() {
  const features = [
    {
      illustration: "f1",
      title: "Instant QR access",
      body: "One code per event. Guests tap and they're in — no redirect, no download, no friction.",
      accent: "#C98F87",
      wide: true,
    },
    {
      illustration: "f2",
      title: "Collaborative albums",
      body: "Unlimited contributors. Watch the gallery grow in real time throughout the event.",
      accent: "#B8905E",
    },
    {
      illustration: "f3",
      title: "Private by default",
      body: "Access-controlled from day one. Only guests with your QR code or link can view anything.",
      accent: "#8DAA84",
    },
    {
      illustration: "f4",
      title: "HD downloads",
      body: "Original-quality downloads, always. Export individual photos or the full album as a ZIP.",
      accent: "#C98F87",
      wide: true,
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: "clamp(80px,10vw,128px) 24px",
        background: "linear-gradient(180deg,#FAF7F2 0%,#F5F0E8 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "clamp(52px,7vw,80px)" }}>
            <span
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#C9A87C",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 500,
              }}
            >
              Features
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(2rem,4vw,3.2rem)",
                fontWeight: 600,
                color: "#2E2520",
                marginTop: "10px",
                lineHeight: 1.1,
              }}
            >
              Everything your
              <br />
              <em style={{ fontStyle: "italic", color: "rgba(46,37,32,0.45)" }}>
                event needs.
              </em>
            </h2>
          </div>
        </Reveal>

        <div className="features-bento">
          {features.map((f, i) => (
            <Reveal
              key={i}
              delay={i * 50}
              className={f.wide ? "feature-wide" : ""}
            >
              <FeatureCard feature={f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature: f }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        height: "100%",
        minHeight: "260px",
        borderRadius: "22px",
        background: hov ? "rgba(255,252,248,0.78)" : "rgba(255,252,248,0.62)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: hov
          ? `1px solid ${f.accent}55`
          : "1px solid rgba(210,200,188,0.5)",
        boxShadow: hov
          ? `0 18px 48px rgba(90,70,50,0.14), 0 0 0 1px ${f.accent}18`
          : "0 4px 20px rgba(90,70,50,0.06)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: `transform 0.25s ${EASE_OUT}, box-shadow 0.25s ${EASE_OUT}, background 0.25s ${EASE_OUT}, border-color 0.25s ${EASE_OUT}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tinted glow wash behind the illustration so it reads on glass, not flat color */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "70%",
          height: "140%",
          background: `radial-gradient(ellipse at 70% 50%, ${f.accent}22 0%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />

      {/* Illustration — bleeds off the right edge, fades into the glass */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "58%",
          height: "100%",
          maskImage:
            "linear-gradient(105deg, transparent 0%, transparent 6%, black 50%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(105deg, transparent 0%, transparent 6%, black 50%, black 100%)",
          pointerEvents: "none",
          transform: hov ? "scale(1.04)" : "scale(1)",
          transition: `transform 0.5s ${EASE_OUT}`,
        }}
      >
        <img
          src={ILLUSTRATIONS[f.illustration]}
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            right: "-6%",
            transform: "translateY(-50%)",
            width: "100%",
            height: "auto",
            opacity: 0.95,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(26px,3vw,36px) clamp(24px,3vw,34px)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: "60%",
        }}
      >
        <span
          style={{
            display: "inline-block",
            alignSelf: "flex-start",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: f.accent,
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(6px)",
            border: `1px solid ${f.accent}35`,
            padding: "5px 12px",
            borderRadius: "999px",
            marginBottom: "18px",
          }}
        >
          Feature
        </span>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(1.3rem,2.4vw,1.7rem)",
            fontWeight: 600,
            color: "#2E2520",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          {f.title}
        </h3>

        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.875rem",
            lineHeight: 1.65,
            color: "#5C5148",
            flexGrow: 1,
          }}
        >
          {f.body}
        </p>

        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: f.accent,
            marginTop: "16px",
          }}
        >
          Learn more →
        </span>
      </div>
    </div>
  );
}

// ─── Auth Section ─────────────────────────────────────────────────────────────
function pwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function AuthSection() {
  const [tab, setTab] = useState("signup");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [signupError, setSignupError] = useState("");

  const strength = pwStrength(signupPassword);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#C98F87", "#C9A87C", "#A8BFA0", "#8DAA84"][
    strength
  ];

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(210,200,188,0.65)",
    background: "rgba(255,252,248,0.85)",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.875rem",
    color: "#2E2520",
    outline: "none",
    transition: `border-color 0.18s ${EASE_OUT}, box-shadow 0.18s ${EASE_OUT}`,
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#9A8F85",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  };
  function handleFocus(e) {
    e.target.style.borderColor = "rgba(201,168,124,0.7)";
    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,124,0.12)";
  }
  function handleBlur(e) {
    e.target.style.borderColor = "rgba(210,200,188,0.65)";
    e.target.style.boxShadow = "none";
  }

  const sectionStyle = {
    padding: "clamp(64px,10vw,120px) 24px",
    background: "#FAF7F2",
    position: "relative",
    overflow: "hidden",
  };
  const cardStyle = {
    background: "rgba(255,252,248,0.88)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(210,200,188,0.55)",
    borderRadius: "24px",
    padding: "clamp(28px,4vw,40px) clamp(22px,4vw,34px)",
    boxShadow: "0 8px 40px rgba(90,70,50,0.1)",
  };

  // Forgot password view
  if (showForgot) {
    return (
      <section id="auth" style={sectionStyle}>
        <div
          style={{ maxWidth: "460px", margin: "0 auto", position: "relative" }}
        >
          <Reveal>
            <button
              onClick={() => {
                setShowForgot(false);
                setForgotSent(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.875rem",
                color: "#9A8F85",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                marginBottom: "32px",
                fontFamily: "'DM Sans',sans-serif",
                transition: `color 0.18s ${EASE_OUT}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#5C5148")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8F85")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to sign in
            </button>
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "2.4rem",
                  fontWeight: 600,
                  color: "#2E2520",
                  marginBottom: "8px",
                }}
              >
                Reset password
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.875rem",
                  color: "#9A8F85",
                }}
              >
                Enter your email and we'll send you a reset link.
              </p>
            </div>
            <div style={cardStyle}>
              {forgotSent ? (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: "rgba(200,213,192,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8DAA84"
                      strokeWidth="2.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.9rem",
                      color: "#5C5148",
                      lineHeight: 1.6,
                      marginBottom: "20px",
                    }}
                  >
                    We sent a reset link to{" "}
                    <strong style={{ color: "#2E2520" }}>{forgotEmail}</strong>.
                    It may take a minute to arrive.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgot(false);
                      setForgotSent(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                      color: "white",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <button
                    onClick={() => setForgotSent(true)}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                      color: "white",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(201,168,124,0.4)",
                    }}
                  >
                    Send reset link
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  // Signup done state
  if (signupDone) {
    return (
      <section id="auth" style={sectionStyle}>
        <div style={{ maxWidth: "460px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(200,213,192,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8DAA84"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "2.2rem",
                  fontWeight: 600,
                  color: "#2E2520",
                  marginBottom: "12px",
                }}
              >
                Check your email
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.9rem",
                  color: "#5C5148",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                }}
              >
                We sent a confirmation link to{" "}
                <strong style={{ color: "#2E2520" }}>{signupEmail}</strong>.
                Click it to activate your account, then come back to sign in.
              </p>
              <button
                onClick={() => {
                  setSignupDone(false);
                  setTab("login");
                }}
                style={{
                  padding: "13px 32px",
                  borderRadius: "13px",
                  border: "none",
                  background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                  color: "white",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                }}
              >
                Go to log in
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="auth" style={sectionStyle}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px",
          height: "500px",
          background:
            "radial-gradient(ellipse,rgba(201,143,135,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{ maxWidth: "460px", margin: "0 auto", position: "relative" }}
      >
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(1.8rem,4vw,2.4rem)",
                fontWeight: 600,
                color: "#2E2520",
                marginBottom: "8px",
              }}
            >
              {tab === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.875rem",
                color: "#9A8F85",
              }}
            >
              {tab === "signup"
                ? "Free forever. No credit card needed."
                : "Sign in to manage your events and photos."}
            </p>
          </div>

          <div style={cardStyle}>
            {/* Tab switcher */}
            <div
              style={{
                display: "flex",
                background: "rgba(237,232,222,0.65)",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "28px",
              }}
            >
              {["signup", "login"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "9px",
                    border: "none",
                    cursor: "pointer",
                    background:
                      tab === t ? "rgba(255,252,248,0.95)" : "transparent",
                    color: tab === t ? "#2E2520" : "#9A8F85",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: tab === t ? 600 : 400,
                    boxShadow:
                      tab === t ? "0 2px 8px rgba(90,70,50,0.1)" : "none",
                    transition: `all 0.2s ${EASE_OUT}`,
                  }}
                >
                  {t === "signup" ? "Sign up" : "Log in"}
                </button>
              ))}
            </div>

            {/* LOGIN */}
            {tab === "login" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      style={{
                        fontSize: "0.75rem",
                        color: "#C9A87C",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                        padding: 0,
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showLoginPass ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: "40px" }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((v) => !v)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9A8F85",
                        display: "flex",
                        padding: 0,
                      }}
                    >
                      <EyeIcon open={showLoginPass} />
                    </button>
                  </div>
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "13px",
                    border: "none",
                    background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                    color: "white",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                    marginTop: "4px",
                    transition: `transform 0.18s ${EASE_OUT}, box-shadow 0.18s ${EASE_OUT}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 28px rgba(201,168,124,0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(201,168,124,0.45)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.98)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "translateY(-1px)")
                  }
                >
                  Sign in
                </button>
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.8rem",
                    color: "#9A8F85",
                    marginTop: "4px",
                  }}
                >
                  Don't have an account?{" "}
                  <button
                    onClick={() => setTab("signup")}
                    style={{
                      color: "#C9A87C",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      padding: 0,
                    }}
                  >
                    Sign up free
                  </button>
                </p>
              </div>
            )}

            {/* SIGNUP */}
            {tab === "signup" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {signupError && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "rgba(201,143,135,0.1)",
                      border: "1px solid rgba(201,143,135,0.4)",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.85rem",
                      color: "#C98F87",
                    }}
                  >
                    {signupError}
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showSignupPass ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      style={{ ...inputStyle, paddingRight: "40px" }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPass((v) => !v)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9A8F85",
                        display: "flex",
                        padding: 0,
                      }}
                    >
                      <EyeIcon open={showSignupPass} />
                    </button>
                  </div>
                  {signupPassword && (
                    <div style={{ marginTop: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          marginBottom: "4px",
                        }}
                      >
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            style={{
                              height: "3px",
                              flex: 1,
                              borderRadius: "2px",
                              background:
                                i <= strength
                                  ? strengthColor
                                  : "rgba(210,200,188,0.6)",
                              transition: `background 0.25s ${EASE_OUT}`,
                            }}
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#9A8F85",
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Confirm password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showSignupPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        ...inputStyle,
                        paddingRight: "40px",
                        borderColor:
                          confirmPassword && confirmPassword !== signupPassword
                            ? "rgba(201,143,135,0.6)"
                            : confirmPassword &&
                                confirmPassword === signupPassword
                              ? "rgba(168,191,160,0.6)"
                              : "rgba(210,200,188,0.65)",
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    {confirmPassword && (
                      <span
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {confirmPassword === signupPassword ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8DAA84"
                            strokeWidth="2.5"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#C98F87"
                            strokeWidth="2.5"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (signupPassword.length < 8) {
                      setSignupError("Password must be at least 8 characters.");
                      return;
                    }
                    if (signupPassword !== confirmPassword) {
                      setSignupError("Passwords don't match.");
                      return;
                    }
                    setSignupError("");
                    setSignupDone(true);
                  }}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "13px",
                    border: "none",
                    background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                    color: "white",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                    marginTop: "4px",
                    transition: `transform 0.18s ${EASE_OUT}, box-shadow 0.18s ${EASE_OUT}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 28px rgba(201,168,124,0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(201,168,124,0.45)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.98)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "translateY(-1px)")
                  }
                >
                  Create account
                </button>
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.8rem",
                    color: "#9A8F85",
                    marginTop: "4px",
                  }}
                >
                  Already have an account?{" "}
                  <button
                    onClick={() => setTab("login")}
                    style={{
                      color: "#C9A87C",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      padding: 0,
                    }}
                  >
                    Log in
                  </button>
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section
      style={{
        padding: "clamp(48px,8vw,80px) 24px",
        background: "linear-gradient(135deg,#F5F0E8,#EDE8DE)",
      }}
    >
      <Reveal>
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
            background: "rgba(255,252,248,0.75)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            border: "1px solid rgba(201,168,124,0.4)",
            borderRadius: "28px",
            padding: "clamp(32px,5vw,56px) clamp(20px,5vw,48px)",
            boxShadow: "0 8px 48px rgba(90,70,50,0.1)",
          }}
        >
          <div
            style={{ display: "inline-flex", gap: "8px", marginBottom: "16px" }}
          >
            {["#E8C5C0", "#C8D5C0", "#D4B896", "#E8C5C0", "#A8BFA0"].map(
              (c, i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ),
            )}
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(1.6rem,4vw,2.8rem)",
              fontWeight: 600,
              color: "#2E2520",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Your next event deserves
            <br />
            <em style={{ color: "#C9A87C", fontStyle: "italic" }}>
              a shared album.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "clamp(0.875rem,2vw,1rem)",
              color: "#5C5148",
              lineHeight: 1.65,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Create your first album in under a minute. No credit card required.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "32px",
            }}
          >
            <a
              href="#auth"
              style={{
                padding: "13px 28px",
                borderRadius: "14px",
                background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                color: "white",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.92rem",
                fontWeight: 500,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                transition: `transform 0.2s ${EASE_OUT}, box-shadow 0.2s ${EASE_OUT}`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(201,168,124,0.6)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(201,168,124,0.45)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get started free <ArrowRight />
            </a>
            <a
              href="#how"
              style={{
                padding: "13px 28px",
                borderRadius: "14px",
                border: "1px solid rgba(201,168,124,0.5)",
                color: "#5C5148",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.92rem",
                textDecoration: "none",
                transition: `transform 0.2s ${EASE_OUT}`,
                background: "rgba(255,252,248,0.6)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              See how it works
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: "clamp(32px,5vw,48px) 24px clamp(24px,4vw,32px)",
        background: "#EDE8DE",
        borderTop: "1px solid rgba(210,200,188,0.5)",
      }}
    >
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: "32px" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "9px",
                  background: "linear-gradient(135deg,#C9A87C,#C98F87)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ImageIcon size={14} />
              </div>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "#2E2520",
                }}
              >
                ShareAlbum
              </span>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.82rem",
                color: "#9A8F85",
                maxWidth: "200px",
                lineHeight: 1.6,
              }}
            >
              Shared photo albums for every occasion.
            </p>
          </div>
          {[
            {
              label: "Product",
              links: ["How it works", "Features", "Pricing", "Download"],
            },
            { label: "Company", links: ["About", "Blog", "Careers", "Press"] },
            {
              label: "Legal",
              links: ["Privacy", "Terms", "Cookie policy", "GDPR"],
            },
          ].map((col) => (
            <div key={col.label}>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#5C5148",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "16px",
                }}
              >
                {col.label}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.85rem",
                        color: "#9A8F85",
                        textDecoration: "none",
                        transition: `color 0.18s ${EASE_OUT}`,
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#C9A87C")}
                      onMouseLeave={(e) => (e.target.style.color = "#9A8F85")}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(210,200,188,0.5)",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.78rem",
              color: "#9A8F85",
            }}
          >
            © 2026 ShareAlbum. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.78rem",
              color: "#9A8F85",
            }}
          >
            Made with care for shared moments.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #FAF7F2; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes orbFloat1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-20px,30px) scale(1.05); }
  }
  @keyframes orbFloat2 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(15px,-20px); }
  }
  @keyframes orbFloat3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-10px,15px) scale(0.97); }
  }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(6px); }
  }

  ::selection { background: rgba(201,168,124,0.25); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #FAF7F2; }
  ::-webkit-scrollbar-thumb { background: rgba(201,168,124,0.4); border-radius: 3px; }

  /* ── Hover: only on pointer-capable devices ── */
  @media (hover: hover) and (pointer: fine) {
    a, button { cursor: pointer; }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ── Hero ── */
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; gap: 56px; text-align: center; }
    .hero-grid > div:first-child p { margin-left: auto; margin-right: auto; }
    .hero-grid > div:first-child > div:nth-child(3) { justify-content: center; }
    .hero-grid > div:first-child > div:nth-child(4) { justify-content: center; }
    .hero-grid > div:first-child > div:last-child { justify-content: center; }
  }
  @media (max-width: 540px) {
    .phone-badge-right, .phone-badge-left { display: none !important; }
    .hero-phone { padding: 0 8px; }
  }

  /* ── How It Works ── */
  .three-col-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  @media (max-width: 860px) { .three-col-grid { grid-template-columns: 1fr; gap: 16px; } .connecting-line { display: none; } }
  @media (min-width: 540px) and (max-width: 860px) { .three-col-grid { grid-template-columns: repeat(2,1fr); } }

  /* ── Features bento ── */
  .features-bento {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 20px;
  }
  .feature-wide { grid-column: span 2; }

  @media (max-width: 860px) {
    .features-bento { grid-template-columns: repeat(2, 1fr); }
    .feature-wide { grid-column: span 2; }
  }
  @media (max-width: 520px) {
    .features-bento { grid-template-columns: 1fr; }
    .feature-wide { grid-column: span 1; }
  }

  /* ── Navbar ── */
  .nav-desktop { display: flex !important; }
  .nav-mobile  { display: none !important; }
  @media (max-width: 680px) {
    .nav-desktop { display: none !important; }
    .nav-mobile  { display: flex !important; }
  }

  /* ── Footer ── */
  .footer-grid { display: grid; grid-template-columns: 1.5fr repeat(3,1fr); gap: 40px; align-items: start; }
  @media (max-width: 760px) { .footer-grid { grid-template-columns: repeat(2,1fr); gap: 28px; } }
  @media (max-width: 440px) { .footer-grid { grid-template-columns: 1fr; gap: 24px; } }
`;

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <style>{globalStyles}</style>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <AuthSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
