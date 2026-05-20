import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

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

  // Distribute items into columns (shortest-column-first)
  const cols = Array.from({ length: columns }, () => []);
  const heights = Array(columns).fill(0);
  items.forEach((item, idx) => {
    // Estimate height: use a stored natural ratio or default
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

  // Fetch uploader name once
  useEffect(() => {
    if (!item.uploader_id) return;

    supabase
      .rpc("get_user_display_name", {
        user_id: item.uploader_id,
      })
      .then(({ data, error }) => {
        if (!error && data) {
          setUploader(data);
        } else {
          setUploader("Guest");
        }
      });
  }, [item.uploader_id]);

  function handleLoad(e) {
    const el = e.currentTarget;
    const w = el.naturalWidth || el.videoWidth || 1;
    const h = el.naturalHeight || el.videoHeight || 1;
    if (w && h) {
      item._ratio = h / w; // cache on item object
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
        {/* Aspect-ratio box */}
        <div style={{ position: "relative", width: "100%", paddingTop }}>
          {/* Shimmer while loading */}
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

        {/* Hover overlay */}
        <div
          className="absolute inset-0 transition-all duration-250 rounded-2xl pointer-events-none"
          style={{
            background: hovered ? "rgba(46,37,32,0.22)" : "rgba(46,37,32,0)",
          }}
        />

        {/* Video badge */}
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

        {/* Uploader tooltip — slides up on hover */}
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
  // Random-ish heights for visual interest
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

  // Open animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function triggerClose() {
    setClosing(true);
    setTimeout(onClose, 280);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") triggerClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasPrev, hasNext, onPrev, onNext]);

  const backdropStyle = {
    opacity: visible && !closing ? 1 : 0,
    transition: "opacity 0.28s ease",
  };
  const mediaStyle = {
    opacity: visible && !closing ? 1 : 0,
    transform:
      visible && !closing
        ? "scale(1) translateY(0)"
        : "scale(0.93) translateY(20px)",
    transition:
      "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.4,0.64,1)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ ...backdropStyle, background: "rgba(46,37,32,0.72)" }}
      onClick={triggerClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors z-10"
        onClick={triggerClose}
        aria-label="Close"
        style={{
          opacity: visible && !closing ? 1 : 0,
          transition: "opacity 0.2s ease",
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-4 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors z-10"
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

      {/* Media */}
      <div
        className="max-w-3xl max-h-[85vh] mx-14"
        style={mediaStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {item.file_type === "video" ? (
          <video
            src={item.file_url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-full rounded-2xl shadow-glass-lg"
          />
        ) : (
          <img
            src={item.file_url}
            alt=""
            className="max-h-[85vh] max-w-full rounded-2xl shadow-glass-lg object-contain"
          />
        )}
      </div>

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-4 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors z-10"
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
      {/* ── Hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: "260px" }}
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
                  "linear-gradient(to bottom, rgba(46,37,32,0.25) 0%, rgba(46,37,32,0.55) 100%)",
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
        <div
          className="relative z-10 flex flex-col items-center justify-end h-full pb-8 pt-16 px-6 text-center"
          style={{ minHeight: "260px" }}
        >
          {loading ? (
            <>
              <div className="skeleton h-8 w-48 rounded-xl mb-3" />
              <div className="skeleton h-4 w-32 rounded-lg" />
            </>
          ) : (
            <>
              <h1
                className={`font-display text-4xl sm:text-5xl font-light tracking-tight mb-2 text-balance ${ceremony?.cover_url ? "text-ivory drop-shadow-sm" : "text-text-h"}`}
              >
                {ceremony?.name}
              </h1>
              <div
                className={`flex items-center gap-3 text-sm font-sans ${ceremony?.cover_url ? "text-ivory/80" : "text-text-sm"}`}
              >
                <span>
                  {media.length}{" "}
                  {media.length === 1 ? "photo" : "photos & videos"}
                </span>
                {media.length > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
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
