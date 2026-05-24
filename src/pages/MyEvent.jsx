import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import Loader from "../components/common/Loader";

const THEMES = [
  { value: "classic", label: "Classic", color: "#C9A87C" },
  { value: "romantic", label: "Romantic", color: "#E8C5C0" },
  { value: "modern", label: "Modern", color: "#8B9E8A" },
  { value: "rustic", label: "Rustic", color: "#A0856C" },
  { value: "garden", label: "Garden", color: "#B5C9A8" },
  { value: "beach", label: "Beach", color: "#A8C4C9" },
];

function getStoragePath(url) {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? decodeURIComponent(url.slice(idx + marker.length)) : null;
}

/* ─── QR Sheet ─────────────────────────────────────────────────── */
function QRSheet({ ceremony, onClose }) {
  const qrRef = useRef(null);
  const qrUrl = ceremony.qr_code;

  function downloadQR() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ceremony.name.replace(/\s+/g, "-")}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function shareQR() {
    if (navigator.share) {
      try {
        await navigator.share({ title: ceremony.name, url: qrUrl });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(qrUrl);
    alert("Link copied to clipboard!");
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

/* ─── Saving Dialog ─────────────────────────────────────────────── */
function SavingDialog({ status }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/10 backdrop-blur-sm" />
      <div className="relative glass-lg w-full max-w-xs shadow-glass-lg p-8 flex flex-col items-center gap-4">
        <Loader />
        <div className="text-center">
          <p className="font-display text-lg font-light text-text-h">
            Saving changes
          </p>
          <p className="text-sm text-text-sm font-sans mt-1">{status}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ────────────────────────────────────────────── */
function DeleteMediaDialog({ onConfirm, onCancel, loading }) {
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
              Delete this item?
            </h3>
            <p className="text-xs text-text-sm font-sans mt-0.5">
              This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary flex-1 justify-center text-sm"
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

/* ─── Media Card (owner view) ──────────────────────────────────── */
function MediaCard({ item, onDelete }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border shadow-soft group break-inside-avoid mb-3">
      {item.file_type === "video" ? (
        <video
          src={item.file_url}
          className="w-full object-cover block"
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
          className="w-full object-cover block transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      {item.file_type === "video" && (
        <div className="absolute top-2 left-2 badge bg-black/40 text-white border-white/20 backdrop-blur-sm text-[10px]">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>{" "}
          Video
        </div>
      )}
      <button
        onClick={() => onDelete(item)}
        className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-soft hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all"
        title="Delete"
      >
        <svg
          className="w-3.5 h-3.5 text-rose-400"
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

/* ─── Column count hook ─────────────────────────────────────────── */
function useColumns() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1280) setCols(4);
      else if (w >= 768) setCols(3);
      else setCols(2);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

const SKELETON_HEIGHTS = [
  [240, 160, 300, 180],
  [180, 260, 140, 220],
  [200, 320, 160, 200],
  [280, 160, 240, 180],
];
function SkeletonGrid({ columns }) {
  return (
    <div className="flex gap-3">
      {Array.from({ length: columns }, (_, ci) => (
        <div key={ci} className="flex-1 flex flex-col">
          {SKELETON_HEIGHTS[ci % SKELETON_HEIGHTS.length].map((h, i) => (
            <div
              key={i}
              className="skeleton w-full rounded-2xl mb-3"
              style={{ height: h }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function MyEvent() {
  const { id: ceremonyId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const user = session?.user;
  const columns = useColumns();

  const [ceremony, setCeremony] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("classic");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const coverInputRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: cer, error: cerErr }, { data: med, error: medErr }] =
        await Promise.all([
          supabase.from("ceremonies").select("*").eq("id", ceremonyId).single(),
          supabase
            .from("media")
            .select("*")
            .eq("ceremony_id", ceremonyId)
            .order("created_at", { ascending: false }),
        ]);
      if (cerErr) throw cerErr;
      if (medErr) throw medErr;

      // Ownership guard
      if (cer.owner_id !== user?.id) {
        navigate(`/ceremony/${ceremonyId}/my-media`, { replace: true });
        return;
      }

      setCeremony(cer);
      setName(cer.name ?? "");
      setTheme(cer.theme ?? "classic");
      setCoverPreview(cer.cover_url ?? null);
      setMedia(med ?? []);
    } catch {
      setError("Failed to load event. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [ceremonyId, user?.id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const r = new FileReader();
    r.onload = (ev) => setCoverPreview(ev.target.result);
    r.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("Event name cannot be empty.");
      return;
    }
    setError(null);
    setSaving(true);
    setSaveStatus("Saving changes…");
    try {
      let coverUrl = ceremony.cover_url;

      if (coverFile) {
        setSaveStatus("Uploading cover image…");
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${user.id}/${Date.now()}.${ext}`;
        const { data: cd, error: cErr } = await supabase.storage
          .from("media")
          .upload(path, coverFile, { contentType: coverFile.type });
        if (cErr) throw cErr;
        coverUrl = supabase.storage.from("media").getPublicUrl(cd.path)
          .data.publicUrl;
      }

      setSaveStatus("Updating event…");
      const { error: updErr } = await supabase
        .from("ceremonies")
        .update({ name: name.trim(), theme, cover_url: coverUrl })
        .eq("id", ceremonyId);
      if (updErr) throw updErr;

      setCeremony((prev) => ({
        ...prev,
        name: name.trim(),
        theme,
        cover_url: coverUrl,
      }));
      setCoverFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e?.message ?? "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMedia() {
    if (!toDelete) return;
    setDeleteLoading(true);
    try {
      const path = getStoragePath(toDelete.file_url);
      if (path) await supabase.storage.from("media").remove([path]);
      await supabase.from("media").delete().eq("id", toDelete.id);
      setMedia((prev) => prev.filter((m) => m.id !== toDelete.id));
      setToDelete(null);
    } catch {
      setError("Failed to delete media.");
      setToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  // Masonry columns
  const cols = Array.from({ length: columns }, () => []);
  media.forEach((item, i) => cols[i % columns].push(item));

  return (
    <div className="min-h-svh bg-ivory">
      {saving && <SavingDialog status={saveStatus} />}
      {showQR && ceremony && (
        <QRSheet ceremony={ceremony} onClose={() => setShowQR(false)} />
      )}
      {toDelete && (
        <DeleteMediaDialog
          onConfirm={handleDeleteMedia}
          onCancel={() => setToDelete(null)}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
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
            <p className="text-xs text-text-sm font-sans">Owner</p>
            <h2 className="text-lg font-light text-text-h font-display leading-tight">
              {loading ? (
                <span className="skeleton inline-block w-28 h-5 rounded" />
              ) : (
                "Manage event"
              )}
            </h2>
          </div>
        </div>
        {/* QR button */}
        {!loading && ceremony && (
          <button
            onClick={() => setShowQR(true)}
            className="btn-secondary gap-2 text-sm"
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
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 18.75h.75v.75h-.75v-.75zM18.75 13.5h.75v.75h-.75v-.75zM18.75 18.75h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
              />
            </svg>
            QR Code
          </button>
        )}
      </header>

      <main className="page pt-6 pb-28 max-w-2xl">
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50/60 border border-rose-200/50 text-sm text-rose-500 font-sans flex items-center gap-2">
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
            <button onClick={() => setError(null)} className="ml-auto">
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-7">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-sm p-5 flex flex-col gap-3">
                <div className="skeleton h-4 w-28 rounded" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-7">
            {/* Name */}
            <div className="glass-sm p-5 flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                  Event name <span className="text-rose-400">*</span>
                </label>
                <p className="text-xs text-text-sm font-sans mb-2">
                  The title shown to all guests in the gallery.
                </p>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>

            {/* Cover */}
            <div className="glass-sm p-5 flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                  Cover photo
                </label>
                <p className="text-xs text-text-sm font-sans mb-3">
                  Appears at the top of your event gallery.
                </p>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
              {coverPreview ? (
                <div
                  className="relative rounded-2xl overflow-hidden border border-border shadow-soft"
                  style={{ maxHeight: 240 }}
                >
                  <img
                    src={coverPreview}
                    alt="cover"
                    className="w-full object-cover"
                    style={{ maxHeight: 240 }}
                  />
                  <div className="absolute inset-0 flex items-end justify-end p-2">
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      className="btn-secondary text-xs px-3 py-1.5 gap-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-border hover:border-accent/40 hover:bg-parchment/30 transition-all py-10 flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-parchment flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-text-sm"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-sans text-text-sm">
                    Tap to add cover photo
                  </span>
                </button>
              )}
            </div>

            {/* Theme */}
            <div className="glass-sm p-5 flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                  Theme
                </label>
                <p className="text-xs text-text-sm font-sans mb-3">
                  Colour accent displayed in your gallery.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-sans transition-all ${theme === t.value ? "border-accent bg-accent/10 text-text-h font-medium" : "border-border bg-surface/40 text-text-sm hover:border-accent/40"}`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 border border-black/10"
                      style={{ background: t.color }}
                    />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Media grid */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-text-h font-sans">
                    All media
                  </h3>
                  <p className="text-xs text-text-sm font-sans mt-0.5">
                    {media.length} {media.length === 1 ? "item" : "items"} — you
                    can delete any file as the owner
                  </p>
                </div>
              </div>

              {media.length === 0 ? (
                <div className="glass-sm p-8 flex flex-col items-center gap-3 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-parchment border border-border flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-text-sm"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-text-sm font-sans text-center">
                    No media yet. Share the QR code with guests to start
                    collecting memories.
                  </p>
                </div>
              ) : (
                <div className="flex gap-3">
                  {cols.map((col, ci) => (
                    <div key={ci} className="flex-1 flex flex-col">
                      {col.map((item) => (
                        <MediaCard
                          key={item.id}
                          item={item}
                          onDelete={setToDelete}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom bar */}
      {!loading && (
        <div className="fixed bottom-0 inset-x-0 z-30 glass-sm border-t border-border px-4 py-4 flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(`/ceremony/${ceremonyId}`)}
            className="btn-secondary gap-2 text-sm"
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
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.58-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            View gallery
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1 justify-center gap-2"
          >
            {saved ? (
              <>
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Saved!
              </>
            ) : (
              <>
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
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
                Save changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
