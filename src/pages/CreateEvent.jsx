import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import Loader from "../components/common/Loader";

const APP_URL = import.meta.env.VITE_APP_URL ?? window.location.origin;

const THEMES = [
  { value: "classic", label: "Classic", color: "#C9A87C" },
  { value: "romantic", label: "Romantic", color: "#E8C5C0" },
  { value: "modern", label: "Modern", color: "#8B9E8A" },
  { value: "rustic", label: "Rustic", color: "#A0856C" },
  { value: "garden", label: "Garden", color: "#B5C9A8" },
  { value: "beach", label: "Beach", color: "#A8C4C9" },
];

/* ─── helpers ──────────────────────────────────────────────────── */
function getFilePreview(file) {
  return new Promise((resolve) => {
    if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      video.muted = true;
      video.onloadeddata = () => {
        video.currentTime = 0.5;
      };
      video.onseeked = () => {
        try {
          const c = document.createElement("canvas");
          c.width = 200;
          c.height =
            Math.round((video.videoHeight / video.videoWidth) * 200) || 150;
          c.getContext("2d").drawImage(video, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve({ preview: c.toDataURL(), isVideo: true });
        } catch {
          URL.revokeObjectURL(url);
          resolve({ preview: null, isVideo: true });
        }
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ preview: null, isVideo: true });
      };
    } else {
      const r = new FileReader();
      r.onload = (e) => resolve({ preview: e.target.result, isVideo: false });
      r.onerror = () => resolve({ preview: null, isVideo: false });
      r.readAsDataURL(file);
    }
  });
}

