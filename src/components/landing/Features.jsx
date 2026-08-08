import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reveal, EASE_OUT } from "./LandingPageShared";
import f1 from "../../assets/illustrations/f1.svg";
import f2 from "../../assets/illustrations/f2.svg";
import f3 from "../../assets/illustrations/f3.svg";
import f4 from "../../assets/illustrations/f4.svg";

const ILLUSTRATIONS = { f1, f2, f3, f4 };

function FeatureCard({ feature: f }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/features/${f.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/features/${f.slug}`);
      }}
      style={{
        position: "relative",
        height: "100%",
        minHeight: "260px",
        borderRadius: "22px",
        cursor: "pointer",
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
      {/* ambient glow, brightens on hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "70%",
          height: "140%",
          background: `radial-gradient(ellipse at 70% 50%, ${f.accent}${
            hov ? "33" : "22"
          } 0%, transparent 68%)`,
          transition: `background 0.4s ${EASE_OUT}`,
          pointerEvents: "none",
        }}
      />

      {/* illustration layer, scales + drifts on hover (magicui-style background motion) */}
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
        }}
      >
        <img
          src={ILLUSTRATIONS[f.illustration]}
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            right: "-6%",
            transform: hov
              ? "translateY(-50%) scale(1.06)"
              : "translateY(-50%) scale(1)",
            width: "100%",
            height: "auto",
            opacity: 0.95,
            transition: `transform 0.5s ${EASE_OUT}`,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(26px,3vw,36px) clamp(24px,3vw,34px) 0",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          maxWidth: "60%",
          transform: hov ? "translateY(-30px)" : "translateY(0)",
          transition: `transform 0.35s ${EASE_OUT}`,
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
            marginTop: "10px",
            marginBottom: "8px",
            transform: hov ? "scale(0.88)" : "scale(1)",
            transformOrigin: "left center",
            transition: `transform 0.3s ${EASE_OUT}`,
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
      </div>

      {/* CTA — sits right where the text block's bottom used to be; rises into place as the text block shifts up above it */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 clamp(24px,3vw,34px) clamp(26px,3vw,36px)",
          marginTop: "-30px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transform: hov ? "translateY(0)" : "translateY(14px)",
          opacity: hov ? 1 : 0,
          transition: `transform 0.35s ${EASE_OUT}, opacity 0.3s ${EASE_OUT}`,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: f.accent,
            whiteSpace: "nowrap",
          }}
        >
          Learn more
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: hov ? "translateX(3px)" : "translateX(0)",
            transition: `transform 0.3s ${EASE_OUT}`,
            flexShrink: 0,
          }}
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke={f.accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      illustration: "f1",
      slug: "instant-qr-access",
      title: "Instant QR access",
      body: "One code per event. Guests tap and they're in — no redirect, no download, no friction.",
      accent: "#C98F87",
      wide: true,
    },
    {
      illustration: "f2",
      slug: "collaborative-albums",
      title: "Collaborative albums",
      body: "Unlimited contributors. Watch the gallery grow in real time throughout the event.",
      accent: "#B8905E",
    },
    {
      illustration: "f3",
      slug: "private-by-default",
      title: "Private by default",
      body: "Access-controlled from day one. Only guests with your QR code or link can view anything.",
      accent: "#8DAA84",
    },
    {
      illustration: "f4",
      slug: "hd-downloads",
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
