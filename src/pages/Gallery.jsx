import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Loader from "../components/common/Loader";
import nophoto from "../assets/illustrations/nophoto.svg";
import eventnotfound from "../assets/illustrations/eventnotfound.svg";
import JSZip from "jszip";
import { QRCodeSVG } from "qrcode.react";
import { notify } from "../lib/toast";

// ── Avatar ─────────────────────────────────────────────────────
function Avatar({ name, size = 28 }) {
  const letter = (name || "?")[0].toUpperCase();
  const colors = [
    { bg: "rgba(232,197,192,0.9)", text: "#7a4c47" },
    { bg: "rgba(212,184,150,0.9)", text: "#6b4c2a" },
    { bg: "rgba(200,213,192,0.9)", text: "#3e5e38" },
    { bg: "rgba(168,191,160,0.9)", text: "#2f4a2a" },
    { bg: "rgba(201,168,124,0.85)", text: "#5a3e1b" },
  ];
  const color = colors[letter.charCodeAt(0) % colors.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color.bg,
        color: color.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        border: "1.5px solid rgba(255,252,248,0.7)",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

// ── Masonry grid ───────────────────────────────────────────────
function MasonryGrid({ items, onOpenLightbox }) {
  const containerRef = useRef(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    function update() {
      const w = containerRef.current?.offsetWidth ?? window.innerWidth;
      if (w < 480) setColumns(2);
      else if (w < 768) setColumns(3);
      else setColumns(4);
    }
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const cols = Array.from({ length: columns }, () => []);
  const heights = Array(columns).fill(0);
  items.forEach((item, idx) => {
    const ratio = item._ratio || 1;
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push({ item, idx });
    heights[shortest] += ratio;
  });

  return (
    <div ref={containerRef} className="flex gap-3">
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-3 flex-1 min-w-0">
          {col.map(({ item, idx }) => (
            <MasonryCard
              key={item.id}
              item={item}
              globalIdx={idx}
              onClick={() => onOpenLightbox(idx)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Masonry card ───────────────────────────────────────────────
function MasonryCard({ item, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [uploader, setUploader] = useState(null);
  const [naturalRatio, setNaturalRatio] = useState(item._ratio || null);
  const isVideo = item.file_type === "video";

  useEffect(() => {
    if (!item.uploader_id) return;
    supabase
      .rpc("get_user_display_name", { user_id: item.uploader_id })
      .then(({ data, error }) => {
        setUploader(!error && data ? data : "Guest");
      });
  }, [item.uploader_id]);

  function handleLoad(e) {
    const el = e.currentTarget;
    const w = el.naturalWidth || el.videoWidth || 1;
    const h = el.naturalHeight || el.videoHeight || 1;
    if (w && h) {
      item._ratio = h / w;
      setNaturalRatio(h / w);
    }
    setLoaded(true);
  }

  const paddingTop = naturalRatio ? `${naturalRatio * 100}%` : "100%";

  return (
    <button
      className="relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-2xl overflow-hidden group"
      style={{ display: "block" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full rounded-2xl overflow-hidden bg-parchment shadow-soft">
        <div style={{ position: "relative", width: "100%", paddingTop }}>
          {!loaded && !errored && (
            <div className="skeleton absolute inset-0 rounded-2xl" />
          )}
          {errored ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-sm bg-parchment/60">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="opacity-40"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-xs">Unavailable</span>
            </div>
          ) : isVideo ? (
            <video
              src={item.file_url}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoadedMetadata={handleLoad}
              onError={() => setErrored(true)}
              muted
              playsInline
              ref={(el) => {
                if (el) {
                  if (hovered) el.play().catch(() => {});
                  else {
                    el.pause();
                    el.currentTime = 0;
                  }
                }
              }}
            />
          ) : (
            <img
              src={item.file_url}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={handleLoad}
              onError={() => setErrored(true)}
            />
          )}
        </div>

        <div
          className="absolute inset-0 transition-all duration-250 rounded-2xl pointer-events-none"
          style={{
            background: hovered ? "rgba(46,37,32,0.22)" : "rgba(46,37,32,0)",
          }}
        />

        {isVideo && loaded && (
          <div className="absolute top-2 left-2">
            <span className="badge-gold text-[10px] px-2 py-0.5 flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              video
            </span>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 px-2.5 py-2 flex items-center gap-2 transition-all duration-250"
          style={{
            opacity: hovered && loaded && uploader ? 1 : 0,
            transform:
              hovered && loaded && uploader
                ? "translateY(0)"
                : "translateY(6px)",
            pointerEvents: "none",
            background:
              "linear-gradient(to top, rgba(46,37,32,0.55) 0%, transparent 100%)",
            borderRadius: "0 0 1rem 1rem",
          }}
        >
          {uploader && <Avatar name={uploader} size={24} />}
          <span
            className="text-ivory text-xs font-sans font-medium truncate"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            {uploader}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Skeleton masonry ───────────────────────────────────────────
function SkeletonMasonry({ count = 12 }) {
  const ratios = [1.2, 0.75, 1, 1.5, 0.8, 1.1, 0.9, 1.3, 0.7, 1, 1.4, 0.85];
  const [columns, setColumns] = useState(3);
  const ref = useRef(null);
  useEffect(() => {
    function update() {
      const w = ref.current?.offsetWidth ?? window.innerWidth;
      if (w < 480) setColumns(2);
      else if (w < 768) setColumns(3);
      else setColumns(4);
    }
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const cols = Array.from({ length: columns }, (_, ci) =>
    ratios.filter((_, i) => i % columns === ci),
  );
  return (
    <div ref={ref} className="flex gap-3">
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-3 flex-1 min-w-0">
          {col.map((ratio, i) => (
            <div
              key={i}
              className="skeleton rounded-2xl w-full"
              style={{
                paddingTop: `${ratio * 100}%`,
                animationDelay: `${(ci * col.length + i) * 50}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Thumbnail Strip ────────────────────────────────────────────
function ThumbnailStrip({ items, activeIdx, onSelect, visible }) {
  const stripRef = useRef(null);

  useEffect(() => {
    if (!stripRef.current) return;
    const active = stripRef.current.querySelector("[data-active='true']");
    active?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIdx]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* FIX 1: justify-center so strip is centered when items don't fill full width */}
      <div
        ref={stripRef}
        className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 py-2 justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {items.map((m, i) => {
          const isActive = i === activeIdx;
          const isVideo = m.file_type === "video";
          return (
            <button
              key={m.id}
              data-active={isActive ? "true" : "false"}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden"
              style={{
                outline: isActive
                  ? "2px solid rgba(201,168,124,0.95)"
                  : "2px solid rgba(255,252,248,0.12)",
                outlineOffset: "2px",
                opacity: isActive ? 1 : 0.4,
                transition:
                  "opacity 0.35s cubic-bezier(0.4,0,0.2,1), outline-color 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
              aria-label={`View item ${i + 1}`}
            >
              {isVideo ? (
                <div className="relative w-full h-full bg-parchment/20">
                  <video
                    src={m.file_url + "#t=0.5"}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(46,37,32,0.3)" }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="rgba(250,247,242,0.9)"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <img
                  src={m.file_url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Lightbox ───────────────────────────────────────────────────
function Lightbox({
  item,
  itemIndex,
  allItems,
  onClose,
  onPrev,
  onNext,
  onSelect,
  hasPrev,
  hasNext,
}) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [uploader, setUploader] = useState(null);
  const [uploaderFetched, setUploaderFetched] = useState(false);
  const [zoom, setZoom] = useState(1);
  // const [shareToast, setShareToast] = useState(false);
  // FIX: chrome visibility — show on any interaction, auto-hide after 3s idle
  const [chromeVisible, setChromeVisible] = useState(true);
  const idleTimer = useRef(null);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipeDeltaX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const isVideo = item.file_type === "video";
  const lightboxRef = useRef(null);

  // Reset idle timer — show chrome, restart 3s countdown
  const resetIdle = useCallback(() => {
    setChromeVisible(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setChromeVisible(false), 3000);
  }, []);

  // Start idle timer on mount, clear on unmount
  useEffect(() => {
    resetIdle();
    return () => clearTimeout(idleTimer.current);
  }, [resetIdle]);

  // Reset idle whenever item changes (navigation = activity)
  useEffect(() => {
    resetIdle();
  }, [item.id, resetIdle]);

  // Non-passive touchmove to block page scroll during horizontal swipe
  useEffect(() => {
    const el = lightboxRef.current;
    if (!el) return;
    function blockScroll(e) {
      if (touchStartX.current === null) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    }
    el.addEventListener("touchmove", blockScroll, { passive: false });
    return () => el.removeEventListener("touchmove", blockScroll);
  }, []);

  // Reset ALL states whenever item.id changes
  useEffect(() => {
    setMediaLoaded(false);
    setUploader(null);
    setUploaderFetched(false);
    setZoom(1);
    setSwipeOffset(0);
  }, [item.id]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Fetch uploader name — runs fresh on every item.id change
  useEffect(() => {
    let cancelled = false;
    if (!item.uploader_id) {
      setUploader("Guest");
      setUploaderFetched(true);
      return;
    }
    supabase
      .rpc("get_user_display_name", { user_id: item.uploader_id })
      .then(({ data, error }) => {
        if (cancelled) return;
        setUploader(!error && data ? data : "Guest");
        setUploaderFetched(true);
      });
    return () => {
      cancelled = true;
    };
  }, [item.id, item.uploader_id]);

  const fullyReady = mediaLoaded && uploaderFetched;

  const uploadedAt = item.created_at
    ? new Date(item.created_at).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  function triggerClose() {
    setClosing(true);
    setTimeout(onClose, 280);
  }

  // Backdrop tap: only close if it's a plain tap (not a swipe, not on chrome)
  function handleBackdropClick() {
    // If chrome is hidden, first tap just reveals it
    if (!chromeVisible) {
      resetIdle();
      return;
    }
    triggerClose();
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") triggerClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasPrev, hasNext, onPrev, onNext]);

  function handleTouchStart(e) {
    resetIdle();
    if (zoom > 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeDeltaX.current = 0;
  }
  function handleTouchMove(e) {
    if (zoom > 1 || touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      swipeDeltaX.current = dx;
      setSwipeOffset(dx);
    }
  }
  function handleTouchEnd() {
    if (zoom > 1) return;
    const threshold = 60;
    if (swipeDeltaX.current < -threshold && hasNext) onNext();
    else if (swipeDeltaX.current > threshold && hasPrev) onPrev();
    setSwipeOffset(0);
    touchStartX.current = null;
    swipeDeltaX.current = 0;
  }

  async function handleDownload() {
    try {
      const response = await fetch(item.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `memory-${item.id}.${isVideo ? "mp4" : "jpg"}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(item.file_url, "_blank");
    }
  }

  async function handleShare() {
    const shareData = { url: item.file_url };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(item.file_url);
      notify.success("Link copied", "Ready to share.");
    }
  }

  const backdropStyle = {
    opacity: visible && !closing ? 1 : 0,
    transition: "opacity 0.28s ease",
  };
  const mediaWrapStyle = {
    opacity:
      visible && !closing
        ? swipeOffset !== 0
          ? Math.max(0.35, 1 - Math.abs(swipeOffset) / 260)
          : 1
        : 0,
    transform:
      visible && !closing
        ? "scale(1) translateY(0)"
        : "scale(0.93) translateY(20px)",
    transition:
      swipeOffset !== 0
        ? "opacity 0.12s ease"
        : "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.4,0.64,1)",
  };

  const toolBtn = {
    width: 38,
    height: 38,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,252,248,0.12)",
    border: "1px solid rgba(255,252,248,0.18)",
    backdropFilter: "blur(8px)",
    color: "rgba(250,247,242,0.88)",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.15s",
    flexShrink: 0,
  };

  const chromeTransition = "opacity 0.4s cubic-bezier(0.4,0,0.2,1)";

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
      style={{ ...backdropStyle, background: "rgba(46,37,32,0.82)" }}
      onClick={handleBackdropClick}
      onPointerMove={resetIdle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-3"
        style={{
          background:
            "linear-gradient(to bottom, rgba(46,37,32,0.5) 0%, transparent 100%)",
          opacity: chromeVisible && visible && !closing ? 1 : 0,
          transition: chromeTransition,
          pointerEvents: chromeVisible ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={toolBtn}
          onClick={triggerClose}
          aria-label="Close"
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,252,248,0.22)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,252,248,0.12)")
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <button
            style={{ ...toolBtn, opacity: zoom <= 1 ? 0.4 : 1 }}
            onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
            disabled={zoom <= 1}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.12)")
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            style={{ ...toolBtn, opacity: zoom >= 3 ? 0.4 : 1 }}
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            disabled={zoom >= 3}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.12)")
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            style={toolBtn}
            onClick={handleDownload}
            aria-label="Download"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.12)")
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            style={toolBtn}
            onClick={handleShare}
            aria-label="Share"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,252,248,0.12)")
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-3 z-20 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            resetIdle();
            onPrev();
          }}
          aria-label="Previous"
          style={{
            opacity: chromeVisible && visible && !closing ? 1 : 0,
            transition: chromeTransition,
            pointerEvents: chromeVisible ? "auto" : "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Media area */}
      <div
        className="flex flex-col items-center w-full px-14"
        style={{ ...mediaWrapStyle, maxWidth: "56rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {!fullyReady && (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: "40vh" }}
          >
            <Loader />
          </div>
        )}

        <div style={{ display: fullyReady ? "block" : "none", width: "100%" }}>
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.25s cubic-bezier(0.34,1.4,0.64,1)",
              overflow: zoom > 1 ? "visible" : "hidden",
            }}
          >
            {isVideo ? (
              <video
                key={item.id}
                src={item.file_url}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-2xl shadow-glass-lg mx-auto block"
                onCanPlay={() => setMediaLoaded(true)}
              />
            ) : (
              <img
                key={item.id}
                src={item.file_url}
                alt=""
                className="max-h-[75vh] max-w-full rounded-2xl shadow-glass-lg object-contain mx-auto block"
                onLoad={() => setMediaLoaded(true)}
              />
            )}
          </div>
        </div>

        {fullyReady && (uploader || uploadedAt) && (
          <div
            className="mt-3"
            style={{
              opacity: visible && !closing ? 1 : 0,
              transition: "opacity 0.35s ease 0.15s",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: "rgba(250,247,242,0.75)",
                letterSpacing: "0.01em",
                textAlign: "center",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                margin: 0,
              }}
            >
              {uploader && (
                <>
                  Uploaded by{" "}
                  <span
                    style={{ color: "rgba(250,247,242,0.95)", fontWeight: 600 }}
                  >
                    {uploader}
                  </span>
                </>
              )}
              {uploader && uploadedAt && (
                <span
                  style={{ color: "rgba(250,247,242,0.35)", margin: "0 0.5em" }}
                >
                  ·
                </span>
              )}
              {uploadedAt && (
                <span style={{ color: "rgba(250,247,242,0.6)" }}>
                  {uploadedAt}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-3 z-20 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            resetIdle();
            onNext();
          }}
          aria-label="Next"
          style={{
            opacity: chromeVisible && visible && !closing ? 1 : 0,
            transition: chromeTransition,
            pointerEvents: chromeVisible ? "auto" : "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Thumbnail strip */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{
          background:
            "linear-gradient(to top, rgba(46,37,32,0.75) 0%, transparent 100%)",
          paddingTop: "2.5rem",
          paddingBottom: "0.5rem",
          pointerEvents: "none",
        }}
      >
        <ThumbnailStrip
          items={allItems}
          activeIdx={itemIndex}
          onSelect={(i) => {
            resetIdle();
            onSelect(i);
          }}
          visible={chromeVisible && visible && !closing}
        />
      </div>

      {/* Swipe dots */}
      <div
        className="absolute bottom-20 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none"
        style={{
          opacity: chromeVisible && visible && !closing ? 0.5 : 0,
          transition: chromeTransition,
        }}
      >
        {hasPrev && (
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(250,247,242,0.6)",
              display: "inline-block",
            }}
          />
        )}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(250,247,242,0.95)",
            display: "inline-block",
          }}
        />
        {hasNext && (
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(250,247,242,0.6)",
              display: "inline-block",
            }}
          />
        )}
      </div>

      {/* Share toast */}
      {/* {shareToast && (
        <div
          className="fixed bottom-24 left-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-sans"
          style={{
            transform: "translateX(-50%)",
            background: "rgba(255,252,248,0.15)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,252,248,0.2)",
            color: "rgba(250,247,242,0.9)",
            fontStyle: "italic",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1rem",
            boxShadow: "0 4px 24px rgba(46,37,32,0.3)",
          }}
        >
          Link copied to clipboard
        </div>
      )} */}
    </div>
  );
}

// ── Smart FAB ──────────────────────────────────────────────────
// FIX 3: non-owner icon replaced with "image + plus" concept
function SmartFAB({ session, isOwner, onClick }) {
  const label = isOwner ? "Manage event" : "Add your memories";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-glass-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 hover:shadow-glass-lg"
      style={{
        background: "linear-gradient(135deg, #D4B896 0%, #C9A87C 100%)",
      }}
    >
      {isOwner ? (
        /* Settings/gear icon for owner */
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FAF7F2"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ) : (
        /* Image-with-plus icon: a landscape photo frame with a + badge */
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FAF7F2"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Photo frame */}
          <rect x="2" y="4" width="16" height="13" rx="2" />
          {/* Mountain/landscape inside */}
          <path d="M2 13.5l4-4 3 3 2.5-2.5L14 13.5" />
          {/* Sun dot */}
          <circle cx="6" cy="8.5" r="1" fill="#FAF7F2" stroke="none" />
          {/* Plus badge — bottom right, slightly outside frame */}
          <line x1="19" y1="15" x2="19" y2="21" strokeWidth="2.2" />
          <line x1="16" y1="18" x2="22" y2="18" strokeWidth="2.2" />
        </svg>
      )}
    </button>
  );
}

const DotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2.4" />
    <circle cx="12" cy="12" r="2.4" />
    <circle cx="12" cy="19" r="2.4" />
  </svg>
);

/* ─── Gallery Options Menu (top-right, 3-dot) ───────────────────── */
function GalleryMenu({
  anchorRef,
  onClose,
  onDownload,
  onShowQR,
  downloading,
}) {
  const rect = anchorRef?.current?.getBoundingClientRect();

  const menuStyle = rect
    ? {
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.right - 256, // menu width
        width: 256,
      }
    : {
        position: "fixed",
        top: 64,
        right: 16,
        width: 256,
      };

  useEffect(() => {
    const handleScroll = () => {
      onClose();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        style={menuStyle}
        className="glass-sm p-1 shadow-glass-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          <button
            onClick={onDownload}
            disabled={downloading}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-parchment/60 rounded-lg transition-colors font-sans disabled:opacity-50"
          >
            {downloading ? (
              <svg
                className="w-4 h-4 animate-spin text-text-sm"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-text-sm"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            )}
            {downloading ? "Preparing zip…" : "Download as ZIP"}
          </button>
          <button
            onClick={onShowQR}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-parchment/60 rounded-lg transition-colors font-sans"
          >
            <svg
              className="w-4 h-4 text-text-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 18.75h.75v.75h-.75v-.75zM18.75 13.5h.75v.75h-.75v-.75zM18.75 18.75h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
              />
            </svg>
            Get QR code
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── QR Sheet (same as My Event page) ──────────────────────────── */
function QRSheet({ ceremony, onClose }) {
  const qrRef = useRef(null);
  const qrUrl = ceremony.qr_code;

  function downloadQR() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const size = 400;
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${ceremony.name.replace(/\s+/g, "-")}-qr.png`;
      a.click();
    };
    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
  }

  async function shareQR() {
    if (navigator.share) {
      try {
        await navigator.share({ title: ceremony.name, url: qrUrl });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(qrUrl);
    notify.success("Link copied", "QR link copied to clipboard.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/20 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative glass-lg w-full max-w-sm shadow-glass-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-pink-dust via-accent to-sage-light" />
        <div className="px-6 pt-5 pb-7 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-display text-lg font-medium text-text-h">
              Event QR code
            </h3>
            <button onClick={onClose} className="btn-ghost px-2 py-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div ref={qrRef} className="glass p-4 rounded-2xl shadow-soft">
            <QRCodeSVG
              value={qrUrl}
              size={180}
              bgColor="transparent"
              fgColor="#3d2e1e"
              level="M"
            />
          </div>
          <p className="text-xs text-text-sm font-sans text-center break-all opacity-70">
            {qrUrl}
          </p>
          <div className="flex gap-2 w-full">
            <button
              onClick={downloadQR}
              className="btn-secondary flex-1 justify-center text-sm gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download
            </button>
            <button
              onClick={shareQR}
              className="btn-secondary flex-1 justify-center text-sm gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── helpers ────────────────────────────────────────────────────── */
function extFromUrl(url) {
  const clean = url.split("?")[0];
  const m = clean.match(/\.([a-zA-Z0-9]+)$/);
  return m ? m[1] : "jpg";
}

// ── Main Gallery ───────────────────────────────────────────────
export default function Gallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const menuButtonRef = useRef(null);

  const [ceremony, setCeremony] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      const [{ data: cer, error: cerErr }, { data: med }] = await Promise.all([
        supabase.from("ceremonies").select("*").eq("id", id).single(),
        supabase
          .from("media")
          .select("*")
          .eq("ceremony_id", id)
          .order("created_at", { ascending: false }),
      ]);
      if (cerErr) setError("Event not found.");
      else {
        setCeremony(cer);
        setMedia(med ?? []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    if (session && ceremony) {
      setIsOwner(session.user.id === ceremony.owner_id);
    } else {
      setIsOwner(false);
    }
  }, [session, ceremony]);

  useEffect(() => {
    if (ceremony?.name) {
      document.title = `${ceremony.name} • ShareAlbum`;
    } else {
      document.title = "Gallery • ShareAlbum";
    }

    return () => {
      document.title = "ShareAlbum";
    };
  }, [ceremony]);

  const handleFAB = useCallback(async () => {
    if (!session) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (isOwner) {
      navigate(`/ceremony/${id}/manage`);
    } else {
      navigate(`/ceremony/${id}/my-media`);
    }
  }, [session, isOwner, id, navigate, location.pathname]);

  const closeLightbox = () => setLightbox(null);
  const prevItem = () => setLightbox((i) => (i > 0 ? i - 1 : i));
  const nextItem = () => setLightbox((i) => (i < media.length - 1 ? i + 1 : i));
  const jumpToItem = (i) => setLightbox(i);

  async function handleDownloadZip() {
    if (downloading) return;
    setDownloading(true);
    try {
      const zip = new JSZip();
      const safeName = (ceremony?.name || "event").replace(/[^\w\-]+/g, "_");
      const folder = zip.folder(safeName);

      if (ceremony?.cover_url) {
        const res = await fetch(ceremony.cover_url);
        const blob = await res.blob();
        folder.file(`cover.${extFromUrl(ceremony.cover_url)}`, blob);
      }

      let photoCount = 0;
      let videoCount = 0;
      for (const item of media) {
        const res = await fetch(item.file_url);
        const blob = await res.blob();
        const ext = extFromUrl(item.file_url);
        if (item.file_type === "video") {
          videoCount += 1;
          folder.file(
            `video-${String(videoCount).padStart(3, "0")}.${ext}`,
            blob,
          );
        } else {
          photoCount += 1;
          folder.file(
            `photo-${String(photoCount).padStart(3, "0")}.${ext}`,
            blob,
          );
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      notify.success("Download ready", `${safeName}.zip has been saved.`);
    } catch (e) {
      notify.error(
        "Download failed",
        "Failed to download album. Please try again.",
      );
    } finally {
      setDownloading(false);
      setMenuOpen(false);
    }
  }

  const images = media.filter((m) => m.file_type !== "video");
  const videos = media.filter((m) => m.file_type === "video");

  if (!loading && error) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-ivory px-6">
        <div className="glass max-w-sm w-full px-8 py-10 text-center space-y-4">
          <img
            src={eventnotfound}
            alt=""
            className="w-28 h-28 object-contain mx-auto"
          />
          <h2 className="font-display text-2xl font-light text-text-h">
            {error}
          </h2>
          <p className="text-text-sm text-sm font-sans">
            This event link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-ivory">
      {/* Hero */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
        {ceremony?.cover_url ? (
          <>
            <img
              src={ceremony.cover_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(46,37,32,0.1) 0%, rgba(46,37,32,0.6) 100%)",
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, #EDE8DE 0%, #E8C5C0 50%, #D4B896 100%)",
              }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-[-30px] left-[-30px] w-64 h-64 rounded-full opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, #C8D5C0, transparent 70%)",
                }}
              />
              <div
                className="absolute bottom-0 right-10 w-48 h-48 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, #D4B896, transparent 70%)",
                }}
              />
            </div>
          </>
        )}

        {!loading && ceremony && (
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(true)}
            className="absolute top-5 right-5 z-10 flex items-center justify-center transition-opacity hover:opacity-80"
            style={{
              background: "transparent",
              border: "none",
              color: ceremony?.cover_url ? "#fff" : "#5C5148",
            }}
          >
            <DotsIcon />
          </button>
        )}

        <div className="absolute bottom-0 left-0 z-10 pb-10 px-6 sm:px-8 max-w-[85vw]">
          {loading ? (
            <>
              <div className="skeleton h-9 w-48 rounded-xl mb-3" />
              <div className="skeleton h-4 w-32 rounded-lg" />
            </>
          ) : (
            <>
              <h1
                className={`font-display font-light tracking-tight mb-2 text-balance leading-tight ${ceremony?.cover_url ? "text-ivory drop-shadow-sm" : "text-text-h"}`}
                style={{ fontSize: "clamp(2rem, 7vw, 3.75rem)" }}
              >
                {ceremony?.name}
              </h1>
              <div
                className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans ${ceremony?.cover_url ? "text-ivory/80" : "text-text-sm"}`}
                style={{ fontSize: "clamp(0.7rem, 3vw, 0.875rem)" }}
              >
                <span>
                  {media.length}{" "}
                  {media.length === 1 ? "photo" : "photos & videos"}
                </span>
                {media.length > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50 hidden sm:inline-block" />
                    <span>
                      {images.length} photos · {videos.length} videos
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="page pt-8">
        {loading ? (
          <SkeletonMasonry count={12} />
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <img src={nophoto} alt="" className="w-32 h-32 opacity-90" />
            <div className="text-center space-y-1">
              <p className="font-display text-2xl font-light text-text-h">
                No photos yet
              </p>
              <p className="text-text-sm text-sm font-sans">
                Be the first to share a memory
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <MasonryGrid items={media} onOpenLightbox={setLightbox} />
          </div>
        )}
      </div>

      {/* Smart FAB */}
      <SmartFAB session={session} isOwner={isOwner} onClick={handleFAB} />

      {/* Gallery options menu */}
      {menuOpen && (
        <GalleryMenu
          anchorRef={menuButtonRef}
          onClose={() => setMenuOpen(false)}
          onDownload={handleDownloadZip}
          onShowQR={() => {
            setMenuOpen(false);
            setShowQR(true);
          }}
          downloading={downloading}
        />
      )}

      {/* QR code sheet */}
      {showQR && ceremony && (
        <QRSheet ceremony={ceremony} onClose={() => setShowQR(false)} />
      )}

      {/* Lightbox */}
      {lightbox !== null && media[lightbox] && (
        <Lightbox
          item={media[lightbox]}
          itemIndex={lightbox}
          allItems={media}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
          onSelect={jumpToItem}
          hasPrev={lightbox > 0}
          hasNext={lightbox < media.length - 1}
        />
      )}
    </div>
  );
}
