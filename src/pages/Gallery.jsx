import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

// ── Skeleton card ──────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <div
      className="skeleton rounded-2xl"
      style={{
        aspectRatio: "1",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

// ── Media card ─────────────────────────────────────────────────
function MediaCard({ item }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const isVideo = item.file_type === "video";

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-parchment shadow-soft">
      {/* Loading shimmer behind the media */}
      {!loaded && !errored && (
        <div className="skeleton absolute inset-0 rounded-2xl" />
      )}

      {errored ? (
        <div className="aspect-square flex flex-col items-center justify-center gap-2 text-text-sm bg-parchment/60">
          <svg
            width="28"
            height="28"
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
          className={`w-full aspect-square object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => setLoaded(true)}
          onError={() => setErrored(true)}
          muted
          playsInline
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      ) : (
        <img
          src={item.file_url}
          alt=""
          className={`w-full aspect-square object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

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

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-text-h/0 group-hover:bg-text-h/10 transition-all duration-200 rounded-2xl" />
    </div>
  );
}

// ── Lightbox ───────────────────────────────────────────────────
function Lightbox({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-h/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-9 h-9 rounded-full glass-sm flex items-center justify-center text-text hover:text-text-h transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
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
        className="max-w-3xl max-h-[85vh] mx-14 animate-fade-up"
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
  const [lightbox, setLightbox] = useState(null); // index

  // Get session (non-blocking — gallery is public)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // Fetch ceremony + media
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const [{ data: cer, error: cerErr }, { data: med, error: medErr }] =
        await Promise.all([
          supabase.from("ceremonies").select("*").eq("id", id).single(),
          supabase
            .from("media")
            .select("*")
            .eq("ceremony_id", id)
            .order("created_at", { ascending: false }),
        ]);

      if (cerErr) {
        setError("Event not found.");
      } else {
        setCeremony(cer);
        setMedia(med ?? []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // + button logic
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

    if (cer?.owner_id === session.user.id) {
      navigate(`/ceremony/${id}/manage`);
    } else {
      navigate(`/ceremony/${id}/my-media`);
    }
  }, [session, id, navigate, location.pathname]);

  // Lightbox nav
  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prevItem = () => setLightbox((i) => (i > 0 ? i - 1 : i));
  const nextItem = () => setLightbox((i) => (i < media.length - 1 ? i + 1 : i));

  // ── Error state ──
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

  const images = media.filter((m) => m.file_type !== "video");
  const videos = media.filter((m) => m.file_type === "video");

  return (
    <div className="min-h-svh bg-ivory">
      {/* ── Hero header ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: "260px" }}
      >
        {/* Cover image or gradient */}
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
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #EDE8DE 0%, #E8C5C0 50%, #D4B896 100%)",
            }}
          />
        )}

        {/* Blobs (only when no cover) */}
        {!ceremony?.cover_url && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-[-30px] left-[-30px] w-64 h-64 rounded-full opacity-30"
              style={{
                background: "radial-gradient(circle, #C8D5C0, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 right-10 w-48 h-48 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #D4B896, transparent 70%)",
              }}
            />
          </div>
        )}

        {/* Content */}
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
                className={`font-display text-4xl sm:text-5xl font-light tracking-tight mb-2 text-balance
                  ${ceremony?.cover_url ? "text-ivory drop-shadow-sm" : "text-text-h"}`}
              >
                {ceremony?.name}
              </h1>
              <div
                className={`flex items-center gap-3 text-sm font-sans
                ${ceremony?.cover_url ? "text-ivory/80" : "text-text-sm"}`}
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

      {/* ── Media grid ── */}
      <div className="page pt-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} delay={i * 40} />
            ))}
          </div>
        ) : media.length === 0 ? (
          /* Empty state */
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
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {media.map((item, idx) => (
              <button
                key={item.id}
                className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-2xl"
                onClick={() => openLightbox(idx)}
                aria-label={`Open ${item.file_type} ${idx + 1}`}
              >
                <MediaCard item={item} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Floating + button ── */}
      <button
        onClick={handlePlus}
        aria-label="Upload or manage"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-glass-md
                   flex items-center justify-center
                   transition-all duration-200 active:scale-90 hover:scale-105 hover:shadow-glass-lg"
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