/* ─── QR Success Dialog ────────────────────────────────────────── */
function QRDialog({ ceremony }) {
  const navigate = useNavigate();
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
    alert("Link copied to clipboard!");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/20 backdrop-blur-md" />
      <div className="relative glass-lg w-full max-w-sm shadow-glass-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-pink-dust via-accent to-sage-light" />
        <div className="px-6 pt-6 pb-8 flex flex-col items-center gap-5">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sage-light/40 border border-sage-light/60 mb-3">
              <svg
                className="w-5 h-5 text-sage-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-light text-text-h">
              Event created!
            </h2>
            <p className="text-sm text-text-sm font-sans mt-1">
              Share this QR code with your guests
            </p>
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
          <p className="text-xs text-text-sm font-sans text-center break-all px-2 opacity-70">
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
          <button
            onClick={() => navigate(`/ceremony/${ceremony.id}`)}
            className="btn-primary w-full justify-center"
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
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
            Go to event gallery
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Creating Dialog ──────────────────────────────────────────── */
function CreatingDialog({ status }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/10 backdrop-blur-sm" />
      <div className="relative glass-lg w-full max-w-xs shadow-glass-lg p-8 flex flex-col items-center gap-4">
        <Loader />
        <div className="text-center">
          <p className="font-display text-lg font-light text-text-h">
            Creating your event
          </p>
          <p className="text-sm text-text-sm font-sans mt-1">{status}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Discard Confirm Dialog ───────────────────────────────────── */
function DiscardDialog({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/10 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-lg p-6 w-full max-w-sm shadow-glass-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-amber-400"
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
              Discard changes?
            </h3>
            <p className="text-xs text-text-sm font-sans mt-0.5">
              Your event won't be created.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1 justify-center text-sm"
          >
            Keep editing
          </button>
          <button
            onClick={onConfirm}
            className="btn flex-1 justify-center text-sm bg-amber-400 text-white hover:bg-amber-500 active:scale-95 shadow-soft"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Media Thumbnail ──────────────────────────────────────────── */
function MediaThumb({ item, onRemove }) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-parchment border border-border shadow-soft">
      {item.preview ? (
        <img src={item.preview} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-text-sm"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
      )}
      {item.isVideo && (
        <div className="absolute top-1 left-1 badge bg-black/40 text-white border-white/20 text-[10px] px-1 py-0.5 backdrop-blur-sm">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

/* ─── isDirty helper ───────────────────────────────────────────── */
function useIsDirty(name, coverFile, mediaFiles) {
  return name.trim().length > 0 || coverFile !== null || mediaFiles.length > 0;
}

/* ─── Main Page ────────────────────────────────────────────────── */
export default function CreateEvent() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const user = session?.user;

  const [name, setName] = useState("");
  const [theme, setTheme] = useState("classic");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState("");
  const [created, setCreated] = useState(null);
  const [error, setError] = useState(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);

  const coverInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  const isDirty = useIsDirty(name, coverFile, mediaFiles);

  // Block browser back/refresh when dirty
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (isDirty && !created) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, created]);

  function tryNavigate(dest) {
    if (isDirty && !created) {
      setPendingNav(dest);
      setShowDiscard(true);
    } else navigate(dest);
  }

  function confirmDiscard() {
    setShowDiscard(false);
    navigate(pendingNav ?? "/dashboard");
  }

  async function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const r = new FileReader();
    r.onload = (ev) => setCoverPreview(ev.target.result);
    r.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleMediaAdd(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const processed = [];
    for (const f of files) {
      if (!f.type.startsWith("image/") && !f.type.startsWith("video/"))
        continue;
      if (f.size > 10 * 1024 * 1024) continue;
      const { preview, isVideo } = await getFilePreview(f);
      processed.push({ id: crypto.randomUUID(), file: f, preview, isVideo });
    }
    setMediaFiles((prev) => {
      const names = new Set(prev.map((p) => p.file.name));
      return [...prev, ...processed.filter((p) => !names.has(p.file.name))];
    });
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError("Please enter an event name.");
      return;
    }
    setError(null);
    setCreating(true);
    try {
      let coverUrl = null;
      if (coverFile) {
        setStatus("Uploading cover image…");
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${user.id}/${Date.now()}.${ext}`;
        const { data: cd, error: cErr } = await supabase.storage
          .from("media")
          .upload(path, coverFile, { contentType: coverFile.type });
        if (cErr) throw cErr;
        coverUrl = supabase.storage.from("media").getPublicUrl(cd.path)
          .data.publicUrl;
      }
      setStatus("Creating event…");
      const { data: ceremony, error: cerErr } = await supabase
        .from("ceremonies")
        .insert({
          owner_id: user.id,
          name: name.trim(),
          theme,
          cover_url: coverUrl,
          qr_code: "",
        })
        .select()
        .single();
      if (cerErr) throw cerErr;
      const qrUrl = `${APP_URL}/ceremony/${ceremony.id}`;
      await supabase
        .from("ceremonies")
        .update({ qr_code: qrUrl })
        .eq("id", ceremony.id);
      if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const { file, isVideo } = mediaFiles[i];
          setStatus(`Uploading media (${i + 1} / ${mediaFiles.length})…`);
          const ext = file.name.split(".").pop();
          const path = `${ceremony.id}/${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
          const { data: fd, error: fErr } = await supabase.storage
            .from("media")
            .upload(path, file, { contentType: file.type });
          if (fErr) continue;
          const fileUrl = supabase.storage.from("media").getPublicUrl(fd.path)
            .data.publicUrl;
          await supabase
            .from("media")
            .insert({
              ceremony_id: ceremony.id,
              uploader_id: user.id,
              file_url: fileUrl,
              file_type: isVideo ? "video" : "image",
            });
        }
      }
      setStatus("Done!");
      setCreated({ ...ceremony, qr_code: qrUrl });
    } catch (e) {
      setError(e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-svh bg-ivory">
      {creating && <CreatingDialog status={status} />}
      {created && <QRDialog ceremony={created} />}
      {showDiscard && (
        <DiscardDialog
          onConfirm={confirmDiscard}
          onCancel={() => setShowDiscard(false)}
        />
      )}

      <header className="sticky top-0 z-40 glass-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => tryNavigate("/dashboard")}
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
          <p className="text-xs text-text-sm font-sans">New event</p>
          <h2 className="text-lg font-light text-text-h font-display leading-tight">
            Create ceremony
          </h2>
        </div>
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

        <div className="flex flex-col gap-7">
          {/* Name */}
          <div className="glass-sm p-5 flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                Event name <span className="text-rose-400">*</span>
              </label>
              <p className="text-xs text-text-sm font-sans mb-2">
                Give your ceremony a memorable title that guests will recognise.
              </p>
              <input
                className="input"
                placeholder="e.g. Sarah & James — June 2026"
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
                This appears at the top of the gallery. A portrait shot works
                best.
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
                  className="w-full h-full object-cover"
                  style={{ maxHeight: 240 }}
                />
                <button
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 transition-all shadow-soft"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
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
                Sets the colour accent for your event gallery.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
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

          {/* Media */}
          <div className="glass-sm p-5 flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                Add media{" "}
                <span className="text-text-sm font-normal">(optional)</span>
              </label>
              <p className="text-xs text-text-sm font-sans mb-3">
                Upload photos or videos now, or do it later from the event page.
                Max 10 MB per file.
              </p>
            </div>
            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleMediaAdd}
            />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {mediaFiles.map((item) => (
                <MediaThumb
                  key={item.id}
                  item={item}
                  onRemove={(id) =>
                    setMediaFiles((p) => p.filter((f) => f.id !== id))
                  }
                />
              ))}
              <button
                onClick={() => mediaInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-parchment/30 flex flex-col items-center justify-center gap-1.5 transition-all text-text-sm hover:text-text"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="text-[11px] font-sans">Add</span>
              </button>
            </div>
            {mediaFiles.length > 0 && (
              <p className="text-xs text-text-sm font-sans">
                {mediaFiles.length} file{mediaFiles.length !== 1 ? "s" : ""}{" "}
                ready to upload
              </p>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-30 glass-sm border-t border-border px-4 py-4 flex items-center gap-3 max-w-2xl mx-auto">
        <button
          onClick={() => tryNavigate("/dashboard")}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="btn-primary flex-1 justify-center"
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
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Create event
        </button>
      </div>
    </div>
  );
}
