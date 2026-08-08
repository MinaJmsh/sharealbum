import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneMockup from "./PhoneMockup";
import { WordRotate } from "../ui/word-rotate";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useAuth } from "../../context/AuthContext";
import {
  SparkleIcon,
  CameraIcon,
  ArrowRight,
  StarIcon,
  ChevronDown,
  EASE_OUT,
} from "./LandingPageShared";

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  const uaMobile = /android|iphone|ipad|ipod|mobile/i.test(ua);
  const touchMobile =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)")?.matches;
  return uaMobile || !!touchMobile;
}

export default function Hero() {
  const [scanHover, setScanHover] = useState(false);
  const [createHover, setCreateHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleScanClick = () => {
    if (isMobile) {
      // Hidden capture input opens the device's native camera directly.
      cameraInputRef.current?.click();
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: hand off to QR decode / gallery-open flow once captured.
    e.target.value = "";
  };

  const handleCreateEventClick = () => {
    navigate(isLoggedIn ? "/ceremony/create" : "/login");
  };

  const scanButton = (
    <button
      onMouseEnter={() => setScanHover(true)}
      onMouseLeave={() => setScanHover(false)}
      onClick={handleScanClick}
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
  );

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
              {isMobile ? (
                scanButton
              ) : (
                <Tooltip.Provider delayDuration={100}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>{scanButton}</Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        sideOffset={12}
                        style={{
                          zIndex: 99999,
                          background: "#FAF7F2",
                          border: "1px solid rgba(201,168,124,0.5)",
                          borderRadius: "14px",
                          padding: "14px 16px",
                          width: "250px",
                          boxShadow: "0 10px 30px rgba(46,37,32,0.12)",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: "1.15rem",
                            fontWeight: 600,
                            color: "#2E2520",
                            marginBottom: "6px",
                          }}
                        >
                          Scan with your phone
                        </div>

                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.82rem",
                            lineHeight: 1.55,
                            color: "#5C5148",
                            margin: 0,
                          }}
                        >
                          Use your phone's camera to scan the QR code on your
                          table. Tap the link that appears to open the gallery.
                        </p>

                        <Tooltip.Arrow
                          style={{
                            fill: "#FAF7F2",
                          }}
                        />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}

              {/* Hidden capture input — triggers the native camera on mobile */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                style={{ display: "none" }}
                tabIndex={-1}
                aria-hidden="true"
              />

              <button
                onClick={handleCreateEventClick}
                onMouseEnter={() => setCreateHover(true)}
                onMouseLeave={() => setCreateHover(false)}
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
                  boxShadow: createHover
                    ? "0 8px 24px rgba(90,70,50,0.1)"
                    : "0 4px 16px rgba(90,70,50,0.06)",
                  cursor: "pointer",
                  transform: createHover ? "translateY(-2px)" : "translateY(0)",
                  transition: `transform 0.2s ${EASE_OUT}, box-shadow 0.2s ${EASE_OUT}`,
                }}
              >
                Create an event <ArrowRight />
              </button>
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
