import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "../components/common/ProfileMenu";
import nomedia from "../assets/illustrations/nomedia.svg";

function getStoragePath(url) {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? decodeURIComponent(url.slice(idx + marker.length)) : null;
}

/* ─── Delete Confirm Dialog ────────────────────────────────────────── */
function DeleteDialog({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/10 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-lg p-6 w-full max-w-sm shadow-glass-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-medium text-text-h font-display">
              Delete media?
            </h3>
            <p className="text-xs text-text-sm font-sans mt-0.5">
              This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1 justify-center text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn flex-1 justify-center text-sm bg-rose-400 text-white hover:bg-rose-500 active:scale-95 shadow-soft"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
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
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── FIX 2: Square grid skeleton ────────────────────────────────── */
function SkeletonSquareGrid({ columns }) {
  const rows = 3;
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: columns * rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton rounded-xl"
          style={{ aspectRatio: "1 / 1", animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

/* ─── FIX 2: Square Media Card ────────────────────────────────────── */
function SquareMediaCard({ item, onDelete }) {
  const isVideo = item.file_type === "video";
  return (
    <div
      className="relative rounded-xl overflow-hidden border border-border shadow-soft group"
      style={{ aspectRatio: "1 / 1" }}
    >
      {isVideo ? (
        <video
          src={item.file_url}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
          }}
        />
      ) : (
        <img
          src={item.file_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      {isVideo && (
        <div className="absolute top-1.5 left-1.5 badge bg-black/40 text-white border-white/20 backdrop-blur-sm text-[10px]">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Video
        </div>
      )}
      <button
        onClick={() => onDelete(item)}
        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-soft transition-all duration-200 hover:bg-rose-50 hover:border-rose-200 active:scale-95"
        title="Delete"
      >
        <svg
          className="w-3 h-3 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}

/* ─── Responsive column count ─────────────────────────────────────── */
function useColumns() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1280) setCols(5);
      else if (w >= 768) setCols(4);
      else setCols(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

/* ─── Main Page ───────────────────────────────────────────────────── */
export default function MyMedia() {
  const { id: ceremonyId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const columns = useColumns();

  const [media, setMedia] = useState([]);
  const [ceremony, setCeremony] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = session?.user;
  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: ceremonyData }, { data: mediaData, error: mediaErr }] =
        await Promise.all([
          supabase
            .from("ceremonies")
            .select("id, name, cover_url")
            .eq("id", ceremonyId)
            .single(),
          supabase
            .from("media")
            .select("*")
            .eq("ceremony_id", ceremonyId)
            .eq("uploader_id", user.id)
            .order("created_at", { ascending: false }),
        ]);
      if (mediaErr) throw mediaErr;
      setCeremony(ceremonyData);
      setMedia(mediaData ?? []);
    } catch {
      setError("Failed to load your media. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [ceremonyId, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleteLoading(true);
    try {
      const path = getStoragePath(toDelete.file_url);
      if (path) await supabase.storage.from("media").remove([path]);
      const { error: dbErr } = await supabase
        .from("media")
        .delete()
        .eq("id", toDelete.id);
      if (dbErr) throw dbErr;
      setMedia((prev) => prev.filter((m) => m.id !== toDelete.id));
      setToDelete(null);
    } catch {
      setError("Failed to delete. Please try again.");
      setToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="min-h-svh bg-ivory">
      <header className="sticky top-0 z-40 glass-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/ceremony/${ceremonyId}`)}
            className="btn-ghost px-2 py-1.5"
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div>
            <p className="text-xs text-text-sm font-sans">My uploads</p>
            <h2 className="text-lg font-light text-text-h font-display leading-tight">
              {loading ? (
                <span className="skeleton inline-block w-32 h-5 rounded" />
              ) : (
                (ceremony?.name ?? "Event")
              )}
            </h2>
          </div>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center hover:bg-accent/30 transition-colors"
        >
          <span className="text-xs font-medium text-gold-deep font-sans">
            {initials}
          </span>
        </button>
      </header>

      {menuOpen && (
        <ProfileMenu user={user} onClose={() => setMenuOpen(false)} />
      )}
      {toDelete && (
        <DeleteDialog
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleteLoading}
        />
      )}

      <main className="page pt-6 pb-28">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50/60 border border-rose-200/50 text-sm text-rose-500 font-sans flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-rose-400 hover:text-rose-600"
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <SkeletonSquareGrid columns={columns} />
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <img src={nomedia} alt="" className="w-32 h-32 object-contain" />
            <div className="text-center">
              <p className="font-display text-lg font-light text-text-h">
                No uploads yet
              </p>
              <p className="text-sm text-text-sm font-sans mt-1">
                Your shared memories will appear here
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-sm font-sans">
                {media.length} {media.length === 1 ? "file" : "files"} shared
              </p>
            </div>
            {/* FIX 2: uniform square grid instead of masonry */}
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {media.map((item) => (
                <SquareMediaCard
                  key={item.id}
                  item={item}
                  onDelete={setToDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <div className="fixed bottom-6 inset-x-0 flex justify-center z-30 pointer-events-none">
        <button
          onClick={() => navigate(`/ceremony/${ceremonyId}/upload`)}
          className="pointer-events-auto btn-primary gap-2.5 px-6 py-3 rounded-2xl shadow-glass-lg text-base"
        >
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add media
        </button>
      </div>
    </div>
  );
}
