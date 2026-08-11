import { useState, useEffect, useRef, useCallback } from "react";
import { EASE_OUT } from "./LandingPageShared";
import Step1SVG from "../../assets/illustrations/step1.svg";
import Step2SVG from "../../assets/illustrations/step2.svg";
import Step3SVG from "../../assets/illustrations/step3.svg";

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
    title: "Choose & upload",
    body: "Select your favorite photos from your gallery and upload them straight to the shared album. Everyone sees them instantly.",
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

const STEP_COOLDOWN_MS = 500;
const SWIPE_THRESHOLD_PX = 32;

function ProgressTrack({ activeIndex }) {
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
        const segFill = i <= activeIndex ? 1 : 0;
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
                transition: `height 0.4s ${EASE_OUT}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function StepVisual({ activeIndex, fixedHeight }) {
  return (
    <div
      style={{
        position: "relative",
        height: fixedHeight ? `${fixedHeight}px` : "160px",
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
              transform: i === activeIndex ? "scale(1.15)" : "scale(1.11)",
              transformOrigin: "center",
              transition: `opacity 0.45s ${EASE_OUT}, transform 0.45s ${EASE_OUT}`,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function StepRow({ step, index, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(index);
      }}
      style={{
        display: "flex",
        gap: "16px",
        padding: "clamp(6px,1.2vw,12px) 4px",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isActive
            ? "clamp(1.6rem,2.2vw,2rem)"
            : "clamp(1.35rem,1.8vw,1.6rem)",
          fontWeight: 600,
          lineHeight: 1,
          color: isActive ? step.accent : "rgba(92,81,72,0.22)",
          transition: `all 0.4s ${EASE_OUT}`,
          minWidth: "42px",
        }}
      >
        {step.num}
      </span>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(0.95rem, 1.4vw, 1.12rem)",
            fontWeight: 600,
            color: isActive ? "#2E2520" : "rgba(46,37,32,0.5)",
            marginBottom: "4px",
            lineHeight: 1.25,
            transition: `color 0.4s ${EASE_OUT}`,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            lineHeight: 1.55,
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

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [rightColHeight, setRightColHeight] = useState(null);

  const cardRef = useRef(null);
  const rightColRef = useRef(null);
  const cooldownRef = useRef(false);
  const activeIndexRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchHandledRef = useRef(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const goTo = useCallback((next) => {
    setActiveIndex(Math.min(STEPS.length - 1, Math.max(0, next)));
  }, []);

  const tryAdvance = useCallback(
    (goingDown) => {
      const i = activeIndexRef.current;
      const atStart = i === 0;
      const atEnd = i === STEPS.length - 1;
      if ((goingDown && atEnd) || (!goingDown && atStart)) {
        return false; // let the page scroll normally
      }
      if (cooldownRef.current) return true;
      cooldownRef.current = true;
      goTo(i + (goingDown ? 1 : -1));
      setTimeout(() => {
        cooldownRef.current = false;
      }, STEP_COOLDOWN_MS);
      return true;
    },
    [goTo],
  );

  // Both the wheel (desktop) and touch (mobile) listeners are bound
  // directly to the content wrapper, so the scroll-jack only ever engages
  // while the pointer/finger is actually over the step content — anywhere
  // else on the page scrolls normally.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const handled = tryAdvance(e.deltaY > 0);
      if (handled) e.preventDefault();
    };

    const onTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
      touchHandledRef.current = false;
    };

    const onTouchMove = (e) => {
      if (touchHandledRef.current) return;
      const delta = touchStartYRef.current - e.touches[0].clientY;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
      const handled = tryAdvance(delta > 0);
      touchHandledRef.current = true;
      if (handled) e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [tryAdvance]);

  const handleStepClick = useCallback(
    (i) => {
      goTo(i);
    },
    [goTo],
  );

  return (
    <section
      id="how"
      style={{
        background: "#FAF7F2",
        position: "relative",
        width: "100%",
        // Guards against any child briefly overflowing the viewport width
        // (e.g. during resize/measure passes) and exposing the browser's
        // default white behind the section's edges.
        overflowX: "clip",
        boxSizing: "border-box",
      }}
    >
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
          padding: isMobile
            ? "clamp(32px, 6vw, 44px) clamp(16px, 5vw, 24px)"
            : "clamp(40px, 4vw, 56px) clamp(16px, 5vw, 40px)",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            marginBottom: isMobile ? "16px" : "clamp(18px, 2.4vw, 28px)",
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
            <em style={{ fontStyle: "italic", color: "rgba(46,37,32,0.4)" }}>
              One shared moment.
            </em>
          </h2>
        </div>

        {isMobile ? (
          <div ref={cardRef} style={{ touchAction: "pan-x" }}>
            <div style={{ marginBottom: "8px" }}>
              <StepVisual
                activeIndex={activeIndex}
                fixedHeight={
                  rightColHeight ? Math.min(rightColHeight, 150) : 140
                }
              />
            </div>
            <div
              ref={rightColRef}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "10px" }}>
                  <div style={{ paddingTop: "6px" }}>
                    <div
                      style={{
                        width: "3px",
                        height: "100%",
                        minHeight: "44px",
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
                          height: i <= activeIndex ? "100%" : "0%",
                          background: step.accent,
                          borderRadius: "2px",
                          transition: `height 0.4s ${EASE_OUT}`,
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
          <div
            ref={cardRef}
            style={{
              display: "grid",
              gridTemplateColumns: "0.85fr 24px 1.15fr",
              gap: "0 24px",
              alignItems: "center",
              minHeight: "clamp(260px, 28vh, 320px)",
            }}
          >
            <StepVisual
              activeIndex={activeIndex}
              fixedHeight={rightColHeight}
            />
            <ProgressTrack activeIndex={activeIndex} />
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

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #how * { transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  );
}
