import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import notFoundSVG from "../assets/illustrations/page-not-found.svg";

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(threshold = 0.05) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── NotFound ─────────────────────────────────────────────────────────────────
export default function NotFound() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [contentRef, contentVisible] = useInView(0.05);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#FAF7F2",
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, rgba(232,197,192,0.18) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(212,184,150,0.15) 0%, transparent 55%),
          radial-gradient(ellipse at 60% 80%, rgba(200,213,192,0.12) 0%, transparent 50%)
        `,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px, 6vw, 64px) clamp(20px, 5vw, 40px)",
      }}
    >
      {/* ── Ambient glow blobs ── */}
      {[
        {
          w: 340,
          h: 340,
          top: "-100px",
          right: "-80px",
          color: "rgba(201,168,124,0.11)",
        },
        {
          w: 260,
          h: 260,
          bottom: "8%",
          left: "-60px",
          color: "rgba(201,143,135,0.09)",
        },
        {
          w: 200,
          h: 200,
          top: "35%",
          left: "3%",
          color: "rgba(141,170,132,0.09)",
        },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: b.w,
            height: b.h,
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Floating glass orbs ── */}
      {[
        {
          size: 72,
          top: "11%",
          right: "7%",
          delay: "0s",
          anim: "floatA 6s ease-in-out infinite",
        },
        {
          size: 48,
          bottom: "17%",
          left: "6%",
          delay: "1.2s",
          anim: "floatB 8s ease-in-out infinite",
        },
        {
          size: 34,
          top: "54%",
          right: "4%",
          delay: "0.6s",
          anim: "floatC 7s ease-in-out infinite",
        },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(255,252,248,0.8) 0%, rgba(250,247,242,0.3) 100%)",
            border: "1px solid rgba(210,200,188,0.5)",
            backdropFilter: "blur(10px) saturate(150%)",
            WebkitBackdropFilter: "blur(10px) saturate(150%)",
            boxShadow:
              "0 4px 20px rgba(90,70,50,0.07), inset 0 1px 0 rgba(255,255,255,0.55)",
            animation: mounted ? orb.anim : "none",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        style={{
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(16px, 3vw, 28px)",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.65s ease, transform 0.65s ease",
        }}
      >
        {/* ── 404 pill ── */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 16px",
            borderRadius: 999,
            background:
              "linear-gradient(135deg, rgba(255,252,248,0.88) 0%, rgba(250,247,242,0.68) 100%)",
            border: "1px solid rgba(210,200,188,0.55)",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            boxShadow: "0 2px 16px rgba(90,70,50,0.07)",
            opacity: mounted ? 1 : 0,
            transform: mounted
              ? "translateY(0) scale(1)"
              : "translateY(-8px) scale(0.97)",
            transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#B8905E",
              letterSpacing: "0.1em",
            }}
          >
            404
          </span>
          <span
            style={{
              width: 1,
              height: 11,
              background: "rgba(210,200,188,0.8)",
            }}
          />
          <span
            style={{ fontSize: 11, color: "#9A8F85", letterSpacing: "0.04em" }}
          >
            Page not found
          </span>
        </div>

        {/* ── Illustration ── */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s",
            filter: "drop-shadow(0 6px 28px rgba(90,70,50,0.07))",
          }}
        >
          <img
            src={notFoundSVG}
            alt="Page not found illustration"
            style={{ width: "100%", maxWidth: 480, height: "auto" }}
            draggable={false}
          />
        </div>

        {/* ── Headline + sub ── */}
        <div
          style={{
            textAlign: "center",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.1rem, 5vw, 3rem)",
              fontWeight: 600,
              color: "#2E2520",
              lineHeight: 1.12,
              margin: "0 0 10px",
              letterSpacing: "-0.01em",
            }}
          >
            Looks like you're lost
          </h1>
          <p
            style={{
              fontSize: "clamp(13.5px, 1.8vw, 15px)",
              color: "#9A8F85",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 360,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            This page has wandered off — or it never existed. Let's get you
            somewhere familiar.
          </p>
        </div>

        {/* ── Actions ── */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease 0.42s, transform 0.6s ease 0.42s",
          }}
        >
          {/* Primary — Go Home */}
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "12px 28px",
              borderRadius: 999,
              border: "1px solid rgba(184,144,94,0.45)",
              background: "linear-gradient(135deg, #C9A87C 0%, #B8905E 100%)",
              color: "#FAF7F2",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: "0.01em",
              cursor: "pointer",
              boxShadow:
                "0 4px 18px rgba(184,144,94,0.32), 0 1px 4px rgba(90,70,50,0.10)",
              transition: "transform 0.17s ease, box-shadow 0.17s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 26px rgba(184,144,94,0.44), 0 2px 8px rgba(90,70,50,0.13)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 18px rgba(184,144,94,0.32), 0 1px 4px rgba(90,70,50,0.10)";
            }}
          >
            Go Home
          </button>

          {/* Secondary — My Albums */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "12px 28px",
              borderRadius: 999,
              border: "1px solid rgba(210,200,188,0.6)",
              background:
                "linear-gradient(135deg, rgba(255,252,248,0.75) 0%, rgba(250,247,242,0.55) 100%)",
              backdropFilter: "blur(14px) saturate(160%)",
              WebkitBackdropFilter: "blur(14px) saturate(160%)",
              color: "#5C5148",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: "0.01em",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(90,70,50,0.07)",
              transition: "transform 0.17s ease, box-shadow 0.17s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(90,70,50,0.11)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 12px rgba(90,70,50,0.07)";
            }}
          >
            My Albums
          </button>
        </div>

        {/* ── Wordmark ── */}
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "#9A8F85",
            letterSpacing: "0.06em",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            opacity: mounted ? 0.45 : 0,
            transition: "opacity 0.6s ease 0.6s",
          }}
        >
          ShareAlbum
        </p>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translateY(0)    rotate(0deg); }
          33%      { transform: translateY(-13px) rotate(4deg); }
          66%      { transform: translateY(-5px)  rotate(-2deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0)    rotate(0deg); }
          40%      { transform: translateY(-17px) rotate(-5deg); }
          70%      { transform: translateY(-7px)  rotate(3deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
