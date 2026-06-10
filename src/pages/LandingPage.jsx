import { useEffect, useRef, useState } from "react";

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
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
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

// ─── Animated Section Wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
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
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(250,247,242,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
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
        {/* Logo */}
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

        {/* Desktop links */}
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
                transition: "all 0.2s",
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
              transition: "all 0.2s",
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
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 4px 20px rgba(201,168,124,0.6)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 2px 12px rgba(201,168,124,0.4)")
            }
          >
            Sign up free
          </a>
        </div>

        {/* Mobile hamburger */}
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

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="nav-mobile"
          style={{
            background: "rgba(250,247,242,0.97)",
            backdropFilter: "blur(16px)",
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
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          background:
            "radial-gradient(ellipse, rgba(201,168,124,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* Phone shell */}
      <div
        style={{
          width: "260px",
          background: "#2E2520",
          borderRadius: "38px",
          padding: "10px",
          boxShadow:
            "0 32px 80px rgba(46,37,32,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset",
          position: "relative",
        }}
      >
        {/* Screen */}
        <div
          style={{
            background: "#FAF7F2",
            borderRadius: "30px",
            overflow: "hidden",
            minHeight: "520px",
            padding: "20px 14px",
          }}
        >
          {/* Status bar */}
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
                fontFamily: "'DM Sans', sans-serif",
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

          {/* App header */}
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

          {/* Photo grid */}
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

          {/* Upload button */}
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
            <CameraIcon />
            Add your photos
          </button>
        </div>

        {/* Home indicator */}
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

      {/* Floating notification */}
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

// ─── Hero Section ─────────────────────────────────────────────────────────────
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
        {/* Two-column on large, stack on small */}
        <div className="hero-grid">
          {/* Left: copy */}
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
                    ? "0 8px 32px rgba(201,168,124,0.55)"
                    : "0 4px 20px rgba(201,168,124,0.4)",
                  cursor: "pointer",
                  transform: scanHover ? "translateY(-2px)" : "translateY(0)",
                  transition: "all 0.25s ease",
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
                  transition: "all 0.25s ease",
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

          {/* Right: phone mockup */}
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

        {/* Scroll hint */}
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

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <QrIcon />,
      title: "Scan the QR code",
      body: "Each event has a unique QR code. Guests scan it at arrival — no app download, no sign-in required for guests.",
    },
    {
      num: "02",
      icon: <CameraIcon />,
      title: "Capture & upload",
      body: "Tap the camera, snap your moments, and upload instantly. Photos appear in the shared gallery in real time.",
    },
    {
      num: "03",
      icon: <ImageIcon />,
      title: "Watch the gallery grow",
      body: "See everyone's perspectives in one beautiful, organized space. Download the full album anytime.",
    },
  ];
  return (
    <section
      id="how"
      style={{
        padding: "clamp(64px,10vw,120px) 24px",
        background: "#FAF7F2",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse,rgba(201,168,124,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(40px,6vw,64px)",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#C9A87C",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 500,
              }}
            >
              How it works
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(1.8rem,4vw,3rem)",
                fontWeight: 600,
                color: "#2E2520",
                marginTop: "12px",
                lineHeight: 1.15,
              }}
            >
              Three steps to a shared memory
            </h2>
          </div>
        </Reveal>

        <div className="three-col-grid" style={{ position: "relative" }}>
          {/* Connecting line — desktop only */}
          <div
            className="connecting-line"
            style={{
              position: "absolute",
              top: "52px",
              left: "calc(16.66% + 24px)",
              right: "calc(16.66% + 24px)",
              height: "1px",
              background:
                "linear-gradient(90deg,transparent,rgba(201,168,124,0.4),rgba(201,168,124,0.4),transparent)",
              pointerEvents: "none",
            }}
          />
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div
                style={{
                  background: "rgba(255,252,248,0.75)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(210,200,188,0.55)",
                  borderRadius: "20px",
                  padding: "clamp(20px,3vw,32px) clamp(16px,3vw,28px)",
                  boxShadow: "0 4px 24px rgba(90,70,50,0.07)",
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 48px rgba(90,70,50,0.13)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(90,70,50,0.07)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg,rgba(201,168,124,0.2),rgba(201,143,135,0.15))",
                      border: "1px solid rgba(201,168,124,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#C9A87C",
                    }}
                  >
                    {s.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "2.5rem",
                      fontWeight: 600,
                      color: "rgba(201,168,124,0.25)",
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "clamp(1.1rem,2vw,1.35rem)",
                    fontWeight: 600,
                    color: "#2E2520",
                    marginBottom: "10px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    color: "#5C5148",
                  }}
                >
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid ─────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <QrIcon />,
      title: "Instant QR access",
      body: "Generate a unique QR per event. Guests scan and land straight in the gallery.",
      accent: "#C9A87C",
    },
    {
      icon: <CameraIcon />,
      title: "In-app camera",
      body: "Open the camera directly from the gallery. Capture and upload in one tap.",
      accent: "#C98F87",
    },
    {
      icon: <UsersIcon />,
      title: "Collaborative albums",
      body: "Unlimited guests can contribute. Watch the gallery grow throughout the event.",
      accent: "#8DAA84",
    },
    {
      icon: <LockIcon />,
      title: "Private by default",
      body: "Each album is access-controlled. Only guests with the QR code or link can view.",
      accent: "#C9A87C",
    },
    {
      icon: <ImageIcon />,
      title: "HD downloads",
      body: "Download individual photos or the full album as a ZIP — always in original quality.",
      accent: "#C98F87",
    },
    {
      icon: <SparkleIcon />,
      title: "Auto-organized",
      body: "Smart timeline view groups photos by contributor and time so nothing gets lost.",
      accent: "#8DAA84",
    },
  ];
  return (
    <section
      id="features"
      style={{
        padding: "clamp(64px,10vw,120px) 24px",
        background: "linear-gradient(180deg,#FAF7F2 0%,#F5F0E8 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(40px,6vw,64px)",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
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
                fontSize: "clamp(1.8rem,4vw,3rem)",
                fontWeight: 600,
                color: "#2E2520",
                marginTop: "12px",
              }}
            >
              Everything your event needs
            </h2>
          </div>
        </Reveal>
        <div className="features-grid">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                style={{
                  background: "rgba(255,252,248,0.7)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(210,200,188,0.5)",
                  borderRadius: "18px",
                  padding: "clamp(18px,2.5vw,28px) clamp(14px,2.5vw,24px)",
                  boxShadow: "0 2px 12px rgba(90,70,50,0.06)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 36px rgba(90,70,50,0.11)";
                  e.currentTarget.style.borderColor = `${f.accent}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(90,70,50,0.06)";
                  e.currentTarget.style.borderColor = "rgba(210,200,188,0.5)";
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg,${f.accent}22,${f.accent}11)`,
                    border: `1px solid ${f.accent}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: f.accent,
                    marginBottom: "16px",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "clamp(1rem,2vw,1.2rem)",
                    fontWeight: 600,
                    color: "#2E2520",
                    marginBottom: "8px",
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
                  }}
                >
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const items = [
    {
      name: "Emma R.",
      role: "Wedding photographer",
      text: "My clients absolutely love it. I share the QR at the start and by the end of the night there are 400 photos from every angle.",
      avatar: "#E8C5C0",
    },
    {
      name: "Marcus T.",
      role: "Corporate event planner",
      text: "We used ShareAlbum for our annual summit. The QR scan flow is so smooth that even tech-averse guests managed it easily.",
      avatar: "#C8D5C0",
    },
    {
      name: "Lena K.",
      role: "Birthday host",
      text: "No more chasing people for their photos! Everything ended up in one album. I cried seeing all the moments I missed.",
      avatar: "#D4B896",
    },
  ];
  return (
    <section
      style={{
        padding: "clamp(64px,10vw,120px) 24px",
        background: "#FAF7F2",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "linear-gradient(0deg,#F5F0E8,transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{ maxWidth: "1160px", margin: "0 auto", position: "relative" }}
      >
        <Reveal>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(40px,6vw,64px)",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#C9A87C",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 500,
              }}
            >
              Testimonials
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(1.8rem,4vw,3rem)",
                fontWeight: 600,
                color: "#2E2520",
                marginTop: "12px",
              }}
            >
              Memories worth sharing
            </h2>
          </div>
        </Reveal>
        <div className="three-col-grid">
          {items.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                style={{
                  background: "rgba(255,252,248,0.75)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(210,200,188,0.5)",
                  borderRadius: "20px",
                  padding: "clamp(18px,2.5vw,28px) clamp(14px,2.5vw,24px)",
                  boxShadow: "0 4px 24px rgba(90,70,50,0.07)",
                }}
              >
                <div
                  style={{ display: "flex", gap: "2px", marginBottom: "16px" }}
                >
                  {[1, 2, 3, 4, 5].map((k) => (
                    <span key={k} style={{ color: "#C9A87C" }}>
                      <StarIcon />
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: "#5C5148",
                    marginBottom: "20px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: t.avatar,
                      border: "2px solid rgba(255,255,255,0.8)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#2E2520",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.75rem",
                        color: "#9A8F85",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Auth Section ─────────────────────────────────────────────────────────────
// Password strength helper
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

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Signup state
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
    transition: "all 0.2s",
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

  // Forgot password view
  if (showForgot) {
    return (
      <section
        id="auth"
        style={{
          padding: "clamp(64px,10vw,120px) 24px",
          background: "#FAF7F2",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
                transition: "color 0.2s",
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
            <div
              style={{
                background: "rgba(255,252,248,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(210,200,188,0.55)",
                borderRadius: "24px",
                padding: "clamp(24px,4vw,36px) clamp(20px,4vw,32px)",
                boxShadow: "0 8px 40px rgba(90,70,50,0.1)",
              }}
            >
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
      <section
        id="auth"
        style={{
          padding: "clamp(64px,10vw,120px) 24px",
          background: "#FAF7F2",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "460px", margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                background: "rgba(255,252,248,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(210,200,188,0.55)",
                borderRadius: "24px",
                padding: "clamp(32px,5vw,48px) clamp(20px,4vw,32px)",
                boxShadow: "0 8px 40px rgba(90,70,50,0.1)",
                textAlign: "center",
              }}
            >
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
    <section
      id="auth"
      style={{
        padding: "clamp(64px,10vw,120px) 24px",
        background: "#FAF7F2",
        position: "relative",
        overflow: "hidden",
      }}
    >
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

          <div
            style={{
              background: "rgba(255,252,248,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(210,200,188,0.55)",
              borderRadius: "24px",
              padding: "clamp(24px,4vw,36px) clamp(20px,4vw,32px)",
              boxShadow: "0 8px 40px rgba(90,70,50,0.1)",
            }}
          >
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
                    transition: "all 0.2s",
                  }}
                >
                  {t === "signup" ? "Sign up" : "Log in"}
                </button>
              ))}
            </div>

            {/* ── LOGIN FORM ── */}
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
                    transition: "all 0.25s",
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
                >
                  Sign in
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    margin: "4px 0",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(210,200,188,0.5)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#9A8F85",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    or
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(210,200,188,0.5)",
                    }}
                  />
                </div>

                {/* Google */}
                <button
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "13px",
                    border: "1px solid rgba(210,200,188,0.65)",
                    background: "rgba(255,252,248,0.8)",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.875rem",
                    color: "#5C5148",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(237,232,222,0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,252,248,0.8)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <GoogleLogo /> Continue with Google
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

            {/* ── SIGNUP FORM ── */}
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
                  {/* Strength meter */}
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
                              transition: "background 0.3s",
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
                    transition: "all 0.25s",
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
                >
                  Create account
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    margin: "4px 0",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(210,200,188,0.5)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#9A8F85",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    or
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(210,200,188,0.5)",
                    }}
                  />
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "13px",
                    border: "1px solid rgba(210,200,188,0.65)",
                    background: "rgba(255,252,248,0.8)",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.875rem",
                    color: "#5C5148",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(237,232,222,0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,252,248,0.8)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <GoogleLogo /> Continue with Google
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

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
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
            backdropFilter: "blur(16px)",
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
                transition: "all 0.25s",
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
                transition: "all 0.25s",
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
                        transition: "color 0.2s",
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

  /* ── Responsive grid helpers ── */

  /* Hero: 2-col on ≥900px, stack below */
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  @media (max-width: 900px) {
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 56px;
      text-align: center;
    }
    .hero-grid > div:first-child p { margin-left: auto; margin-right: auto; }
    .hero-grid > div:first-child > div:nth-child(3) { justify-content: center; }
    .hero-grid > div:first-child > div:nth-child(4) { justify-content: center; }
    .hero-grid > div:first-child > div:last-child { justify-content: center; }
  }

  /* Phone mockup badges: hide on narrow so they don't overflow */
  @media (max-width: 540px) {
    .phone-badge-right,
    .phone-badge-left { display: none !important; }
    .hero-phone { padding: 0 8px; }
  }

  /* How It Works / Testimonials: 3-col → 1-col */
  .three-col-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  @media (max-width: 860px) {
    .three-col-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .connecting-line { display: none; }
  }
  @media (min-width: 540px) and (max-width: 860px) {
    .three-col-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Features: 3-col → 2-col → 1-col */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
  @media (max-width: 860px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 520px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Navbar: show/hide desktop vs mobile */
  .nav-desktop { display: flex !important; }
  .nav-mobile  { display: none !important; }
  @media (max-width: 680px) {
    .nav-desktop { display: none !important; }
    .nav-mobile  { display: flex !important; }
  }

  /* Footer: 4-col → 2-col → 1-col */
  .footer-grid {
    display: grid;
    grid-template-columns: 1.5fr repeat(3, 1fr);
    gap: 40px;
    align-items: start;
  }
  @media (max-width: 760px) {
    .footer-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }
  }
  @media (max-width: 440px) {
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
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
        <Testimonials />
        <AuthSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
