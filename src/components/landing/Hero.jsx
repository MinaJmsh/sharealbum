import { useState } from "react";
import PhoneMockup from "./PhoneMockup";
import { WordRotate } from "../ui/word-rotate";

import {
  SparkleIcon,
  CameraIcon,
  ArrowRight,
  StarIcon,
  ChevronDown,
  EASE_OUT,
} from "./LandingPageShared";

export default function Hero() {
  const [scanHover, setScanHover] = useState(false);

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
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
              <span>shared </span>
              <WordRotate
                className="inline-block italic text-[#C9A87C]"
                duration={3000}
                words={[
                  "instantly.",
                  "beautifully.",
                  "securely.",
                  "together.",
                  "effortlessly.",
                ]}
              />
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
