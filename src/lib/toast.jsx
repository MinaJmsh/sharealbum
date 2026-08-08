import { toast } from "react-toastify";

/* ── react-toastify overrides, injected once so this file is self-contained ── */
const TOAST_CSS = `
.Toastify__toast-container {
  width: 380px;
  max-width: calc(100vw - 32px);
  padding: 0;
}

.Toastify__toast {
  position: relative !important;
  display: block !important;
  padding: 0 !important;
  margin-bottom: 14px !important;
  border-radius: 1.1rem !important;
  min-height: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  overflow: hidden !important;
}

.Toastify__toast-body {
  padding: 0 !important;
  margin: 0 !important;
  display: block !important;
}

.Toastify__toast-icon {
  display: none !important;
}

.Toastify__close-button {
  position: absolute !important;
  top: 16px;
  right: 16px;
  z-index: 2;
  color: #9A8F85 !important;
  opacity: 0.5;
}

.Toastify__close-button:hover {
  opacity: 1;
}

.Toastify__progress-bar {
  height: 3px !important;
  opacity: 0.85 !important;
}
`;

if (typeof document !== "undefined") {
  let el = document.querySelector("style[data-toast-theme='sharealbum']");
  if (!el) {
    el = document.createElement("style");
    el.setAttribute("data-toast-theme", "sharealbum");
    document.head.appendChild(el);
  }
  el.textContent = TOAST_CSS;
}

/**
 * ShareAlbum themed toast notifications.
 * Each status gets its own accent from the brand palette so they're
 * visually distinct at a glance, while staying inside the same
 * glassmorphism language as the rest of the app.
 *
 * success -> gold      (#C9A87C)
 * error   -> blush     (#C98F87)
 * info    -> sage      (#8DAA84)
 * warning -> deep gold (#B8905E)
 */

const ICONS = {
  success: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  info: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25h.75v5.25h.75M12 7.5h.008v.008H12V7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  ),
};

const THEME = {
  success: {
    accent: "#C9A87C",
    iconBg: "rgba(201,168,124,0.18)",
    iconColor: "#8a6d3f",
  },
  error: {
    accent: "#C98F87",
    iconBg: "rgba(201,143,135,0.18)",
    iconColor: "#96473f",
  },
  info: {
    accent: "#8DAA84",
    iconBg: "rgba(141,170,132,0.18)",
    iconColor: "#3e5e38",
  },
  warning: {
    accent: "#B8905E",
    iconBg: "rgba(184,144,94,0.20)",
    iconColor: "#7a5730",
  },
};

/**
 * This div is the ENTIRE visual card — background, border, shadow, padding.
 * The library's own toast wrapper is reset to transparent/invisible via
 * TOAST_CSS above, so this is the only thing rendering visible chrome
 * (aside from the library's close button and progress bar, which we
 * position around it, not inside it).
 */
function ToastCard({ title, message, type }) {
  const t = THEME[type];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        width: "100%",
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, rgba(255,252,248,0.95) 0%, rgba(250,247,242,0.9) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderLeft: `3px solid ${t.accent}`,
        borderRadius: "1.1rem",
        boxShadow:
          "0 16px 64px rgba(90,70,50,0.15), 0 4px 16px rgba(90,70,50,0.10)",
        padding: "22px 44px 26px 22px",
      }}
    >
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          background: t.iconBg,
          color: t.iconColor,
        }}
      >
        {ICONS[type]}
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-1.5">
        {title && (
          <p
            className="font-display text-base leading-tight font-medium text-text-h m-0"
            style={{ wordBreak: "break-word" }}
          >
            {title}
          </p>
        )}
        {message && (
          <p
            className="text-xs font-sans text-text-sm leading-relaxed m-0"
            style={{ wordBreak: "break-word" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function fire(type, title, message, options = {}) {
  const t = THEME[type];
  return toast(<ToastCard title={title} message={message} type={type} />, {
    ...options,
    progressStyle: { background: t.accent },
  });
}

export const notify = {
  success: (title, message, options) =>
    fire("success", title, message, options),
  error: (title, message, options) => fire("error", title, message, options),
  info: (title, message, options) => fire("info", title, message, options),
  warning: (title, message, options) =>
    fire("warning", title, message, options),
};

export default notify;
