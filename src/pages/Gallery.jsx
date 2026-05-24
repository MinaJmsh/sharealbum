import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { SpinnerDotted } from "spinners-react";

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

// ── Lightbox ───────────────────────────────────────────────────
function Lightbox({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [uploader, setUploader] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [shareToast, setShareToast] = useState(false);

  // Swipe state
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipeDeltaX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const isVideo = item.file_type === "video";
  const lightboxRef = useRef(null);

  // Non-passive touchmove: prevents the gallery page scrolling during horizontal swipes
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

  // Reset on item change
  useEffect(() => {
    setMediaLoaded(false);
    setZoom(1);
    setSwipeOffset(0);
  }, [item.id]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (!item.uploader_id) return;
    setUploader(null);
    supabase
      .rpc("get_user_display_name", { user_id: item.uploader_id })
      .then(({ data, error }) => {
        setUploader(!error && data ? data : "Guest");
      });
  }, [item.uploader_id]);

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

  // Keyboard nav
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

  // Touch swipe handlers
  function handleTouchStart(e) {
    if (zoom > 1) return; // disable swipe when zoomed
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeDeltaX.current = 0;
  }
  function handleTouchMove(e) {
    if (zoom > 1 || touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Only track horizontal swipes
    if (Math.abs(dx) > Math.abs(dy)) {
      swipeDeltaX.current = dx;
      setSwipeOffset(dx);
    }
  }
  function handleTouchEnd() {
    if (zoom > 1) return;
    const threshold = 60;
    if (swipeDeltaX.current < -threshold && hasNext) {
      onNext();
    } else if (swipeDeltaX.current > threshold && hasPrev) {
      onPrev();
    }
    setSwipeOffset(0);
    touchStartX.current = null;
    swipeDeltaX.current = 0;
  }

  // Download
  async function handleDownload() {
    try {
      const response = await fetch(item.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = isVideo ? "mp4" : "jpg";
      a.download = `memory-${item.id}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(item.file_url, "_blank");
    }
  }

  // Share
  async function handleShare() {
    const shareData = { url: item.file_url };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(item.file_url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
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

  // Toolbar button style helper
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

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
      style={{ ...backdropStyle, background: "rgba(46,37,32,0.82)" }}
      onClick={triggerClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Top bar: close + toolbar ── */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-3"
        style={{
          background:
            "linear-gradient(to bottom, rgba(46,37,32,0.5) 0%, transparent 100%)",
          opacity: visible && !closing ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
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

        {/* Right-side action buttons */}
        <div className="flex items-center gap-2">
          {/* Zoom out */}
          <button
            style={{ ...toolBtn, opacity: zoom <= 1 ? 0.4 : 1 }}
            onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
            aria-label="Zoom out"
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
          {/* Zoom in */}
          <button
            style={{ ...toolBtn, opacity: zoom >= 3 ? 0.4 : 1 }}
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            aria-label="Zoom in"
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
          {/* Download */}
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
          {/* Share */}
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

      {/* ── Prev button ── */}
      {hasPrev && (
        <button
          className="absolute left-3 z-20 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
          style={{
            opacity: visible && !closing ? 1 : 0,
            transition: "opacity 0.2s ease 0.1s",
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

      {/* ── Media area ── */}
      <div
        className="flex flex-col items-center w-full px-14"
        style={{ ...mediaWrapStyle, maxWidth: "56rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spinner shown while loading */}
        {!mediaLoaded && (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: "40vh" }}
          >
            {/* <SpinnerDotted
              size={56}
              thickness={180}
              speed={112}
              color="rgba(212, 184, 150, 1)"
            /> */}
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Media — hidden until loaded */}
        <div style={{ display: mediaLoaded ? "block" : "none", width: "100%" }}>
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

        {/* Caption — only shown when loaded */}
        {mediaLoaded && (uploader || uploadedAt) && (
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

      {/* ── Next button ── */}
      {hasNext && (
        <button
          className="absolute right-3 z-20 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
          style={{
            opacity: visible && !closing ? 1 : 0,
            transition: "opacity 0.2s ease 0.1s",
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

      {/* ── Swipe hint dots ── */}
      <div
        className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 z-20"
        style={{
          opacity: visible && !closing ? 0.5 : 0,
          transition: "opacity 0.3s ease 0.2s",
          pointerEvents: "none",
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

      {/* ── Share toast ── */}
      {shareToast && (
        <div
          className="fixed bottom-16 left-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-sans"
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
      )}
    </div>
  );
}

// ── Main Gallery ───────────────────────────────────────────────
export default function Gallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [ceremony, setCeremony] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [lightbox, setLightbox] = useState(null);

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

  const handlePlus = useCallback(async () => {
    if (!session) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    const { data: cer } = await supabase
      .from("ceremonies")
      .select("owner_id")
      .eq("id", id)
      .single();
    if (cer?.owner_id === session.user.id) navigate(`/ceremony/${id}/manage`);
    else navigate(`/ceremony/${id}/my-media`);
  }, [session, id, navigate, location.pathname]);

  const closeLightbox = () => setLightbox(null);
  const prevItem = () => setLightbox((i) => (i > 0 ? i - 1 : i));
  const nextItem = () => setLightbox((i) => (i < media.length - 1 ? i + 1 : i));

  const images = media.filter((m) => m.file_type !== "video");
  const videos = media.filter((m) => m.file_type === "video");

  if (!loading && error) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-ivory px-6">
        <div className="glass max-w-sm w-full px-8 py-10 text-center space-y-4 animate-fade-up">
          <div
            className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "rgba(232,197,192,0.4)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C98F87"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
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
      {/* ── Hero — fullscreen on load ── */}
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

        {/* Title bottom-left — FIX 2: responsive sizes */}
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

      {/* ── Grid ── */}
      <div className="page pt-8">
        {loading ? (
          <SkeletonMasonry count={12} />
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-fade-up">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(212,184,150,0.2)" }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9A87C"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="text-center space-y-1">
              <p className="font-display text-2xl font-light text-text-h">
                No photos yet
              </p>
              <p className="text-text-sm text-sm font-sans">
                Be the first to share a memory — tap the + button below
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <MasonryGrid items={media} onOpenLightbox={setLightbox} />
          </div>
        )}
      </div>

      {/* ── + FAB ── */}
      <button
        onClick={handlePlus}
        aria-label="Upload or manage"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-glass-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 hover:shadow-glass-lg"
        style={{
          background: "linear-gradient(135deg, #D4B896 0%, #C9A87C 100%)",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FAF7F2"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* ── Lightbox ── */}
      {lightbox !== null && media[lightbox] && (
        <Lightbox
          item={media[lightbox]}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
          hasPrev={lightbox > 0}
          hasNext={lightbox < media.length - 1}
        />
      )}
    </div>
  );
}
