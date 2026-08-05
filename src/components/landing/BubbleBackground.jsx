// src/components/landing/BubbleBackground.jsx
import { useEffect, useRef } from "react";

/**
 * BubbleBackground — soft, glassy, animated gradient bubbles
 * in the ShareAlbum palette (ivory / gold / blush / sage).
 *
 * Pure CSS + SVG goo filter, no framer-motion dependency.
 * `interactive` makes the largest bubble drift toward the pointer.
 */
export default function BubbleBackground({
  interactive = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const interactiveBubbleRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    if (!interactive) return;
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      target.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      };
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      if (interactiveBubbleRef.current) {
        interactiveBubbleRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    el.addEventListener("mousemove", handleMove);
    raf.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none overflow-hidden bg-ivory ${className}`}
      aria-hidden="true"
    >
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="sa-goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="18"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 24 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0"
        style={{ filter: "url(#sa-goo)", opacity: 0.55 }}
      >
        <span className="sa-bubble sa-bubble-gold" />
        <span className="sa-bubble sa-bubble-pink" />
        <span className="sa-bubble sa-bubble-sage" />
        <span className="sa-bubble sa-bubble-gold-soft" />
        {interactive && (
          <span
            ref={interactiveBubbleRef}
            className="sa-bubble sa-bubble-interactive"
          />
        )}
      </div>

      <style>{`
        .sa-bubble {
          position: absolute;
          border-radius: 9999px;
          mix-blend-mode: multiply;
          will-change: transform;
        }

        .sa-bubble-gold {
          top: 8%;
          left: 12%;
          width: clamp(220px, 30vw, 480px);
          height: clamp(220px, 30vw, 480px);
          background: radial-gradient(circle at 30% 30%, rgba(201,168,124,0.75), rgba(201,168,124,0) 70%);
          animation: sa-float-a 18s ease-in-out infinite;
        }

        .sa-bubble-pink {
          top: 40%;
          right: 8%;
          width: clamp(180px, 26vw, 420px);
          height: clamp(180px, 26vw, 420px);
          background: radial-gradient(circle at 40% 40%, rgba(221,168,160,0.7), rgba(221,168,160,0) 70%);
          animation: sa-float-b 22s ease-in-out infinite;
        }

        .sa-bubble-sage {
          bottom: 6%;
          left: 22%;
          width: clamp(160px, 24vw, 380px);
          height: clamp(160px, 24vw, 380px);
          background: radial-gradient(circle at 35% 35%, rgba(168,191,160,0.65), rgba(168,191,160,0) 70%);
          animation: sa-float-c 26s ease-in-out infinite;
        }

        .sa-bubble-gold-soft {
          bottom: 18%;
          right: 20%;
          width: clamp(140px, 20vw, 320px);
          height: clamp(140px, 20vw, 320px);
          background: radial-gradient(circle at 45% 45%, rgba(212,184,150,0.6), rgba(212,184,150,0) 70%);
          animation: sa-float-a 20s ease-in-out infinite reverse;
        }

        .sa-bubble-interactive {
          top: 50%;
          left: 50%;
          width: clamp(180px, 22vw, 340px);
          height: clamp(180px, 22vw, 340px);
          margin-top: calc(clamp(180px, 22vw, 340px) / -2);
          margin-left: calc(clamp(180px, 22vw, 340px) / -2);
          background: radial-gradient(circle at 40% 40%, rgba(201,143,135,0.55), rgba(201,143,135,0) 70%);
          transition: transform 0.05s linear;
        }

        @keyframes sa-float-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(6%, 8%) scale(1.08); }
          66% { transform: translate(-4%, 4%) scale(0.95); }
        }
        @keyframes sa-float-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-8%, 6%) scale(1.06); }
          70% { transform: translate(5%, -5%) scale(0.94); }
        }
        @keyframes sa-float-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(7%, -6%) scale(1.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sa-bubble { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
