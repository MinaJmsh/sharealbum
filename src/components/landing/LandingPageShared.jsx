import { useState, useEffect, useRef } from "react";

export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

// Hook to detect element visibility
export function useInView(options = {}) {
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

// Animated Reveal Wrapper
export function Reveal({ children, delay = 0, className = "" }) {
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

// Shared SVG Icons
export const CameraIcon = ({ size = 20 }) => (
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

export const QrIcon = ({ size = 22 }) => (
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

export const ImageIcon = ({ size = 22 }) => (
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

export const SparkleIcon = () => (
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

export const ChevronDown = () => (
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

export const ArrowRight = () => (
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

export const StarIcon = () => (
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

export const EyeIcon = ({ open }) =>
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

// Global Styling Injection
export const globalStyles = `
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

  @media (hover: hover) and (pointer: fine) {
    a, button { cursor: pointer; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

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

  .nav-desktop { display: flex !important; }
  .nav-mobile  { display: none !important; }
  @media (max-width: 680px) {
    .nav-desktop { display: none !important; }
    .nav-mobile  { display: flex !important; }
  }

  .footer-grid { display: grid; grid-template-columns: 1.5fr repeat(3,1fr); gap: 40px; align-items: start; }
  @media (max-width: 760px) { .footer-grid { grid-template-columns: repeat(2,1fr); gap: 28px; } }
  @media (max-width: 440px) { .footer-grid { grid-template-columns: 1fr; gap: 24px; } }
`;
